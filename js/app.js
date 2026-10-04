/* signal room app */
  function viewGainium() {
    var q = String(S.gq || "").trim().toLowerCase();
    var rows = GAINIUM.filter(function (c) {
      if (S.gTag && c.tags.indexOf(S.gTag) === -1) return false;
      if (!q) return true;
      var blob = [t("g." + c.id), t("gLead." + c.id)].concat(c.tags.map(function (tag) { return t("tag." + tag); })).join("\n").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
    if (S.gSort === "name") rows.sort(function (a, b) { return t("g." + a.id).localeCompare(t("g." + b.id)); });
    if (S.gSort === "namedesc") rows.sort(function (a, b) { return t("g." + b.id).localeCompare(t("g." + a.id)); });
    var tags = '<button type="button" data-g-tag=""' + (S.gTag === "" ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(t("tagAll")) + "</button>" + TAGS.map(function (tag) {
      var on = S.gTag === tag ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-g-tag="' + tag + '"' + on + ">" + esc(t("tag." + tag)) + "</button>";
    }).join("");
    var open = GAINIUM.filter(function (c) { return c.id === S.gOpen; })[0];
    var panel = "";
    if (open) {
      var modes = modesOf(open);
      if (modes.indexOf(S.gMode) === -1) S.gMode = modes[0];
      var switcher = modes.length > 1 ? pills("gmode", S.gMode, [["grid", "bot.grid"], ["dca", "bot.dca"]]) : '<p class="quiet">' + esc(t(S.gMode === "dca" ? "bot.dca" : "bot.grid")) + "</p>";
      panel = paperPanel("g." + open.id, switcher + calcBody({ bag: "g-" + open.id + "-" + S.gMode, kind: S.gMode }), 'data-g-close="1"');
    }
    var cards = rows.map(function (c) {
      var on = S.gOpen === c.id ? ' aria-pressed="true"' : ' aria-pressed="false"';
      var meta = c.tags.map(function (tag) { return '<span class="pill">' + esc(t("tag." + tag)) + "</span>"; }).join("");
      return '<button type="button" class="dircard" data-g-open="' + c.id + '"' + on + "><strong>" + esc(t("g." + c.id)) + '</strong><span class="quiet">' + esc(t("gLead." + c.id)) + '</span><span class="meta">' + meta + "</span></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("gainiumTitle")) + '</h1><p class="quiet">' + esc(t("gainiumLead")) + "</p>"
      + '<div class="fields">' + field("g-search", "dirSearch", S.gq, "")
      + '<label class="field"><span>' + esc(t("sortLabel")) + '</span><select id="g-sort"><option value="overall"' + (S.gSort === "overall" ? " selected" : "") + ">" + esc(t("sortOverall")) + '</option><option value="name"' + (S.gSort === "name" ? " selected" : "") + ">" + esc(t("sortName")) + '</option><option value="namedesc"' + (S.gSort === "namedesc" ? " selected" : "") + ">" + esc(t("sortNameDesc")) + "</option></select></label></div>"
      + '<div class="modes">' + tags + "</div><p class=\"quiet\">" + esc(t("hits")) + " " + mono(String(rows.length)) + "</p>" + panel
      + (cards ? '<div class="dirgrid">' + cards + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
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
    { id: "binance", kind: "venue", pct: 0.2, value: "500", hold: "0.10", wallets: "6" },
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
  var GAINIUM = [
    { id: "gainium", tags: ["grid", "dca", "nocode", "opensource", "selfhost", "cloud", "freemium"] },
    { id: "freqtrade", tags: ["opensource", "selfhost", "free"] },
    { id: "commas", tags: ["grid", "dca", "nocode", "cloud", "paid"] },
    { id: "bitsgap", tags: ["grid", "dca", "nocode", "cloud", "freemium"] },
    { id: "hummingbot", tags: ["opensource", "selfhost", "free"] },
    { id: "octobot", tags: ["grid", "dca", "nocode", "opensource", "selfhost", "cloud", "freemium"] },
    { id: "cornix", tags: ["nocode", "cloud", "paid"] },
    { id: "hopper", tags: ["grid", "dca", "nocode", "cloud", "paid"] },
    { id: "jesse", tags: ["opensource", "selfhost", "freemium"] },
    { id: "passivbot", tags: ["grid", "opensource", "selfhost", "free"] },
    { id: "pionex", tags: ["grid", "dca", "nocode", "free"] }
  ];
  var TAGS = ["grid", "dca", "nocode", "opensource", "selfhost", "cloud", "free", "freemium", "paid"];
  var PIONEX = [
    { id: "pSpot", kind: "grid" },
    { id: "pFut", kind: "grid", fut: 1, lev: 1 },
    { id: "pRev", kind: "grid", reverse: 1 },
    { id: "pInf", kind: "infinity" },
    { id: "pLev", kind: "grid", lev: 1 },
    { id: "pLevRev", kind: "grid", lev: 1, reverse: 1 },
    { id: "pMargin", kind: "grid", lev: 1 },
    { id: "pRebal", kind: "rebalance" },
    { id: "pArb", kind: "arb" },
    { id: "pTwap", kind: "twap" },
    { id: "pDca", kind: "dca" },
    { id: "pSignal", kind: "signal" },
    { id: "pStop", kind: "stoplimit" },
    { id: "pTrail", kind: "trail" }
  ];
  var BINANCE = [
    { id: "bnSpotGrid", kind: "grid", market: "spot" },
    { id: "bnFutGrid", kind: "grid", market: "futures", fut: 1 },
    { id: "bnSnow", kind: "dca", market: "futures", fut: 1 },
    { id: "bnFutDca", kind: "dca", market: "futures", fut: 1 },
    { id: "bnArb", kind: "arb", market: "both" },
    { id: "bnRebal", kind: "rebalance", market: "spot" },
    { id: "bnSpotDca", kind: "dca", market: "spot" },
    { id: "bnSpotTwap", kind: "twap", market: "spot" },
    { id: "bnFutTwap", kind: "twap", market: "futures", fut: 1 },
    { id: "bnVp", kind: "vp", market: "futures", fut: 1 }
  ];
  var MARKET = ["template", "strategy", "signal"];
  var NAV = ["dex", "predictions", "tracer", "visualizer", "alerts", "labels", "api", "more"];
  var SOURCES = [["home", "src.desk"], ["tax", "src.tax"], ["gainium", "src.gainium"], ["commas", "src.commas"], ["pionex", "src.pionex"], ["hopper", "src.hopper"], ["binance", "src.binance"]];
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
    cTab: "dca", pOpen: "", bTab: "all", bOpen: "", hName: "", hNote: "", hMsg: "", form: {}
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
  function val(id, key) { var b = S.form[id]; return b && b[key] != null ? String(b[key]) : ""; }
  function anyFilled(id, keys) { return keys.some(function (k) { return val(id, k).trim() !== ""; }); }
  function errText(code) {
    if (code === "range") return t("errRange");
    if (code === "count") return t("errCount");
    if (code === "pct") return t("errPct");
    return t("errBad");
  }
  function stat(key, n) { return '<div class="stat"><dt>' + esc(t(key)) + "</dt><dd>" + mono(fmt(n)) + "</dd></div>"; }
  function statPlain(key, html) { return '<div class="stat"><dt>' + esc(t(key)) + "</dt><dd>" + html + "</dd></div>"; }
  function fset(id, pairs) {
    return '<div class="fields">' + pairs.map(function (p) {
      return '<label class="field"><span>' + esc(t(p[1])) + '</span><input data-bag="' + esc(id) + '" data-key="' + esc(p[0]) + '" value="' + esc(val(id, p[0])) + '" autocomplete="off" inputmode="decimal"></label>';
    }).join("") + "</div>";
  }
  function gate(id, keys, runner, draw) {
    if (!anyFilled(id, keys)) return '<p class="quiet">' + esc(t("awaitInput")) + "</p>";
    var r = runner();
    if (!r.ok) return '<p class="bad" role="alert">' + esc(errText(r.error)) + "</p>";
    return draw(r);
  }
  function lineList(rows) { return '<ol class="hops scroll">' + rows.join("") + "</ol>"; }
  function modesOf(card) {
    var hasG = card.tags.indexOf("grid") !== -1;
    var hasD = card.tags.indexOf("dca") !== -1;
    if (hasG && !hasD) return ["grid"];
    if (hasD && !hasG) return ["dca"];
    return ["grid", "dca"];
  }
  function sourceOf(view) {
    if (view === "tax" || view === "gainium" || view === "commas" || view === "pionex" || view === "hopper" || view === "binance") return view;
    return "home";
  }
  function navHTML() {
    return '<nav class="primary-nav">' + NAV.map(function (id) {
      var on = window.SR.view === id ? ' aria-current="page"' : "";
      return '<button type="button" class="navitem" data-view="' + id + '"' + on + ">" + esc(t("nav." + id)) + "</button>";
    }).join("") + "</nav>";
  }
  function authHTML() {
    var who = session();
    var name = who ? '<button type="button" class="ghost who" data-view="login">' + esc(who.name) + "</button>" : "";
    return '<div class="auth">' + name + '<button type="button" class="ghost" data-view="login">' + esc(t("login")) + '</button><button type="button" class="solid" data-view="signup">' + esc(t("signup")) + "</button></div>";
  }
  function sourceBar() {
    var cur = sourceOf(window.SR.view);
    return '<div class="sourcebar" role="group" aria-label="' + esc(t("srcGroup")) + '">' + SOURCES.map(function (it) {
      var on = cur === it[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="ghost" data-view="' + it[0] + '"' + on + ">" + esc(t(it[1])) + "</button>";
    }).join("") + "</div>";
  }
  function calcBody(spec) {
    var id = spec.bag;
    var kind = spec.kind;
    var fut = spec.fut ? '<p class="quiet">' + esc(t("paperFutures")) + "</p>" : "";
    if (kind === "grid") {
      var keys = ["lower", "upper", "count", "quote"];
      var pairs = [["lower", "gridLower"], ["upper", "gridUpper"], ["count", "gridCount"], ["quote", "gridQuote"]];
      if (spec.lev) pairs.push(["lev", "levLabel"]);
      return fut + (spec.reverse ? '<p class="quiet">' + esc(t("reverseNote")) + "</p>" : "") + (spec.lev ? '<p class="quiet">' + esc(t("levNote")) + "</p>" : "") + fset(id, pairs) + gate(id, keys.concat(spec.lev ? ["lev"] : []), function () {
        return window.SRCalc.gridCalc({ lower: val(id, "lower"), upper: val(id, "upper"), count: val(id, "count"), quote: val(id, "quote") });
      }, function (r) {
        var pct = spec.reverse ? (r.step / r.lines[r.lines.length - 1]) * 100 : r.profitPct;
        var levLine = "";
        if (spec.lev && val(id, "lev").trim() !== "") {
          var lev = num(val(id, "lev"));
          if (!(lev > 0) || lev > 125) return '<p class="bad" role="alert">' + esc(t("errBad")) + "</p>";
          levLine = stat("paperLev", pct * lev);
        }
        var lines = r.lines.map(function (n, i) { return "<li>" + esc(t("gridLine")) + " " + mono(String(i + 1)) + " " + mono(fmt(n)) + "</li>"; }).join("");
        return '<dl class="stats">' + stat("gridStep", r.step) + stat("quoteLine", r.quotePerLine) + stat("profitPct", pct) + stat("lines", r.lines.length) + levLine + "</dl>" + lineList([lines]);
      });
    }
    if (kind === "dca") {
      return fut + '<p class="quiet">' + esc(t("dcaHint")) + "</p>" + fset(id, [["start", "dcaStart"], ["base", "dcaBase"], ["safety", "dcaSafety"], ["drop", "dcaDrop"], ["scale", "dcaScale"]]) + gate(id, ["start", "base", "safety", "drop", "scale"], function () {
        return window.SRCalc.dcaCalc({ start: val(id, "start"), base: val(id, "base"), safety: val(id, "safety"), drop: val(id, "drop"), scale: val(id, "scale") });
      }, function (r) {
        var rows = r.orders.map(function (o, i) {
          var name = o.safety ? t("safetyName") : t("baseName");
          return "<li>" + esc(name) + " " + mono(String(i)) + " " + esc(t("orderPrice")) + " " + mono(fmt(o.price)) + " " + esc(t("orderQuote")) + " " + mono(fmt(o.quote)) + " " + esc(t("orderQty")) + " " + mono(fmt(o.qty)) + "</li>";
        }).join("");
        return '<dl class="stats">' + stat("totalQuote", r.totalQuote) + stat("avgEntry", r.avg) + stat("orders", r.orders.length) + "</dl>" + lineList([rows]);
      });
    }
    if (kind === "infinity") {
      return fset(id, [["lower", "gridLower"], ["step", "infStep"], ["count", "gridCount"], ["quote", "gridQuote"]]) + gate(id, ["lower", "step", "count", "quote"], function () {
        return window.SRCalc.infinityCalc({ lower: val(id, "lower"), step: val(id, "step"), count: val(id, "count"), quote: val(id, "quote") });
      }, function (r) {
        var lines = r.lines.map(function (n, i) { return "<li>" + esc(t("gridLine")) + " " + mono(String(i + 1)) + " " + mono(fmt(n)) + "</li>"; }).join("");
        return '<dl class="stats">' + stat("gridStep", r.step) + stat("quoteLine", r.quotePerLine) + stat("profitPct", r.profitPct) + stat("lines", r.lines.length) + "</dl>" + lineList([lines]);
      });
    }
    if (kind === "rebalance") {
      return '<p class="quiet">' + esc(t("rebalNote")) + "</p>" + fset(id, [["a", "valueA"], ["b", "valueB"], ["target", "weightTarget"]]) + gate(id, ["a", "b", "target"], function () {
        return window.SRCalc.rebalanceCalc({ a: val(id, "a"), b: val(id, "b"), target: val(id, "target") });
      }, function (r) {
        var word = r.move >= 0 ? t("moveAdd") : t("moveCut");
        return '<dl class="stats">' + stat("totalQuote", r.total) + stat("wantA", r.wantA) + stat("wantB", r.wantB) + "</dl><p>" + esc(word) + " " + mono(fmt(Math.abs(r.move))) + "</p>";
      });
    }
    if (kind === "twap") {
      return fut + fset(id, [["total", "twapTotal"], ["parts", "twapParts"], ["first", "firstPrice"], ["last", "lastPrice"]]) + gate(id, ["total", "parts", "first", "last"], function () {
        return window.SRCalc.twapCalc({ total: val(id, "total"), parts: val(id, "parts"), first: val(id, "first"), last: val(id, "last") });
      }, function (r) {
        var rows = r.rows.map(function (o, i) {
          return "<li>" + mono(String(i + 1)) + " " + esc(t("orderPrice")) + " " + mono(fmt(o.price)) + " " + esc(t("orderQuote")) + " " + mono(fmt(o.quote)) + " " + esc(t("orderQty")) + " " + mono(fmt(o.qty)) + "</li>";
        }).join("");
        return '<dl class="stats">' + stat("avgEntry", r.avg) + stat("totalQuote", r.total) + stat("orderQty", r.qty) + "</dl>" + lineList([rows]);
      });
    }
    if (kind === "arb") {
      return '<p class="quiet">' + esc(t("arbNote")) + "</p>" + fset(id, [["buy", "arbBuy"], ["sell", "arbSell"], ["qty", "dexQty"], ["fee", "feePct"]]) + gate(id, ["buy", "sell", "qty", "fee"], function () {
        return window.SRCalc.arbCalc({ buy: val(id, "buy"), sell: val(id, "sell"), qty: val(id, "qty"), fee: val(id, "fee") });
      }, function (r) { return '<dl class="stats">' + stat("gross", r.gross) + stat("feeCost", r.feeCost) + stat("net", r.net) + "</dl>"; });
    }
    if (kind === "vp") {
      return fut + '<p class="quiet">' + esc(t("vpNote")) + "</p>" + fset(id, [["qty", "dexQty"], ["part", "partPct"], ["bar", "barVol"]]) + gate(id, ["qty", "part", "bar"], function () {
        return window.SRCalc.vpCalc({ qty: val(id, "qty"), part: val(id, "part"), bar: val(id, "bar") });
      }, function (r) { return '<dl class="stats">' + stat("childSize", r.child) + stat("barCount", r.bars) + stat("lastSlice", r.last) + "</dl>"; });
    }
    if (kind === "trail") {
      return fset(id, [["mark", "markPrice"], ["trail", "trailPct"]]) + gate(id, ["mark", "trail"], function () {
        return window.SRCalc.trailCalc({ mark: val(id, "mark"), trail: val(id, "trail") });
      }, function (r) { return '<dl class="stats">' + stat("trailTrigger", r.trigger) + "</dl>"; });
    }
    if (kind === "stoplimit") {
      return fset(id, [["mark", "markPrice"], ["stop", "smartStop"], ["limit", "limitPrice"], ["qty", "dexQty"]]) + gate(id, ["mark", "stop", "limit", "qty"], function () {
        return window.SRCalc.stopLimitCalc({ mark: val(id, "mark"), stop: val(id, "stop"), limit: val(id, "limit"), qty: val(id, "qty") });
      }, function (r) { return '<dl class="stats">' + stat("notional", r.notional) + stat("gap", r.gap) + "</dl><p>" + esc(r.armed ? t("armed") : t("notArmed")) + "</p>"; });
    }
    if (kind === "signal") {
      return '<p class="quiet">' + esc(t("signalNote")) + "</p>" + fset(id, [["price", "dexPrice"], ["qty", "dexQty"]]) + gate(id, ["price", "qty"], function () {
        return window.SRCalc.notionCalc({ price: val(id, "price"), qty: val(id, "qty") });
      }, function (r) { return '<dl class="stats">' + stat("notional", r.notional) + "</dl>"; });
    }
    return "";
  }
  function smartBody() {
    var id = "smart";
    return '<p class="quiet">' + esc(t("smartNote")) + "</p>" + fset(id, [["entry", "smartEntry"], ["qty", "dexQty"], ["stop", "smartStop"], ["t1", "tp1"], ["p1", "tp1pct"], ["t2", "tp2"], ["p2", "tp2pct"], ["t3", "tp3"], ["p3", "tp3pct"]]) + gate(id, ["entry", "qty", "stop", "t1", "p1", "t2", "p2", "t3", "p3"], function () {
      return window.SRCalc.smartCalc({
        entry: val(id, "entry"), qty: val(id, "qty"), stop: val(id, "stop"),
        steps: [{ price: val(id, "t1"), pct: val(id, "p1") }, { price: val(id, "t2"), pct: val(id, "p2") }, { price: val(id, "t3"), pct: val(id, "p3") }]
      });
    }, function (r) {
      var rows = r.rows.map(function (o, i) {
        return "<li>" + esc(t("tpStep")) + " " + mono(String(i + 1)) + " " + mono(fmt(o.price)) + " " + mono(fmt(o.pct)) + "% " + esc(t("taxGain")) + " " + mono(fmt(o.gain)) + "</li>";
      }).join("");
      var list = rows ? lineList([rows]) : '<p class="quiet">' + esc(t("noTp")) + "</p>";
      return '<dl class="stats">' + stat("tpGain", r.realized) + stat("stopGain", r.stopGain) + stat("leftQty", r.leftQty) + "</dl>" + list;
    });
  }
  function paperPanel(titleKey, inner, closeAttr) {
    return '<div class="panel"><h2>' + esc(t(titleKey)) + '</h2><p class="banner">' + esc(t("paperLine")) + "</p>" + inner + '<div class="rowacts"><button type="button" class="ghost" ' + closeAttr + ">" + esc(t("closePanel")) + "</button></div></div>";
  }
  function viewHome() {
    var cards = ENTITIES.filter(function (e) {
      return hit([t("name." + e.id), t("kind." + e.kind), e.id, e.value, e.hold, e.wallets, String(e.pct), t("exampleTag")]);
    });
    var minRaw = String(S.minUsd).trim();
    var minN = num(S.minUsd);
    var rows = XFERS.filter(function (r) {
      if (minRaw !== "" && isFinite(minN) && Number(r.usd) < minN) return false;
      return hit([t(r.from), t(r.to), r.time, r.val, r.token, r.usd, t("exampleTag")]);
    });
    var bettors = BETTORS.filter(function (b) { return hit([b.id, t("bettor." + b.id), b.token, b.sample, t("exampleTag")]); });
    var tokens = TOKENS.filter(function (tk) { return hit([tk.token, tk.sample, t("exampleTag"), t("tokenHolders")]); });
    var cardHTML = cards.map(function (e) {
      var cls = e.pct > 0 ? "up" : e.pct < 0 ? "down" : "";
      var sign = e.pct > 0 ? "+" : "";
      var unit = e.kind === "venue" ? "BTC" : e.id.toUpperCase();
      return '<button type="button" class="entitycard" data-set-q="' + esc(e.id) + '"><div class="cardtop"><h3>' + esc(t("name." + e.id)) + '</h3><span class="pill">' + esc(t("exampleTag")) + '</span></div><div class="kv"><span>' + esc(t("valueLine")) + " " + mono(e.value) + '</span><b class="' + cls + '">' + mono(sign + e.pct.toFixed(2) + '%') + '</b></div><div class="kv"><span>' + esc(t("largestHold")) + "</span><span>" + mono(e.hold) + " " + mono(unit) + '</span></div><div class="kv"><span>' + esc(t("activeWallets")) + "</span><span>" + mono(e.wallets) + "</span></div></button>";
    }).join("");
    var table = rows.map(function (r) {
      return "<tr><td>" + mono(r.time) + '</td><td><span class="pill">' + esc(t("exampleTag")) + "</span> " + esc(t(r.from)) + "</td><td>" + esc(t(r.to)) + "</td><td>" + mono(r.val) + "</td><td>" + mono(r.token) + "</td><td>" + mono(r.usd) + "</td></tr>";
    }).join("");
    var allOn = minRaw === "" ? ' aria-pressed="true"' : ' aria-pressed="false"';
    var betHTML = bettors.map(function (b) {
      return '<button type="button" class="entitycard" data-set-q="' + esc(b.id) + '"><div class="cardtop"><h3>' + esc(t("bettor." + b.id)) + '</h3><span class="pill">' + esc(t("exampleTag")) + '</span></div><div class="kv"><span>' + mono(b.token) + "</span><span>" + esc(t("sampleSize")) + " " + mono(b.sample) + "</span></div></button>";
    }).join("");
    var tokHTML = tokens.map(function (tk) {
      return '<button type="button" class="entitycard" data-set-q="' + esc(tk.token) + '"><div class="cardtop"><h3>' + mono(tk.token) + '</h3><span class="pill">' + esc(t("exampleTag")) + '</span></div><div class="kv"><span>' + esc(t("tokenHolders")) + "</span><span>" + mono(tk.sample) + "</span></div></button>";
    }).join("");
    var q = qnorm();
    var hits = q ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(cards.length + rows.length + bettors.length + tokens.length)) + "</p>" : "";
    return '<section class="hero"><p class="kicker">' + esc(t("heroKicker")) + "</p><h1>" + esc(t("heroTitle")) + '</h1><p class="lead">' + esc(t("heroLead")) + "</p>" + searchBox("q-hero", "finder") + "</section>" + hits
      + '<div class="desk-grid"><section class="block"><div class="headrow"><h2>' + esc(t("trendTitle")) + '</h2></div><p class="quiet">' + esc(t("trendNote")) + "</p>"
      + (cards.length ? '<div class="stack">' + cardHTML + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + '</section><section class="block"><div class="headrow"><h2>' + esc(t("xfersTitle")) + '</h2></div><p class="quiet">' + esc(t("xfersNote")) + "</p>"
      + '<div class="filterrow"><button type="button" class="ghost" id="xfer-all"' + allOn + ">" + esc(t("filterAll")) + "</button>" + field("min-usd", "minUsd", S.minUsd, 'inputmode="decimal"') + "</div>"
      + (rows.length ? '<div class="tape-wrap tight"><table><thead><tr><th>' + esc(t("col.time")) + "</th><th>" + esc(t("col.from")) + "</th><th>" + esc(t("col.to")) + "</th><th>" + esc(t("col.val")) + "</th><th>" + esc(t("col.token")) + "</th><th>" + esc(t("col.usd")) + "</th></tr></thead><tbody>" + table + "</tbody></table></div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section></div>"
      + '<div class="desk-grid even"><section class="block"><h2>' + esc(t("bettorsTitle")) + '</h2><p class="quiet">' + esc(t("bettorsNote")) + "</p>"
      + (bettors.length ? '<div class="stack">' + betHTML + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + '</section><section class="block"><h2>' + esc(t("tokensTitle")) + '</h2><p class="quiet">' + esc(t("tokensNote")) + "</p>"
      + (tokens.length ? '<div class="stack">' + tokHTML + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + "</section></div>";
  }
  function viewPred() {
    var cats = pills("pred", S.pred, [["politics", "predCat.politics"], ["sports", "predCat.sports"], ["crypto", "predCat.crypto"]]);
    var line = S.pred ? esc(t("predCat." + S.pred)) + " " + esc(t("predPicked")) : esc(t("predNone"));
    var extra = qnorm() ? '<p class="quiet">' + esc(t("predQuery")) + ' <span class="isolate">' + esc(window.SR.q) + "</span></p>" : "";
    return '<section class="block"><h1>' + esc(t("predTitle")) + '</h1><p class="banner">' + esc(t("predLead")) + "</p><p>" + line + "</p>" + extra + cats + "</section>";
  }
