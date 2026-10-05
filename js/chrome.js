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
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "\u0026amp;quot;", "'": "&#39;" }[c];
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
      color.setAttribute("content", theme === "day" ? "#f4f2ec" : theme === "night" ? "#000000" : "#06070c");
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
    return '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8.4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="11" r="2.2" fill="currentColor"/><path d="M11 2v2.2M11 17.8V20M2 11h2.2M17.8 11H20" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.2 5.2l1.4 1.4M15.4 15.4l1.4 1.4M15.4 6.6l1.4-1.4M5.2 16.8l1.4-1.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/></svg>';
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
  function setNavOpen(on) {
    var root = document.documentElement;
    if (on) root.classList.add("nav-open");
    else root.classList.remove("nav-open");
    var btn = document.querySelector("[data-mobile-nav='toggle']");
    if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
  }
  function bar(opts) {
    opts = opts || {};
    var brandInner = mark() + "<span>" + esc(t("brand")) + "</span>";
    var brand = opts.brandHref
      ? '<a class="brandlock" href="' + esc(opts.brandHref) + '">' + brandInner + "</a>"
      : '<button type="button" class="brandlock" data-view="home">' + brandInner + "</button>";
    var nav = opts.nav || "";
    var mid = opts.mid || "";
    var end = opts.end || "";
    var prefs = prefsHTML();
    var burger = '<button type="button" class="nav-burger" data-mobile-nav="toggle" aria-expanded="false" aria-controls="mobile-drawer" aria-label="' + esc(t("menuOpen")) + '"><span></span><span></span><span></span></button>';
    var drawer = '<div class="nav-drawer" id="mobile-drawer" role="dialog" aria-label="' + esc(t("menuOpen")) + '">'
      + '<div class="nav-drawer-head"><span>' + esc(t("brand")) + '</span>'
      + '<button type="button" class="nav-close" data-mobile-nav="close" aria-label="' + esc(t("menuClose")) + '">&times;</button></div>'
      + nav
      + '<div class="prefs drawer-prefs">' + prefs + "</div>"
      + end
      + "</div>"
      + '<button type="button" class="nav-scrim" data-mobile-nav="close" tabindex="-1" aria-label="' + esc(t("menuClose")) + '"></button>';
    return '<header class="topnav"><div class="topnav-inner">' + brand
      + '<div class="nav-desktop">' + nav + "</div>"
      + mid
      + '<div class="prefs nav-desktop">' + prefs + "</div>"
      + '<div class="nav-desktop">' + end + "</div>"
      + burger
      + "</div>" + drawer + "</header>";
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
      var mob = e.target.closest("[data-mobile-nav]");
      if (mob) {
        var act = mob.getAttribute("data-mobile-nav");
        if (act === "toggle") setNavOpen(!document.documentElement.classList.contains("nav-open"));
        else if (act === "close") setNavOpen(false);
        return;
      }
      if (e.target.closest(".nav-drawer [data-view], .nav-drawer .backlink, .nav-drawer [data-set-lang], .nav-drawer [data-set-theme]")) {
        setNavOpen(false);
      }
      var lang = e.target.closest("[data-set-lang]");
      if (lang) { setLang(lang.getAttribute("data-set-lang")); return; }
      var theme = e.target.closest("[data-set-theme]");
      if (theme) { setTheme(theme.getAttribute("data-set-theme")); return; }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
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
    initChrome: initChrome,
    setNavOpen: setNavOpen
  };
})();
