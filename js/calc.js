(function (root) {
  function num(v) {
    if (typeof v === "string" && v.trim() === "") return NaN;
    return Number(v);
  }
  function integer(v) {
    var n = num(v);
    return isFinite(n) && Math.floor(n) === n ? n : NaN;
  }
  function bad(code) { return { ok: false, error: code || "bad" }; }
  function gridCalc(input) {
    input = input || {};
    var lower = num(input.lower);
    var upper = num(input.upper);
    var count = integer(input.count);
    var quote = num(input.quote);
    if (!isFinite(lower) || !isFinite(upper) || !isFinite(count) || !isFinite(quote)) return bad();
    if (!(lower > 0) || !(quote > 0)) return bad();
    if (!(upper > lower)) return bad("range");
    if (!(count >= 2) || count > 500) return bad("count");
    var step = (upper - lower) / (count - 1);
    var lines = [];
    for (var i = 0; i < count; i++) lines.push(i === count - 1 ? upper : lower + step * i);
    var quotePerLine = quote / count;
    var profitPct = (step / lower) * 100;
    if (!isFinite(step) || !isFinite(quotePerLine) || !isFinite(profitPct)) return bad();
    if (!lines.every(function (n) { return isFinite(n); })) return bad();
    return { ok: true, step: step, lines: lines, quotePerLine: quotePerLine, profitPct: profitPct };
  }
  function dcaCalc(input) {
    input = input || {};
    var start = num(input.start);
    var base = num(input.base);
    var safety = integer(input.safety);
    var drop = num(input.drop);
    var scale = num(input.scale);
    if (!isFinite(start) || !isFinite(base) || !isFinite(safety) || !isFinite(drop) || !isFinite(scale)) return bad();
    if (!(start > 0) || !(base > 0) || !(scale > 0)) return bad();
    if (safety < 0 || safety > 40) return bad();
    if (!(drop > 0) || !(drop < 100)) return bad();
    var orders = [];
    var totalQuote = 0;
    var totalQty = 0;
    for (var i = 0; i <= safety; i++) {
      var price = start * Math.pow(1 - drop / 100, i);
      var quote = base * Math.pow(scale, i);
      if (!isFinite(price) || !(price > 0) || !isFinite(quote)) return bad();
      var qty = quote / price;
      if (!isFinite(qty)) return bad();
      orders.push({ price: price, quote: quote, qty: qty, safety: i > 0 });
      totalQuote += quote;
      totalQty += qty;
    }
    var avg = totalQuote / totalQty;
    if (!isFinite(totalQuote) || !isFinite(avg)) return bad();
    return { ok: true, orders: orders, totalQuote: totalQuote, avg: avg };
  }
  function smartCalc(input) {
    input = input || {};
    var entry = num(input.entry);
    var qty = num(input.qty);
    var stop = num(input.stop);
    if (!(entry > 0) || !(qty > 0) || !(stop > 0)) return bad();
    var steps = input.steps || [];
    var used = 0;
    var rows = [];
    var realized = 0;
    for (var i = 0; i < steps.length; i++) {
      var rawP = steps[i].price;
      var rawC = steps[i].pct;
      if (String(rawP).trim() === "" && String(rawC).trim() === "") continue;
      var price = num(rawP);
      var pct = num(rawC);
      if (!(price > 0) || !(pct > 0) || pct > 100) return bad();
      used += pct;
      if (used > 100 + 1e-9) return bad("pct");
      var q = qty * pct / 100;
      var gain = (price - entry) * q;
      if (!isFinite(gain) || !isFinite(q)) return bad();
      realized += gain;
      rows.push({ price: price, pct: pct, qty: q, gain: gain });
    }
    var leftQty = qty * (100 - used) / 100;
    var stopGain = (stop - entry) * leftQty;
    if (!isFinite(stopGain) || !isFinite(realized)) return bad();
    return { ok: true, rows: rows, realized: realized, stopGain: stopGain, leftQty: leftQty };
  }
  function rebalanceCalc(input) {
    input = input || {};
    var a = num(input.a);
    var b = num(input.b);
    var target = num(input.target);
    if (!isFinite(a) || !isFinite(b) || !isFinite(target)) return bad();
    if (a < 0 || b < 0 || target < 0 || target > 100) return bad();
    var total = a + b;
    if (!(total > 0)) return bad();
    var wantA = total * target / 100;
    var wantB = total - wantA;
    return { ok: true, total: total, wantA: wantA, wantB: wantB, move: wantA - a };
  }
  function twapCalc(input) {
    input = input || {};
    var total = num(input.total);
    var parts = integer(input.parts);
    var first = num(input.first);
    var last = num(input.last);
    if (!(total > 0) || !(first > 0) || !(last > 0)) return bad();
    if (!(parts >= 2) || parts > 60) return bad("count");
    var slice = total / parts;
    var rows = [];
    var qty = 0;
    for (var i = 0; i < parts; i++) {
      var price = first + (last - first) * i / (parts - 1);
      var q = slice / price;
      if (!(price > 0) || !isFinite(q)) return bad();
      qty += q;
      rows.push({ price: price, quote: slice, qty: q });
    }
    var avg = total / qty;
    if (!isFinite(avg)) return bad();
    return { ok: true, rows: rows, avg: avg, total: total, qty: qty };
  }
  function backtestCalc(input) {
    input = input || {};
    var start = num(input.start);
    var end = num(input.end);
    var fee = num(input.fee);
    if (!(start > 0) || !(end > 0) || !isFinite(fee)) return bad();
    if (fee < 0 || fee >= 100) return bad();
    var gross = end - start;
    var feeCost = (start + end) * (fee / 100);
    var net = gross - feeCost;
    if (!isFinite(net) || !isFinite(feeCost)) return bad();
    return { ok: true, gross: gross, feeCost: feeCost, net: net, grossPct: (gross / start) * 100, netPct: (net / start) * 100 };
  }
  function arbCalc(input) {
    input = input || {};
    var buy = num(input.buy);
    var sell = num(input.sell);
    var qty = num(input.qty);
    var fee = num(input.fee);
    if (!(buy > 0) || !(sell > 0) || !(qty > 0) || !isFinite(fee)) return bad();
    if (fee < 0 || fee >= 100) return bad();
    var gross = (sell - buy) * qty;
    var feeCost = (buy + sell) * qty * (fee / 100);
    var net = gross - feeCost;
    if (!isFinite(net)) return bad();
    return { ok: true, gross: gross, feeCost: feeCost, net: net };
  }
  function vpCalc(input) {
    input = input || {};
    var qty = num(input.qty);
    var part = num(input.part);
    var bar = num(input.bar);
    if (!(qty > 0) || !(part > 0) || part > 100 || !(bar > 0)) return bad();
    var child = bar * part / 100;
    if (!(child > 0) || !isFinite(child)) return bad();
    var bars = Math.ceil(qty / child);
    if (!isFinite(bars) || bars > 100000) return bad();
    var last = qty - child * (bars - 1);
    return { ok: true, child: child, bars: bars, last: last };
  }
  function infinityCalc(input) {
    input = input || {};
    var lower = num(input.lower);
    var stepPct = num(input.step);
    var count = integer(input.count);
    var quote = num(input.quote);
    if (!(lower > 0) || !(stepPct > 0) || !(stepPct < 100) || !(quote > 0)) return bad();
    if (!(count >= 2) || count > 500) return bad("count");
    var lines = [];
    for (var i = 0; i < count; i++) lines.push(lower * Math.pow(1 + stepPct / 100, i));
    if (!lines.every(function (n) { return isFinite(n) && n > 0; })) return bad();
    return { ok: true, lines: lines, step: lines[1] - lines[0], quotePerLine: quote / count, profitPct: stepPct };
  }
  function trailCalc(input) {
    input = input || {};
    var mark = num(input.mark);
    var trail = num(input.trail);
    if (!(mark > 0) || !(trail > 0) || !(trail < 100)) return bad();
    var trigger = mark * (1 - trail / 100);
    if (!isFinite(trigger)) return bad();
    return { ok: true, trigger: trigger };
  }
  function stopLimitCalc(input) {
    input = input || {};
    var mark = num(input.mark);
    var stop = num(input.stop);
    var limit = num(input.limit);
    var qty = num(input.qty);
    if (!(mark > 0) || !(stop > 0) || !(limit > 0) || !(qty > 0)) return bad();
    var notional = limit * qty;
    if (!isFinite(notional)) return bad();
    return { ok: true, armed: mark <= stop, notional: notional, gap: limit - stop };
  }
  function notionCalc(input) {
    input = input || {};
    var price = num(input.price);
    var qty = num(input.qty);
    if (!(price > 0) || !(qty > 0)) return bad();
    var notional = price * qty;
    if (!isFinite(notional)) return bad();
    return { ok: true, notional: notional };
  }
  var api = {
    gridCalc: gridCalc,
    dcaCalc: dcaCalc,
    smartCalc: smartCalc,
    rebalanceCalc: rebalanceCalc,
    twapCalc: twapCalc,
    backtestCalc: backtestCalc,
    arbCalc: arbCalc,
    vpCalc: vpCalc,
    infinityCalc: infinityCalc,
    trailCalc: trailCalc,
    stopLimitCalc: stopLimitCalc,
    notionCalc: notionCalc
  };
  root.SRCalc = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
