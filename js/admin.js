(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var TICKER_URL = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
  var KLINE_URL = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60";
  var job = { phase: "wait", price: null, closes: null, priceFail: null, klineFail: null };
  var started = false;

  function mono(s) {
    return '<span class="ltr" dir="ltr">' + esc(s) + "</span>";
  }
  function endpoint(beforeKey, urlKey, afterKey) {
    return "<p>" + esc(t(beforeKey)) + " " + mono(t(urlKey)) + " " + esc(t(afterKey)) + "</p>";
  }
  function failBox(fail) {
    if (!fail) return "";
    var parts = [];
    if (fail.status) parts.push(esc(t("adminStatus")) + " " + esc(String(fail.status)) + (fail.statusText ? " " + esc(fail.statusText) : ""));
    if (fail.error) parts.push(esc(fail.error));
    if (fail.text) parts.push(esc(fail.text.slice(0, 300)));
    if (!parts.length) parts.push(esc(t("adminFail")));
    return '<p class="bad" role="alert">' + parts.join(" — ") + "</p><p class=\"quiet\">" + esc(t("adminFail")) + "</p>";
  }
  function svg(closes) {
    var w = 720;
    var h = 240;
    var pad = 16;
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
    return '<svg viewBox="0 0 ' + w + " " + h + '" class="chart" role="img" aria-label="' + esc(t("chartLabel")) + '"><polyline fill="none" stroke="currentColor" stroke-width="1.8" points="' + pts + '"/></svg>';
  }
  function body() {
    var price = "";
    var chart = "";
    if (job.phase === "wait") {
      chart = '<p class="quiet">' + esc(t("adminWait")) + "</p>";
    } else {
      if (job.price != null) {
        price = '<p class="price-line"><span>' + esc(t("adminLast")) + '</span> <span class="num" dir="ltr">' + esc(job.price) + "</span></p>";
      } else if (job.priceFail) {
        price = failBox(job.priceFail);
      } else {
        price = '<p class="bad" role="alert">' + esc(t("noPrice")) + "</p>";
      }
      if (job.closes) {
        chart = '<p class="quiet">' + esc(t("chartLabel")) + " " + '<span class="num" dir="ltr">' + esc(String(job.closes.length)) + "</span> " + esc(t("closeCount")) + '</p><div class="chart-box">' + svg(job.closes) + "</div>";
      } else if (job.klineFail) {
        chart = failBox(job.klineFail);
      } else {
        chart = '<p class="bad" role="alert">' + esc(t("badBody")) + "</p>";
      }
    }
    return '<div class="block"><h1>' + esc(t("adminTitle")) + "</h1><p>" + mono(t("pairSymbol")) + "</p>"
      + endpoint("adminTickerBefore", "url.ticker", "adminTickerAfter")
      + endpoint("adminKlineBefore", "url.kline", "adminKlineAfter")
      + "<p>" + esc(t("adminLimit")) + "</p>"
      + price
      + chart
      + "</div>";
  }
  function render() {
    window.SRX.applyDocument();
    var nav = '<a class="backlink" href="index.html">' + esc(t("adminBack")) + "</a>";
    document.getElementById("app").innerHTML = window.SRX.skip()
      + window.SRX.bar({ brandHref: "index.html", nav: nav })
      + '<div class="wrap"><div id="main" tabindex="-1">' + body() + "</div></div>"
      + window.SRX.foot();
  }
  function pull(url) {
    return fetch(url, { method: "GET", cache: "no-store", credentials: "omit" }).then(function (r) {
      return r.text().then(function (text) {
        return { ok: r.ok, status: r.status, statusText: r.statusText || "", text: text || "" };
      }, function () {
        return { ok: false, status: r.status, statusText: r.statusText || "", text: "" };
      });
    }, function (err) {
      return { ok: false, status: 0, statusText: "", text: "", error: err && err.message ? String(err.message) : String(err) };
    });
  }
  function load() {
    if (started) return;
    started = true;
    Promise.all([pull(TICKER_URL), pull(KLINE_URL)]).then(function (pair) {
      var ticker = pair[0];
      var klines = pair[1];
      if (!ticker.ok) job.priceFail = ticker;
      else {
        try {
          var data = JSON.parse(ticker.text);
          if (data && typeof data.price === "string" && isFinite(Number(data.price))) job.price = data.price;
        } catch (e) { job.price = null; }
      }
      if (!klines.ok) job.klineFail = klines;
      else {
        try {
          var rows = JSON.parse(klines.text);
          if (Array.isArray(rows) && rows.length) {
            var closes = rows.map(function (row) { return Array.isArray(row) ? Number(row[4]) : NaN; });
            if (closes.length && closes.every(function (n) { return isFinite(n); })) job.closes = closes;
          }
        } catch (e2) { job.closes = null; }
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
