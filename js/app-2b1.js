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
      return '<div class="panel lux-card"><h2>' + mono(a) + "</h2>" + warn + '<dl class="stats">' + statPlain("taxAvg", avg) + '<div class="stat"><dt>' + esc(t("taxRemain")) + "</dt><dd>" + mono(fmt(box.remain)) + "</dd></div>" + stat("taxRealized", box.realized) + "</dl></div>";
    }).join("");
    var msg = S.taxMsg ? '<p class="bad" role="alert">' + esc(t(S.taxMsg)) + "</p>" : "";
    var wList = wallets.map(function (w) {
      return '<li><span class="isolate">' + esc(w.name) + '</span> <button type="button" class="ghost" data-remove-wallet="' + esc(w.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("");
    var steps = '<ol class="steps"><li><strong>' + esc(t("step1")) + '</strong><span class="quiet">' + esc(t("step1Lead")) + '</span></li><li><strong>' + esc(t("step2")) + '</strong><span class="quiet">' + esc(t("step2Lead")) + '</span></li><li><strong>' + esc(t("step3")) + '</strong><span class="quiet">' + esc(t("step3Lead")) + "</span></li></ol>";
    return '<section class="block"><h1>' + esc(t("taxTitle")) + '</h1><p class="quiet">' + esc(t("taxLead")) + "</p>" + steps + '<h2>' + esc(t("step1")) + '</h2><p class="quiet">' + esc(t("step1Lead")) + '</p><h2>' + esc(t("walletTitle")) + '</h2><p class="quiet">' + esc(t("walletLead")) + "</p>"
      + '<div class="fields">' + field("wallet-name", "walletName", S.walletName, "") + '</div><div class="rowacts"><button type="button" class="solid" id="wallet-add">' + esc(t("walletAdd")) + "</button></div>"
      + (wallets.length ? '<ul class="nodes">' + wList + "</ul>" : '<p class="quiet">' + esc(t("walletEmpty")) + "</p>")
      + "<h2>" + esc(t("txTitle")) + '</h2><p class="quiet">' + esc(t("taxOrder")) + "</p>"
      + '<div class="fields"><label class="field"><span>' + esc(t("taxWallet")) + '</span><select id="tax-wallet">' + (wallets.length ? wOpts : '<option value="">' + esc(t("walletEmpty")) + "</option>") + '</select></label>'
      + '<label class="field"><span>' + esc(t("taxAsset")) + '</span><select id="lot-asset">' + aOpts + "</select></label>" + field("lot-date", "taxDate", S.lotDate, 'type="date"') + "</div>"
      + pills("lotside", S.lotSide, [["buy", "side.buy"], ["sell", "side.sell"]])
      + '<div class="fields">' + field("lot-qty", "taxQty", S.lotQty, 'inputmode="decimal"') + field("lot-price", "taxPrice", S.lotPrice, 'inputmode="decimal"') + "</div>"
      + msg + '<div class="rowacts"><button type="button" class="solid" id="lot-add">' + esc(t("taxAdd")) + "</button></div>"
      + (lots.length ? "" : '<p class="quiet">' + esc(t("taxEmpty")) + "</p>")
      + "<h2>" + esc(t("step2")) + '</h2><p class="quiet">' + esc(t("step2Lead")) + "</p>" + (lots.length ? summaries : "") + "<h2>" + esc(t("step3")) + "</h2><h2>" + esc(t("reportTitle")) + '</h2><p class="quiet">' + esc(t("reportLead")) + "</p>"
      + '<label class="field"><span>' + esc(t("taxAsset")) + '</span><select id="tax-asset">' + options + "</select></label>"
      + (shown.length ? '<div class="tape-wrap lux-table-wrap"><table><thead><tr><th>' + esc(t("taxDate")) + "</th><th>" + esc(t("taxWallet")) + "</th><th>" + esc(t("taxAsset")) + "</th><th>" + esc(t("taxSide")) + "</th><th>" + esc(t("taxQty")) + "</th><th>" + esc(t("taxPrice")) + "</th><th>" + esc(t("taxCost")) + "</th><th>" + esc(t("taxGain")) + "</th><th>" + esc(t("remove")) + "</th></tr></thead><tbody>" + table + "</tbody></table></div>" : "")
      + "</section>";
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
