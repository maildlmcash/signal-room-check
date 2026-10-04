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
