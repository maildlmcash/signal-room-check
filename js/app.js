(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var EX = "bc1qsignalroomexample00000000000000000000";
  var PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "LINKUSDT"];
  var ENTITIES = [
    { id: "btc", kind: "asset", pct: 1.24 },
    { id: "eth", kind: "asset", pct: -0.62 },
    { id: "sol", kind: "asset", pct: 3.05 },
    { id: "bnb", kind: "asset", pct: 0.41 },
    { id: "xrp", kind: "asset", pct: -1.1 },
    { id: "binance", kind: "venue", pct: 0.18 },
    { id: "coinbase", kind: "venue", pct: -0.27 },
    { id: "kraken", kind: "venue", pct: 0.09 }
  ];
  var XFERS = [
    { from: "ex.alpha", to: "ex.desk", val: "0.50", token: "BTC", usd: "24000" },
    { from: "ex.desk", to: "ex.beta", val: "12", token: "ETH", usd: "18000" },
    { from: "ex.beta", to: "ex.alpha", val: "5000", token: "USDT", usd: "5000" },
    { from: "ex.alpha", to: "ex.desk", val: "40", token: "SOL", usd: "3200" },
    { from: "ex.desk", to: "ex.beta", val: "2.5", token: "BNB", usd: "1500" }
  ];
  var NODES = [
    { id: "alpha", kind: "wallet", links: ["desk"] },
    { id: "desk", kind: "desk", links: ["alpha", "beta"] },
    { id: "beta", kind: "wallet", links: ["desk"] },
    { id: "addr", kind: "address", links: ["beta"] }
  ];
  var HOPS = [["ex.alpha", "ex.desk"], ["ex.desk", "ex.beta"], ["ex.beta", "ex.addr"]];
  var NAV = ["dex", "predictions", "tracer", "visualizer", "alerts", "labels", "api", "more"];
  var focus = { id: null, pos: null };
  var restore = false;
  var S = {
    pred: "",
    trace: "",
    pair: "BTCUSDT",
    side: "buy",
    price: "",
    qty: "",
    blotter: [],
    ticket: "",
    alertAsset: "",
    alertDir: "above",
    alertLevel: "",
    alertCheck: "",
    alertMsg: "",
    labelAddr: "",
    labelName: "",
    labelMsg: "",
    lotDate: "",
    lotAsset: "",
    lotSide: "buy",
    lotQty: "",
    lotPrice: "",
    taxAsset: "all",
    taxMsg: "",
    authName: "",
    authMsg: "",
    cmp: {
      A: blankBot(),
      B: blankBot()
    }
  };

  function blankBot() {
    return { lower: "", upper: "", count: "", quote: "", start: "", base: "", safety: "", drop: "", scale: "" };
  }
  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }
  function readArr(key) {
    try {
      var v = JSON.parse(lsGet(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function writeArr(key, rows) {
    return lsSet(key, JSON.stringify(rows));
  }
  function session() {
    try {
      var v = JSON.parse(lsGet("sr-room-session") || "null");
      if (v && typeof v.name === "string" && v.name) return v;
    } catch (e) {}
    return null;
  }
  function uid() { return String(Date.now()) + "-" + String(Math.floor(Math.random() * 1000000)); }
  function num(v) {
    if (typeof v === "string" && v.trim() === "") return NaN;
    return Number(v);
  }
  function fmt(n) {
    if (!isFinite(n)) return "—";
    var s = n.toFixed(8);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }
  function mono(s) { return '<span class="num" dir="ltr">' + esc(s) + "</span>"; }
  function qnorm() { return String(window.SR.q || "").trim().toLowerCase(); }
  function hit(parts) {
    var q = qnorm();
    if (!q) return true;
    return parts.join("\n").toLowerCase().indexOf(q) !== -1;
  }
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
    return '<p class="quiet">' + esc(t("searchHeld")) + " " + '<span class="isolate">' + esc(window.SR.q) + "</span></p>";
  }
  function navHTML() {
    var moreOn = window.SR.view === "more" || window.SR.view === "tax" || window.SR.view === "bots" || window.SR.view === "compare";
    return '<nav class="primary-nav">' + NAV.map(function (id) {
      var on = (id === "more" ? moreOn : window.SR.view === id) ? ' aria-current="page"' : "";
      return '<button type="button" class="navitem" data-view="' + id + '"' + on + ">" + esc(t("nav." + id)) + "</button>";
    }).join("") + "</nav>";
  }
  function authHTML() {
    var who = session();
    var name = who ? '<button type="button" class="ghost who" data-view="login">' + esc(who.name) + "</button>" : "";
    return '<div class="auth">' + name
      + '<button type="button" class="ghost" data-view="login">' + esc(t("login")) + "</button>"
      + '<button type="button" class="solid" data-view="signup">' + esc(t("signup")) + "</button></div>";
  }
  function crumb() {
    return '<p class="crumb"><button type="button" class="textish" data-view="more">' + esc(t("nav.more")) + "</button></p>";
  }
  function errText(code) {
    if (code === "range") return t("errRange");
    if (code === "count") return t("errCount");
    return t("errBad");
  }
  function emptyBot(b, keys) {
    return keys.every(function (k) { return String(b[k]).trim() === ""; });
  }
  function gridOut(b) {
    if (emptyBot(b, ["lower", "upper", "count", "quote"])) return '<p class="quiet">' + esc(t("awaitInput")) + "</p>";
    var r = window.SRCalc.gridCalc({ lower: b.lower, upper: b.upper, count: b.count, quote: b.quote });
    if (!r.ok) return '<p class="bad" role="alert">' + esc(errText(r.error)) + "</p>";
    var stats = '<dl class="stats">'
      + stat("gridStep", r.step) + stat("quoteLine", r.quotePerLine) + stat("profitPct", r.profitPct) + stat("lines", r.lines.length)
      + "</dl>";
    var lines = r.lines.map(function (n, i) {
      return "<li>" + esc(t("gridLine")) + " " + mono(String(i + 1)) + " " + mono(fmt(n)) + "</li>";
    }).join("");
    return stats + '<ol class="hops scroll">' + lines + "</ol>";
  }
  function dcaOut(b) {
    if (emptyBot(b, ["start", "base", "safety", "drop", "scale"])) return '<p class="quiet">' + esc(t("awaitInput")) + "</p>";
    var r = window.SRCalc.dcaCalc({ start: b.start, base: b.base, safety: b.safety, drop: b.drop, scale: b.scale });
    if (!r.ok) return '<p class="bad" role="alert">' + esc(errText(r.error)) + "</p>";
    var stats = '<dl class="stats">' + stat("totalQuote", r.totalQuote) + stat("avgEntry", r.avg) + stat("orders", r.orders.length) + "</dl>";
    var rows = r.orders.map(function (o, i) {
      var name = o.safety ? t("safetyName") : t("baseName");
      return "<li>" + esc(name) + " " + mono(String(i)) + " " + esc(t("orderPrice")) + " " + mono(fmt(o.price))
        + " " + esc(t("orderQuote")) + " " + mono(fmt(o.quote)) + " " + esc(t("orderQty")) + " " + mono(fmt(o.qty)) + "</li>";
    }).join("");
    return stats + '<ol class="hops scroll">' + rows + "</ol>";
  }
  function stat(key, n) {
    return "<div class=\"stat\"><dt>" + esc(t(key)) + "</dt><dd>" + mono(fmt(n)) + "</dd></div>";
  }
  function gridFields(prefix, b) {
    return '<div class="fields">'
      + field(prefix + "-lower", "gridLower", b.lower, 'inputmode="decimal"')
      + field(prefix + "-upper", "gridUpper", b.upper, 'inputmode="decimal"')
      + field(prefix + "-count", "gridCount", b.count, 'inputmode="numeric"')
      + field(prefix + "-quote", "gridQuote", b.quote, 'inputmode="decimal"')
      + "</div>" + gridOut(b);
  }
  function dcaFields(prefix, b) {
    return '<div class="fields">'
      + field(prefix + "-start", "dcaStart", b.start, 'inputmode="decimal"')
      + field(prefix + "-base", "dcaBase", b.base, 'inputmode="decimal"')
      + field(prefix + "-safety", "dcaSafety", b.safety, 'inputmode="numeric"')
      + field(prefix + "-drop", "dcaDrop", b.drop, 'inputmode="decimal"')
      + field(prefix + "-scale", "dcaScale", b.scale, 'inputmode="decimal"')
      + "</div>" + dcaOut(b);
  }
  function scoreGrid(b) {
    if (emptyBot(b, ["lower", "upper", "count", "quote"])) return null;
    var r = window.SRCalc.gridCalc({ lower: b.lower, upper: b.upper, count: b.count, quote: b.quote });
    return r.ok ? r.profitPct : null;
  }
  function scoreDca(b) {
    if (emptyBot(b, ["start", "base", "safety", "drop", "scale"])) return null;
    var r = window.SRCalc.dcaCalc({ start: b.start, base: b.base, safety: b.safety, drop: b.drop, scale: b.scale });
    return r.ok ? r.totalQuote : null;
  }
  function near(a, b) {
    return Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b));
  }
  function verdict(a, b) {
    if (a == null || b == null) return t("largerNone");
    if (near(a, b)) return t("largerSame");
    return a > b ? t("largerLeft") : t("largerRight");
  }
  function costReport(lots) {
    var groups = {};
    lots.forEach(function (lot) {
      if (!groups[lot.asset]) groups[lot.asset] = [];
      groups[lot.asset].push(lot);
    });
    var out = {};
    Object.keys(groups).sort().forEach(function (asset) {
      var rows = groups[asset].slice().sort(function (a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return a.id < b.id ? -1 : 1;
      });
      var qty = 0;
      var cost = 0;
      var warn = false;
      var lines = rows.map(function (lot) {
        if (lot.side === "buy") {
          qty += lot.qty;
          cost += lot.qty * lot.price;
          return { lot: lot, basis: lot.qty * lot.price, gain: null, avg: qty > 0 ? cost / qty : null };
        }
        var avg = qty > 0 ? cost / qty : 0;
        var matched = Math.min(lot.qty, qty);
        if (lot.qty > qty + 1e-12) warn = true;
        var basis = matched * avg;
        var gain = lot.qty * lot.price - basis;
        cost -= basis;
        qty -= matched;
        if (qty < 1e-10) { qty = 0; cost = 0; }
        return { lot: lot, basis: basis, gain: gain, avg: matched > 0 ? avg : null };
      });
      var realized = 0;
      lines.forEach(function (ln) { if (ln.gain != null) realized += ln.gain; });
      out[asset] = { lines: lines, remain: qty, avg: qty > 0 ? cost / qty : null, realized: realized, warn: warn };
    });
    return out;
  }
  function viewHome() {
    var cards = ENTITIES.filter(function (e) {
      return hit([t("name." + e.id), t("kind." + e.kind), e.id, String(e.pct), t("exampleTag")]);
    });
    var rows = XFERS.filter(function (r) {
      return hit([t(r.from), t(r.to), r.val, r.token, r.usd, t("exampleTag")]);
    });
    var cardHTML = cards.map(function (e) {
      var cls = e.pct > 0 ? "up" : e.pct < 0 ? "down" : "";
      var sign = e.pct > 0 ? "+" : "";
      return '<article class="entity"><h3>' + esc(t("name." + e.id)) + '</h3><div class="pct"><b class="' + cls + '">' + mono(sign + e.pct.toFixed(2) + "%") + "</b><small>" + esc(t("exampleTag")) + '</small></div><p class="meta"><span class="pill">' + esc(t("kind." + e.kind)) + '</span><span class="pill">' + esc(t("exampleTag")) + "</span></p></article>";
    }).join("");
    var table = rows.map(function (r) {
      return "<tr><td><span class=\"pill\">" + esc(t("exampleTag")) + "</span> " + esc(t(r.from)) + "</td><td>" + esc(t(r.to)) + "</td><td>" + mono(r.val) + "</td><td>" + mono(r.token) + "</td><td>" + mono(r.usd) + "</td></tr>";
    }).join("");
    var q = qnorm();
    var hits = q ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(cards.length + rows.length)) + "</p>" : "";
    return '<section class="hero"><p class="kicker">' + esc(t("heroKicker")) + "</p><h1>" + esc(t("heroTitle")) + "</h1><p class=\"lead\">" + esc(t("heroLead")) + "</p>" + searchBox("q-hero", "finder") + "</section>"
      + '<section class="block"><div class="headrow"><h2>' + esc(t("trendTitle")) + "</h2><p class=\"quiet\">" + esc(t("trendNote")) + "</p></div>" + hits
      + (cards.length ? '<div class="trendrow">' + cardHTML + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section>"
      + '<section class="block"><div class="headrow"><h2>' + esc(t("xfersTitle")) + "</h2><p class=\"quiet\">" + esc(t("xfersNote")) + "</p></div>"
      + (rows.length ? '<div class="tape-wrap"><table><thead><tr><th>' + esc(t("col.from")) + "</th><th>" + esc(t("col.to")) + "</th><th>" + esc(t("col.val")) + "</th><th>" + esc(t("col.token")) + "</th><th>" + esc(t("col.usd")) + "</th></tr></thead><tbody>" + table + "</tbody></table></div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section>";
  }
  function viewDex() {
    var pairs = PAIRS.filter(function (p) { return hit([p, t("noQuote")]); });
    var buttons = pairs.map(function (p) {
      var on = S.pair === p ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="pairbtn" data-pair="' + p + '"' + on + ">" + mono(p) + "</button>";
    }).join("");
    var price = num(S.price);
    var qty = num(S.qty);
    var live = "";
    if (String(S.price).trim() !== "" || String(S.qty).trim() !== "") {
      if (!(price > 0) || !(qty > 0)) live = '<p class="bad" role="alert">' + esc(t("previewNeed")) + "</p>";
      else live = '<p>' + esc(t("notional")) + " " + mono(fmt(price * qty)) + "</p>";
    }
    var note = S.ticket ? '<p role="status">' + esc(t(S.ticket)) + "</p>" : "";
    var blot = S.blotter.length ? '<ol class="blotter">' + S.blotter.map(function (b) {
      return "<li>" + mono(b.pair) + " " + esc(t("side." + b.side)) + " " + mono(fmt(b.qty)) + " @ " + mono(fmt(b.price)) + " " + esc(t("notional")) + " " + mono(fmt(b.notional)) + "</li>";
    }).join("") + "</ol>" : '<p class="quiet">' + esc(t("blotterEmpty")) + "</p>";
    return '<section class="block"><h1>' + esc(t("dexTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("dexLead")) + "</p>"
      + (qnorm() ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(pairs.length)) + "</p>" : "")
      + (pairs.length ? '<div class="modes">' + buttons + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + '<div class="panel"><h2>' + mono(S.pair) + "</h2><p class=\"quiet\">" + esc(t("noQuote")) + "</p>"
      + pills("side", S.side, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("dex-price", "dexPrice", S.price, 'inputmode="decimal"') + field("dex-qty", "dexQty", S.qty, 'inputmode="decimal"') + "</div>"
      + live + '<div class="rowacts"><button type="button" class="solid" id="paper-add">' + esc(t("preview")) + "</button></div>" + note
      + "<h2>" + esc(t("blotter")) + "</h2>" + blot + "</div></section>";
  }
  function viewPred() {
    var cats = pills("pred", S.pred, [["politics", "predCat.politics"], ["sports", "predCat.sports"], ["crypto", "predCat.crypto"]]);
    var line = S.pred ? esc(t("predCat." + S.pred)) + " " + esc(t("predPicked")) : esc(t("predNone"));
    var extra = qnorm() ? '<p class="quiet">' + esc(t("predQuery")) + ' <span class="isolate">' + esc(window.SR.q) + "</span></p>" : "";
    return '<section class="block"><h1>' + esc(t("predTitle")) + '</h1><p class="banner">' + esc(t("predLead")) + "</p><p>" + line + "</p>" + extra + cats + "</section>";
  }
  function viewTrace() {
    var show = S.trace.trim() === EX;
    var body = "";
    if (!S.trace.trim()) body = '<p class="quiet">' + esc(t("traceLead")) + "</p>";
    else if (!show) body = '<p class="bad" role="status">' + esc(t("traceMiss")) + "</p>";
    else {
      body = '<p class="ok">' + esc(t("traceHit")) + "</p><ol class=\"hops\">" + HOPS.map(function (h) {
        return "<li>" + esc(t(h[0])) + " " + esc(t("toWord")) + " " + esc(t(h[1])) + "</li>";
      }).join("") + "</ol>";
    }
    return '<section class="block"><h1>' + esc(t("traceTitle")) + "</h1>" + held()
      + "<p>" + esc(t("traceLabel")) + " " + mono(EX) + "</p>"
      + '<div class="fields">' + field("trace-q", "traceLabel", S.trace, "") + "</div>"
      + '<div class="rowacts"><button type="button" class="solid" id="trace-use">' + esc(t("traceUse")) + '</button><button type="button" class="ghost" id="trace-clear">' + esc(t("traceClear")) + "</button></div>"
      + body + "</section>";
  }
  function viewViz() {
    var nodes = NODES.filter(function (n) {
      var names = [t("ex." + n.id), t("kind." + n.kind), t("linked")].concat(n.links.map(function (id) { return t("ex." + id); }));
      if (n.id === "addr") names.push(EX);
      return hit(names);
    });
    var list = nodes.map(function (n) {
      var links = n.links.map(function (id) { return t("ex." + id); }).join(", ");
      var addr = n.id === "addr" ? " " + mono(EX) : "";
      return "<li><strong>" + esc(t("ex." + n.id)) + "</strong>" + addr + "<div class=\"quiet\">" + esc(t("kind." + n.kind)) + " · " + esc(t("linked")) + " " + esc(links) + "</div></li>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("vizTitle")) + '</h1><p class="quiet">' + esc(t("vizLead")) + "</p>"
      + searchBox("q-viz", "find")
      + (qnorm() ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(nodes.length)) + "</p>" : "")
      + (nodes.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section>";
  }
  function viewAlerts() {
    var rows = readArr("sr-room-alerts").filter(function (a) {
      return a && typeof a.asset === "string" && (a.dir === "above" || a.dir === "below") && typeof a.level === "number";
    }).filter(function (a) {
      return hit([a.asset, t("dir." + a.dir), String(a.level), a.check == null ? "" : String(a.check)]);
    });
    var list = rows.map(function (a) {
      var state;
      if (typeof a.check !== "number" || !isFinite(a.check)) state = t("alertNone");
      else if (a.dir === "above" ? a.check >= a.level : a.check <= a.level) state = t("alertMet");
      else state = t("alertWait");
      return "<li>" + mono(a.asset) + " " + esc(t("dir." + a.dir)) + " " + mono(fmt(a.level))
        + (typeof a.check === "number" ? " " + mono(fmt(a.check)) : "")
        + "<div>" + esc(state) + '</div><button type="button" class="ghost" data-remove-alert="' + esc(a.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var msg = S.alertMsg ? '<p class="bad" role="alert">' + esc(t(S.alertMsg)) + "</p>" : "";
    return '<section class="block"><h1>' + esc(t("alertsTitle")) + '</h1><p class="quiet">' + esc(t("alertsLead")) + "</p>"
      + '<div class="fields">' + field("alert-asset", "alertAsset", S.alertAsset, "")
      + "</div>" + pills("dir", S.alertDir, [["above", "dir.above"], ["below", "dir.below"]])
      + '<div class="fields">' + field("alert-level", "alertLevel", S.alertLevel, 'inputmode="decimal"') + field("alert-check", "alertCheck", S.alertCheck, 'inputmode="decimal"') + "</div>"
      + msg + '<button type="button" class="solid" id="alert-add">' + esc(t("add")) + "</button>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("alertEmpty")) + "</p>")
      + "</section>";
  }
  function viewLabels() {
    var rows = readArr("sr-room-labels").filter(function (r) {
      return r && typeof r.addr === "string" && typeof r.name === "string";
    }).filter(function (r) { return hit([r.addr, r.name]); });
    var list = rows.map(function (r) {
      return "<li>" + mono(r.addr) + " <span class=\"isolate\">" + esc(r.name) + '</span> <button type="button" class="ghost" data-remove-label="' + esc(r.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var msg = S.labelMsg ? '<p class="bad" role="alert">' + esc(t(S.labelMsg)) + "</p>" : "";
    return '<section class="block"><h1>' + esc(t("labelsTitle")) + '</h1><p class="quiet">' + esc(t("labelsLead")) + "</p>"
      + '<div class="fields">' + field("label-addr", "labelAddr", S.labelAddr, "") + field("label-name", "labelName", S.labelName, "") + "</div>"
      + msg + '<button type="button" class="solid" id="label-add">' + esc(t("add")) + "</button>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("labelEmpty")) + "</p>")
      + "</section>";
  }
  function viewApi() {
    var urls = ["url.ping", "url.time", "url.exchange", "url.tickerAll", "url.ticker", "url.kline"];
    var rows = urls.filter(function (k) { return hit([t(k)]); });
    var list = rows.map(function (k) { return "<li>" + mono(t(k)) + "</li>"; }).join("");
    return '<section class="block"><h1>' + esc(t("apiTitle")) + '</h1><p class="quiet">' + esc(t("apiLead")) + "</p><p>" + esc(t("apiLimit")) + "</p><p>" + esc(t("apiWeight")) + "</p>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section>";
  }
  function viewMore() {
    return '<section class="block"><h1>' + esc(t("moreTitle")) + '</h1><p class="quiet">' + esc(t("moreLead")) + "</p>" + held()
      + '<div class="rowacts"><button type="button" class="solid" data-view="tax">' + esc(t("nav.tax")) + '</button><button type="button" class="solid" data-view="bots">' + esc(t("nav.bots")) + '</button><button type="button" class="solid" data-view="compare">' + esc(t("nav.compare")) + "</button></div></section>";
  }
  function viewTax() {
    var lots = readArr("sr-room-lots").filter(function (r) {
      return r && typeof r.asset === "string" && (r.side === "buy" || r.side === "sell") && typeof r.qty === "number" && typeof r.price === "number" && typeof r.date === "string";
    });
    var report = costReport(lots);
    var assets = Object.keys(report);
    if (S.taxAsset !== "all" && assets.indexOf(S.taxAsset) === -1) S.taxAsset = "all";
    var options = '<option value="all"' + (S.taxAsset === "all" ? " selected" : "") + ">" + esc(t("taxAll")) + "</option>" + assets.map(function (a) {
      return '<option value="' + esc(a) + '"' + (S.taxAsset === a ? " selected" : "") + ">" + esc(a) + "</option>";
    }).join("");
    var shown = lots.filter(function (r) {
      if (S.taxAsset !== "all" && r.asset !== S.taxAsset) return false;
      return hit([r.date, r.asset, t("side." + r.side), String(r.qty), String(r.price)]);
    });
    var lineMap = {};
    Object.keys(report).forEach(function (asset) {
      report[asset].lines.forEach(function (ln) { lineMap[ln.lot.id] = ln; });
    });
    var table = shown.map(function (r) {
      var ln = lineMap[r.id];
      var basis = ln ? fmt(ln.basis) : "—";
      var gain = ln && ln.gain != null ? fmt(ln.gain) : "—";
      return "<tr><td>" + mono(r.date) + "</td><td>" + mono(r.asset) + "</td><td>" + esc(t("side." + r.side)) + "</td><td>" + mono(fmt(r.qty)) + "</td><td>" + mono(fmt(r.price)) + "</td><td>" + mono(basis) + "</td><td>" + mono(gain) + '</td><td><button type="button" class="ghost" data-remove-lot="' + esc(r.id) + '">' + esc(t("remove")) + "</button></td></tr>";
    }).join("");
    var summaries = (S.taxAsset === "all" ? assets : [S.taxAsset]).filter(function (a) { return report[a]; }).map(function (a) {
      var box = report[a];
      var avg = box.avg == null ? esc(t("noRemain")) : mono(fmt(box.avg));
      var warn = box.warn ? '<p class="bad">' + esc(t("taxWarn")) + "</p>" : "";
      return '<div class="panel"><h2>' + mono(a) + "</h2>" + warn + '<dl class="stats">' + statPlain("taxAvg", avg) + "<div class=\"stat\"><dt>" + esc(t("taxRemain")) + "</dt><dd>" + mono(fmt(box.remain)) + "</dd></div>" + stat("taxRealized", box.realized) + "</dl></div>";
    }).join("");
    var msg = S.taxMsg ? '<p class="bad" role="alert">' + esc(t(S.taxMsg)) + "</p>" : "";
    return '<section class="block"><h1>' + esc(t("taxTitle")) + '</h1><p class="quiet">' + esc(t("taxLead")) + "</p><p class=\"quiet\">" + esc(t("taxOrder")) + "</p>"
      + '<div class="fields">' + field("lot-date", "taxDate", S.lotDate, 'type="date"') + field("lot-asset", "taxAsset", S.lotAsset, "") + "</div>"
      + pills("lotside", S.lotSide, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("lot-qty", "taxQty", S.lotQty, 'inputmode="decimal"') + field("lot-price", "taxPrice", S.lotPrice, 'inputmode="decimal"') + "</div>"
      + msg + '<div class="rowacts"><button type="button" class="solid" id="lot-add">' + esc(t("taxAdd")) + "</button></div>"
      + '<label class="field"><span>' + esc(t("taxAsset")) + '</span><select id="tax-asset">' + options + "</select></label>"
      + (shown.length ? '<div class="tape-wrap"><table><thead><tr><th>' + esc(t("taxDate")) + "</th><th>" + esc(t("taxAsset")) + "</th><th>" + esc(t("taxSide")) + "</th><th>" + esc(t("taxQty")) + "</th><th>" + esc(t("taxPrice")) + "</th><th>" + esc(t("taxCost")) + "</th><th>" + esc(t("taxGain")) + "</th><th>" + esc(t("remove")) + "</th></tr></thead><tbody>" + table + "</tbody></table></div>" : '<p class="quiet">' + esc(t("taxEmpty")) + "</p>")
      + summaries + "</section>";
  }
  function statPlain(key, html) {
    return "<div class=\"stat\"><dt>" + esc(t(key)) + "</dt><dd>" + html + "</dd></div>";
  }
  function viewBots() {
    var mode = window.SR.bot === "dca" ? "dca" : "grid";
    var body = mode === "dca" ? dcaFields("dca", S.cmp.A) : gridFields("grid", S.cmp.A);
    return '<section class="block"><h1>' + esc(t("botsTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("botsLead")) + "</p>" + held()
      + pills("bot", mode, [["grid", "bot.grid"], ["dca", "bot.dca"]])
      + '<p class="quiet">' + esc(mode === "dca" ? t("dcaHint") : t("gridHint")) + "</p>"
      + '<div class="panel">' + body + "</div></section>";
  }
  function viewCompare() {
    function col(title, prefix, b) {
      return '<div class="panel"><h2>' + esc(t(title)) + "</h2><h3>" + esc(t("bot.grid")) + "</h3>" + gridFields(prefix + "g", b) + "<h3>" + esc(t("bot.dca")) + "</h3>" + dcaFields(prefix + "d", b) + "</div>";
    }
    var lg = scoreGrid(S.cmp.A);
    var rg = scoreGrid(S.cmp.B);
    var ld = scoreDca(S.cmp.A);
    var rd = scoreDca(S.cmp.B);
    return '<section class="block"><h1>' + esc(t("compareTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("compareLead")) + "</p>" + held()
      + '<div class="columns">' + col("colLeft", "a", S.cmp.A) + col("colRight", "b", S.cmp.B) + "</div>"
      + '<div class="panel"><h2>' + esc(t("nav.compare")) + "</h2><p>" + esc(t("cmpGrid")) + " " + mono(lg == null ? "—" : fmt(lg)) + " / " + mono(rg == null ? "—" : fmt(rg)) + " " + esc(verdict(lg, rg)) + "</p><p>" + esc(t("cmpDca")) + " " + mono(ld == null ? "—" : fmt(ld)) + " / " + mono(rd == null ? "—" : fmt(rd)) + " " + esc(verdict(ld, rd)) + "</p></div></section>";
  }
  function viewAuth(kind) {
    var saved = session();
    var have = saved ? '<p>' + esc(t("authHave")) + ' <span class="isolate">' + esc(saved.name) + "</span></p>" : "";
    var msg = S.authMsg ? '<p role="status">' + esc(t(S.authMsg)) + "</p>" : "";
    var action = kind === "signup"
      ? '<button type="button" class="solid" id="auth-save">' + esc(t("authSave")) + "</button>"
      : '<button type="button" class="solid" id="auth-check">' + esc(t("authCheck")) + "</button>";
    var out = saved ? '<button type="button" class="ghost" id="auth-out">' + esc(t("signOut")) + "</button>" : "";
    var swap = kind === "signup"
      ? '<button type="button" class="ghost" data-view="login">' + esc(t("login")) + "</button>"
      : '<button type="button" class="ghost" data-view="signup">' + esc(t("signup")) + "</button>";
    return '<section class="block"><h1>' + esc(t(kind === "signup" ? "signupTitle" : "loginTitle")) + "</h1>" + held() + have
      + '<div class="fields">' + field("auth-name", "authName", S.authName, "") + "</div>"
      + msg + '<div class="rowacts">' + action + out + swap + "</div></section>";
  }
  function renderView() {
    var v = window.SR.view;
    if (v === "dex") return viewDex();
    if (v === "predictions") return viewPred();
    if (v === "tracer") return viewTrace();
    if (v === "visualizer") return viewViz();
    if (v === "alerts") return viewAlerts();
    if (v === "labels") return viewLabels();
    if (v === "api") return viewApi();
    if (v === "more") return viewMore();
    if (v === "tax") return crumb() + viewTax();
    if (v === "bots") return crumb() + viewBots();
    if (v === "compare") return crumb() + viewCompare();
    if (v === "login") return viewAuth("login");
    if (v === "signup") return viewAuth("signup");
    return viewHome();
  }
  function cookie() {
    if (lsGet("sr-room-cookie") === "off") return "";
    return '<aside class="cookiebar"><p>' + esc(t("cookie")) + '</p><button type="button" class="solid" id="cookie-dismiss">' + esc(t("cookieOk")) + "</button></aside>";
  }
  function render() {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.skip()
      + window.SRX.bar({ nav: navHTML(), mid: searchBox("q-bar", "find"), end: authHTML() })
      + '<div class="wrap"><div id="main" tabindex="-1">' + renderView() + "</div></div>"
      + window.SRX.foot()
      + cookie();
    if (restore && focus.id) {
      var el = document.getElementById(focus.id);
      if (el) {
        el.focus();
        if (typeof focus.pos === "number" && el.setSelectionRange) {
          try { el.setSelectionRange(focus.pos, focus.pos); } catch (e) {}
        }
      }
    }
    restore = false;
  }
  var binds = {
    "q-bar": function (v) { window.SR.q = v; },
    "q-hero": function (v) { window.SR.q = v; },
    "q-viz": function (v) { window.SR.q = v; },
    "trace-q": function (v) { S.trace = v; },
    "dex-price": function (v) { S.price = v; },
    "dex-qty": function (v) { S.qty = v; },
    "alert-asset": function (v) { S.alertAsset = v; },
    "alert-level": function (v) { S.alertLevel = v; },
    "alert-check": function (v) { S.alertCheck = v; },
    "label-addr": function (v) { S.labelAddr = v; },
    "label-name": function (v) { S.labelName = v; },
    "lot-date": function (v) { S.lotDate = v; },
    "lot-asset": function (v) { S.lotAsset = v; },
    "lot-qty": function (v) { S.lotQty = v; },
    "lot-price": function (v) { S.lotPrice = v; },
    "tax-asset": function (v) { S.taxAsset = v; },
    "auth-name": function (v) { S.authName = v; }
  };
  ["a", "b"].forEach(function (side) {
    var box = side === "a" ? S.cmp.A : S.cmp.B;
    [["g-lower", "lower"], ["g-upper", "upper"], ["g-count", "count"], ["g-quote", "quote"], ["d-start", "start"], ["d-base", "base"], ["d-safety", "safety"], ["d-drop", "drop"], ["d-scale", "scale"]].forEach(function (pair) {
      binds[side + pair[0]] = function (v) { box[pair[1]] = v; };
    });
  });
  [["grid-lower", "lower"], ["grid-upper", "upper"], ["grid-count", "count"], ["grid-quote", "quote"], ["dca-start", "start"], ["dca-base", "base"], ["dca-safety", "safety"], ["dca-drop", "drop"], ["dca-scale", "scale"]].forEach(function (pair) {
    binds[pair[0]] = function (v) { S.cmp.A[pair[1]] = v; };
  });

  function onEdit(e) {
    var id = e.target && e.target.id;
    if (!id || !binds[id]) return;
    if (e.type === "change" && e.target.tagName !== "SELECT") {
      binds[id](e.target.value);
      return;
    }
    binds[id](e.target.value);
    focus.id = id;
    focus.pos = typeof e.target.selectionStart === "number" ? e.target.selectionStart : null;
    restore = true;
    render();
  }
  document.addEventListener("input", onEdit);
  document.addEventListener("change", onEdit);
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-set-lang],[data-set-theme],[data-skip]")) return;
    var view = e.target.closest("[data-view]");
    if (view) { window.SR.view = view.getAttribute("data-view"); render(); return; }
    var pair = e.target.closest("[data-pair]");
    if (pair) { S.pair = pair.getAttribute("data-pair"); render(); return; }
    var side = e.target.closest("[data-side]");
    if (side) { S.side = side.getAttribute("data-side"); render(); return; }
    var pred = e.target.closest("[data-pred]");
    if (pred) { S.pred = pred.getAttribute("data-pred"); render(); return; }
    var dir = e.target.closest("[data-dir]");
    if (dir) { S.alertDir = dir.getAttribute("data-dir"); render(); return; }
    var lotSide = e.target.closest("[data-lotside]");
    if (lotSide) { S.lotSide = lotSide.getAttribute("data-lotside"); render(); return; }
    var bot = e.target.closest("[data-bot]");
    if (bot) { window.SR.bot = bot.getAttribute("data-bot"); render(); return; }
    if (e.target.closest("#cookie-dismiss")) { lsSet("sr-room-cookie", "off"); render(); return; }
    if (e.target.closest("#trace-use")) { S.trace = EX; render(); return; }
    if (e.target.closest("#trace-clear")) { S.trace = ""; render(); return; }
    if (e.target.closest("#paper-add")) {
      var price = num(S.price);
      var qty = num(S.qty);
      if (!(price > 0) || !(qty > 0)) { S.ticket = "notAdded"; render(); return; }
      S.blotter.unshift({ pair: S.pair, side: S.side, price: price, qty: qty, notional: price * qty });
      if (S.blotter.length > 8) S.blotter.pop();
      S.ticket = "added";
      render();
      return;
    }
    if (e.target.closest("#alert-add")) {
      var level = num(S.alertLevel);
      var asset = S.alertAsset.trim();
      if (!asset || !(level > 0)) { S.alertMsg = "alertBad"; render(); return; }
      var check = String(S.alertCheck).trim() === "" ? null : num(S.alertCheck);
      if (check != null && !isFinite(check)) { S.alertMsg = "alertBad"; render(); return; }
      var alerts = readArr("sr-room-alerts");
      alerts.push({ id: uid(), asset: asset, dir: S.alertDir === "below" ? "below" : "above", level: level, check: check });
      if (!writeArr("sr-room-alerts", alerts)) { S.alertMsg = "storeFail"; render(); return; }
      S.alertAsset = ""; S.alertLevel = ""; S.alertCheck = ""; S.alertMsg = "";
      render();
      return;
    }
    var rmA = e.target.closest("[data-remove-alert]");
    if (rmA) {
      var idA = rmA.getAttribute("data-remove-alert");
      writeArr("sr-room-alerts", readArr("sr-room-alerts").filter(function (r) { return r.id !== idA; }));
      render();
      return;
    }
    if (e.target.closest("#label-add")) {
      var addr = S.labelAddr.trim();
      var name = S.labelName.trim();
      if (!addr || !name) { S.labelMsg = "labelBad"; render(); return; }
      var labels = readArr("sr-room-labels");
      labels.push({ id: uid(), addr: addr, name: name });
      if (!writeArr("sr-room-labels", labels)) { S.labelMsg = "storeFail"; render(); return; }
      S.labelAddr = ""; S.labelName = ""; S.labelMsg = "";
      render();
      return;
    }
    var rmL = e.target.closest("[data-remove-label]");
    if (rmL) {
      var idL = rmL.getAttribute("data-remove-label");
      writeArr("sr-room-labels", readArr("sr-room-labels").filter(function (r) { return r.id !== idL; }));
      render();
      return;
    }
    if (e.target.closest("#lot-add")) {
      var qtyL = num(S.lotQty);
      var priceL = num(S.lotPrice);
      var assetL = S.lotAsset.trim();
      if (!S.lotDate || !assetL || !(qtyL > 0) || !(priceL > 0)) { S.taxMsg = "taxBad"; render(); return; }
      var lots = readArr("sr-room-lots");
      lots.push({ id: uid(), date: S.lotDate, asset: assetL, side: S.lotSide === "sell" ? "sell" : "buy", qty: qtyL, price: priceL });
      if (!writeArr("sr-room-lots", lots)) { S.taxMsg = "storeFail"; render(); return; }
      S.lotQty = ""; S.lotPrice = ""; S.taxMsg = "";
      render();
      return;
    }
    var rmLot = e.target.closest("[data-remove-lot]");
    if (rmLot) {
      var idLot = rmLot.getAttribute("data-remove-lot");
      writeArr("sr-room-lots", readArr("sr-room-lots").filter(function (r) { return r.id !== idLot; }));
      render();
      return;
    }
    if (e.target.closest("#auth-save")) {
      var nm = S.authName.trim();
      if (!nm) { S.authMsg = "authNeed"; render(); return; }
      if (!lsSet("sr-room-session", JSON.stringify({ name: nm }))) { S.authMsg = "storeFail"; render(); return; }
      S.authMsg = "authSaved";
      render();
      return;
    }
    if (e.target.closest("#auth-check")) {
      var saved = session();
      var typed = S.authName.trim();
      if (!typed) { S.authMsg = "authNeed"; render(); return; }
      if (!saved) S.authMsg = "authNone";
      else if (saved.name === typed) S.authMsg = "authMatch";
      else S.authMsg = "authMiss";
      render();
      return;
    }
    if (e.target.closest("#auth-out")) {
      try { localStorage.removeItem("sr-room-session"); } catch (e2) {}
      S.authMsg = "authOut";
      render();
    }
  });

  if (window.SR.bot !== "grid" && window.SR.bot !== "dca") window.SR.bot = "grid";
  window.SRX.initChrome();
  window.SR.onChange = function () { render(); };
  render();
})();
