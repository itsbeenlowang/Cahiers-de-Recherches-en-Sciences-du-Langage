# OJS integration — CRSL

This document covers how **Open Journal Systems (OJS 3.5 LTS)** fits behind the
existing premium CRSL site, what is already wired in this repository, how to
enable it, and the remaining deployment chunks.

OJS is developed by the **Public Knowledge Project (PKP)**, is free and open
source (GPL), and runs the whole editorial workflow: submission, peer review,
copy-editing, production, publication, author dashboard, DOIs, ORCID and
OAI-PMH.

---

## 1. Architecture: keep the premium front end, put OJS behind it

Two viable models. The first one is the default for this repository.

### Option A — Static premium front end + OJS editorial backend (recommended)

```
journal.example.dz            → this static site (design untouched, fast, cheap to host)
ojs.example.dz/index.php/crsl → OJS: submissions, peer review, author dashboard, archive
```

* The public design stays exactly as it is (hero, issues, committee, contact gate).
* "Soumettre", "Espace auteur" and "Archives OJS" deep-link into OJS.
* Published metadata is pulled back with OAI-PMH (`tools/ojs-sync.mjs`) so the
  static site can list OJS articles without querying the OJS database.
* No PHP theme work, no risk to the design during OJS upgrades.

The only duplication is editorial content. The sync script removes it for
article metadata; issues can still be curated by hand.

### Option B — OJS as the whole site with a custom theme

Choose this only if the journal must live entirely inside OJS (single login,
single URL, native issue pages). It requires a `ThemePlugin` (PHP + LESS),
template overrides and re-testing on every OJS upgrade. The current design
would have to be ported into OJS templates.

> Do not embed OJS in an `<iframe>`: OJS sends `X-Frame-Options`/CSP headers,
> and login/CSRF flows break.

---

## 2. What is already wired in this repository

| File | Purpose |
| --- | --- |
| `assets/js/data.js` → `meta.ojs` | OJS configuration: `enabled`, `url`, `journalPath`, paths |
| `assets/js/app.js` → `applyOjsLinks()` | Builds OJS URLs and toggles the OJS UI |
| `index.html` → `#ojs-links`, `#ojs-note`, `#ojs-card`, `#footer-ojs` | Premium OJS surfaces, hidden until enabled |
| `assets/js/i18n.js` | FR / EN / AR strings for every OJS surface |
| `tools/ojs-sync.mjs` | Dependency-free OAI-PMH harvester |
| `ojs.config.example.json` | Sync configuration template |
| `assets/js/data.ojs.js` | Generated OJS catalogue (placeholder committed) |

### Enable the OJS links

Edit `assets/js/data.js`:

```js
ojs: {
  enabled: true,
  url: "https://ojs.example.org",   // installation root, no /index.php
  journalPath: "crsl",              // https://ojs.example.org/index.php/crsl
  submissions: "about/submissions",
  login: "login",
  dashboard: "submissions",
  archive: "issue/archive",
  oai: "oai"
}
```

What changes on the site:

* the submission button becomes **“Soumettre sur OJS”** and points to
  `/index.php/crsl/about/submissions`;
* **Espace auteur** and **Archives OJS** links appear under it;
* the guideline line “Dépôt et suivi via la plateforme ASJP” switches to OJS;
* a **Plateforme OJS** card appears in Contact;
* **Espace auteur (OJS)** appears in the footer;
* everything is translated in FR / EN / AR and works at 320 px.

While `enabled` is `false`, none of these elements render and the ASJP flow is
untouched. This is deliberate: never publish a link to an OJS instance that is
not live.

---

## 3. Chunk plan

| Chunk | Status | Work |
| --- | --- | --- |
| A. OJS-ready front end | **Done** | Config, links, translations, responsive QA |
| B. OAI-PMH sync | **Done** | `tools/ojs-sync.mjs`, JSON/JS catalogue, docs |
| C. Host + install OJS | Blocked | Needs domain, server/VPS, database, TLS |
| D. Seed the archive | Next | Create issues/articles in OJS from `data.js` + `pdf/` |
| E. Surface synced articles | Next | Render `CRSL_OJS.articles` on the static site |
| F. Standards & indexation | Next | Crossref DOIs, ORCID, DOAJ/BASE/CORE, sitemap |

Chunk C is the only hard blocker: it requires an actual server. Nothing else
depends on it, so A/B can ship now.

---

## 4. Chunk B — run the OAI-PMH sync

OJS exposes every journal at:

```
https://ojs.example.org/index.php/crsl/oai
```

Verify it first:

```bash
curl "https://ojs.example.org/index.php/crsl/oai?verb=Identify"
curl "https://ojs.example.org/index.php/crsl/oai?verb=ListMetadataFormats"
```

Then:

