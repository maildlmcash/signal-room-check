(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var ENT = [
    { id: "harbor", kind: "exchange", band: "wide", amt: "12", asset: "BTC" },
    { id: "north", kind: "desk", band: "narrow", amt: "4", asset: "ETH" },
    { id: "lantern", kind: "fund", band: "wide", amt: "8", asset: "BTC" },
    { id: "quiet", kind: "maker", band: "narrow", amt: "3", asset: "ETH" },
    { id: "span", kind: "bridge", band: "narrow", amt: "1", asset: "BTC" },
    { id: "civic", kind: "treasury", band: "wide", amt: "6", asset: "ETH" }
  ];
  var XFER = [
    { when: "09:14", from: "harbor", to: "north", asset: "BTC", amt: "1.20" },
    { when: "09:22", from: "north", to: "quiet", asset: "ETH", amt: "12" },
    { when: "09:31", from: "lantern", to: "civic", asset: "BTC", amt: "0.40" },
    { when: "09:44", from: "span", to: "harbor", asset: "ETH", amt: "6" },
    { when: "09:58", from: "quiet", to: "span", asset: "BTC", amt: "0.15" },
    { when: "10:06", from: "civic", to: "lantern", asset: "ETH", amt: "3" },
    { when: "10:18", from: "harbor", to: "span", asset: "BTC", amt: "2" },
    { when: "10:27", from: "north", to: "civic", asset: "ETH", amt: "8" }
  ];
  var BOTS = [
    { view: "spot", book: "book.spot", holds: "yes", touch: "mid" },
    { view: "futures", book: "book.futures", holds: "no", touch: "high" },
    { view: "dca", book: "book.spot", holds: "yes", touch: "low" },
    { view: "rebalance", book: "book.both", holds: "yes", touch: "low" },
    { view: "signal", book: "book.both", holds: "no", touch: "mid" },
    { view: "catalog", book: "book.both", holds: "no", touch: "low" },
    { view: "paper", book: "book.spot", holds: "no", touch: "low" },
    { view: "backtest", book: "book.both", holds: "no", touch: "mid" }
  ];
  var ITEMS = [
    { id: "walker", cat: "range" },
    { id: "ladder", cat: "schedule" },
    { id: "mix", cat: "mix" },
    { id: "gate", cat: "schedule" },
    { id: "twin", cat: "range" },
    { id: "cap", cat: "mix" }
  ];
  var MKTS = [
    { book: "spot", asset: "BTC", price: "100000", ch: "+1.0", size: "12" },
    { book: "futures", asset: "BTC", price: "100200", ch: "+0.5", size: "8" },
    { book: "spot", asset: "ETH", price: "4000", ch: "+2.0", size: "20" },
    { book: "futures", asset: "ETH", price: "4010", ch: "-0.5", size: "6" }
  ];
  var PRESET = ["treasury", "hot", "cold", "public", "internal"];
  var DIR_VIEWS = ["search", "entities", "transfers", "alerts", "labels", "bots", "spot", "futures", "dca", "rebalance", "signal", "catalog", "paper", "backtest", "tax", "markets", "api", "visualizer", "tracer", "insights"];
  var BOT_SET = { bots: 1, spot: 1, futures: 1, dca: 1, rebalance: 1, signal: 1, catalog: 1, paper: 1, backtest: 1 };
  var MORE_SET = { visualizer: 1, tracer: 1, insights: 1 };

  function qtext() { return (window.SR.q || "").trim().toLowerCase(); }
  function hit(text) {
    var q = qtext();
    if (!q) return true;
    return String(text).toLowerCase().indexOf(q) !== -1;
  }
  function badge() { return '<span class="badge">' + esc(t("sample")) + "</span>"; }
  function tick(s) { return '<span class="ticker ltr">' + esc(s) + "</span>"; }
  function readArr(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function writeArr(key, v) { localStorage.setItem(key, JSON.stringify(v)); }
  function entName(id) { return t("ent." + id + ".name"); }
  function labelName(entry) {
    if (entry.preset) return t("tag." + entry.id);
    return entry.text;
  }
  function allLabels() {
    return PRESET.map(function (id) { return { id: id, preset: true }; }).concat(readArr("sr-user-labels"));
  }
  function linksFor(id) {
    return readArr("sr-links").filter(function (l) { return l.entity === id; });
  }
  function sheet(headers, rows) {
    if (!rows.length) return "<p>" + esc(t("empty")) + "</p>";
    var th = headers.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("");
    var tb = rows.map(function (r) {
      return "<tr>" + r.map(function (c, i) {
        return '<td data-th="' + esc(headers[i]) + '">' + c + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<table class="sheet"><thead><tr>' + th + "</tr></thead><tbody>" + tb + "</tbody></table>";
  }
  function spark(seed) {
    var pts = [];
    for (var i = 0; i < 28; i++) {
      var y = 30 + Math.round(Math.sin(i / 3 + seed) * 12 + (i % 5) - 2);
      pts.push(i * 6 + "," + y);
    }
    return '<svg class="spark" viewBox="0 0 162 56" aria-hidden="true"><polyline points="' + pts.join(" ") + '"/></svg>';
  }
  function band(seed) {
    return '<div class="band">' + spark(seed) + "</div>";
  }
  function page(title, body) {
    var flash = window.SR.flash ? "<p>" + esc(t(window.SR.flash)) + "</p>" : "";
    return "<h1>" + esc(t(title)) + "</h1>" + flash + body;
  }
  function viewBtn(view) {
    var cur = window.SR.view === view ? ' aria-current="page"' : "";
    return '<button type="button" data-view="' + view + '"' + cur + ">" + esc(t("nav." + view)) + "</button>";
  }
  function menu(name, views, flip) {
    var open = window.SR.menu === name ? " open" : "";
    var active = name === "bots" ? BOT_SET[window.SR.view] : MORE_SET[window.SR.view];
    var cur = active ? ' aria-current="page"' : "";
    var lab = name === "bots"
      ? '<button type="button" class="menu-lab" data-view="bots"' + (window.SR.view === "bots" || BOT_SET[window.SR.view] ? ' aria-current="page"' : "") + ">" + esc(t("nav.bots")) + "</button>"
      : "";
    var aria = name === "more" ? "" : ' aria-label="' + esc(t("openMenu")) + '"';
    var text = name === "more" ? esc(t("nav.more")) + " " : "";
    var togCur = name === "more" && active ? ' aria-current="page"' : "";
    var tog = '<button type="button" class="menu-toggle" data-menu-toggle="' + name + '" aria-expanded="' + (window.SR.menu === name ? "true" : "false") + '"' + aria + togCur + ">" + text + window.SRX.chev() + "</button>";
    return '<div class="menu' + open + (flip ? " flip" : "") + '" data-menu="' + name + '">' + lab + tog + '<div class="menu-panel">' + views.map(viewBtn).join("") + "</div></div>";
  }
  function navHTML() {
    var primary = ["search", "entities", "transfers", "alerts", "labels"];
    var tail = ["tax", "markets", "api"];
    return '<nav class="nav">' + primary.map(viewBtn).join("")
      + menu("bots", ["spot", "futures", "dca", "rebalance", "signal", "catalog", "paper", "backtest"], false)
      + tail.map(viewBtn).join("")
      + menu("more", ["visualizer", "tracer", "insights"], true)
      + "</nav>";
  }
  function filteredXfer() {
    return XFER.filter(function (r) {
      return hit([r.when, r.asset, r.amt, entName(r.from), entName(r.to)].join(" "));
    });
  }
  function tapeInner() {
    var rows = filteredXfer();
    return "<h2>" + esc(t("nav.transfers")) + " " + badge() + "</h2><p class="muted">" + esc(t("sampleLong")) + " " + esc(t("loop")) + "</p><ul class="tape-list">"
      + (rows.length ? rows.map(function (r) {
        return "<li><span class="num ltr">" + esc(r.when) + "</span><span>" + esc(entName(r.from)) + " → " + esc(entName(r.to)) + "</span><span>" + tick(r.asset) + " " + esc(r.amt) + "</span></li>";
      }).join("") : "<li>" + esc(t("empty")) + "</li>")
      + "</ul>";
  }
  function entityCards(list) {
    return '<div class="grid cards">' + list.map(function (e) {
      var open = window.SR.openId === e.id;
      var marks = linksFor(e.id).map(function (l) {
        var lab = allLabels().filter(function (x) { return x.id === l.label; })[0];
        return lab ? esc(labelName(lab)) : "";
      }).filter(Boolean).join(", ");
      return '<article class="card"><h2>' + esc(entName(e.id)) + "</h2><p class="muted">" + esc(t("kind." + e.kind)) + "</p><p>" + badge() + " " + esc(t(e.band)) + " " + esc(e.amt) + " " + tick(e.asset) + "</p>"
        + (marks ? "<p>" + esc(t("nav.labels")) + ": " + marks + "</p>" : "")
        + '<button type="button" class="text-btn" data-open-entity="' + e.id + '">' + esc(t(open ? "close" : "open")) + "</button>"
        + (open ? "<p>" + esc(t("ent." + e.id + ".blurb")) + "</p>" : "")
        + "</article>";
    }).join("") + "</div>";
  }
  function searchView() {
    var dirs = DIR_VIEWS.filter(function (v) { return hit(t("nav." + v)); });
    var ents = ENT.filter(function (e) { return hit(entName(e.id) + " " + t("ent." + e.id + ".blurb") + " " + t("kind." + e.kind)); });
    var n = dirs.length + ents.length;
    var jumps = '<div class="chips">' + (dirs.length ? dirs.map(function (v) {
      return '<button type="button" class="chip" data-view="' + v + '">' + esc(t("nav." + v)) + "</button>";
    }).join("") : "<p>" + esc(t("empty")) + "</p>") + "</div>";
    return page("nav.search", "<p>" + esc(t("searchLede")) + "</p><p>" + badge() + " " + esc(t("sampleLong")) + "</p>"
      + (qtext() ? "<p class="muted">" + esc(t("hits")) + " " + n + "</p>" : "")
      + '<div class="grid stats"><div class="card stat"><span>' + esc(t("nav.entities")) + "</span><b>" + ENT.length + "</b></div><div class="card stat"><span>" + esc(t("nav.transfers")) + "</span><b>" + XFER.length + "</b></div><div class="card stat"><span>" + esc(t("nav.labels")) + "</span><b>" + allLabels().length + "</b></div></div>"
      + "<h2>" + esc(t("nav.search")) + "</h2>" + jumps
      + "<h2>" + esc(t("nav.entities")) + "</h2>" + (ents.length ? entityCards(ents) : "<p>" + esc(t("empty")) + "</p>"));
  }
  function entitiesView() {
    var list = ENT.filter(function (e) { return hit(entName(e.id) + " " + t("ent." + e.id + ".blurb")); });
    return page("nav.entities", "<p>" + esc(t("entitiesIntro")) + "</p><p>" + badge() + "</p>" + (list.length ? entityCards(list) : "<p>" + esc(t("empty")) + "</p>"));
  }
  function transfersView() {
    var rows = filteredXfer().map(function (r) {
      return [esc(r.when), esc(entName(r.from)), esc(entName(r.to)), tick(r.asset), esc(r.amt)];
    });
    return page("nav.transfers", "<p>" + esc(t("sampleLong")) + " " + esc(t("loop")) + "</p><p>" + badge() + "</p>" + sheet([t("when"), t("from"), t("to"), t("asset"), t("amount")], rows));
  }
  function alertsView() {
    var rows = readArr("sr-alerts").filter(function (a) { return hit(a.symbol + " " + a.threshold); });
    var list = rows.length ? "<ul class="hops">" + rows.map(function (a) {
      return "<li>" + tick(a.symbol) + " " + esc(t(a.dir === "down" ? "dir.down" : "dir.up")) + " <span class="num">" + esc(a.threshold) + '</span> <button type="button" class="text-btn" data-action="rm-alert" data-id="' + esc(a.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("") + "</ul>" : "<p>" + esc(t("empty")) + "</p>";
    return page("nav.alerts", "<p>" + esc(t("notWatching")) + " " + esc(t("deviceOnly")) + "</p>"
      + '<div class="card"><div class="field"><span>' + esc(t("alertSymbol")) + '</span><input id="alert-symbol" class="ltr" maxlength="8"></div>'
      + '<div class="field"><span>' + esc(t("alertDir")) + '</span><select id="alert-dir"><option value="up">' + esc(t("dir.up")) + '</option><option value="down">' + esc(t("dir.down")) + "</option></select></div>"
      + '<div class="field"><span>' + esc(t("alertThreshold")) + '</span><input id="alert-level" class="ltr" inputmode="decimal"></div>'
      + '<button type="button" class="solid" data-action="add-alert">' + esc(t("add")) + "</button></div>" + list);
  }
  function labelsView() {
    var labels = allLabels().filter(function (l) { return hit(labelName(l)); });
    var chips = labels.map(function (l) {
      var rm = l.preset ? "" : ' <button type="button" class="text-btn" data-action="rm-label" data-id="' + esc(l.id) + '">' + esc(t("remove")) + "</button>";
      return "<li>" + esc(labelName(l)) + rm + "</li>";
    }).join("");
    var entOpts = ENT.map(function (e) { return '<option value="' + e.id + '">' + esc(entName(e.id)) + "</option>"; }).join("");
    var labOpts = allLabels().map(function (l) { return '<option value="' + esc(l.id) + '">' + esc(labelName(l)) + "</option>"; }).join("");
    return page("nav.labels", "<p>" + esc(t("labelsIntro")) + " " + esc(t("deviceOnly")) + "</p>"
      + "<ul class="hops">" + (chips || "<li>" + esc(t("empty")) + "</li>") + "</ul>"
      + '<div class="card"><div class="field"><span>' + esc(t("labelPh")) + '</span><input id="label-text" maxlength="32"></div><button type="button" class="solid" data-action="add-label">' + esc(t("add")) + "</button></div>"
      + '<div class="card"><div class="field"><span>' + esc(t("assignEntity")) + "</span><select id="link-entity">" + entOpts + "</select></div>"
      + '<div class="field"><span>' + esc(t("assignLabel")) + "</span><select id="link-label">" + labOpts + "</select></div>"
      + '<button type="button" class="solid" data-action="assign">' + esc(t("assign")) + "</button></div>");
  }
  function botsView() {
    var rows = BOTS.filter(function (b) { return hit(t("nav." + b.view) + " " + t("fit." + b.view)); }).map(function (b) {
      return ['<button type="button" class="text-btn" data-view="' + b.view + '">' + esc(t("nav." + b.view)) + "</button>", esc(t(b.book)), esc(t(b.holds)), esc(t(b.touch)), esc(t("fit." + b.view))];
    });
    return page("nav.bots", "<p>" + esc(t("botsIntro")) + "</p><p>" + esc(t("noOrders")) + " " + badge() + "</p>" + sheet([t("col.style"), t("col.book"), t("col.holds"), t("col.attention"), t("col.fit")], rows));
  }
  function gridView(which) {
    var seed = which === "futures" ? 2 : 1;
    return page(which === "futures" ? "nav.futures" : "nav.spot", "<p>" + esc(t(which === "futures" ? "futuresIntro" : "spotIntro")) + "</p><p>" + badge() + " " + esc(t("gridCaption")) + "</p>"
      + "<p><span class="muted">" + esc(t("gridLower")) + '</span> <span class="num">90000</span> <span class="muted">' + esc(t("gridUpper")) + '</span> <span class="num">110000</span> <span class="muted">' + esc(t("gridLines")) + '</span> <span class="num">8</span></p>'
      + band(seed)
      + "<p><b>" + esc(t("plan.start")) + "</b> " + esc(t(which === "futures" ? "futuresIntro" : "spotIntro")) + "</p>"
      + "<p><b>" + esc(t("plan.extra")) + "</b> " + esc(t("gridCaption")) + "</p>"
      + "<p><b>" + esc(t("plan.exit")) + "</b> " + esc(t("noOrders")) + "</p>");
  }
  function dcaView() {
    return page("nav.dca", "<p>" + esc(t("dcaIntro")) + "</p><p>" + badge() + " " + esc(t("dcaCaption")) + "</p>"
      + "<p>" + esc(t("dcaBase")) + ' <span class="num">100</span> · ' + esc(t("dcaStep")) + ' <span class="num">50</span> · ' + esc(t("dcaEvery")) + ' <span class="num">7</span> ' + esc(t("dcaUnit")) + " · " + esc(t("dcaTimes")) + ' <span class="num">4</span></p>'
      + band(3)
      + "<p><b>" + esc(t("plan.start")) + "</b> " + esc(t("rule.clock.body")) + "</p>"
      + "<p><b>" + esc(t("plan.extra")) + "</b> " + esc(t("rule.fall.body")) + "</p>"
      + "<p><b>" + esc(t("plan.exit")) + "</b> " + esc(t("noOrders")) + "</p>");
  }
  function reView() {
    return page("nav.rebalance", "<p>" + esc(t("reIntro")) + "</p><p>" + badge() + " " + esc(t("reCaption")) + "</p>"
      + '<div class="bars"><div>' + tick("BTC") + '<b style="width:60%"></b><em class="num">60</em></div><div>' + tick("ETH") + '<b style="width:40%"></b><em class="num">40</em></div></div>'
      + "<p>" + esc(t("noOrders")) + "</p>");
  }
  function signalView() {
    var rules = ["fall", "clock", "band"].filter(function (id) { return hit(t("rule." + id + ".name") + t("rule." + id + ".body")); });
    var cards = rules.map(function (id) {
      return '<article class="card"><h2>' + esc(t("rule." + id + ".name")) + "</h2><p>" + esc(t("rule." + id + ".body")) + "</p></article>";
    }).join("");
    return page("nav.signal", "<p>" + esc(t("signalIntro")) + "</p><p>" + esc(t("noOrders")) + "</p><div class="grid cards">" + (cards || "<p>" + esc(t("empty")) + "</p>") + "</div>");
  }
  function catalogView() {
    var cats = [["all", "cat.all"], ["range", "cat.range"], ["schedule", "cat.schedule"], ["mix", "cat.mix"]];
    var chips = '<div class="chips">' + cats.map(function (c) {
      var on = window.SR.cat === c[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="chip" data-cat="' + c[0] + '"' + on + ">" + esc(t(c[1])) + "</button>";
    }).join("") + "</div>";
    var items = ITEMS.filter(function (it) {
      if (window.SR.cat !== "all" && it.cat !== window.SR.cat) return false;
      return hit(t("item." + it.id + ".name") + t("item." + it.id + ".body"));
    });
    var cards = items.map(function (it) {
      return '<article class="card"><h2>' + esc(t("item." + it.id + ".name")) + "</h2><p class="muted">" + esc(t("cat." + it.cat)) + "</p><p>" + esc(t("item." + it.id + ".body")) + "</p></article>";
    }).join("");
    return page("nav.catalog", "<p>" + esc(t("catIntro")) + "</p><p>" + esc(t("noOrders")) + "</p>" + chips + '<div class="grid cards">' + (cards || "<p>" + esc(t("empty")) + "</p>") + "</div>");
  }
  function paperView() {
    var fills = [
      ["09:10", "buy", "BTC", "0.10", "100000"],
      ["09:40", "sell", "ETH", "1", "4000"],
      ["10:05", "buy", "ETH", "2", "4000"]
    ].filter(function (r) { return hit(r.join(" ") + t(r[1])); });
    var rows = fills.map(function (r) { return [esc(r[0]), esc(t(r[1])), tick(r[2]), esc(r[3]), '<span class="num">' + esc(r[4]) + "</span>"]; });
    return page("nav.paper", "<p>" + esc(t("paperIntro")) + "</p><p>" + badge() + " " + esc(t("noOrders")) + "</p>" + sheet([t("when"), t("col.type"), t("asset"), t("amount"), t("col.price")], rows));
  }
  function backView() {
    var rows = [
      ["30", "BTC", "+2"],
      ["30", "ETH", "+1"],
      ["90", "BTC", "-1"]
    ].filter(function (r) { return hit(r.join(" ")); }).map(function (r) {
      return ['<span class="num">' + esc(r[0]) + "</span>", tick(r[1]), '<span class="num">' + esc(r[2]) + "</span>", esc(t("sample"))];
    });
    return page("nav.backtest", "<p>" + esc(t("backIntro")) + "</p><p>" + badge() + " " + esc(t("noForecast")) + " " + esc(t("noOrders")) + "</p>" + sheet([t("col.window"), t("asset"), t("col.change"), t("col.type")], rows));
  }
  function factor() { return window.SR.year === "2024" ? 1 : window.SR.year === "2025" ? 2 : 3; }
  function taxView() {
    var f = factor();
    var gain = (window.SR.method === "avg" ? 150 : 200) * f;
    var tabs = ["summary", "disposals", "income", "holdings"].map(function (id) {
      var on = window.SR.year && window.SR.taxTab === id ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="chip" data-tax="' + id + '"' + on + ">" + esc(t("tab." + id)) + "</button>";
    }).join("");
    var controls = '<div class="inline"><label class="field"><span>' + esc(t("taxYear")) + '</span><select id="tax-year">'
      + ["2024", "2025", "2026"].map(function (y) { return '<option value="' + y + '"' + (window.SR.year === y ? " selected" : "") + ">" + y + "</option>"; }).join("")
      + '</select></label><label class="field"><span>' + esc(t("taxMethod")) + '</span><select id="tax-method"><option value="first"' + (window.SR.method === "first" ? " selected" : "") + ">" + esc(t("method.first")) + '</option><option value="avg"' + (window.SR.method === "avg" ? " selected" : "") + ">" + esc(t("method.avg")) + "</select></label></div>";
    var body = "";
    if (window.SR.taxTab === "disposals") {
      body = sheet([t("asset"), t("col.proceeds"), t("col.cost"), t("col.gain")], [
        [tick("BTC"), String(1000 * f), String(800 * f), String(gain)],
        [tick("ETH"), String(400 * f), String(250 * f), String(Math.round(gain / 2))]
      ].map(function (r) { return r.map(function (c, i) { return i ? '<span class="num">' + esc(c) + "</span>" : c; }); }));
    } else if (window.SR.taxTab === "income") {
      body = sheet([t("col.type"), t("amount")], [
        [esc(t("income.stake")), '<span class="num">' + (10 * f) + "</span>"],
        [esc(t("income.rebate")), '<span class="num">' + (4 * f) + "</span>"]
      ]);
    } else if (window.SR.taxTab === "holdings") {
      body = sheet([t("asset"), t("amount")], [[tick("BTC"), '<span class="num">2</span>'], [tick("ETH"), '<span class="num">10</span>']]);
    } else {
      body = '<div class="grid stats"><div class="card stat"><span>' + esc(t("totalGain")) + "</span><b>" + gain + '</b></div><div class="card stat"><span>' + esc(t("totalIncome")) + "</span><b>" + (14 * f) + "</b></div></div>";
    }
    return page("nav.tax", "<p>" + esc(t("taxIntro")) + "</p><p>" + esc(t("taxDisclaimer")) + "</p><p>" + badge() + " " + esc(t("nothingOut")) + "</p>" + controls + '<div class="chips">' + tabs + "</div>" + body);
  }
  var TICKER_URL = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
  var KLINE_URL = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60";
  var mkt = { phase: "idle", price: null, candles: null, tickerErr: null, klineErr: null, tickerStatus: null, klineStatus: null };
  var mktGen = 0;
  var drawn = [];
  var drawnSample = false;
  var obs = null;

  function sampleCandles() {
    var rows = [];
    var price = 100000;
    for (var i = 0; i < 60; i++) {
      var o = price;
      var drift = Math.round(Math.sin(i / 5) * 180 + Math.cos(i / 3) * 40);
      var c = o + drift;
      rows.push({ t: i, o: o, h: Math.max(o, c) + 60, l: Math.min(o, c) - 60, c: c });
      price = c;
    }
    return rows;
  }
  function chartState() {
    if (mkt.phase === "done" && mkt.candles && mkt.candles.length) return { rows: mkt.candles, sample: false };
    if (mkt.phase === "done") return { rows: sampleCandles(), sample: true };
    return { rows: [], sample: false };
  }
  function pullPublic(url) {
    return fetch(url, { method: "GET", cache: "no-store", credentials: "omit" }).then(function (r) {
      return r.text().then(function (text) {
        var slice = text.slice(0, 700);
        if (!r.ok) return { status: r.status, text: slice, err: slice || ("HTTP " + r.status) };
        return { status: r.status, text: text, err: null };
      });
    }).catch(function (e) {
      return { status: null, text: "", err: String((e && e.message) || e) };
    });
  }
  function loadMarkets() {
    var gen = ++mktGen;
    mkt.phase = "wait";
    mkt.price = null;
    mkt.candles = null;
    mkt.tickerErr = null;
    mkt.klineErr = null;
    mkt.tickerStatus = null;
    mkt.klineStatus = null;
    if (window.SR.view === "markets") renderMain();
    Promise.all([pullPublic(TICKER_URL), pullPublic(KLINE_URL)]).then(function (pair) {
      if (gen !== mktGen) return;
      var tr = pair[0];
      var kr = pair[1];
      mkt.tickerStatus = tr.status;
      mkt.klineStatus = kr.status;
      mkt.tickerErr = tr.err;
      mkt.klineErr = kr.err;
      if (!tr.err) {
        try {
          var j = JSON.parse(tr.text);
          if (j && j.price) mkt.price = String(j.price);
          else mkt.tickerErr = tr.text.slice(0, 700) || t("failed");
        } catch (e) { mkt.tickerErr = tr.text.slice(0, 700) || t("failed"); }
      }
      if (!kr.err) {
        try {
          var arr = JSON.parse(kr.text);
          if (Array.isArray(arr) && arr.length) {
            mkt.candles = arr.map(function (k) {
              return { t: +k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4] };
            });
          } else mkt.klineErr = kr.text.slice(0, 700) || t("failed");
        } catch (e2) { mkt.klineErr = kr.text.slice(0, 700) || t("failed"); }
      }
      mkt.phase = "done";
      if (window.SR.view === "markets") renderMain();
    });
  }
  function errBox(status, err) {
    if (!err) return "";
    var bits = "<p>" + esc(t("failed")) + "</p>";
    if (status === 451) bits += "<p>" + esc(t("refused")) + "</p>";
    bits += '<p class="mono">' + esc(status == null ? t("noStatus") : t("status") + " " + status) + "</p>";
    bits += '<p class="muted">' + esc(t("upstream")) + '</p><pre class="err ltr" lang="en">' + esc(err) + "</pre>";
    return bits;
  }
  function hhmm(ms) {
    var d = new Date(ms);
    function z(n) { return (n < 10 ? "0" : "") + n; }
    return z(d.getUTCHours()) + ":" + z(d.getUTCMinutes());
  }
  function endpointLine(key) {
    var text = t(key);
    var i = text.indexOf("https://");
    if (i < 0) return "<p>" + esc(text) + "</p>";
    var urlEnd = text.indexOf(" ", i);
    if (urlEnd < 0) urlEnd = text.length;
    return '<p class="ltr">' + esc(text.slice(0, i)) + '<span class="mono">' + esc(text.slice(i, urlEnd)) + "</span>" + esc(text.slice(urlEnd)) + "</p>";
  }
  function candleTable(rows, sample) {
    var body = rows.map(function (r) {
      var when = sample ? String(r.t) : hhmm(r.t);
      return "<tr><td class="num ltr">" + esc(when) + "</td><td class="num ltr">" + r.o + "</td><td class="num ltr">" + r.h + "</td><td class="num ltr">" + r.l + "</td><td class="num ltr">" + r.c + "</td></tr>";
    }).join("");
    return '<table class="sheet"><thead><tr><th>' + esc(t("when")) + "</th><th>" + esc(t("candle.open")) + "</th><th>" + esc(t("candle.high")) + "</th><th>" + esc(t("candle.low")) + "</th><th>" + esc(t("candle.close")) + "</th></tr></thead><tbody>" + body + "</tbody></table>";
  }
  function marketsView() {
    var chips = [["all", "all"], ["spot", "chip.spot"], ["futures", "chip.futures"]].map(function (c) {
      var on = window.SR.chip === c[0] ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="chip" data-chip="' + c[0] + '"' + on + ">" + esc(t(c[1])) + "</button>";
    }).join("");
    var rows = MKTS.filter(function (m) {
      if (window.SR.chip !== "all" && m.book !== window.SR.chip) return false;
      return hit(m.asset + " " + t(m.book === "spot" ? "chip.spot" : "chip.futures"));
    }).map(function (m) {
      var cls = m.ch.charAt(0) === "-" ? "down" : "up";
      return [esc(t(m.book === "spot" ? "chip.spot" : "chip.futures")), tick(m.asset), '<span class="num">' + m.price + "</span>", '<span class="num ' + cls + '">' + m.ch + "</span>", '<span class="num">' + m.size + "</span>"];
    });
    var state = chartState();
    drawn = state.rows;
    drawnSample = state.sample;
    var head = "";
    if (mkt.phase === "wait") head += "<p>" + esc(t("waiting")) + "</p>";
    if (mkt.phase === "done" && mkt.price) {
      head += "<p>" + esc(t("last")) + '</p><p class="price ltr">' + esc(mkt.price) + ' <span class="badge live">' + esc(t("liveSeries")) + "</span></p>";
    }
    if (state.sample) {
      if (!mkt.price) head += '<p class="price"><span class="num ltr">100000</span> <span class="badge">' + esc(t("sampleSeries")) + "</span></p>";
      head += "<p><span class="badge">" + esc(t("sampleSeries")) + "</span> " + esc(t("sampleLong")) + " " + esc(t("sampleClock")) + "</p>";
    } else if (mkt.candles) {
      head += "<p><span class="badge live">" + esc(t("liveSeries")) + "</span> " + esc(t("liveClock")) + "</p>";
    }
    var table = drawn.length ? candleTable(drawn.slice(-8), state.sample) : "";
    var chart = '<div class="desk-split"><section class="card"><h2>' + esc(t("chartTitle")) + "</h2>"
      + '<p class="muted ltr">' + esc(t("pair")) + "</p>"
      + head
      + '<div class="chart-wrap"><canvas id="chart"></canvas></div>'
      + table
      + "</section><aside class="card"><h2>" + esc(t("sourceTitle")) + "</h2>"
      + "<p>" + esc(t("sourceBody")) + "</p>"
      + endpointLine("tickerWeight")
      + endpointLine("klineWeight")
      + "<p>" + esc(t("limitLine")) + "</p>"
      + "<p>" + esc(t("weightsNote")) + "</p>"
      + errBox(mkt.tickerStatus, mkt.tickerErr)
      + errBox(mkt.klineStatus, mkt.klineErr)
      + '<button type="button" class="solid" data-action="mkt-refresh">' + esc(t("refresh")) + "</button>"
      + "</aside></div>";
    return page("nav.markets", "<p>" + esc(t("marketsIntro")) + "</p>" + chart
      + "<h2>" + esc(t("nav.markets")) + "</h2><p>" + badge() + " " + esc(t("sampleLong")) + '</p><div class="chips">' + chips + "</div>"
      + sheet([t("col.book"), t("asset"), t("col.price"), t("col.change"), t("col.size")], rows));
  }
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#d7b36a";
  }
  function drawChart() {
    var canvas = document.getElementById("chart");
    if (!canvas) return;
    var rows = drawn;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 600;
    var h = canvas.clientHeight || 320;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!rows.length) return;
    var pad = 18;
    var max = rows[0].h;
    var min = rows[0].l;
    rows.forEach(function (r) { if (r.h > max) max = r.h; if (r.l < min) min = r.l; });
    if (max === min) { max += 1; min -= 1; }
    function y(v) { return pad + (max - v) / (max - min) * (h - pad * 2); }
    function x(i) { return pad + (i + 0.5) * ((w - pad * 2) / rows.length); }
    var up = cssVar("--up");
    var down = cssVar("--down");
    var cw = Math.max(2, ((w - pad * 2) / rows.length) * 0.55);
    rows.forEach(function (r, i) {
      var cx = x(i);
      ctx.strokeStyle = r.c >= r.o ? up : down;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, y(r.h));
      ctx.lineTo(cx, y(r.l));
      ctx.stroke();
      var top = y(Math.max(r.o, r.c));
      var bot = y(Math.min(r.o, r.c));
      ctx.fillRect(cx - cw / 2, top, cw, Math.max(1, bot - top));
    });
    if (drawnSample) {
      ctx.fillStyle = cssVar("--accent");
      ctx.font = '600 13px "Source Sans 3", "Noto Sans Devanagari", "Noto Sans Arabic", sans-serif';
      ctx.fillText(t("sampleSeries"), pad, 16);
    }
  }
  function mountChart() {
    drawChart();
    var canvas = document.getElementById("chart");
    if (obs) { obs.disconnect(); obs = null; }
    if (canvas && window.ResizeObserver) {
      obs = new ResizeObserver(function () { drawChart(); });
      obs.observe(canvas.parentNode);
    }
    if (mkt.phase === "idle") loadMarkets();
  }
  function apiView() {
    return page("nav.api", "<p>" + esc(t("apiIntro")) + "</p><ul class="hops"><li>" + esc(t("api.1")) + "</li><li>" + esc(t("api.2")) + "</li><li>" + esc(t("api.3")) + "</li><li>" + esc(t("api.4")) + "</li></ul><p>" + esc(t("weightsNote")) + "</p>");
  }
  function visView() {
    var nodes = ENT.filter(function (e) { return hit(entName(e.id)); }).map(function (e) {
      return '<div class="node"><strong>' + esc(entName(e.id)) + "</strong><p class="muted">" + esc(t("kind." + e.kind)) + "</p></div>";
    }).join("");
    return page("nav.visualizer", "<p>" + esc(t("visIntro")) + "</p><p>" + badge() + '</p><div class="vmap">' + (nodes || "<p>" + esc(t("empty")) + "</p>") + "</div>");
  }
  function tracerView() {
    var hops = XFER.slice(0, 4).map(function (r, i) {
      return "<li><span class="num">" + (i + 1) + "</span> " + esc(t("hop")) + " " + esc(entName(r.from)) + " → " + esc(entName(r.to)) + " " + tick(r.asset) + " " + esc(r.amt) + "</li>";
    }).join("");
    return page("nav.tracer", "<p>" + esc(t("tracerIntro")) + "</p><p>" + badge() + "</p><ol class="hops">" + hops + "</ol>");
  }
  function insightsView() {
    var cards = ["desks", "routes", "marks"].map(function (id, i) {
      var n = [2, 4, 5][i];
      if (!hit(t("ins." + id + ".title") + t("ins." + id + ".body"))) return "";
      return '<article class="card"><h2>' + esc(t("ins." + id + ".title")) + "</h2><p class="price">" + n + "</p><p>" + badge() + " " + esc(t("ins." + id + ".body")) + "</p></article>";
    }).join("");
    return page("nav.insights", "<p>" + esc(t("insightsIntro")) + "</p><p>" + esc(t("noForecast")) + '</p><div class="grid cards">' + (cards || "<p>" + esc(t("empty")) + "</p>") + "</div>");
  }
  function viewHTML() {
    switch (window.SR.view) {
      case "entities": return entitiesView();
      case "transfers": return transfersView();
      case "alerts": return alertsView();
      case "labels": return labelsView();
      case "bots": return botsView();
      case "spot": return gridView("spot");
      case "futures": return gridView("futures");
      case "dca": return dcaView();
      case "rebalance": return reView();
      case "signal": return signalView();
      case "catalog": return catalogView();
      case "paper": return paperView();
      case "backtest": return backView();
      case "tax": return taxView();
      case "markets": return marketsView();
      case "api": return apiView();
      case "visualizer": return visView();
      case "tracer": return tracerView();
      case "insights": return insightsView();
      default: return searchView();
    }
  }
  function wantsTape() {
    return window.SR.view === "search" || window.SR.view === "entities" || window.SR.view === "transfers";
  }
  function render(scroll) {
    window.SRX.applyDocument();
    var tape = wantsTape();
    document.getElementById("app").innerHTML = window.SRX.headerHTML({ search: true, nav: navHTML() })
      + '<div class="shell' + (tape ? "" : " solo") + '"><div id="main" tabindex="-1"></div>'
      + (tape ? '<aside class="tape" id="tape"></aside>' : "")
      + "</div>" + window.SRX.footerHTML("app");
    renderMain();
    if (scroll) window.scrollTo(0, 0);
  }
  function renderMain() {
    var main = document.getElementById("main");
    if (!main) return render(false);
    if (window.SR.view !== "markets" && obs) { obs.disconnect(); obs = null; }
    main.innerHTML = viewHTML();
    var tape = document.getElementById("tape");
    if (tape) tape.innerHTML = tapeInner();
    if (window.SR.view === "markets") mountChart();
  }
  function syncMenus() {
    document.querySelectorAll("[data-menu]").forEach(function (el) {
      var name = el.getAttribute("data-menu");
      var on = window.SR.menu === name;
      el.classList.toggle("open", on);
      var tog = el.querySelector("[data-menu-toggle]");
      if (tog) tog.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }
  function doAction(action, el) {
    if (action === "mkt-refresh") { loadMarkets(); return; }
    if (action === "add-alert") {
      var sym = (document.getElementById("alert-symbol").value || "").trim().toUpperCase();
      var level = Number(document.getElementById("alert-level").value);
      var dir = document.getElementById("alert-dir").value === "down" ? "down" : "up";
      if (sym !== "BTC" && sym !== "ETH") { window.SR.flash = "badSymbol"; renderMain(); return; }
      if (!isFinite(level) || level <= 0) { window.SR.flash = "badNumber"; renderMain(); return; }
      var list = readArr("sr-alerts");
      list.push({ id: String(Date.now()), symbol: sym, dir: dir, threshold: String(level) });
      writeArr("sr-alerts", list);
      window.SR.flash = "saved";
      renderMain();
      return;
    }
    if (action === "rm-alert") {
      writeArr("sr-alerts", readArr("sr-alerts").filter(function (a) { return a.id !== el.getAttribute("data-id"); }));
      renderMain();
      return;
    }
    if (action === "add-label") {
      var text = (document.getElementById("label-text").value || "").trim().slice(0, 32);
      if (!text) return;
      var labs = readArr("sr-user-labels");
      labs.push({ id: "u" + Date.now(), text: text });
      writeArr("sr-user-labels", labs);
      window.SR.flash = "saved";
      renderMain();
      return;
    }
    if (action === "rm-label") {
      var id = el.getAttribute("data-id");
      writeArr("sr-user-labels", readArr("sr-user-labels").filter(function (l) { return l.id !== id; }));
      writeArr("sr-links", readArr("sr-links").filter(function (l) { return l.label !== id; }));
      renderMain();
      return;
    }
    if (action === "assign") {
      var entity = document.getElementById("link-entity").value;
      var label = document.getElementById("link-label").value;
      var links = readArr("sr-links");
      if (!links.some(function (l) { return l.entity === entity && l.label === label; })) links.push({ entity: entity, label: label });
      writeArr("sr-links", links);
      window.SR.flash = "saved";
      renderMain();
    }
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-set-lang],[data-set-theme]")) return;
    if (e.target.closest("[data-skip]")) {
      var main = document.getElementById("main");
      if (main) main.focus();
      return;
    }
    var toggle = e.target.closest("[data-menu-toggle]");
    if (toggle) {
      var name = toggle.getAttribute("data-menu-toggle");
      window.SR.menu = window.SR.menu === name ? null : name;
      syncMenus();
      return;
    }
    var viewBtnEl = e.target.closest("[data-view]");
    if (viewBtnEl) {
      window.SR.view = viewBtnEl.getAttribute("data-view");
      window.SR.menu = null;
      window.SR.openId = null;
      window.SR.flash = "";
      render(true);
      return;
    }
    var op = e.target.closest("[data-open-entity]");
    if (op) {
      var id = op.getAttribute("data-open-entity");
      window.SR.openId = window.SR.openId === id ? null : id;
      renderMain();
      return;
    }
    var tax = e.target.closest("[data-tax]");
    if (tax) { window.SR.taxTab = tax.getAttribute("data-tax"); renderMain(); return; }
    var chip = e.target.closest("[data-chip]");
    if (chip) { window.SR.chip = chip.getAttribute("data-chip"); renderMain(); return; }
    var cat = e.target.closest("[data-cat]");
    if (cat) { window.SR.cat = cat.getAttribute("data-cat"); renderMain(); return; }
    var act = e.target.closest("[data-action]");
    if (act) { doAction(act.getAttribute("data-action"), act); return; }
    if (!e.target.closest("[data-menu]") && window.SR.menu) { window.SR.menu = null; syncMenus(); }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "q") {
      window.SR.q = e.target.value;
      renderMain();
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "tax-year") { window.SR.year = e.target.value; renderMain(); }
    if (e.target.id === "tax-method") { window.SR.method = e.target.value; renderMain(); }
  });
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === "/" && tag !== "INPUT" && tag !== "SELECT" && tag !== "TEXTAREA") {
      var q = document.getElementById("q");
      if (q) { e.preventDefault(); q.focus(); }
    }
    if (e.key === "Escape" && window.SR.menu) { window.SR.menu = null; syncMenus(); }
  });
  window.SR.taxTab = "summary";
  window.SR.method = "first";
  window.SR.year = "2026";
  window.SR.chip = "all";
  window.SR.cat = "all";
  window.SR.openId = null;
  window.SR.flash = "";
  window.SR.view = "search";
  window.SRX.initChrome();
  window.SR.onChange = function (why) {
    if (why === "q") renderMain();
    else render(false);
  };
  render(false);
})();
