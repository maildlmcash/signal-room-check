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
    return '<div class="panel lux-card"><h2>' + esc(t(titleKey)) + '</h2><p class="banner">' + esc(t("paperLine")) + "</p>" + inner + '<div class="rowacts"><button type="button" class="ghost" ' + closeAttr + ">" + esc(t("closePanel")) + "</button></div></div>";
  }
