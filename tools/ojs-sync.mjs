#!/usr/bin/env node
/**
 * CRSL · OJS OAI-PMH sync
 * ------------------------------------------------------------
 * Harvests the published articles of an Open Journal Systems
 * installation through its OAI-PMH endpoint and writes a
 * normalized catalogue that the static site (or any other tool)
 * can consume without touching the OJS database.
 *
 * Requirements: Node.js 18+ (built-in fetch). No dependencies.
 *
 * Usage:
 *   node tools/ojs-sync.mjs --config ojs.config.json
 *   node tools/ojs-sync.mjs --base https://ojs.example.org --journal crsl
 *   node tools/ojs-sync.mjs --dry-run
 *
 * Options:
 *   --config <file>   JSON config (default: ojs.config.json)
 *   --base <url>      OJS installation root, e.g. https://ojs.example.org
 *   --journal <path>  Journal path under /index.php/, e.g. crsl
 *   --out <file>      Output .js file (default: assets/js/data.ojs.js)
 *   --prefix <name>   Metadata prefix (default: oai_dc)
 *   --from <date>     OAI from= (YYYY-MM-DD)
 *   --until <date>    OAI until= (YYYY-MM-DD)
 *   --set <spec>      OAI setSpec
 *   --max-pages <n>   Safety limit (default: 200)
 *   --dry-run         Harvest and report, write nothing
 *   --help            Show this help
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULTS = {
  baseUrl: "",
  journalPath: "crsl",
  metadataPrefix: "oai_dc",
  out: "assets/js/data.ojs.js",
  maxPages: 200,
  from: "",
  until: "",
  set: ""
};

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--dry-run") {
      opts.dryRun = true;
      continue;
    }
    const key = arg.replace(/^--/, "");
    const value = argv[i + 1];
    if (!key || value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    opts[key] = value;
    i += 1;
  }
  return opts;
}

function usage() {
  const text = [
    "CRSL · OJS OAI-PMH sync",
    "",
    "  node tools/ojs-sync.mjs --base https://ojs.example.org --journal crsl",
    "",
    "Options: --config, --base, --journal, --out, --prefix, --from, --until,",
    "         --set, --max-pages, --dry-run, --help"
  ].join("\n");
  console.log(text);
}

async function readConfig(path) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`Cannot read ${path}: ${error.message}`);
  }
}

function decodeEntities(value) {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function cleanText(value) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function texts(block, tag) {
  const pattern = new RegExp(
    `<(?:[\\w.-]+:)?${tag}\\b[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${tag}>`,
    "gi"
  );
  const found = [];
  let match;
  while ((match = pattern.exec(block)) !== null) {
    const value = cleanText(match[1]);
    if (value) found.push(value);
  }
  return found;
}

function normalizeLanguage(value) {
  const lang = String(value || "").toLowerCase();
  if (/^fr/.test(lang)) return "fr";
  if (/^en/.test(lang)) return "en";
  if (/^ar/.test(lang)) return "ar";
  return lang.split(/[-_]/)[0] || "";
}

function parseSource(source) {
  const out = { volume: "", issue: "", year: "", pages: "" };
  if (!source) return out;

  const year = source.match(/\((\d{4})\)/) || source.match(/\b(19|20)\d{2}\b/);
  if (year) out.year = year[1] && year[1].length === 4 ? year[1] : year[0];

  const volume = source.match(/vol\.?\s*(\d+)/i);
  if (volume) out.volume = volume[1];

  const issue = source.match(/no\.?\s*(\d+)/i);
  if (issue) out.issue = issue[1];

  const pages = source.match(/(?:pp?\.?\s*)?(\d+)\s*[-–]\s*(\d+)/);
  if (pages) out.pages = `${pages[1]}–${pages[2]}`;

  return out;
}

function pickArticleUrl(identifiers) {
  const urls = identifiers.filter((id) => /^https?:\/\//i.test(id));
  const landing = urls.find((url) => /\/article\/view\/\d+\/?$/.test(url));
  if (landing) return landing;
  const anyArticle = urls.find((url) => /\/article\/view\//.test(url));
  return anyArticle || urls[0] || "";
}

function pickPdfUrl(identifiers) {
  return (
    identifiers.find((id) => /\/article\/download\//.test(id) && !/\/downloadSuppFile\//.test(id)) ||
    identifiers.find((id) => /\.pdf(?:$|\?)/i.test(id)) ||
    ""
  );
}

function pickDoi(identifiers, relations) {
  const all = identifiers.concat(relations);
  const url = all.find((value) => /doi\.org\/10\.\d{4,9}/i.test(value));
  if (url) return url.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  const bare = all.find((value) => /^10\.\d{4,9}\/\S+$/.test(value));
  return bare || "";
}

function parseRecord(xml, datestamp) {
  const headerMatch = xml.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i);
  const header = headerMatch ? headerMatch[1] : "";
  const metadataMatch = xml.match(/<metadata\b[^>]*>([\s\S]*?)<\/metadata>/i);
  const metadata = metadataMatch ? metadataMatch[1] : "";

  const oaiId = texts(header, "identifier")[0] || "";
  const updated = texts(header, "datestamp")[0] || datestamp || "";
  const setSpec = texts(header, "setSpec")[0] || "";

  const titles = texts(metadata, "title");
  const creators = texts(metadata, "creator");
  const descriptions = texts(metadata, "description");
  const subjects = texts(metadata, "subject");
  const identifiers = texts(metadata, "identifier");
  const relations = texts(metadata, "relation");
  const sources = texts(metadata, "source");
  const dates = texts(metadata, "date");
  const languages = texts(metadata, "language");
  const rights = texts(metadata, "rights");
  const publishers = texts(metadata, "publisher");
  const types = texts(metadata, "type");

  const source = sources[0] || "";
  const parsed = parseSource(source);
  const date = dates[0] || "";
  const year = parsed.year || (date.match(/\d{4}/) || [""])[0];

  const abstract =
    descriptions
      .slice()
      .sort((a, b) => b.length - a.length)[0] || "";

  return {
    id: oaiId || identifiers[0] || titles[0] || "",
    oai: oaiId,
    title: titles[0] || "",
    altTitle: titles.find((title) => title !== titles[0]) || "",
    authors: creators,
    abstract,
    keywords: subjects,
    language: normalizeLanguage(languages[0]),
    date,
    year,
    volume: parsed.volume,
    issue: parsed.issue,
    pages: parsed.pages,
    source,
    doi: pickDoi(identifiers, relations),
    articleUrl: pickArticleUrl(identifiers),
    pdfUrl: pickPdfUrl(identifiers),
    rights: rights[0] || "",
    publisher: publishers[0] || "",
    type: types[0] || "",
    setSpec,
    updated
  };
}

function buildOaiUrl(config, token) {
  const base = String(config.baseUrl).replace(/\/+$/, "");
  const journal = String(config.journalPath || "").replace(/^\/+|\/+$/g, "");
  const endpoint =
    base + (journal ? `/index.php/${journal}` : "") + "/" + (config.oaiPath || "oai");

  const params = new URLSearchParams();
  if (token) {
    params.set("verb", "ListRecords");
    params.set("resumptionToken", token);
  } else {
    params.set("verb", "ListRecords");
    params.set("metadataPrefix", config.metadataPrefix || "oai_dc");
    if (config.from) params.set("from", config.from);
    if (config.until) params.set("until", config.until);
    if (config.set) params.set("set", config.set);
  }
  return `${endpoint}?${params.toString()}`;
}

async function fetchXml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "CRSL-OJS-Sync/1.0 (+https://crsl-journal.dz)",
      Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8"
    },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`OAI request failed: HTTP ${response.status} ${response.statusText} (${url})`);
  }
  return response.text();
}

function oaiError(xml) {
  if (!/<error\b/i.test(xml)) return null;
  const match = xml.match(/<error\b[^>]*code="([^"]+)"[^>]*>([\s\S]*?)<\/error>/i);
  if (!match) return "Unknown OAI error";
  if (match[1] === "noRecordsMatch") return null;
  return `OAI error ${match[1]}: ${cleanText(match[2])}`;
}

async function harvest(config, log) {
  const records = new Map();
  let token = "";
  let page = 0;
  let truncated = false;

  while (page < config.maxPages) {
    page += 1;
    const url = buildOaiUrl(config, token);
    log(`page ${page}: ${url}`);

    const xml = await fetchXml(url);
    const error = oaiError(xml);
    if (error) throw new Error(error);

    const responseDate = (xml.match(/<responseDate>([\s\S]*?)<\/responseDate>/i) || [])[1] || "";
    const blocks = xml.match(/<record\b[^>]*>[\s\S]*?<\/record>/gi) || [];

    for (const block of blocks) {
      const record = parseRecord(block, responseDate.trim());
      if (!record.title) continue;
      records.set(record.oai || record.id, record);
    }

    const tokenMatch = xml.match(/<resumptionToken\b[^>]*>([\s\S]*?)<\/resumptionToken>/i);
    token = tokenMatch ? decodeEntities(tokenMatch[1]).trim() : "";

    if (!blocks.length || !token) break;
    if (page >= config.maxPages) truncated = true;
  }

  if (truncated) {
    throw new Error(`Stopped after ${config.maxPages} pages; increase --max-pages if needed.`);
  }

  return Array.from(records.values()).sort((a, b) => {
    if (a.date === b.date) return a.title.localeCompare(b.title);
    return a.date < b.date ? 1 : -1;
  });
}

function toOutput(config, articles) {
  const payload = {
    generatedAt: new Date().toISOString(),
    source: buildOaiUrl(config, "").replace(/\?.*$/, ""),
    endpoint: buildOaiUrl(config, "").split("?")[0],
    metadataPrefix: config.metadataPrefix || "oai_dc",
    count: articles.length,
    articles
  };

  const banner =
    "/* Generated by tools/ojs-sync.mjs from the OJS OAI-PMH endpoint.\n" +
    "   Do not edit by hand: re-run the sync instead. */\n";
  const js = `${banner}window.CRSL_OJS = ${JSON.stringify(payload, null, 2)};\n`;

  return { payload, js };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const configPath = resolve(ROOT, args.config || "ojs.config.json");
  const fileConfig = await readConfig(configPath);

  const config = {
    ...DEFAULTS,
    ...fileConfig,
    ...(args.base ? { baseUrl: args.base } : {}),
    ...(args.journal ? { journalPath: args.journal } : {}),
    ...(args.out ? { out: args.out } : {}),
    ...(args.prefix ? { metadataPrefix: args.prefix } : {}),
    ...(args.from ? { from: args.from } : {}),
    ...(args.until ? { until: args.until } : {}),
    ...(args.set ? { set: args.set } : {}),
    ...(args["max-pages"] ? { maxPages: Number(args["max-pages"]) } : {})
  };

  if (!config.baseUrl) {
    throw new Error(
      "No OJS base URL. Add \"baseUrl\" to ojs.config.json or pass --base https://ojs.example.org"
    );
  }

  const log = (message) => console.log(`[ojs-sync] ${message}`);
  log(`harvesting ${config.baseUrl} (${config.metadataPrefix})`);

  const articles = await harvest(config, log);
  const { payload, js } = toOutput(config, articles);
  const outPath = resolve(ROOT, config.out);
  const jsonPath = outPath.replace(/\.js$/i, ".json");

  log(`records: ${payload.count}`);
  if (articles[0]) log(`latest: ${articles[0].date || articles[0].year} · ${articles[0].title}`);

  if (args.dryRun) {
    log("dry run: nothing written");
    return;
  }

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, js, "utf8");
  await writeFile(jsonPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  log(`wrote ${outPath}`);
  log(`wrote ${jsonPath}`);
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main().catch((error) => {
    console.error(`[ojs-sync] ${error.message}`);
    process.exitCode = 1;
  });
}

export { parseRecord, parseSource, decodeEntities, cleanText, buildOaiUrl };
