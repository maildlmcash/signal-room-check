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
    if (v === "markets") return viewMarkets();
    if (v === "spot") return viewSpot();
    if (v === "futures") return viewFutures();
    if (v === "bots") return viewBots();
    if (v === "integrations") return viewIntegrations();
    if (v === "resources") return viewResources();
    if (v === "accountants") return viewAccountants();
    if (v === "earn") return viewEarn();
    if (v === "rwa") return viewRwa();
    if (v === "card") return viewCard();
    if (v === "ai") return viewAi();
    if (v === "pricing") return viewPricing();
    if (v === "marketplace") return viewMarketplace();
    if (v === "learn") return viewLearn();
    if (v === "features") return viewFeatures();
    if (v === "solutions") return viewSolutions();
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
    "h-note": function (v) { S.hNote = v; },
    "mkt-q": function (v) { S.mq = v; },
    "fut-lev": function (v) { S.lev = v; },
    "plan-name": function (v) { S.planName = v; },
    "plan-note": function (v) { S.planNote = v; },
    "ai-note": function (v) { S.aiText = v; }
  };