```bash
cp ojs.config.example.json ojs.config.json
# edit baseUrl / journalPath
node tools/ojs-sync.mjs --config ojs.config.json
```

Output:

* `assets/js/data.ojs.js` — `window.CRSL_OJS = { generatedAt, source, count, articles }`
* `assets/js/data.ojs.json` — same payload for tooling/SEO scripts

Record shape:

```json
{
  "id": "oai:ojs.example.org:article/42",
  "oai": "oai:ojs.example.org:article/42",
  "title": "…",
  "altTitle": "…",
  "authors": ["…"],
  "abstract": "…",
  "keywords": ["…"],
  "language": "fr",
  "date": "2026-01-15",
  "year": "2026",
  "volume": "4",
  "issue": "1",
  "pages": "15–29",
  "source": "Vol. 4 No. 1 (2026)",
  "doi": "10.xxxx/xxxxx",
  "articleUrl": "https://ojs.example.org/index.php/crsl/article/view/42",
  "pdfUrl": "https://ojs.example.org/index.php/crsl/article/download/42/57",
  "rights": "…",
  "publisher": "…",
  "type": "…",
  "setSpec": "crsl:ART",
  "updated": "2026-01-15T10:00:00Z"
}
```

Useful flags:

```bash
node tools/ojs-sync.mjs --base https://ojs.example.org --journal crsl --dry-run
node tools/ojs-sync.mjs --from 2025-01-01 --until 2026-12-31
```

Daily cron (4 a.m.):

```cron
0 4 * * * cd /var/www/crsl-website && /usr/bin/node tools/ojs-sync.mjs --config ojs.config.json >> /var/log/crsl-ojs-sync.log 2>&1
```

Windows: create a Task Scheduler job running `node tools\ojs-sync.mjs` with the
project folder as "Start in".

Only **published** articles with at least one galley are exposed by OJS. An
empty harvest usually means the issue is not published yet.

---

## 5. Chunk C — install OJS 3.5 LTS

Download the current 3.5 LTS package from
<https://pkp.sfu.ca/software/ojs/download/>. OJS 3.5 was released in June 2025;
3.5.0-5 LTS followed on 30 June 2026.

### Server requirements

| Component | Minimum | Recommended |
| --- | --- | --- |
| PHP | 8.2 | 8.3 (8.2 minimum for 3.5) |
| MySQL / MariaDB | 5.7.22 / 10.3 | MySQL 8.0+ / MariaDB 10.11+ |
| PostgreSQL | 9.5 | 15+ |
| Web server | Apache 2.4 / Nginx 1.20 | Nginx + PHP-FPM |
| RAM / disk | 1 GB / 10 GB | 4 GB / 50 GB+ |
| TLS | required | Let’s Encrypt |

PHP extensions: `mbstring`, `xml`/`dom`/`simplexml`, `intl`, `gd`, `curl`,
`zip`, `fileinfo`, `mysqli` (or `pgsql`), `bcmath`, `json`.

### Ubuntu 24.04 (PHP 8.3) sketch

```bash
sudo apt update
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-mysql php8.3-xml \
  php8.3-mbstring php8.3-intl php8.3-gd php8.3-curl php8.3-zip php8.3-bcmath

sudo mysql <<'SQL'
CREATE DATABASE ojs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ojs'@'localhost' IDENTIFIED BY 'CHANGE_ME';
GRANT ALL PRIVILEGES ON ojs.* TO 'ojs'@'localhost';
FLUSH PRIVILEGES;
SQL

cd /var/www
# download the 3.5 LTS tarball from the PKP page, then:
tar xzf ojs-3.5*.tar.gz
sudo mkdir -p /var/lib/ojs/files
sudo chown -R www-data:www-data /var/www/ojs /var/lib/ojs
```

On Ubuntu 22.04 the default PHP is 8.1, which **cannot** run OJS 3.5: add the
`ondrej/php` PPA and install PHP 8.2 or 8.3 first.

Open `https://ojs.example.org/install` and follow the web installer. Point the
files directory to `/var/lib/ojs/files` (outside the web root).

After installation:

* keep `files_dir` outside the web root;
* set `base_url` in `config.inc.php`;
* turn OAI on in the config and in **Settings → Distribution → Access**;
* set `api_secret_key` if you plan to use the REST API;
* protect/remove the `install` directory;
* enable HTTPS and HSTS.

Scheduled tasks (review reminders, Crossref deposits, statistics):

```cron
*/5 * * * * www-data php /var/www/ojs/bin/runScheduledTasks.php
```

OJS 3.5 migrated the REST API from Slim to Laravel. Interactive API docs are
served by the installation at `/api/v1/_docs`; authenticated calls use
`Authorization: Bearer <API token>` (token in **User Profile → API Key**).
OAI-PMH remains the right interface for public metadata; the REST API is for
editorial automation, not for public reading.

