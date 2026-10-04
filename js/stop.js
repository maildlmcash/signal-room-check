(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var note = "";
  var KEEP = { "sr-theme": 1, "sr-lang": 1 };
  var NAMED = [
    ["sr-room-alerts", "countAlerts"],
    ["sr-room-labels", "countLabels"],
    ["sr-room-lots", "countTax"]
  ];

  function readArr(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : null;
    } catch (e) { return null; }
  }
  function num(n) { return '<span class="num" dir="ltr">' + esc(String(n)) + "</span>"; }
  function otherCount() {
    var known = { "sr-room-alerts": 1, "sr-room-labels": 1, "sr-room-lots": 1 };
    var n = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf("sr-") !== 0 || KEEP[k] || known[k]) continue;
        if (readArr(k)) n += readArr(k).length;
      }
    } catch (e) { return 0; }
    return n;
  }
  function body() {
    var msg = note ? '<p role="status">' + esc(t(note)) + "</p>" : "";
    var stats = NAMED.map(function (row) {
      var list = readArr(row[0]);
      var count = list ? list.length : 0;
      return "<div class=\"stat\"><dt>" + esc(t(row[1])) + "</dt><dd>" + num(count) + "</dd></div>";
    }).join("");
    stats += "<div class=\"stat\"><dt>" + esc(t("countOther")) + "</dt><dd>" + num(otherCount()) + "</dd></div>";
    return '<div class="block"><h1>' + esc(t("stopTitle")) + "</h1><p class=\"quiet\">" + esc(t("stopHint")) + "</p>" + msg
      + '<dl class="stats">' + stats + '</dl><button type="button" class="solid" id="clear-desk">' + esc(t("clear")) + "</button></div>";
  }
  function render() {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.skip()
      + window.SRX.bar({ brandHref: "index.html", nav: '<a class="backlink" href="index.html">' + esc(t("adminBack")) + "</a>" })
      + '<div class="wrap"><div id="main" tabindex="-1">' + body() + "</div></div>"
      + window.SRX.foot();
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
    if (e.target.closest("#clear-desk")) {
      scrub();
      note = "cleared";
      render();
    }
  });
  window.SRX.initChrome();
  window.SR.onChange = function () { render(); };
  render();
})();
