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
    var color = document.querySelector('meta[name="theme-color"]');
    if (color) {
      var theme = resolvedTheme();
      color.setAttribute("content", theme === "day" ? "#f5f7fb" : theme === "night" ? "#000000" : "#07080b");
    }
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
    return '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="11" cy="11" r="2.1" fill="currentColor"/><path d="M11 1.6v2.5M11 17.9v2.5M1.6 11h2.5M17.9 11h2.5" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function seg(kind, items, current, labelKey) {
    return '<div class="seg" role="group" aria-label="' + esc(t(labelKey)) + '">' + items.map(function (it) {
      var on = current === it[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-set-' + kind + '="' + it[0] + '"' + on + '>' + esc(t(it[1])) + "</button>";
    }).join("") + "</div>";
  }
  function prefsHTML() {
    return seg("lang", [["en", "lang.en"], ["hi", "lang.hi"], ["ur", "lang.ur"]], window.SR.lang, "langGroup")
      + seg("theme", [["dark", "theme.dark"], ["night", "theme.night"], ["auto", "theme.auto"]], window.SR.themeChoice, "themeGroup");
  }
  function bar(opts) {
    opts = opts || {};
    var brandInner = mark() + "<span>" + esc(t("brand")) + "</span>";
    var brand = opts.brandHref
      ? '<a class="brandlock" href="' + esc(opts.brandHref) + '">' + brandInner + "</a>"
      : '<button type="button" class="brandlock" data-view="home">' + brandInner + "</button>";
    return '<header class="topnav"><div class="topnav-inner">' + brand
      + (opts.nav || "")
      + (opts.mid || "")
      + '<div class="prefs">' + prefsHTML() + "</div>"
      + (opts.end || "")
      + "</div></header>";
  }
  function foot() {
    return '<footer class="foot"><p>' + esc(t("footerNote")) + '</p><nav><a href="stop.html">' + esc(t("deviceLink")) + '</a><a href="admin.html">' + esc(t("chartLink")) + "</a></nav></footer>";
  }
  function skip() {
    return '<button type="button" class="skip" data-skip="1">' + esc(t("skip")) + "</button>";
  }
  function initChrome() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-skip]")) {
        var main = document.getElementById("main");
        if (main) main.focus();
        return;
      }
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
  window.SRX = {
    t: t,
    esc: esc,
    applyDocument: applyDocument,
    prefsHTML: prefsHTML,
    bar: bar,
    foot: foot,
    skip: skip,
    initChrome: initChrome
  };
})();
