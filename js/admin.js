(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var TICKER_URL = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT";
  var KLINE_URL = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=48";
  var job = { phase: "wait", price: null, closes: null };
  var started = false;

  function endpoint(beforeKey, urlKey, afterKey) {
    return "<p>" + esc(t(beforeKey)) + ' <span class="ltr" dir="ltr">' + esc(t(urlKey)) + "</span> " + esc(t(afterKey)) + "</p>";
  }
  function svg(closes) {
    var w = 640;
    var h = 220;
    var pad = 12;
    var min = closes[0];
    var max = closes[0];
    closes.forEach(function (c) {
      if (c < min) min = c;
      if (c > max) max = c;
    });
    if (min === max) { min -= 1; max += 1; }
    var pts = closes.map(function (c, i) {
      var x = pad + (closes.length === 1 ? (w - pad * 2) / 2 : i * (w - pad * 2) / (closes.length - 1));
      var y = pad + (max - c) / (max - min) * (h - pad * 2);
      return x.toFixed(2) + "," + y.toFixed(2);
    }).join(" ");
    return '<svg viewBox="0 0 ' + w + " " + h + '" class="chart" role="img" aria-label="' + esc(t("chartLabel")) + '"><polyline fill="none" stroke="currentColor" stroke-width="1.6" points="' + pts + '"/></svg>';
  }
  function body() {
    var price = "";
    var chart = "";
    if (job.phase === "wait") {
      chart = '<p class="muted">' + esc(t("adminWait")) + "</p>";
    } else {
      if (job.price != null) {
        price = '<p class="price-line"><span>' + esc(t("adminLast")) + '</span> <span class="num" dir="ltr">' + esc(job.price) + "</span></p>";
      } else {
        price = '<p class="err" role="alert">' + esc(t("adminFail")) + "</p>";
      }
      chart = job.closes ? svg(job.closes) : '<p class="err" role="alert">' + esc(t("adminFail")) + "</p>";
    }
    return '<div class="view"><h1>' + esc(t("adminTitle")) + '</h1><p><span class="ltr" dir="ltr">' + esc(t("pairSymbol")) + "</span></p>"
      + endpoint("adminTickerBefore", "url.ticker", "adminTickerAfter")
      + endpoint("adminKlineBefore", "url.kline", "adminKlineAfter")
      + "<p>" + esc(t("adminLimit")) + "</p>"
      + price
      + '<div class="chart-box">' + chart + "</div></div>";
  }
  function render() {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.headerHTML({
      brandHref: "index.html",
      nav: '<a class="back" href="index.html">' + esc(t("adminBack")) + "</a>"
    }) + '<div class="page-body"><div id="main" tabindex="-1">' + body() + "</div></div>";
  }
  function pull(url) {
    return fetch(url, { method: "GET", cache: "no-store", credentials: "omit" }).then(function (r) {
      if (!r.ok) return null;
      return r.json().catch(function () { return null; });
    }).catch(function () { return null; });
  }
  function load() {
    if (started) return;
    started = true;
    Promise.all([pull(TICKER_URL), pull(KLINE_URL)]).then(function (pair) {
      var ticker = pair[0];
      var klines = pair[1];
      if (ticker && ticker.lastPrice != null && isFinite(Number(ticker.lastPrice))) job.price = String(ticker.lastPrice);
      if (Array.isArray(klines) && klines.length) {
        var closes = klines.map(function (row) { return Number(row[4]); });
        if (closes.length && closes.every(function (n) { return isFinite(n); })) job.closes = closes;
      }
      job.phase = "done";
      render();
    });
  }
  window.SRX.initChrome();
  window.SR.onChange = function () { render(); };
  render();
  load();
})();
