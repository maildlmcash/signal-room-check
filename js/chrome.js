(function () {
  var TICKER_URL = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
  var KLINE_URL = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60";

  function pack() { return window.SR_DICT[window.SR.lang]; }
  function t(path) {
    var node = pack().strings;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object" || !(parts[i] in node)) return "\u2026";
      node = node[parts[i]];
    }
    return String(node);
  }
  function esc(s) {
    return String(s).replace(/[&<>\"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" }[c];
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
    return '<svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true"><rect x="1.2" y="1.2" width="19.6" height="19.6" rx="4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 14.5 9.2 8l2.2 4.2L14 7.5 16.5 14.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function chev() {
    return '<svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.2 6 8l4-3.8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  }
  function seg(kind, items, current) {
    return '<div class="seg" role="group">' + items.map(function (it) {
      var on = current === it[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-set-' + kind + '="' + it[0] + '"' + on + '>' + esc(t(it[1])) + "</button>";
    }).join("") + "</div>";
  }
  function headerHTML(opts) {
    opts = opts || {};
    var brand = opts.href
      ? '<a class="brand" href="' + esc(opts.href) + '">' + mark() + "<span>" + esc(t("brand")) + "</span></a>"
      : '<button type="button" class="brand" data-view="home">' + mark() + "<span>" + esc(t("brand")) + "</span></button>";
    var search = "";
    if (opts.search) {
      search = '<div class="search compact" role="search"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor"/><path d="M10.2 10.2 14 14" stroke="currentColor"/></svg><input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t("searchPlaceholder")) + '" aria-label="' + esc(t("searchLabel")) + '" value="' + esc(window.SR.q || "") + '"></div>';
    }
    var who = "";
    if (opts.account) {
      if (window.SR.session) {
        who = '<button type="button" class="text-btn" data-action="sign-out">' + esc(window.SR.session.name) + "</button>";
      } else {
        who = '<button type="button" data-view="login">' + esc(t("signIn")) + "</button>";
      }
    }
    return '<div class="sticky-stack"><a class="skip" href="#main">' + esc(t("skip")) + '</a><div class="bar">' + brand
      + (opts.nav || "")
      + '<div class="tools">' + search + who
      + seg("lang", [["en", "lang.en"], ["hi", "lang.hi"], ["ur", "lang.ur"]], window.SR.lang)
      + seg("theme", [["dark", "theme.dark"], ["night", "theme.night"], ["auto", "theme.auto"]], window.SR.themeChoice)
      + "</div></div></div>";
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
  function pullPublic(url) {
    return fetch(url, { method: "GET", cache: "no-store", credentials: "omit" }).then(function (r) {
      return r.text().then(function (text) {
        var slice = text.slice(0, 700);
        if (!r.ok) return { status: r.status, text: slice, err: slice || String(r.status) };
        return { status: r.status, text: text, err: null };
      });
    }).catch(function (e) {
      return { status: null, text: "", err: String((e && e.message) || e) };
    });
  }
  function mktState() {
    if (!window.SR.mkt) {
      window.SR.mkt = {
        phase: "idle", price: null, candles: null,
        tickerErr: null, klineErr: null, tickerStatus: null, klineStatus: null
      };
    }
    return window.SR.mkt;
  }
  function loadBtc(force) {
    var mkt = mktState();
    if (mkt.phase === "wait" && mkt.promise) return mkt.promise;
    if (mkt.phase === "done" && !force) return Promise.resolve(mkt);
    mkt.phase = "wait";
    mkt.price = null;
    mkt.candles = null;
    mkt.tickerErr = null;
    mkt.klineErr = null;
    mkt.tickerStatus = null;
    mkt.klineStatus = null;
    mkt.promise = Promise.all([pullPublic(TICKER_URL), pullPublic(KLINE_URL)]).then(function (pair) {
      var tr = pair[0];
      var kr = pair[1];
      mkt.tickerStatus = tr.status;
      mkt.klineStatus = kr.status;
      mkt.tickerErr = tr.err;
      mkt.klineErr = kr.err;
      if (!tr.err) {
        try {
          var j = JSON.parse(tr.text);
          if (j && j.price != null && j.price !== "") mkt.price = String(j.price);
          else mkt.tickerErr = tr.text.slice(0, 700) || t("ex.failed");
        } catch (e) { mkt.tickerErr = tr.text.slice(0, 700) || t("ex.failed"); }
      }
      if (!kr.err) {
        try {
          var arr = JSON.parse(kr.text);
          if (Array.isArray(arr) && arr.length) {
            mkt.candles = arr.map(function (k) {
              return { t: +k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] };
            });
          } else mkt.klineErr = kr.text.slice(0, 700) || t("ex.failed");
        } catch (e2) { mkt.klineErr = kr.text.slice(0, 700) || t("ex.failed"); }
      }
      mkt.phase = "done";
      return mkt;
    });
    return mkt.promise;
  }
  function cssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }
  function drawCloses(canvas, rows) {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 640;
    var h = canvas.clientHeight || 280;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!rows || rows.length < 2) return;
    var pad = 16;
    var max = rows[0].c;
    var min = rows[0].c;
    rows.forEach(function (r) { if (r.c > max) max = r.c; if (r.c < min) min = r.c; });
    if (max === min) { max += 1; min -= 1; }
    function y(v) { return pad + (max - v) / (max - min) * (h - pad * 2); }
    function x(i) { return pad + i * ((w - pad * 2) / Math.max(1, rows.length - 1)); }
    ctx.beginPath();
    rows.forEach(function (r, i) {
      var px = x(i);
      var py = y(r.c);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = cssVar("--accent", "#3d8bfd");
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  function errBlock(status, err) {
    if (!err) return "";
    var bits = "<p>" + esc(t("ex.failed")) + "</p>";
    bits += "<p>" + esc(status == null ? t("ex.noStatus") : t("ex.status") + " " + status) + "</p>";
    bits += '<p class="muted">' + esc(t("ex.upstream")) + '</p><pre class="err ltr" lang="en">' + esc(err) + "</pre>";
    return bits;
  }
  window.SRX = {
    t: t, esc: esc, applyDocument: applyDocument, headerHTML: headerHTML, initChrome: initChrome, chev: chev,
    loadBtc: loadBtc, drawCloses: drawCloses, errBlock: errBlock, mktState: mktState,
    TICKER_URL: TICKER_URL, KLINE_URL: KLINE_URL
  };
})();