---

## 6. Journal configuration checklist (OJS admin)

1. **Journal path** `crsl`, title, ISSN `2992-0302`, EISSN `2992-0647`.
2. **Languages**: enable Français, English and العربية; set French as primary.
   OJS ships RTL support for Arabic.
3. **Sections**: Articles, Comptes rendus / Book reviews, as needed.
4. **Review**: double-blind by default; review forms in FR/EN.
5. **Roles**: Journal Manager (Soumia Chentouf), Editor, Section Editors,
   Reviewers, Authors, Readers. Create accounts by invitation.
6. **Emails**: authenticated SMTP, sender name and address; templates in FR/EN.
7. **Submission**: author guidelines, template file, copyright and licensing
   (CC BY recommended for DOAJ), plagiarism and AI-use declarations.
8. **Publication**: issue templates (Vol. / No. / year), cover images, galleys
   (PDF first, HTML/ePub later).
9. **OAI-PMH**: on, `oai_dc` and JATS exposed; test with `?verb=ListRecords`.
10. **DOIs**: install the Crossref plugin, register the prefix, deposit; use
    the test system before the first real deposit (Crossref membership needed).
11. **ORCID**: enable the ORCID plugin so authors can authenticate.
12. **Indexation**: submit the OAI endpoint to DOAJ, BASE, CORE and OpenAIRE;
    Google Scholar picks up OJS meta tags automatically. Enable the sitemap
    plugin.

---

## 7. Chunk D — seed the existing archive

Existing content lives in `assets/js/data.js` and `pdf/`. Two options:

* **Manual** (safest for a first install): create the four issues in OJS, then
  one submission per article, upload the PDF as a galley, paste title,
  abstract, keywords and authors. Publish.
* **Scripted** (for larger archives): OJS native XML import via
  **Tools → Import/Export**, or the REST API with a Journal Manager API token.
  Prepare a native XML file from `data.js` in a later chunk.

Rules that avoid surprises:

* create issues **before** articles;
* one galley per article is enough to expose it through OAI-PMH;
* keep the original filenames from `pdf/` for traceability;
* do not re-publish the same article in both ASJP and OJS with different DOIs.

---

## 8. Chunk E — show OJS articles on the premium site

`data.ojs.js` already loads in `index.html` and exposes
`window.CRSL_OJS.articles`. The next chunk can render, for example:

* a “Latest articles” strip above the curated issues;
* an “OJS archive” count on the Contact card;
* automatic `sitemap.xml` entries for `articleUrl` and `pdfUrl`.

Design constraints to keep the premium look:

* reuse the existing `.issue-card` / `.article-row` tokens, no new palette;
* cap the strip at 3–5 items and link out to OJS for the full list;
* never duplicate an article that is already in `data.js` (dedupe on DOI or
  `articleUrl`);
* keep the 2-second email gate untouched.

---

## 9. Operations

* **Backups**: database + `files_dir` daily, off-server, restore tested.
* **Upgrades**: 3.5.x patch releases are drop-in (replace code, run
  `php tools/upgrade.php upgrade`); never skip the release notes.
* **Security**: HTTPS only, strong admin passwords, 2FA via plugin, keep PHP
  and OJS patched, restrict `/install`, disable directory listing.
* **Performance**: OPcache, object cache (Redis/Memcached) for busy journals,
  CDN for static assets only (not for `/index.php`).
* **Monitoring**: uptime on the OJS home page and `/oai?verb=Identify`,
  log rotation for `ojs.log` and PHP-FPM.

---

## 10. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `?verb=Identify` shows “badVerb” | You are on the correct endpoint; add a verb |
| `noRecordsMatch` | No published issue/galley yet, or OAI disabled |
| Empty `data.ojs.js` | Sync ran before publication; check the issue state |
| OJS login loops | `base_url` or `trusted_hosts` mismatch, or HTTPS proxy headers |
| Uploads fail | `upload_max_filesize`, `post_max_size`, `client_max_body_size` |
| DOI deposit fails | Crossref credentials/prefix, or missing author metadata |
| Arabic text breaks | Database not `utf8mb4` or missing `intl` |

---

## 11. What is needed to finish chunk C

Provide:

1. a domain or subdomain for OJS (e.g. `ojs.crsl-journal.dz`);
2. a VPS/hosting plan with PHP 8.2+, MySQL 8+ and SSH (or cPanel);
3. TLS certificate (Let’s Encrypt is fine);
4. the journal’s preferred contact and SMTP credentials;
5. confirmation of the OJS journal path (`crsl` by default).

Once the instance exists, set `meta.ojs.enabled = true` and the premium site
starts routing submissions to OJS with no design changes.
