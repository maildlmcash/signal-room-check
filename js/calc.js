(function (root) {
  function num(v) {
    if (typeof v === "string" && v.trim() === "") return NaN;
    return Number(v);
  }
  function integer(v) {
    var n = num(v);
    return isFinite(n) && Math.floor(n) === n ? n : NaN;
  }
  function gridCalc(input) {
    input = input || {};
    var lower = num(input.lower);
    var upper = num(input.upper);
    var count = integer(input.count);
    var quote = num(input.quote);
    if (!isFinite(lower) || !isFinite(upper) || !isFinite(count) || !isFinite(quote)) return { ok: false, error: "bad" };
    if (!(lower > 0) || !(quote > 0)) return { ok: false, error: "bad" };
    if (!(upper > lower)) return { ok: false, error: "range" };
    if (!(count >= 2)) return { ok: false, error: "count" };
    if (count > 500) return { ok: false, error: "count" };
    var step = (upper - lower) / (count - 1);
    var lines = [];
    for (var i = 0; i < count; i++) lines.push(i === count - 1 ? upper : lower + step * i);
    var quotePerLine = quote / count;
    var profitPct = (step / lower) * 100;
    if (!isFinite(step) || !isFinite(quotePerLine) || !isFinite(profitPct)) return { ok: false, error: "bad" };
    if (!lines.every(function (n) { return isFinite(n); })) return { ok: false, error: "bad" };
    return { ok: true, step: step, lines: lines, quotePerLine: quotePerLine, profitPct: profitPct };
  }
  function dcaCalc(input) {
    input = input || {};
    var start = num(input.start);
    var base = num(input.base);
    var safety = integer(input.safety);
    var drop = num(input.drop);
    var scale = num(input.scale);
    if (!isFinite(start) || !isFinite(base) || !isFinite(safety) || !isFinite(drop) || !isFinite(scale)) return { ok: false, error: "bad" };
    if (!(start > 0) || !(base > 0) || !(scale > 0)) return { ok: false, error: "bad" };
    if (safety < 0 || safety > 40) return { ok: false, error: "bad" };
    if (!(drop > 0) || !(drop < 100)) return { ok: false, error: "bad" };
    var orders = [];
    var totalQuote = 0;
    var totalQty = 0;
    for (var i = 0; i <= safety; i++) {
      var price = start * Math.pow(1 - drop / 100, i);
      var quote = base * Math.pow(scale, i);
      if (!isFinite(price) || !(price > 0) || !isFinite(quote)) return { ok: false, error: "bad" };
      var qty = quote / price;
      if (!isFinite(qty)) return { ok: false, error: "bad" };
      orders.push({ price: price, quote: quote, qty: qty, safety: i > 0 });
      totalQuote += quote;
      totalQty += qty;
    }
    var avg = totalQuote / totalQty;
    if (!isFinite(totalQuote) || !isFinite(avg)) return { ok: false, error: "bad" };
    return { ok: true, orders: orders, totalQuote: totalQuote, avg: avg };
  }
  var api = { gridCalc: gridCalc, dcaCalc: dcaCalc };
  root.SRCalc = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
