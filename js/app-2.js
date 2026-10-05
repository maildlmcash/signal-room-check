  function viewDex() {
    var pairs = PAIRS.filter(function (p) { return hit([p, t("noQuote")]); });
    var buttons = pairs.map(function (p) {
      var on = S.pair === p ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="pairbtn" data-pair="' + p + '"' + on + ">" + mono(p) + "</button>";
    }).join("");
    var price = num(S.price);
    var qty = num(S.qty);
    var live = "";
    if (String(S.price).trim() !== "" || String(S.qty).trim() !== "") {
      if (!(price > 0) || !(qty > 0)) live = '<p class="bad" role="alert">' + esc(t("previewNeed")) + "</p>";
      else live = "<p>" + esc(t("notional")) + " " + mono(fmt(price * qty)) + "</p>";
    }
    var note = S.ticket ? '<p role="status">' + esc(t(S.ticket)) + "</p>" : "";
    var blot = S.blotter.length ? '<ol class="blotter">' + S.blotter.map(function (b) {
      return "<li>" + mono(b.pair) + " " + esc(t("side." + b.side)) + " " + mono(fmt(b.qty)) + " @ " + mono(fmt(b.price)) + " " + esc(t("notional")) + " " + mono(fmt(b.notional)) + "</li>";
    }).join("") + "</ol>" : '<p class="quiet">' + esc(t("blotterEmpty")) + "</p>";
    return '<section class="block"><h1>' + esc(t("dexTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("dexLead")) + "</p>"
      + (qnorm() ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(pairs.length)) + "</p>" : "")
      + (pairs.length ? '<div class="modes">' + buttons + "</div>" : '<p class="quiet">' + esc(t("empty")) + "</p>")
      + '<div class="panel lux-card"><h2>' + mono(S.pair) + '</h2><p class="quiet">' + esc(t("noQuote")) + "</p>"
      + pills("side", S.side, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("dex-price", "dexPrice", S.price, 'inputmode="decimal"') + field("dex-qty", "dexQty", S.qty, 'inputmode="decimal"') + "</div>"
      + live + '<div class="rowacts"><button type="button" class="solid" id="paper-add">' + esc(t("preview")) + "</button></div>" + note
      + "<h2>" + esc(t("blotter")) + "</h2>" + blot + "</div></section>";
  }
  function viewTrace() {
    var show = S.trace.trim() === EX;
    var body = "";
    if (!S.trace.trim()) body = '<p class="quiet">' + esc(t("traceLead")) + "</p>";
    else if (!show) body = '<p class="bad" role="status">' + esc(t("traceMiss")) + "</p>";
    else body = '<p class="ok">' + esc(t("traceHit")) + '</p><ol class="hops">' + HOPS.map(function (h) { return "<li>" + esc(t(h[0])) + " " + esc(t("toWord")) + " " + esc(t(h[1])) + "</li>"; }).join("") + "</ol>";
    return '<section class="block"><h1>' + esc(t("traceTitle")) + "</h1>" + held() + "<p>" + esc(t("traceLabel")) + " " + mono(EX) + "</p>"
      + '<div class="fields">' + field("trace-q", "traceLabel", S.trace, "") + "</div>"
      + '<div class="rowacts"><button type="button" class="solid" id="trace-use">' + esc(t("traceUse")) + '</button><button type="button" class="ghost" id="trace-clear">' + esc(t("traceClear")) + "</button></div>" + body + "</section>";
  }
  function viewViz() {
    var nodes = NODES.filter(function (n) {
      var names = [t("ex." + n.id), t("kind." + n.kind), t("linked")].concat(n.links.map(function (id) { return t("ex." + id); }));
      if (n.id === "addr") names.push(EX);
      return hit(names);
    });
    var list = nodes.map(function (n) {
      var links = n.links.map(function (id) { return t("ex." + id); }).join(", ");
      var addr = n.id === "addr" ? " " + mono(EX) : "";
      return "<li><strong>" + esc(t("ex." + n.id)) + "</strong>" + addr + '<div class="quiet">' + esc(t("kind." + n.kind)) + " · " + esc(t("linked")) + " " + esc(links) + "</div></li>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("vizTitle")) + '</h1><p class="quiet">' + esc(t("vizLead")) + "</p>" + searchBox("q-viz", "find")
      + (qnorm() ? '<p class="quiet">' + esc(t("hits")) + " " + mono(String(nodes.length)) + "</p>" : "")
      + (nodes.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
  function viewAlerts() {
    var rows = readArr("sr-room-alerts").filter(function (a) {
      return a && typeof a.asset === "string" && (a.dir === "above" || a.dir === "below") && typeof a.level === "number";
    }).filter(function (a) { return hit([a.asset, t("dir." + a.dir), String(a.level), a.check == null ? "" : String(a.check)]); });
    var list = rows.map(function (a) {
      var state = typeof a.check !== "number" || !isFinite(a.check) ? t("alertNone") : (a.dir === "above" ? a.check >= a.level : a.check <= a.level) ? t("alertMet") : t("alertWait");
      return "<li>" + mono(a.asset) + " " + esc(t("dir." + a.dir)) + " " + mono(fmt(a.level)) + (typeof a.check === "number" ? " " + mono(fmt(a.check)) : "") + "<div>" + esc(state) + '</div><button type="button" class="ghost" data-remove-alert="' + esc(a.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var msg = S.alertMsg ? '<p class="bad" role="alert">' + esc(t(S.alertMsg)) + "</p>" : "";
    return '<section class="block"><h1>' + esc(t("alertsTitle")) + '</h1><p class="quiet">' + esc(t("alertsLead")) + "</p>"
      + '<div class="fields">' + field("alert-asset", "alertAsset", S.alertAsset, "") + "</div>"
      + pills("dir", S.alertDir, [["above", "dir.above"], ["below", "dir.below"]])
      + '<div class="fields">' + field("alert-level", "alertLevel", S.alertLevel, 'inputmode="decimal"') + field("alert-check", "alertCheck", S.alertCheck, 'inputmode="decimal"') + "</div>"
      + msg + '<button type="button" class="solid" id="alert-add">' + esc(t("add")) + "</button>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("alertEmpty")) + "</p>") + "</section>";
  }
  function viewLabels() {
    var rows = readArr("sr-room-labels").filter(function (r) { return r && typeof r.addr === "string" && typeof r.name === "string"; }).filter(function (r) { return hit([r.addr, r.name]); });
    var list = rows.map(function (r) {
      return "<li>" + mono(r.addr) + ' <span class="isolate">' + esc(r.name) + '</span> <button type="button" class="ghost" data-remove-label="' + esc(r.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var msg = S.labelMsg ? '<p class="bad" role="alert">' + esc(t(S.labelMsg)) + "</p>" : "";
    return '<section class="block"><h1>' + esc(t("labelsTitle")) + '</h1><p class="quiet">' + esc(t("labelsLead")) + "</p>"
      + '<div class="fields">' + field("label-addr", "labelAddr", S.labelAddr, "") + field("label-name", "labelName", S.labelName, "") + "</div>"
      + msg + '<button type="button" class="solid" id="label-add">' + esc(t("add")) + "</button>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("labelEmpty")) + "</p>") + "</section>";
  }
  function viewApi() {
    var urls = ["apiEx.ping", "apiEx.time", "apiEx.info", "apiEx.price", "apiEx.bars"];
    var rows = urls.filter(function (k) { return hit([t(k)]); });
    var list = rows.map(function (k) { return "<li>" + mono(t(k)) + "</li>"; }).join("");
    return '<section class="block"><h1>' + esc(t("apiTitle")) + '</h1><p class="quiet">' + esc(t("apiLead")) + "</p><p>" + esc(t("apiLimit")) + "</p><p>" + esc(t("apiWeight")) + "</p>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
  function viewMore() {
    var buttons = MORE.map(function (id) {
      return '<button type="button" class="dircard" data-view="' + id + '"><strong>' + esc(t("moreItem." + id)) + "</strong></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("moreTitle")) + '</h1><p class="quiet">' + esc(t("moreLead")) + "</p>" + held() + '<div class="dirgrid lux-grid">' + buttons + "</div></section>";
  }
