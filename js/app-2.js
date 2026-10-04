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
      + '<div class="panel"><h2>' + mono(S.pair) + '</h2><p class="quiet">' + esc(t("noQuote")) + "</p>"
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
    var urls = ["url.ping", "url.time", "url.exchange", "url.tickerAll", "url.ticker", "url.kline"];
    var rows = urls.filter(function (k) { return hit([t(k)]); });
    var list = rows.map(function (k) { return "<li>" + mono(t(k)) + "</li>"; }).join("");
    return '<section class="block"><h1>' + esc(t("apiTitle")) + '</h1><p class="quiet">' + esc(t("apiLead")) + "</p><p>" + esc(t("apiLimit")) + "</p><p>" + esc(t("apiWeight")) + "</p>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("empty")) + "</p>") + "</section>";
  }
  function viewMore() {
    var buttons = SOURCES.map(function (it) { return '<button type="button" class="solid" data-view="' + it[0] + '">' + esc(t(it[1])) + "</button>"; }).join("");
    return '<section class="block"><h1>' + esc(t("moreTitle")) + '</h1><p class="quiet">' + esc(t("moreLead")) + "</p>" + held() + '<div class="rowacts">' + buttons + "</div></section>";
  }
  function costReport(lots) {
    var groups = {};
    lots.forEach(function (lot) { if (!groups[lot.asset]) groups[lot.asset] = []; groups[lot.asset].push(lot); });
    var out = {};
    Object.keys(groups).sort().forEach(function (asset) {
      var rows = groups[asset].slice().sort(function (a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return a.id < b.id ? -1 : 1;
      });
      var qty = 0, cost = 0, warn = false;
      var lines = rows.map(function (lot) {
        if (lot.side === "buy") {
          qty += lot.qty; cost += lot.qty * lot.price;
          return { lot: lot, basis: lot.qty * lot.price, gain: null };
        }
        var avg = qty > 0 ? cost / qty : 0;
        var matched = Math.min(lot.qty, qty);
        if (lot.qty > qty + 1e-12) warn = true;
        var basis = matched * avg;
        var gain = lot.qty * lot.price - basis;
        cost -= basis; qty -= matched;
        if (qty < 1e-10) { qty = 0; cost = 0; }
        return { lot: lot, basis: basis, gain: gain };
      });
      var realized = 0;
      lines.forEach(function (ln) { if (ln.gain != null) realized += ln.gain; });
      out[asset] = { lines: lines, remain: qty, avg: qty > 0 ? cost / qty : null, realized: realized, warn: warn };
    });
    return out;
  }
  function viewTax() {
    var wallets = readArr("sr-room-wallets").filter(function (w) { return w && typeof w.name === "string" && w.name; });
    var lots = readArr("sr-room-lots").filter(function (r) {
      return r && typeof r.asset === "string" && (r.side === "buy" || r.side === "sell") && typeof r.qty === "number" && typeof r.price === "number" && typeof r.date === "string";
    });
    if (S.lotWallet && !wallets.some(function (w) { return w.id === S.lotWallet; })) S.lotWallet = "";
    var report = costReport(lots);
    var assets = Object.keys(report);
    if (S.taxAsset !== "all" && assets.indexOf(S.taxAsset) === -1) S.taxAsset = "all";
    var wOpts = wallets.map(function (w) {
      return '<option value="' + esc(w.id) + '"' + (S.lotWallet === w.id ? " selected" : "") + ">" + esc(w.name) + "</option>";
    }).join("");
    var aOpts = ASSETS.map(function (a) {
      return '<option value="' + a + '"' + (S.lotAsset === a ? " selected" : "") + ">" + a + "</option>";
    }).join("");
    var options = '<option value="all"' + (S.taxAsset === "all" ? " selected" : "") + ">" + esc(t("taxAll")) + "</option>" + assets.map(function (a) {
      return '<option value="' + esc(a) + '"' + (S.taxAsset === a ? " selected" : "") + ">" + esc(a) + "</option>";
    }).join("");
    var shown = lots.filter(function (r) {
      if (S.taxAsset !== "all" && r.asset !== S.taxAsset) return false;
      return hit([r.date, r.asset, r.wallet || "", t("side." + r.side), String(r.qty), String(r.price)]);
    });
    var lineMap = {};
    Object.keys(report).forEach(function (asset) { report[asset].lines.forEach(function (ln) { lineMap[ln.lot.id] = ln; }); });
    var table = shown.map(function (r) {
      var ln = lineMap[r.id];
      var basis = ln ? fmt(ln.basis) : "—";
      var gain = ln && ln.gain != null ? fmt(ln.gain) : "—";
      return "<tr><td>" + mono(r.date) + "</td><td>" + esc(r.wallet || "—") + "</td><td>" + mono(r.asset) + "</td><td>" + esc(t("side." + r.side)) + "</td><td>" + mono(fmt(r.qty)) + "</td><td>" + mono(fmt(r.price)) + "</td><td>" + mono(basis) + "</td><td>" + mono(gain) + '</td><td><button type="button" class="ghost" data-remove-lot="' + esc(r.id) + '">' + esc(t("remove")) + "</button></td></tr>";
    }).join("");
    var summaries = (S.taxAsset === "all" ? assets : [S.taxAsset]).filter(function (a) { return report[a]; }).map(function (a) {
      var box = report[a];
      var avg = box.avg == null ? esc(t("noRemain")) : mono(fmt(box.avg));
      var warn = box.warn ? '<p class="bad">' + esc(t("taxWarn")) + "</p>" : "";
      return '<div class="panel"><h2>' + mono(a) + "</h2>" + warn + '<dl class="stats">' + statPlain("taxAvg", avg) + '<div class="stat"><dt>' + esc(t("taxRemain")) + "</dt><dd>" + mono(fmt(box.remain)) + "</dd></div>" + stat("taxRealized", box.realized) + "</dl></div>";
    }).join("");
    var msg = S.taxMsg ? '<p class="bad" role="alert">' + esc(t(S.taxMsg)) + "</p>" : "";
    var wList = wallets.map(function (w) {
      return '<li><span class="isolate">' + esc(w.name) + '</span> <button type="button" class="ghost" data-remove-wallet="' + esc(w.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("taxTitle")) + '</h1><p class="quiet">' + esc(t("taxLead")) + "</p><h2>" + esc(t("walletTitle")) + '</h2><p class="quiet">' + esc(t("walletLead")) + "</p>"
      + '<div class="fields">' + field("wallet-name", "walletName", S.walletName, "") + '</div><div class="rowacts"><button type="button" class="solid" id="wallet-add">' + esc(t("walletAdd")) + "</button></div>"
      + (wallets.length ? '<ul class="nodes">' + wList + "</ul>" : '<p class="quiet">' + esc(t("walletEmpty")) + "</p>")
      + "<h2>" + esc(t("txTitle")) + '</h2><p class="quiet">' + esc(t("taxOrder")) + "</p>"
      + '<div class="fields"><label class="field"><span>' + esc(t("taxWallet")) + '</span><select id="tax-wallet">' + (wallets.length ? wOpts : '<option value="">' + esc(t("walletEmpty")) + "</option>") + '</select></label>'
      + '<label class="field"><span>' + esc(t("taxAsset")) + '</span><select id="lot-asset">' + aOpts + "</select></label>" + field("lot-date", "taxDate", S.lotDate, 'type="date"') + "</div>"
      + pills("lotside", S.lotSide, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("lot-qty", "taxQty", S.lotQty, 'inputmode="decimal"') + field("lot-price", "taxPrice", S.lotPrice, 'inputmode="decimal"') + "</div>"
      + msg + '<div class="rowacts"><button type="button" class="solid" id="lot-add">' + esc(t("taxAdd")) + "</button></div>"
      + (lots.length ? "" : '<p class="quiet">' + esc(t("taxEmpty")) + "</p>")
      + "<h2>" + esc(t("reportTitle")) + '</h2><p class="quiet">' + esc(t("reportLead")) + "</p>"
      + '<label class="field"><span>' + esc(t("taxAsset")) + '</span><select id="tax-asset">' + options + "</select></label>"
      + (shown.length ? '<div class="tape-wrap"><table><thead><tr><th>' + esc(t("taxDate")) + "</th><th>" + esc(t("taxWallet")) + "</th><th>" + esc(t("taxAsset")) + "</th><th>" + esc(t("taxSide")) + "</th><th>" + esc(t("taxQty")) + "</th><th>" + esc(t("taxPrice")) + "</th><th>" + esc(t("taxCost")) + "</th><th>" + esc(t("taxGain")) + "</th><th>" + esc(t("remove")) + "</th></tr></thead><tbody>" + table + "</tbody></table></div>" : "")
      + (lots.length ? summaries : "") + "</section>";
  }
  function viewCommas() {
    var tabs = pills("ctab", S.cTab, [["dca", "c.dca"], ["grid", "c.grid"], ["smart", "c.smart"], ["signal", "c.signal"], ["terminal", "c.terminal"]]);
    var body = S.cTab === "grid" ? calcBody({ bag: "c-grid", kind: "grid" })
      : S.cTab === "smart" ? smartBody()
      : S.cTab === "signal" ? calcBody({ bag: "c-signal", kind: "signal" })
      : S.cTab === "terminal" ? '<p class="quiet">' + esc(t("terminalNote")) + "</p>" + calcBody({ bag: "c-terminal", kind: "signal" })
      : calcBody({ bag: "c-dca", kind: "dca" });
    return '<section class="block"><h1>' + esc(t("commasTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("commasLead")) + "</p>" + tabs + '<div class="panel">' + body + "</div></section>";
  }
  function viewPionex() {
    var open = PIONEX.filter(function (c) { return c.id === S.pOpen; })[0];
    var panel = open ? paperPanel("p." + open.id, calcBody({ bag: "p-" + open.id, kind: open.kind, lev: open.lev, reverse: open.reverse, fut: open.fut }), 'data-p-close="1"') : "";
    var cards = PIONEX.map(function (c) {
      var on = S.pOpen === c.id ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="dircard" data-p-open="' + c.id + '"' + on + "><strong>" + esc(t("p." + c.id)) + '</strong><span class="quiet">' + esc(t("openPaper")) + "</span></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("pionexTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("pionexLead")) + "</p>" + panel + '<div class="dirgrid">' + cards + "</div></section>";
  }
  function viewHopper() {
    var rows = readArr("sr-room-strategies").filter(function (r) { return r && typeof r.name === "string"; });
    var list = rows.map(function (r) {
      return '<li><strong class="isolate">' + esc(r.name) + '</strong><div class="quiet isolate">' + esc(r.note || "") + '</div><button type="button" class="ghost" data-remove-strategy="' + esc(r.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var market = MARKET.map(function (id) {
      return '<button type="button" class="dircard" data-market="' + id + '"><strong>' + esc(t("m." + id)) + '</strong><span class="quiet">' + esc(t("mLead." + id)) + '</span><span class="pill">' + esc(t("exampleTag")) + "</span></button>";
    }).join("");
    var msg = S.hMsg ? '<p class="bad" role="alert">' + esc(t(S.hMsg)) + "</p>" : "";
    var bt = gate("bt", ["start", "end", "fee"], function () {
      return window.SRCalc.backtestCalc({ start: val("bt", "start"), end: val("bt", "end"), fee: val("bt", "fee") });
    }, function (r) {
      return '<p class="banner">' + esc(t("paperLine")) + '</p><dl class="stats">' + stat("gross", r.gross) + stat("grossPct", r.grossPct) + stat("feeCost", r.feeCost) + stat("net", r.net) + stat("netPct", r.netPct) + "</dl>";
    });
    return '<section class="block"><h1>' + esc(t("hopperTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("hopperLead")) + "</p>"
      + "<h2>" + esc(t("marketTitle")) + '</h2><p class="quiet">' + esc(t("marketLead")) + '</p><div class="dirgrid">' + market + "</div>"
      + "<h2>" + esc(t("strategyTitle")) + "</h2>" + '<div class="fields">' + field("h-name", "strategyName", S.hName, "") + field("h-note", "strategyNote", S.hNote, "") + "</div>"
      + msg + '<div class="rowacts"><button type="button" class="solid" id="strategy-add">' + esc(t("strategyAdd")) + "</button></div>"
      + (rows.length ? '<ul class="nodes">' + list + "</ul>" : '<p class="quiet">' + esc(t("strategyEmpty")) + "</p>")
      + "<h2>" + esc(t("backtestTitle")) + '</h2><p class="quiet">' + esc(t("backtestLead")) + "</p>" + fset("bt", [["start", "btStart"], ["end", "btEnd"], ["fee", "feePct"]]) + bt + "</section>";
  }
  function viewBinance() {
    var tabs = pills("btab", S.bTab, [["all", "tab.all"], ["spot", "tab.spot"], ["futures", "tab.futures"]]);
    var rows = BINANCE.filter(function (c) { return S.bTab === "all" || c.market === S.bTab || c.market === "both"; });
    var open = BINANCE.filter(function (c) { return c.id === S.bOpen; })[0];
    if (open && rows.every(function (c) { return c.id !== open.id; })) open = null;
    var panel = open ? paperPanel("b." + open.id, calcBody({ bag: "b-" + open.id, kind: open.kind, fut: open.fut }), 'data-b-close="1"') : "";
    var cards = rows.map(function (c) {
      var on = open && S.bOpen === c.id ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return '<button type="button" class="dircard" data-b-open="' + c.id + '"' + on + "><strong>" + esc(t("b." + c.id)) + '</strong><span class="quiet">' + esc(t("openPaper")) + "</span></button>";
    }).join("");
    return '<section class="block"><h1>' + esc(t("binanceTitle")) + '</h1><p class="banner">' + esc(t("paperLine")) + '</p><p class="quiet">' + esc(t("binanceLead")) + "</p>" + tabs + panel + '<div class="dirgrid">' + cards + "</div></section>";
  }
  function viewAuth(kind) {
    var saved = session();
    var have = saved ? "<p>" + esc(t("authHave")) + ' <span class="isolate">' + esc(saved.name) + "</span></p>" : "";
    var msg = S.authMsg ? '<p role="status">' + esc(t(S.authMsg)) + "</p>" : "";
    var action = kind === "signup" ? '<button type="button" class="solid" id="auth-save">' + esc(t("authSave")) + "</button>" : '<button type="button" class="solid" id="auth-check">' + esc(t("authCheck")) + "</button>";
    var out = saved ? '<button type="button" class="ghost" id="auth-out">' + esc(t("signOut")) + "</button>" : "";
    var swap = kind === "signup" ? '<button type="button" class="ghost" data-view="login">' + esc(t("login")) + "</button>" : '<button type="button" class="ghost" data-view="signup">' + esc(t("signup")) + "</button>";
    return '<section class="block"><h1>' + esc(t(kind === "signup" ? "signupTitle" : "loginTitle")) + "</h1>" + held() + have
      + '<div class="fields">' + field("auth-name", "authName", S.authName, "") + "</div>" + msg + '<div class="rowacts">' + action + out + swap + "</div></section>";
  }
  function renderView() {
    var v = window.SR.view;
    if (v === "dex") return viewDex();
    if (v === "predictions") return viewPred();
    if (v === "tracer") return viewTrace();
    if (v === "visualizer") return viewViz();
    if (v === "alerts") return viewAlerts();
    if (v === "labels") return viewLabels();
    if (v === "api") return viewApi();
    if (v === "more") return viewMore();
    if (v === "tax") return viewTax();
    if (v === "gainium") return viewGainium();
    if (v === "commas") return viewCommas();
    if (v === "pionex") return viewPionex();
    if (v === "hopper") return viewHopper();
    if (v === "binance") return viewBinance();
    if (v === "login") return viewAuth("login");
    if (v === "signup") return viewAuth("signup");
    return viewHome();
  }
  function cookie() {
    if (lsGet("sr-room-cookie") === "off") return "";
    return '<aside class="cookiebar"><p>' + esc(t("cookie")) + '</p><button type="button" class="solid" id="cookie-dismiss">' + esc(t("cookieOk")) + "</button></aside>";
  }
  function render() {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.skip()
      + window.SRX.bar({ nav: navHTML(), mid: searchBox("q-bar", "find"), end: authHTML() })
      + sourceBar()
      + '<div class="wrap"><div id="main" tabindex="-1">' + renderView() + "</div></div>"
      + window.SRX.foot() + cookie();
    if (restore && focus.bag) {
      var bagEl = document.querySelector('[data-bag="' + focus.bag + '"][data-key="' + focus.key + '"]');
      if (bagEl) {
        bagEl.focus();
        if (typeof focus.pos === "number" && bagEl.setSelectionRange) { try { bagEl.setSelectionRange(focus.pos, focus.pos); } catch (e) {} }
      }
    } else if (restore && focus.id) {
      var el = document.getElementById(focus.id);
      if (el) {
        el.focus();
        if (typeof focus.pos === "number" && el.setSelectionRange) { try { el.setSelectionRange(focus.pos, focus.pos); } catch (e2) {} }
      }
    }
    restore = false;
  }
  var binds = {
    "q-bar": function (v) { window.SR.q = v; },
    "q-hero": function (v) { window.SR.q = v; },
    "q-viz": function (v) { window.SR.q = v; },
    "trace-q": function (v) { S.trace = v; },
    "dex-price": function (v) { S.price = v; },
    "dex-qty": function (v) { S.qty = v; },
    "alert-asset": function (v) { S.alertAsset = v; },
    "alert-level": function (v) { S.alertLevel = v; },
    "alert-check": function (v) { S.alertCheck = v; },
    "label-addr": function (v) { S.labelAddr = v; },
    "label-name": function (v) { S.labelName = v; },
    "lot-date": function (v) { S.lotDate = v; },
    "lot-qty": function (v) { S.lotQty = v; },
    "lot-price": function (v) { S.lotPrice = v; },
    "wallet-name": function (v) { S.walletName = v; },
    "auth-name": function (v) { S.authName = v; },
    "min-usd": function (v) { S.minUsd = v; },
    "g-search": function (v) { S.gq = v; },
    "h-name": function (v) { S.hName = v; },
    "h-note": function (v) { S.hNote = v; }
  };
