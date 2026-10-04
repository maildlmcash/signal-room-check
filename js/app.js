/* signal room app */
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var EX = "bc1qsignalroomexample00000000000000000000";
  var PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "LINKUSDT"];
  var ASSETS = ["BTC", "ETH", "SOL", "USDT"];
  var ENTITIES = [
    { id: "btc", kind: "asset", pct: 1.2, value: "1000", hold: "0.40", wallets: "3" },
    { id: "eth", kind: "asset", pct: -0.5, value: "800", hold: "2", wallets: "2" },
    { id: "sol", kind: "asset", pct: 2.1, value: "300", hold: "12", wallets: "4" },
    { id: "bnb", kind: "asset", pct: 0.4, value: "200", hold: "1.5", wallets: "1" },
    { id: "xrp", kind: "asset", pct: -1.1, value: "150", hold: "100", wallets: "2" },
    { id: "north", kind: "venue", pct: 0.2, value: "500", hold: "0.10", wallets: "6" },
    { id: "coinbase", kind: "venue", pct: -0.3, value: "400", hold: "0.20", wallets: "5" },
    { id: "kraken", kind: "venue", pct: 0.1, value: "250", hold: "0.05", wallets: "2" }
  ];
  var XFERS = [
    { time: "09:14", from: "ex.alpha", to: "ex.desk", val: "0.50", token: "BTC", usd: "1000" },
    { time: "09:22", from: "ex.desk", to: "ex.beta", val: "12", token: "ETH", usd: "800" },
    { time: "09:31", from: "ex.beta", to: "ex.alpha", val: "500", token: "USDT", usd: "500" },
    { time: "09:40", from: "ex.alpha", to: "ex.desk", val: "40", token: "SOL", usd: "300" },
    { time: "09:48", from: "ex.desk", to: "ex.beta", val: "2.5", token: "BNB", usd: "150" }
  ];
  var BETTORS = [
    { id: "one", token: "BTC", sample: "10" },
    { id: "two", token: "ETH", sample: "8" },
    { id: "three", token: "SOL", sample: "6" }
  ];
  var TOKENS = [
    { token: "BTC", sample: "4" },
    { token: "ETH", sample: "3" },
    { token: "SOL", sample: "2" },
    { token: "USDT", sample: "5" }
  ];
  var MARKET = ["template", "strategy", "signal"];
  var NAV = ["home", "markets", "spot", "futures", "bots", "tax", "alerts", "more"];
  var MORE = ["dex", "predictions", "tracer", "visualizer", "labels", "api", "integrations", "resources", "accountants", "earn", "rwa", "card", "ai", "pricing", "marketplace", "learn", "features", "solutions"];
  var NODES = [
    { id: "alpha", kind: "wallet", links: ["desk"] },
    { id: "desk", kind: "desk", links: ["alpha", "beta"] },
    { id: "beta", kind: "wallet", links: ["desk"] },
    { id: "addr", kind: "address", links: ["beta"] }
  ];
  var HOPS = [["ex.alpha", "ex.desk"], ["ex.desk", "ex.beta"], ["ex.beta", "ex.addr"]];
  var focus = { id: null, pos: null };
  var restore = false;
  var S = {
    pred: "", trace: "", pair: "BTCUSDT", side: "buy", price: "", qty: "", blotter: [], ticket: "",
    alertAsset: "", alertDir: "above", alertLevel: "", alertCheck: "", alertMsg: "",
    labelAddr: "", labelName: "", labelMsg: "",
    lotDate: "", lotAsset: "BTC", lotSide: "buy", lotQty: "", lotPrice: "", lotWallet: "", walletName: "",
    taxAsset: "all", taxMsg: "", authName: "", authMsg: "", minUsd: "",
    gq: "", gSort: "overall", gTag: "", gOpen: "", gMode: "grid",
    cTab: "dca", pOpen: "", bTab: "all", bOpen: "", hName: "", hNote: "", hMsg: "", form: {},
    mq: "", lev: "", pairNote: "", planName: "", planNote: "", planMsg: "",
    aiText: "", aiMsg: "", priceMsg: "", integMsg: ""
  };
  function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) { try { localStorage.setItem(key, value); return true; } catch (e) { return false; } }
  function readArr(key) {
    try { var v = JSON.parse(lsGet(key) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function writeArr(key, rows) { return lsSet(key, JSON.stringify(rows)); }
  function session() {
    try { var v = JSON.parse(lsGet("sr-room-session") || "null"); if (v && typeof v.name === "string" && v.name) return v; } catch (e) {}
    return null;
  }
  function uid() { return String(Date.now()) + "-" + String(Math.floor(Math.random() * 1000000)); }
  function num(v) { if (typeof v === "string" && v.trim() === "") return NaN; return Number(v); }
  function fmt(n) {
    if (!isFinite(n)) return "—";
    var s = n.toFixed(8);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }
  function mono(s) { return '<span class="num" dir="ltr">' + esc(s) + "</span>"; }
  function qnorm() { return String(window.SR.q || "").trim().toLowerCase(); }
  function hit(parts) { var q = qnorm(); if (!q) return true; return parts.join("\n").toLowerCase().indexOf(q) !== -1; }
  function field(id, label, value, extra) {
    return '<label class="field"><span>' + esc(t(label)) + '</span><input id="' + id + '" value="' + esc(value) + '" autocomplete="off" ' + (extra || "") + "></label>";
  }
  function pills(kind, current, items) {
    return '<div class="modes" role="group">' + items.map(function (it) {
      var on = current === it[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-' + kind + '="' + esc(it[0]) + '"' + on + ">" + esc(t(it[1])) + "</button>";
    }).join("") + "</div>";
  }
  function searchBox(id, klass) {
    return '<div class="' + klass + '" role="search"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor"/><path d="M10.2 10.2 14 14" stroke="currentColor"/></svg><input id="' + id + '" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t("searchPlaceholder")) + '" aria-label="' + esc(t("searchLabel")) + '" value="' + esc(window.SR.q || "") + '"></div>';
  }
  function held() {
    if (!qnorm()) return "";
    return '<p class="quiet">' + esc(t("searchHeld")) + ' <span class="isolate">' + esc(window.SR.q) + "</span></p>";
  }
  function bag(id) { if (!S.form[id]) S.form[id] = {}; return S.form[id]; }
