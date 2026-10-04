(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var note = "";
  var KEEP = { "sr-theme": 1, "sr-lang": 1 };

  function count(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v.length : 0;
    } catch (e) { return 0; }
  }
  function num(n) { return '<span class="num" dir="ltr">' + esc(String(n)) + "</span>"; }
  function body() {
    var msg = note ? '<p role="status">' + esc(t(note)) + "</p>" : "";
    return '<div class="view"><h1>' + esc(t("stopTitle")) + "</h1><p>" + esc(t("stopHint")) + "</p>" + msg
      + '<dl class="stats">'
      + "<div><dt>" + esc(t("countTransfers")) + "</dt><dd>" + num(count("sr-transfers")) + "</dd></div>"
      + "<div><dt>" + esc(t("countTax")) + "</dt><dd>" + num(count("sr-tax")) + "</dd></div>"
      + "<div><dt>" + esc(t("countAlerts")) + "</dt><dd>" + num(count("sr-alerts")) + "</dd></div>"
      + '</dl><button type="button" class="solid" id="clear-desk">' + esc(t("clear")) + "</button></div>";
  }
  function render() {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.headerHTML({ brandHref: "index.html" })
      + '<div class="page-body"><div id="main" tabindex="-1">' + body() + "</div></div>";
  }
  function scrub() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    keys.forEach(function (k) {
      if (k && k.indexOf("sr-") === 0 && !KEEP[k]) localStorage.removeItem(k);
    });
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-set-lang],[data-set-theme],[data-skip]")) return;
    if (e.target.id === "clear-desk" || (e.target.closest && e.target.closest("#clear-desk"))) {
      scrub();
      note = "cleared";
      render();
    }
  });
  window.SRX.initChrome();
  window.SR.onChange = function () { render(); };
  render();
})();
