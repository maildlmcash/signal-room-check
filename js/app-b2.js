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
