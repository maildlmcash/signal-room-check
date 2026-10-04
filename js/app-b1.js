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
  function navHTML() {
    return '<nav class="primary-nav">' + NAV.map(function (id) {
      var on = window.SR.view === id || (id === "more" && MORE.indexOf(window.SR.view) !== -1);
      var attr = on ? ' aria-current="page"' : "";
      return '<button type="button" class="navitem" data-view="' + id + '"' + attr + ">" + esc(t("nav." + id)) + "</button>";
    }).join("") + "</nav>";
  }
  function authHTML() {
    var who = session();
    var name = who ? '<button type="button" class="ghost who" data-view="login">' + esc(who.name) + "</button>" : "";
    return '<div class="auth">' + name + '<button type="button" class="ghost" data-view="login">' + esc(t("login")) + '</button><button type="button" class="solid" data-view="signup">' + esc(t("signup")) + "</button></div>";
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
