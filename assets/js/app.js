/* ============================================================
   CRSL - site behaviour
   Language (FR default / EN / AR), theme (dark default),
   issue browser, live search, in-page PDF reader.
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.CRSL_DATA;
  var I18N = window.CRSL_I18N;

  var LANGS = ["fr", "en", "ar"];
  var RTL = { ar: true };

  var state = {
    lang: "fr",
    theme: "dark",
    query: "",
    volume: "all",
    open: new Set(),
    lastFocus: null
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  document.documentElement.classList.add("js");

  /* ---------- Helpers ---------- */

  function t(key, vars) {
    var dict = I18N[state.lang] || I18N.fr;
    var str = dict[key];
    if (typeof str === "undefined") str = I18N.fr[key];
    if (typeof str === "undefined") str = key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      });
    }
    return str;
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function normalize(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u2019']/g, "'");
  }

  function countryLabel(code) {
    var c = DATA.countries[code];
    return c ? (c[state.lang] || c.fr) : "";
  }

  function allArticles() {
    var out = [];
    DATA.volumes.forEach(function (v) {
      v.articles.forEach(function (a) { out.push({ article: a, volume: v }); });
    });
    return out;
  }

  function findArticle(id) {
    var found = null;
    DATA.volumes.forEach(function (v) {
      v.articles.forEach(function (a) {
        if (a.id === id) found = { article: a, volume: v };
      });
    });
    return found;
  }

  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function articleSearchText(entry) {
    var a = entry.article;
    var v = entry.volume;
    return [
      a.title, a.titleEn, a.authors.join(" "), a.affiliation,
      a.keywords.join(" "), a.abstract, a.pages,
      countryLabel(a.country), v.year, v.number
    ].join(" ");
  }

  function matchesFilters(entry) {
    if (state.volume !== "all" && entry.volume.id !== state.volume) return false;
    if (!state.query) return true;
    return normalize(articleSearchText(entry)).indexOf(state.query) !== -1;
  }

  function isFiltering() {
    return Boolean(state.query) || state.volume !== "all";
  }

  /* ---------- Theme ---------- */

  function setTheme(theme, persist) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", state.theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#07080a" : "#f5f5f7");

    var btn = $("#theme");
    if (btn) {
      btn.setAttribute("aria-label", state.theme === "dark" ? t("theme.toLight") : t("theme.toDark"));
      btn.setAttribute("title", state.theme === "dark" ? t("theme.toLight") : t("theme.toDark"));
    }

    if (persist) safeStorageSet("crsl:theme", state.theme);
  }

  /* ---------- Language ---------- */

  function setLanguage(lang, persist) {
    state.lang = LANGS.indexOf(lang) !== -1 ? lang : "fr";

    document.documentElement.setAttribute("lang", state.lang);
    document.documentElement.setAttribute("dir", RTL[state.lang] ? "rtl" : "ltr");
    document.title = "CRSL · " + DATA.meta.name[state.lang];

    var select = $("#lang");
    if (select) select.value = state.lang;

    applyStaticTranslations();
    renderAll();

    setTheme(state.theme, false);

    if (persist) safeStorageSet("crsl:lang", state.lang);
  }

  function applyStaticTranslations() {
    $$("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    $$("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    $$("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });

    var name = DATA.meta.name[state.lang];
    $$(".brand-text strong").forEach(function (el) { el.textContent = name; });

    var heroName = $("#hero-name");
    if (heroName) heroName.textContent = name;

    var address = $("#contact-address");
    if (address) address.textContent = DATA.meta.address[state.lang];

    var search = $("#search");
    if (search && !search.value) search.setAttribute("placeholder", t("issues.search"));
  }

  /* ---------- Hero ---------- */

  function latestVolume() {
    return DATA.volumes[DATA.volumes.length - 1];
  }

  function renderHero() {
    var latest = latestVolume();
    var dateEl = $("#latest-date");
    if (dateEl) dateEl.textContent = latest.date[state.lang];

    var noEl = $("#latest-number");
    if (noEl) noEl.textContent = t("issue.label") + " " + pad2(latest.number);

    var countEl = $("#latest-count");
    if (countEl) countEl.textContent = t("issues.count", { n: latest.articles.length });

    var btn = $("#latest-read");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        var vol = latestVolume();
        openPdf(
          vol.sommaire,
          t("issues.sommaire") + " · " + t("volume.label") + " " + vol.number,
          vol.date[state.lang]
        );
      });
    }

    var total = allArticles();
    var countries = new Set(total.map(function (e) { return e.article.country; }));

    setText("#stat-issues", DATA.volumes.length);
    setText("#stat-articles", total.length);
    setText("#stat-countries", countries.size);
    setText("#stat-founded", DATA.meta.founded);
  }

  function setText(sel, value) {
    var el = $(sel);
    if (el) el.textContent = value;
  }

  /* ---------- Domains & documents ---------- */

  function renderDomains() {
    var list = $("#domains");
    if (!list) return;
    list.innerHTML = DATA.domains.map(function (d) {
      return "<li>" + esc(d[state.lang] || d.fr) + "</li>";
    }).join("");
  }

  function renderDocuments() {
    var wrap = $("#documents");
    if (!wrap) return;
    wrap.innerHTML = DATA.documents.map(function (doc) {
      var title = doc.title[state.lang] || doc.title.fr;
      return (
        '<a class="doc-card" href="' + esc(doc.file) + '" target="_blank" rel="noopener">' +
          '<span class="doc-ico" aria-hidden="true">PDF</span>' +
          "<span>" +
            "<strong>" + esc(title) + "</strong>" +
            "<small>PDF</small>" +
          "</span>" +
          '<span class="doc-arrow" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span>' +
        "</a>"
      );
    }).join("");
  }

  /* ---------- Filters ---------- */

  function renderFilters() {
    var wrap = $("#volume-filters");
    if (!wrap) return;

    var html = '<button class="chip-btn" type="button" data-volume="all" aria-pressed="' +
      (state.volume === "all") + '">' + esc(t("issues.all")) + "</button>";

    DATA.volumes.forEach(function (v) {
      html += '<button class="chip-btn" type="button" data-volume="' + v.id + '" aria-pressed="' +
        (state.volume === v.id) + '">' + esc(t("volume.label")) + " " + v.number + "</button>";
    });

    wrap.innerHTML = html;

    $$(".chip-btn", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.volume = btn.getAttribute("data-volume");
        $$(".chip-btn", wrap).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        renderVolumes();
      });
    });
  }

  /* ---------- Volume / article rendering ---------- */

  function volumeIsOpen(volume) {
    if (isFiltering()) return true;
    return state.open.has(volume.id);
  }

  function renderVolumes() {
    var host = $("#volumes");
    if (!host) return;

    var visibleTotal = 0;
    var html = "";

    DATA.volumes.forEach(function (volume) {
      var articles = volume.articles.filter(function (article) {
        return matchesFilters({ article: article, volume: volume });
      });

      if (!articles.length) return;

      visibleTotal += articles.length;
      var open = volumeIsOpen(volume);
      var bodyId = "volume-body-" + volume.id;

      html += '<article class="volume">';
      html += '<header class="volume-head">';
      html += '<span class="volume-no" aria-hidden="true">' + pad2(volume.number) + "</span>";
      html += '<div class="volume-titles">';
      html += "<h3>" + esc(t("volume.label")) + " " + volume.number + " · " +
        esc(t("issue.label")) + " " + volume.issue + "</h3>";
      html += "<p>" + esc(volume.date[state.lang]) + " · " +
        esc(t("issues.count", { n: volume.articles.length })) + "</p>";
      html += "</div>";
      html += '<div class="volume-actions">';
      if (volume.sommaire) {
        html += '<a class="btn btn-ghost btn-sm" href="' + esc(volume.sommaire) +
          '" target="_blank" rel="noopener">' + esc(t("issues.sommaire")) + "</a>";
      }
      html += '<button class="volume-toggle" type="button" data-volume-toggle="' + volume.id +
        '" aria-expanded="' + open + '" aria-controls="' + bodyId + '" aria-label="' +
        esc(t("volume.label") + " " + volume.number) + '">';
      html += '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      html += "</button>";
      html += "</div>";
      html += "</header>";

      html += '<div class="volume-body" id="' + bodyId + '"' + (open ? "" : " hidden") + ">";
      html += '<ul class="articles">';
      articles.forEach(function (article, idx) {
        html += articleMarkup(article, volume, idx + 1);
      });
      html += "</ul>";
      html += "</div>";
      html += "</article>";
    });

    host.innerHTML = html;

    var empty = $("#empty-state");
    if (empty) empty.hidden = visibleTotal !== 0;

    var results = $("#results-count");
    if (results) {
      results.textContent = isFiltering()
        ? t("issues.results", { n: visibleTotal })
        : t("issues.count", { n: visibleTotal });
    }

    var reset = $("#reset-search");
    if (reset) reset.hidden = !isFiltering();

    $$("[data-volume-toggle]", host).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-volume-toggle");
        var body = $("#volume-body-" + id);
        if (!body) return;
        var willOpen = body.hidden;
        body.hidden = !willOpen;
        btn.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) state.open.add(id); else state.open.delete(id);
      });
    });

    $$("[data-read]", host).forEach(function (el) {
      el.addEventListener("click", function () {
        openReader(el.getAttribute("data-read"));
      });
    });
  }

  function articleMarkup(article, volume, index) {
    var authors = article.authors.join(", ");
    var country = countryLabel(article.country);
    var metaParts = [authors];
    if (article.affiliation) metaParts.push(article.affiliation);
    if (country) metaParts.push(country);

    var html = '<li class="article">';
    html += '<span class="article-idx" aria-hidden="true">' + pad2(index) + "</span>";
    html += '<div class="article-main">';
    html += '<div class="article-tags">';
    html += '<span class="tag tag-lang" lang="' + esc(article.lang) + '">' +
      esc((article.lang || "fr").toUpperCase()) + "</span>";
    if (article.pages) {
      html += '<span class="tag">' + esc(t("article.pp")) + " " + esc(article.pages) + "</span>";
    }
    if (!article.pdf) {
      html += '<span class="tag tag-soon">' + esc(t("article.pdfSoon")) + "</span>";
    }
    html += "</div>";

    html += "<h4>";
    if (article.pdf) {
      html += '<button class="article-title" type="button" data-read="' + esc(article.id) +
        '" lang="fr" dir="ltr">' + esc(article.title) + "</button>";
    } else {
      html += '<span class="article-title" lang="fr" dir="ltr">' + esc(article.title) + "</span>";
    }
    html += "</h4>";

    if (article.titleEn) {
      html += '<p class="article-sub" lang="en" dir="ltr">' + esc(article.titleEn) + "</p>";
    }

    html += '<p class="article-meta"><span class="article-authors">' + esc(authors) + "</span>";
    if (article.affiliation) html += " · " + esc(article.affiliation);
    if (country) html += " · " + esc(country);
    html += "</p>";

    if (article.abstract) {
      html += '<p class="article-abstract">' + esc(article.abstract) + "</p>";
    }

    if (article.keywords.length) {
      html += '<p class="article-keywords">' + esc(t("article.keywords")) + " : " +
        esc(article.keywords.join(" · ")) + "</p>";
    }

    if (!article.pdf) {
      html += '<p class="article-unavailable">' + esc(t("article.unavailableNote")) + "</p>";
    }

    html += "</div>";

    html += '<div class="article-actions">';
    if (article.pdf) {
      html += '<button class="btn btn-primary" type="button" data-read="' + esc(article.id) + '">' +
        '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5C10.5 5 8.4 4.5 5.5 4.5v12c2.9 0 5 .5 6.5 2 1.5-1.5 3.6-2 6.5-2v-12c-2.9 0-5 .5-6.5 2Z"/><path d="M12 6.5v12"/></svg>' +
        esc(t("article.read")) + "</button>";
      html += '<a class="btn btn-ghost" href="' + esc(article.pdf) + '" download>' +
        '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10M7.5 9.5 12 14l4.5-4.5M5 19h14"/></svg>' +
        esc(t("article.download")) + "</a>";
    } else {
      html += '<button class="btn btn-ghost" type="button" disabled>' +
        esc(t("article.pdfSoon")) + "</button>";
    }
    html += "</div>";
    html += "</li>";

    return html;
  }

  /* ---------- Committee ---------- */

  function roleLabel(role) {
    var key = "role." + role;
    return t(key);
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (word) {
      return word.charAt(0);
    }).join("").toUpperCase();
  }

  function renderCommittee() {
    var host = $("#committee");
    if (!host) return;

    host.innerHTML = DATA.committee.map(function (member) {
      var roles = member.roles.map(roleLabel).join(" · ");
      var html = '<div class="committee-card">';
      html += '<span class="committee-avatar" aria-hidden="true">' + esc(initials(member.name)) + "</span>";
      html += '<p class="committee-role">' + esc(roles) + "</p>";
      html += '<h3 class="committee-name">' + esc(member.name) + "</h3>";
      if (member.affiliation) {
        html += '<p class="committee-aff">' + esc(member.affiliation) + "</p>";
      }
      html += '<a class="committee-mail" href="mailto:' + esc(member.email) + '">' +
        esc(member.email) + "</a>";
      html += "</div>";
      return html;
    }).join("");
  }

  /* ---------- PDF viewer ---------- */

  function openReader(id) {
    var found = findArticle(id);
    if (!found || !found.article.pdf) return;
    var a = found.article;
    var sub = a.authors.join(", ");
    if (a.pages) sub += " · " + t("article.pp") + " " + a.pages;
    sub += " · " + t("volume.label") + " " + found.volume.number;
    openPdf(a.pdf, a.title, sub);
  }

  function openPdf(url, title, sub) {
    if (!url) return;
    var viewer = $("#viewer");
    if (!viewer) return;

    state.lastFocus = document.activeElement;
    viewer.hidden = false;
    document.body.classList.add("no-scroll");

    $("#viewer-title").textContent = title;
    $("#viewer-sub").textContent = sub || "";

    var frame = $("#viewer-frame");
    frame.src = url;

    var open = $("#viewer-open");
    open.href = url;

    var dl = $("#viewer-dl");
    dl.href = url;
    dl.setAttribute("download", url.split("/").pop());

    window.setTimeout(function () { $("#viewer-close").focus(); }, 30);
  }

  function closeViewer() {
    var viewer = $("#viewer");
    if (!viewer || viewer.hidden) return;

    viewer.hidden = true;
    document.body.classList.remove("no-scroll");

    var frame = $("#viewer-frame");
    frame.removeAttribute("src");

    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
    state.lastFocus = null;
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    var viewer = $("#viewer");
    if (!viewer || viewer.hidden) return;

    var panel = $(".viewer-panel", viewer);
    var focusable = $$('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])', panel)
      .filter(function (el) { return el.offsetParent !== null || el.tagName === "IFRAME"; });
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------- Search / reset ---------- */

  function resetFilters() {
    state.query = "";
    state.volume = "all";
    var input = $("#search");
    if (input) input.value = "";
    renderFilters();
    renderVolumes();
  }

  function bindSearch() {
    var input = $("#search");
    if (input) {
      input.addEventListener("input", function () {
        state.query = normalize(input.value.trim());
        renderVolumes();
      });
    }

    ["#reset-search", "#empty-reset"].forEach(function (sel) {
      var btn = $(sel);
      if (btn) btn.addEventListener("click", resetFilters);
    });
  }

  /* ---------- Navigation ---------- */

  function bindNav() {
    var menu = $("#menu");
    var nav = $("#nav");

    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("is-open");
      if (menu) {
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", t("menu.open"));
      }
    }

    if (menu && nav) {
      menu.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        menu.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-label", open ? t("menu.close") : t("menu.open"));
      });

      $$("a", nav).forEach(function (a) { a.addEventListener("click", closeMenu); });

      document.addEventListener("click", function (event) {
        if (!nav.classList.contains("is-open")) return;
        if (nav.contains(event.target) || menu.contains(event.target)) return;
        closeMenu();
      });
    }

    var header = $("#site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    var links = $$(".nav a");
    var map = {};
    links.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace("#", "");
      if (id) map[id] = link;
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = map[entry.target.id];
          if (!link) return;
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        });
      }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

      Object.keys(map).forEach(function (id) {
        var section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }
  }

  /* ---------- Reveal ---------- */

  function bindReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var targets = $$(".section-head, .stats, .about-grid, .docs-block, .committee-grid, .submit-grid, .contact-grid");
    targets.forEach(function (el) { el.classList.add("reveal"); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Init ---------- */

  function renderAll() {
    renderHero();
    renderDomains();
    renderDocuments();
    renderFilters();
    renderVolumes();
    renderCommittee();
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    var queryLang = params.get("lang");
    var queryTheme = params.get("theme");

    var storedLang = LANGS.indexOf(queryLang) !== -1 ? queryLang : safeStorageGet("crsl:lang");
    var storedTheme = queryTheme === "light" || queryTheme === "dark" ? queryTheme : safeStorageGet("crsl:theme");

    state.lang = LANGS.indexOf(storedLang) !== -1 ? storedLang : "fr";
    state.theme = storedTheme === "light" ? "light" : "dark";
    state.open = new Set([latestVolume().id]);

    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    setTheme(state.theme, false);
    setLanguage(state.lang, false);

    bindSearch();
    bindNav();
    bindReveal();

    var select = $("#lang");
    if (select) {
      select.addEventListener("change", function () {
        setLanguage(select.value, true);
      });
    }

    var themeBtn = $("#theme");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        setTheme(state.theme === "dark" ? "light" : "dark", true);
      });
    }

    var viewerClose = $("#viewer-close");
    if (viewerClose) viewerClose.addEventListener("click", closeViewer);

    var backdrop = $("#viewer-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeViewer);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        var viewer = $("#viewer");
        if (viewer && !viewer.hidden) {
          closeViewer();
          return;
        }
        var nav = $("#nav");
        if (nav && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          var menu = $("#menu");
          if (menu) {
            menu.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-label", t("menu.open"));
          }
        }
      }

      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement.isContentEditable) return;
        var search = $("#search");
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }

      trapFocus(event);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
