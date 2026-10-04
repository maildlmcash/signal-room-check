  function onEdit(e) {
    var el = e.target;
    if (!el) return;
    if (el.dataset && el.dataset.bag) {
      bag(el.dataset.bag)[el.dataset.key] = el.value;
      focus = { bag: el.dataset.bag, key: el.dataset.key, pos: typeof el.selectionStart === "number" ? el.selectionStart : null, id: null };
      restore = true;
      render();
      return;
    }
    var id = el.id;
    if (!id || !binds[id]) return;
    if (e.type === "change" && el.tagName !== "SELECT") { binds[id](el.value); return; }
    binds[id](el.value);
    focus = { id: id, pos: typeof el.selectionStart === "number" ? el.selectionStart : null, bag: null };
    restore = true;
    render();
  }
  document.addEventListener("input", onEdit);
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el) return;
    if (el.id === "g-sort") { S.gSort = el.value; render(); return; }
    if (el.id === "tax-wallet") { S.lotWallet = el.value; return; }
    if (el.id === "lot-asset") { S.lotAsset = el.value; return; }
    if (el.id === "tax-asset") { S.taxAsset = el.value; render(); return; }
    onEdit(e);
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-set-lang],[data-set-theme],[data-skip]")) return;
    var setq = e.target.closest("[data-set-q]");
    if (setq) { window.SR.q = setq.getAttribute("data-set-q"); render(); return; }
    var view = e.target.closest("[data-view]");
    if (view) { window.SR.view = view.getAttribute("data-view"); render(); return; }
    var pair = e.target.closest("[data-pair]");
    if (pair) { S.pair = pair.getAttribute("data-pair"); render(); return; }
    var side = e.target.closest("[data-side]");
    if (side) { S.side = side.getAttribute("data-side"); render(); return; }
    var pred = e.target.closest("[data-pred]");
    if (pred) { S.pred = pred.getAttribute("data-pred"); render(); return; }
    var dir = e.target.closest("[data-dir]");
    if (dir) { S.alertDir = dir.getAttribute("data-dir"); render(); return; }
    var lotSide = e.target.closest("[data-lotside]");
    if (lotSide) { S.lotSide = lotSide.getAttribute("data-lotside"); render(); return; }
    var gtag = e.target.closest("[data-g-tag]");
    if (gtag) { S.gTag = gtag.getAttribute("data-g-tag") || ""; render(); return; }
    var gopen = e.target.closest("[data-g-open]");
    if (gopen) {
      var gid = gopen.getAttribute("data-g-open");
      S.gOpen = gid;
      var card = GAINIUM.filter(function (c) { return c.id === gid; })[0];
      var modes = card ? modesOf(card) : ["grid"];
      if (modes.indexOf(S.gMode) === -1) S.gMode = modes[0];
      render();
      return;
    }
    if (e.target.closest("[data-g-close]")) { S.gOpen = ""; render(); return; }
    var gmode = e.target.closest("[data-gmode]");
    if (gmode) { S.gMode = gmode.getAttribute("data-gmode"); render(); return; }
    var ctab = e.target.closest("[data-ctab]");
    if (ctab) { S.cTab = ctab.getAttribute("data-ctab"); render(); return; }
    var popen = e.target.closest("[data-p-open]");
    if (popen) { S.pOpen = popen.getAttribute("data-p-open"); render(); return; }
    if (e.target.closest("[data-p-close]")) { S.pOpen = ""; render(); return; }
    var btab = e.target.closest("[data-btab]");
    if (btab) { S.bTab = btab.getAttribute("data-btab"); render(); return; }
    var bopen = e.target.closest("[data-b-open]");
    if (bopen) { S.bOpen = bopen.getAttribute("data-b-open"); render(); return; }
    if (e.target.closest("[data-b-close]")) { S.bOpen = ""; render(); return; }
    var market = e.target.closest("[data-market]");
    if (market) {
      var mid = market.getAttribute("data-market");
      var strategies = readArr("sr-room-strategies");
      strategies.push({ id: uid(), name: t("m." + mid), note: t("mLead." + mid) });
      if (!writeArr("sr-room-strategies", strategies)) { S.hMsg = "storeFail"; render(); return; }
      S.hMsg = "";
      render();
      return;
    }
    if (e.target.closest("#xfer-all")) { S.minUsd = ""; render(); return; }
    if (e.target.closest("#cookie-dismiss")) { lsSet("sr-room-cookie", "off"); render(); return; }
    if (e.target.closest("#trace-use")) { S.trace = EX; render(); return; }
    if (e.target.closest("#trace-clear")) { S.trace = ""; render(); return; }
    if (e.target.closest("#paper-add")) {
      var price = num(S.price), qty = num(S.qty);
      if (!(price > 0) || !(qty > 0)) { S.ticket = "notAdded"; render(); return; }
      S.blotter.unshift({ pair: S.pair, side: S.side, price: price, qty: qty, notional: price * qty });
      if (S.blotter.length > 8) S.blotter.pop();
      S.ticket = "added";
      render();
      return;
    }
    if (e.target.closest("#alert-add")) {
      var level = num(S.alertLevel), asset = S.alertAsset.trim();
      if (!asset || !(level > 0)) { S.alertMsg = "alertBad"; render(); return; }
      var check = String(S.alertCheck).trim() === "" ? null : num(S.alertCheck);
      if (check != null && !isFinite(check)) { S.alertMsg = "alertBad"; render(); return; }
      var alerts = readArr("sr-room-alerts");
      alerts.push({ id: uid(), asset: asset, dir: S.alertDir === "below" ? "below" : "above", level: level, check: check });
      if (!writeArr("sr-room-alerts", alerts)) { S.alertMsg = "storeFail"; render(); return; }
      S.alertAsset = ""; S.alertLevel = ""; S.alertCheck = ""; S.alertMsg = "";
      render();
      return;
    }
    var rmA = e.target.closest("[data-remove-alert]");
    if (rmA) { writeArr("sr-room-alerts", readArr("sr-room-alerts").filter(function (r) { return r.id !== rmA.getAttribute("data-remove-alert"); })); render(); return; }
    if (e.target.closest("#label-add")) {
      var addr = S.labelAddr.trim(), name = S.labelName.trim();
      if (!addr || !name) { S.labelMsg = "labelBad"; render(); return; }
      var labels = readArr("sr-room-labels");
      labels.push({ id: uid(), addr: addr, name: name });
      if (!writeArr("sr-room-labels", labels)) { S.labelMsg = "storeFail"; render(); return; }
      S.labelAddr = ""; S.labelName = ""; S.labelMsg = "";
      render();
      return;
    }
    var rmL = e.target.closest("[data-remove-label]");
    if (rmL) { writeArr("sr-room-labels", readArr("sr-room-labels").filter(function (r) { return r.id !== rmL.getAttribute("data-remove-label"); })); render(); return; }
    if (e.target.closest("#wallet-add")) {
      var wn = S.walletName.trim();
      if (!wn) { S.taxMsg = "walletBad"; render(); return; }
      var ws = readArr("sr-room-wallets");
      var wid = uid();
      ws.push({ id: wid, name: wn });
      if (!writeArr("sr-room-wallets", ws)) { S.taxMsg = "storeFail"; render(); return; }
      S.walletName = ""; S.lotWallet = wid; S.taxMsg = "";
      render();
      return;
    }
    var rmW = e.target.closest("[data-remove-wallet]");
    if (rmW) {
      var idW = rmW.getAttribute("data-remove-wallet");
      writeArr("sr-room-wallets", readArr("sr-room-wallets").filter(function (r) { return r.id !== idW; }));
      if (S.lotWallet === idW) S.lotWallet = "";
      render();
      return;
    }
    if (e.target.closest("#lot-add")) {
      var qtyL = num(S.lotQty), priceL = num(S.lotPrice);
      var walletsNow = readArr("sr-room-wallets");
      var chosen = walletsNow.filter(function (w) { return w.id === S.lotWallet; })[0];
      if (!chosen && walletsNow.length === 1) chosen = walletsNow[0];
      if (!chosen || !S.lotDate || !S.lotAsset || !(qtyL > 0) || !(priceL > 0)) { S.taxMsg = "taxBad"; render(); return; }
      var lots = readArr("sr-room-lots");
      lots.push({ id: uid(), date: S.lotDate, asset: S.lotAsset, wallet: chosen.name, side: S.lotSide === "sell" ? "sell" : "buy", qty: qtyL, price: priceL });
      if (!writeArr("sr-room-lots", lots)) { S.taxMsg = "storeFail"; render(); return; }
      S.lotQty = ""; S.lotPrice = ""; S.taxMsg = "";
      render();
      return;
    }
    var rmLot = e.target.closest("[data-remove-lot]");
    if (rmLot) { writeArr("sr-room-lots", readArr("sr-room-lots").filter(function (r) { return r.id !== rmLot.getAttribute("data-remove-lot"); })); render(); return; }
    if (e.target.closest("#strategy-add")) {
      var sn = S.hName.trim();
      if (!sn) { S.hMsg = "strategyBad"; render(); return; }
      var strategies2 = readArr("sr-room-strategies");
      strategies2.push({ id: uid(), name: sn, note: S.hNote.trim() });
      if (!writeArr("sr-room-strategies", strategies2)) { S.hMsg = "storeFail"; render(); return; }
      S.hName = ""; S.hNote = ""; S.hMsg = "";
      render();
      return;
    }
    var rmS = e.target.closest("[data-remove-strategy]");
    if (rmS) { writeArr("sr-room-strategies", readArr("sr-room-strategies").filter(function (r) { return r.id !== rmS.getAttribute("data-remove-strategy"); })); render(); return; }
    if (e.target.closest("#auth-save")) {
      var nm = S.authName.trim();
      if (!nm) { S.authMsg = "authNeed"; render(); return; }
      if (!lsSet("sr-room-session", JSON.stringify({ name: nm }))) { S.authMsg = "storeFail"; render(); return; }
      S.authMsg = "authSaved";
      render();
      return;
    }
    if (e.target.closest("#auth-check")) {
      var saved = session(), typed = S.authName.trim();
      if (!typed) { S.authMsg = "authNeed"; render(); return; }
      if (!saved) S.authMsg = "authNone";
      else if (saved.name === typed) S.authMsg = "authMatch";
      else S.authMsg = "authMiss";
      render();
      return;
    }
    if (e.target.closest("#auth-out")) {
      try { localStorage.removeItem("sr-room-session"); } catch (e2) {}
      S.authMsg = "authOut";
      render();
    }
  });
  window.SRX.initChrome();
  window.SR.onChange = function () { render(); };
  render();
