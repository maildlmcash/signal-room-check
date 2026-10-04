  var MARKETS = [
    { pair: "BTCUSDT", asset: "btc", price: "64000", pct: 1.2 },
    { pair: "ETHUSDT", asset: "eth", price: "3200", pct: -0.4 },
    { pair: "SOLUSDT", asset: "sol", price: "150", pct: 2.1 },
    { pair: "BNBUSDT", asset: "bnb", price: "580", pct: 0.3 },
    { pair: "XRPUSDT", asset: "xrp", price: "0.55", pct: -1.1 },
    { pair: "DOGEUSDT", asset: "doge", price: "0.12", pct: 0.8 },
    { pair: "ADAUSDT", asset: "ada", price: "0.45", pct: -0.2 },
    { pair: "AVAXUSDT", asset: "avax", price: "28", pct: 1.4 },
    { pair: "LINKUSDT", asset: "link", price: "14", pct: 0.6 }
  ];
  var BOTS = [
    { id: "grid", kind: "grid", tags: ["grid", "spot"] },
    { id: "futgrid", kind: "grid", tags: ["grid", "futures"], fut: 1 },
    { id: "revgrid", kind: "grid", tags: ["grid", "spot"], reverse: 1 },
    { id: "infgrid", kind: "infinity", tags: ["grid", "spot"] },
    { id: "levgrid", kind: "grid", tags: ["grid", "futures"], lev: 1, fut: 1 },
    { id: "margingrid", kind: "grid", tags: ["grid", "margin"], lev: 1 },
    { id: "dca", kind: "dca", tags: ["dca", "spot"] },
    { id: "signal", kind: "signal", tags: ["signal"] },
    { id: "smart", kind: "smart", tags: ["spot"] },
    { id: "terminal", kind: "signal", tags: ["spot"] },
    { id: "spotdca", kind: "dca", tags: ["dca", "spot"] },
    { id: "futdca", kind: "dca", tags: ["dca", "futures"], fut: 1 },
    { id: "snow", kind: "dca", tags: ["dca", "futures"], fut: 1 },
    { id: "arb", kind: "arb", tags: ["spot"] },
    { id: "rebal", kind: "rebalance", tags: ["spot"] },
    { id: "twap", kind: "twap", tags: ["spot"] },
    { id: "vp", kind: "vp", tags: ["futures"], fut: 1 },
    { id: "combo", kind: "plan", tags: ["spot"] },
    { id: "webhook", kind: "plan", tags: ["signal"] },
    { id: "short", kind: "plan", tags: ["futures"], fut: 1 },
    { id: "triggers", kind: "stoplimit", tags: ["spot"] },
    { id: "templates", kind: "plan", tags: ["spot"] },
    { id: "strategies", kind: "plan", tags: ["spot"] },
    { id: "signals", kind: "signal", tags: ["signal"] }
  ];
  var BOT_TAGS = ["grid", "dca", "spot", "futures", "signal", "margin"];
  var VENUES = ["v1", "v2", "v3", "v4", "v5", "v6"];
  var PLANS = [
    { id: "a", name: "planA", note: "planAnote", price: "0" },
    { id: "b", name: "planB", note: "planBnote", price: "12" },
    { id: "c", name: "planC", note: "planCnote", price: "29" }
  ];
  function pairButtons() {
    return PAIRS.map(function (p) {
      var on = S.pair === p ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="pairbtn" data-pair="' + p + '"' + on + ">" + mono(p) + "</button>";
    }).join("");
  }
  function ticketPage(opts) {
    var lev = opts.fut ? field("fut-lev", "levLabel", S.lev, 'inputmode="decimal"') : "";
    var bits = mono(S.pair) + " " + esc(t("side." + S.side)) + " " + esc(t("dexPrice")) + " " + mono(String(S.price).trim() || "—") + " " + esc(t("dexQty")) + " " + mono(String(S.qty).trim() || "—");
    if (opts.fut) bits += " " + esc(t("levLabel")) + " " + mono(String(S.lev).trim() || "—");
    var banner = opts.fut ? t("noFuturesOrder") : t("paperLine");
    return '<section class="block"><h1>' + esc(t(opts.title)) + '</h1><p class="banner">' + esc(t("paperLine")) + "</p>"
      + (opts.fut ? '<p class="banner">' + esc(t("noFuturesOrder")) + "</p>" : "")
      + '<p class="quiet">' + esc(t(opts.lead)) + '</p><div class="modes">' + pairButtons() + "</div>"
      + pills("side", S.side, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("dex-price", "dexPrice", S.price, 'inputmode="decimal"') + field("dex-qty", "dexQty", S.qty, 'inputmode="decimal"') + lev + "</div>"
      + '<div class="panel"><h2>' + esc(t("typedTicket")) + "</h2><p>" + bits + '</p><p class="banner">' + esc(banner) + "</p></div></section>";
  }
  function viewSpot() { return ticketPage({ title: "spotTitle", lead: "spotLead", fut: false }); }
  function viewFutures() { return ticketPage({ title: "futTitle", lead: "futLead", fut: true }); }
  function viewMarkets() {
    var q = String(S.mq || "").trim().toLowerCase();
    var rows = MARKETS.filter(function (m) {
      var name = t("name." + m.asset);
      if (q && (m.pair + "\n" + name).toLowerCase().indexOf(q) === -1) return false;
      return hit([m.pair, name, m.price, String(m.pct), t("exampleTag")]);
    });
    var cards = rows.map(function (m) {
      var cls = m.pct > 0 ? "up" : m.pct < 0 ? "down" : "";
      var sign = m.pct > 0 ? "+" : "";
      var on = S.pair === m.pair ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="entitycard" data-pair="' + m.pair + '"' + on + '><div class="cardtop"><h3>' + esc(t("name." + m.asset)) + "</h3><span class=\"pill\">" + esc(t("exampleTag")) + "</span></div><div class=\"kv\"><span>" + mono(m.pair) + "</span></div><div class=\"kv\"><span>" + esc(t("mktLast")) + "</span><span>" + mono(m.price) + "</span></div><div class=\"kv\"><span>" + esc(t("mktChg")) + '</span><b class="' + cls + '">' + mono(sign + m.pct.toFixed(2) + "%") + "</b></div></button>";
    }).join("");
    var note = S.pairNote ? '<p role="status">' + esc(t(S.pairNote)) + " " + mono(S.pair) + '</p><div class="rowacts"><button type="button" class="solid" data-view="spot">' + esc(t("nav.spot")) + '</button><button type="button" class="ghost" data-view="futures">' + esc(t("nav.futures")) + "</button></div>" : "";
    return '<section class="block"><h1>' + esc(t("mktTitle")) + '</h1><p class="quiet">' + esc(t("mktLead")) + "</p>"
      + '<div class="fields">' + field("mkt-q", "mktSearch", S.mq, "") + "</div>"
      + (qnorm() || q ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(rows.length)) + "</p>" : "")
      + note
      + (cards ? '<div class="dirgrid">' + cards + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
  function planForm(botId) {
    var rows = readArr("sr-room-plans").filter(function (r) { return r && r.bot === botId && typeof r.name === "string"; });
    var list = rows.map(function (r) {
      return '<li><strong class="isolate">' + esc(r.name) + '</strong><div class="quiet isolate">' + esc(r.note || "") + '</div><button type="button" class="ghost" data-remove-plan="' + esc(r.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var msg = S.planMsg ? '<p class="bad" role="alert">' + esc(t(S.planMsg)) + "</p>" : "";
    return '<p class="quiet">' + esc(t("planCard")) + "</p>"
      + '<div class="fields">' + field("plan-name", "planName", S.planName, "") + field("plan-note", "planNote", S.planNote, "") + "</div>"
      + msg + '<div class="rowacts"><button type="button" class="solid" id="plan-save">' + esc(t("planSave")) + "</button></div>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("planEmpty")) + "</p>");
  }
  function viewBots() {
    var q = String(S.gq || "").trim().toLowerCase();
    var rows = BOTS.filter(function (c) {
      if (S.gTag && c.tags.indexOf(S.gTag) === -1) return false;
      var blob = [t("botCard." + c.id)].concat(c.tags.map(function (tag) { return t("tag." + tag); })).join("\n");
      if (q && blob.toLowerCase().indexOf(q) === -1) return false;
      return hit([blob, t("exampleTag")]);
    });
    var tags = '<button type="button" data-g-tag=""' + (S.gTag === "" ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(t("tagAll")) + "</button>" + BOT_TAGS.map(function (tag) {
      var on = S.gTag === tag ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" data-g-tag="' + tag + '"' + on + ">" + esc(t("tag." + tag)) + "</button>";
    }).join("");
    var open = BOTS.filter(function (c) { return c.id === S.gOpen; })[0];
    var panel = "";
    if (open && rows.some(function (c) { return c.id === open.id; })) {
      var inner = open.kind === "smart" ? smartBody() : open.kind === "plan" ? planForm(open.id) : calcBody({ bag: "bot-" + open.id, kind: open.kind, lev: open.lev, reverse: open.reverse, fut: open.fut });
      if ((open.kind === "smart" || open.kind === "plan") && open.fut) inner = '<p class="quiet">' + esc(t("paperFutures")) + "</p>" + inner;
      panel = paperPanel("botCard." + open.id, inner, 'data-g-close="1"');
    }
    var cards = rows.map(function (c) {
      var on = S.gOpen === c.id ? ' aria-pressed="true"' : ' aria-pressed="false"';
      var meta = c.tags.map(function (tag) { return '<span class="pill">' + esc(t("tag." + tag)) + "</span>"; }).join("");
      var lead = c.kind === "plan" ? t("planCard") : t("openPaper");
      return '<button type="button" class="dircard" data-g-open="' + c.id + '"' + on + "><strong>" + esc(t("botCard." + c.id)) + '</strong><span class="quiet">' + esc(lead) + '</span><span class="meta">' + meta + "</span></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("botsTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("botsLead")) + "</p>"
      + '<div class="fields">' + field("g-search", "dirSearch", S.gq, "") + "</div>"
      + '<div class="modes">' + tags + "</div>"
      + (q || qnorm() || S.gTag ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(rows.length)) + "</p>" : "")
      + panel
      + (cards ? '<div class="dirgrid">' + cards + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
  function viewIntegrations() {
    var saved = readArr("sr-room-venues").filter(function (x) { return typeof x === "string"; });
    var msg = S.integMsg ? '<p class="bad" role="alert">' + esc(t(S.integMsg)) + "</p>" : "";
    var cards = VENUES.map(function (id) {
      var on = saved.indexOf(id) !== -1;
      return '<button type="button" class="dircard" data-venue="' + id + '" aria-pressed="' + (on ? "true" : "false") + '"><strong>' + esc(t("venue." + id)) + '</strong><span class="quiet">' + esc(t(on ? "integOn" : "integOff")) + "</span></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("integTitle")) + '</h1><p class="quiet">' + esc(t("integLead")) + "</p>" + msg + '<div class="dirgrid">' + cards + "</div></section>";
  }
  function explain(titleKey, bodyKey, view) {
    var go = '<div class="rowacts"><button type="button" class="ghost" data-view="' + view + '">' + esc(t("nav." + view)) + "</button></div>";
    return '<div class="panel"><h2>' + esc(t(titleKey)) + "</h2><p>" + esc(t(bodyKey)) + "</p>" + go + "</div>";
  }
  function viewResources() {
    return '<section class="block"><h1>' + esc(t("resTitle")) + '</h1><p class="quiet">' + esc(t("resLead")) + "</p>"
      + explain("topicGrid", "resGrid", "bots") + explain("topicDca", "resDca", "bots") + explain("topicLot", "resLot", "tax") + explain("topicAlert", "resAlert", "alerts") + "</section>";
  }
  function viewLearn() {
    return '<section class="block"><h1>' + esc(t("learnTitle")) + '</h1><p class="quiet">' + esc(t("learnLead")) + "</p>"
      + explain("topicGrid", "learnGrid", "bots") + explain("topicDca", "learnDca", "bots") + explain("topicLot", "learnLot", "tax") + explain("topicAlert", "learnAlert", "alerts") + "</section>";
  }
  function viewAccountants() {
    var lots = readArr("sr-room-lots").filter(function (r) {
      return r && typeof r.asset === "string" && (r.side === "buy" || r.side === "sell") && typeof r.qty === "number" && typeof r.price === "number" && typeof r.date === "string";
    });
    var report = costReport(lots);
    var rows = lots.map(function (r) {
      return "<tr><td>" + mono(r.date || "—") + "</td><td>" + esc(r.wallet || "—") + "</td><td>" + mono(r.asset) + "</td><td>" + esc(t("side." + r.side)) + "</td><td>" + mono(fmt(r.qty)) + "</td><td>" + mono(fmt(r.price)) + "</td></tr>";
    }).join("");
    var sums = Object.keys(report).map(function (a) {
      var box = report[a];
      return '<div class="panel"><h2>' + mono(a) + '</h2><dl class="stats">' + stat("taxRealized", box.realized) + '<div class="stat"><dt>' + esc(t("taxRemain")) + "</dt><dd>" + mono(fmt(box.remain)) + "</dd></div></dl></div>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("acctTitle")) + '</h1><p class="banner">' + esc(t("acctLead")) + "</p>"
      + (rows ? '<div class="tape-wrap"><table><thead><tr><th>' + esc(t("taxDate")) + "</th><th>" + esc(t("taxWallet")) + "</th><th>" + esc(t("taxAsset")) + "</th><th>" + esc(t("taxSide")) + "</th><th>" + esc(t("taxQty")) + "</th><th>" + esc(t("taxPrice")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>" + sums : '<p class="quiet">' + esc(t("taxEmpty")) + "</p>")
      + '<div class="rowacts"><button type="button" class="ghost" data-view="tax">' + esc(t("nav.tax")) + "</button></div></section>";
  }
  function exampleCards(rows) {
    return '<div class="dirgrid">' + rows.map(function (r) {
      return '<article class="dircard"><div class="cardtop"><h3>' + esc(t(r[0])) + '</h3><span class="pill">' + esc(t("exampleTag")) + '</span></div><p class="quiet">' + esc(t(r[1])) + "</p>" + (r[2] ? '<p>' + esc(t("exampleFig")) + " " + mono(r[2]) + "</p>" : "") + "</article>";
    }).join("") + "</div>";
  }
  function viewEarn() {
    return '<section class="block"><h1>' + esc(t("earnTitle")) + '</h1><p class="quiet">' + esc(t("earnLead")) + "</p>" + exampleCards([["earn1", "earn1n", "3%"], ["earn2", "earn2n", "5%"]]) + "</section>";
  }
  function viewRwa() {
    return '<section class="block"><h1>' + esc(t("rwaTitle")) + '</h1><p class="quiet">' + esc(t("rwaLead")) + "</p>" + exampleCards([["rwa1", "rwa1n", "1000"], ["rwa2", "rwa2n", "250"]]) + "</section>";
  }
  function viewCard() {
    return '<section class="block"><h1>' + esc(t("cardTitle")) + '</h1><p class="banner">' + esc(t("cardLead")) + "</p>" + exampleCards([["card1", "card1n", ""], ["card2", "card2n", ""]]) + "</section>";
  }
  function viewAi() {
    var saved = lsGet("sr-room-ai") || "";
    var msg = S.aiMsg ? '<p role="status">' + esc(t(S.aiMsg)) + "</p>" : "";
    var shown = saved ? '<div class="panel"><h2>' + esc(t("aiSavedTitle")) + '</h2><p class="isolate">' + esc(saved) + "</p></div>" : '<p class="quiet">' + esc(t("aiEmpty")) + "</p>";
    return '<section class="block"><h1>' + esc(t("aiTitle")) + '</h1><p class="banner">' + esc(t("aiLead")) + "</p>"
      + '<div class="fields">' + field("ai-note", "aiNote", S.aiText, "") + "</div>" + msg
      + '<div class="rowacts"><button type="button" class="solid" id="ai-save">' + esc(t("aiSave")) + "</button></div>" + shown + "</section>";
  }
  function viewPricing() {
    var picked = lsGet("sr-room-price") || "";
    var msg = S.priceMsg ? '<p role="status">' + esc(t(S.priceMsg)) + "</p>" : "";
    var cards = PLANS.map(function (p) {
      var on = picked === p.id ? ' aria-pressed="true"' : ' aria-pressed="false"';
