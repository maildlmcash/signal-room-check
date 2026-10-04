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
