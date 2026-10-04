(function () {
  var langs = { en: 1, hi: 1, ur: 1 };
  var themes = { dark: 1, night: 1, auto: 1 };
  var lang = localStorage.getItem("sr-lang");
  if (!langs[lang]) lang = "en";
  var choice = localStorage.getItem("sr-theme");
  if (!themes[choice]) choice = "dark";
  var theme = choice === "night" ? "night" : choice === "auto"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "day")
    : "dark";
  var root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ur" ? "rtl" : "ltr";
  root.setAttribute("data-lang", lang);
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-theme-choice", choice);
  var titles = { en: "Signal Room", hi: "संकेत कक्ष", ur: "اشارہ خانہ" };
  document.title = titles[lang];
  var SR = window.SR || {};
  SR.lang = lang;
  SR.themeChoice = choice;
  SR.q = SR.q || "";
  SR.view = SR.view || "search";
  SR.menu = SR.menu || null;
  window.SR = SR;
})();
