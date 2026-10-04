(function () {
  function pack() { return window.SR_DICT[window.SR.lang]; }
  function t(path) {
    var node = pack().strings;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object" || !(parts[i] in node)) return "…";
      node = node[parts[i]];
    }
    return String(node);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function resolvedTheme() {
    if (window.SR.themeChoice === "night") return "night";
    if (window.SR.themeChoice === "auto") {
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "day";
    }
    return "dark";
  }
  function applyDocument() {
    var meta = pack();
    var root = document.documentElement;
    root.lang = meta.htmlLang;
    root.dir = meta.dir;
    root.setAttribute("data-lang", window.SR.lang);
    root.setAttribute("data-theme", resolvedTheme());
    root.setAttribute("data-theme-choice", window.SR.themeChoice);
    document.title = t("brand");
  }
  function setLang(lang) {
    if (!window.SR_DICT[lang]) return;
    window.SR.lang = lang;
    localStorage.setItem("sr-lang", lang);
    applyDocument();
    if (window.SR.onChange) window.SR.onChange("lang");
  }
  function setTheme(choice) {
    if (choice !== "dark" && choice !== "night" && choice !== "auto") return;
    window.SR.themeChoice = choice;
    localStorage.setItem("sr-theme", choice);
    applyDocument();
    if (window.SR.onChange) window.SR.onChange("theme");
  }
  function mark() {
    return '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="1" y="1" width="20" height="20" rx="4" fill="none" stroke="currentColor"/><path d="M6 14.5 9.2 8l2.2 4.2L14 7.5 16.5 14.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function chev() {
    return '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.2 6 8l4-3.8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function seg(kind, items, current) {
    return '<div class="seg" role="group">' + items.map(function (it) {
      var on = current === it[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-set-' + kind + '="' + it[0] + '"' + on + '>' + esc(t(it[1])) + '</button>';
    }).join("") + '</div>';
  }
  function headerHTML(opts) {
    opts = opts || {};
    var search = "";
    if (opts.search) {
      search = '<div class="search" role="search"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor"/><path d="M10.2 10.2 14 14" stroke="currentColor"/></svg><input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t("searchPlaceholder")) + '" aria-label="' + esc(t("searchLabel")) + '" value="' + esc(window.SR.q || "") + '"></div>';
    }
    return '<div class="sticky-stack"><button type="button" class="skip" data-skip="1">' + esc(t("skip")) + '</button><div class="bar"><span class="brand">' + mark() + esc(t("brand")) + '</span>' + search
      + seg("lang", [["en", "lang.en"], ["hi", "lang.hi"], ["ur", "lang.ur"]], window.SR.lang)
      + seg("theme", [["dark", "theme.dark"], ["night", "theme.night"], ["auto", "theme.auto"]], window.SR.themeChoice)
      + '</div>' + (opts.nav || "") + '<p class="rule">' + esc(t("note")) + '</p></div>';
  }
  function footerHTML() {
    return '<footer class="foot"></footer>';
  }
  function initChrome() {
    document.addEventListener("click", function (e) {
      var lang = e.target.closest("[data-set-lang]");
      if (lang) { setLang(lang.getAttribute("data-set-lang")); return; }
      var theme = e.target.closest("[data-set-theme]");
      if (theme) { setTheme(theme.getAttribute("data-set-theme")); return; }
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (window.SR.themeChoice === "auto") {
        applyDocument();
        if (window.SR.onChange) window.SR.onChange("theme");
      }
    });
  }
  window.SRX = { t: t, esc: esc, applyDocument: applyDocument, headerHTML: headerHTML, footerHTML: footerHTML, initChrome: initChrome, chev: chev };
})();
