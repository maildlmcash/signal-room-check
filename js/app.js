(function () {
  var t = function (k) { return window.SRX.t(k); };
  var esc = function (s) { return window.SRX.esc(s); };
  var SR = window.SR;

  var CATALOG = [
    { id: "btc", kind: "asset", ticker: "BTC", nameKey: "name.btc", netKey: "net.btc" },
    { id: "eth", kind: "asset", ticker: "ETH", nameKey: "name.eth", netKey: "net.eth" },
    { id: "sol", kind: "asset", ticker: "SOL", nameKey: "name.sol", netKey: "net.sol" },
    { id: "xrp", kind: "asset", ticker: "XRP", nameKey: "name.xrp", netKey: "net.xrp" },
    { id: "bnb", kind: "asset", ticker: "BNB", nameKey: "name.bnb", netKey: "net.bnb" },
    { id: "doge", kind: "asset", ticker: "DOGE", nameKey: "name.doge", netKey: "net.doge" },
    { id: "ada", kind: "asset", ticker: "ADA", nameKey: "name.ada", netKey: "net.ada" },
    { id: "avax", kind: "asset", ticker: "AVAX", nameKey: "name.avax", netKey: "net.avax" },
    { id: "link", kind: "asset", ticker: "LINK", nameKey: "name.link", netKey: "net.link" },
    { id: "usdt", kind: "asset", ticker: "USDT", nameKey: "name.usdt", netKey: "net.usdt" },
    { id: "binance", kind: "venue", ticker: "", nameKey: "name.binance", netKey: "net.venue" },
    { id: "bybit", kind: "venue", ticker: "", nameKey: "name.bybit", netKey: "net.venue" },
    { id: "coinbase", kind: "venue", ticker: "", nameKey: "name.coinbase", netKey: "net.venue" },
    { id: "okx", kind: "venue", ticker: "", nameKey: "name.okx", netKey: "net.venue" },
    { id: "kraken", kind: "venue", ticker: "", nameKey: "name.kraken", netKey: "net.venue" }
  ];

  function entity(id) {
    for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
    return null;
  }
  function kindKey(e) { return e && e.kind === "venue" ? "kind.venue" : "kind.asset"; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function readArr(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function writeArr(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {}
  }
  function readObj(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function writeObj(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {}
  }
  function freshForm() {
    return {
      grid: { lower: "", upper: "", count: "", quote: "" },
      dca: { start: "", base: "", safety: "", drop: "", scale: "" },
      xfer: { time: "", from: "", to: "", asset: "", amount: "" },
      tax: { date: "", asset: "", side: "buy", qty: "", price: "" },
      alert: { asset: "btc", dir: "above", level: "" },
      pos: { price: "", qty: "", fee: "" }
    };
  }
  function setPath(obj, path, value) {
    var parts = path.split(".");
    var node = obj;
    for (var i = 0; i < parts.length - 1; i++) node = node[parts[i]];
    node[parts[parts.length - 1]] = value;
  }
  function val(path) {
    var parts = path.split(".");
    var node = SR.form;
    for (var i = 0; i < parts.length; i++) node = node[parts[i]];
    return esc(node == null ? "" : node);
  }
  function qtext() { return (SR.q || "").trim().toLowerCase(); }
  function fmt(n) {
    if (!isFinite(n)) return "—";
    var neg = n < 0;
    var a = Math.abs(n);
    var s = a === 0 ? "0" : a >= 1000 ? a.toFixed(2) : a >= 1 ? a.toFixed(4) : a.toFixed(8);
    s = s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    return (neg ? "-" : "") + s;
  }
  function numHTML(n) { return '<span class="num" dir="ltr">' + esc(fmt(n)) + "</span>"; }
  function gainHTML(n) {
    var cls = n > 0 ? "up" : n < 0 ? "down" : "";
    return '<span class="num ' + cls + '" dir="ltr">' + esc(fmt(n)) + "</span>";
  }
  function pctHTML(n) { return '<span class="num" dir="ltr">' + esc(fmt(n)) + "%</span>"; }
  function stat(label, valueHTML) {
    return "<div><dt>" + esc(label) + "</dt><dd>" + valueHTML + "</dd></div>";
  }
  function anyFilled(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) if (String(obj[keys[i]]).trim() !== "") return true;
    return false;
  }
  function errText(code) {
    if (code === "range") return t("errRange");
    if (code === "count") return t("errCount");
    return t("errBad");
  }
  function matchEntity(e, q) {
    if (!q) return true;
    var blob = [t(e.nameKey), t(e.netKey), t(kindKey(e)), e.ticker, e.id].join(" ").toLowerCase();
    return blob.indexOf(q) !== -1;
  }
  function tagHTML(e) {
    var html = '<span class="tag">' + esc(t(kindKey(e))) + '</span><span class="tag">' + esc(t("tag.major")) + "</span>";
    if (e.ticker) html += '<span class="tag ltr" dir="ltr">' + esc(e.ticker) + "</span>";
    return html;
  }
  function cardHTML(e) {
    var on = SR.openId === e.id;
    var tickerFig = e.ticker
      ? '<b class="ltr" dir="ltr">' + esc(e.ticker) + "</b>"
      : "<b>" + esc(t("noTicker")) + "</b>";
    return '<button type="button" class="tcard" data-open="' + esc(e.id) + '" aria-pressed="' + (on ? "true" : "false") + '">'
      + "<h3>" + esc(t(e.nameKey)) + "</h3>"
      + '<p class="tags">' + tagHTML(e) + "</p>"
      + '<p class="meta"><span>' + esc(t("detailNet")) + "</span><b>" + esc(t(e.netKey)) + "</b></p>"
      + '<p class="meta"><span>' + esc(t("tokTicker")) + "</span>" + tickerFig + "</p></button>";
  }
  function detailHTML(e) {
    var actions = '<button type="button" data-act="open-x" data-dest="transfers" data-id="' + esc(e.id) + '">' + esc(t("actTransfers")) + "</button>";
    if (e.kind === "asset") {
      actions += '<button type="button" data-act="open-x" data-dest="tokens" data-id="' + esc(e.id) + '">' + esc(t("actToken")) + "</button>";
      actions += '<button type="button" data-act="open-x" data-dest="bots" data-id="' + esc(e.id) + '">' + esc(t("actBot")) + "</button>";
    }
    return '<section class="detail"><h2>' + esc(t(e.nameKey)) + "</h2>"
      + '<p class="tags">' + tagHTML(e) + "</p>"
      + '<p class="meta"><span>' + esc(t("detailKind")) + "</span><b>" + esc(t(kindKey(e))) + "</b></p>"
      + '<p class="meta"><span>' + esc(t("detailNet")) + "</span><b>" + esc(t(e.netKey)) + "</b></p>"
      + "<h3>" + esc(t("next")) + '</h3><div class="actions">' + actions + "</div></section>";
  }
  function homeStage() {
    var q = qtext();
    var list = CATALOG.filter(function (e) { return matchEntity(e, q); });
    var head = '<p class="muted">' + esc(t("hits")) + " " + numHTML(list.length) + "</p>";
    if (!list.length) return head + '<p class="muted">' + esc(t("empty")) + "</p>";
    var open = entity(SR.openId);
    var detail = open && matchEntity(open, q) ? detailHTML(open) : "";
    return head + '<div class="tcards">' + list.map(cardHTML).join("") + "</div>" + detail;
  }
  function pinHTML() {
    if (!SR.pin) return "";
    var e = entity(SR.pin);
    if (!e) return "";
    var tick = e.ticker ? ' <span class="ltr" dir="ltr">' + esc(e.ticker) + "</span>" : "";
    return '<p class="pin"><span>' + esc(t("filteredTo")) + "</span> <b>" + esc(t(e.nameKey)) + "</b>" + tick
      + ' <button type="button" class="text-btn" data-act="clear-pin">' + esc(t("remove")) + "</button></p>";
  }
  function matchXfer(r, q) {
    var blob = [r.time, r.from, r.to, r.asset, r.amount].join(" ").toLowerCase();
    if (q && blob.indexOf(q) === -1) return false;
    if (!SR.pin) return true;
    var e = entity(SR.pin);
    if (!e) return true;
    var name = t(e.nameKey).toLowerCase();
    var tick = (e.ticker || "").toLowerCase();
    if (tick && blob.indexOf(tick) !== -1) return true;
    if (name && blob.indexOf(name) !== -1) return true;
    if (blob.indexOf(String(e.id).toLowerCase()) !== -1) return true;
    return false;
  }
  function xferRows() {
    var q = qtext();
    var rows = readArr("sr-transfers").filter(function (r) { return matchXfer(r, q); });
    var key = SR.xferSort.key;
    var dir = SR.xferSort.dir;
    rows.sort(function (a, b) {
      var c = 0;
      if (key === "amount") c = Number(a.amount) - Number(b.amount);
      else c = String(a.time).localeCompare(String(b.time));
      if (c === 0) c = String(a.id).localeCompare(String(b.id));
      return c * dir;
    });
    return rows;
  }
  function sortMark(key) {
    if (SR.xferSort.key !== key) return "";
    return SR.xferSort.dir < 0 ? " ↓" : " ↑";
  }
  function sortHTML() {
    function btn(key, label) {
      var on = SR.xferSort.key === key;
      return '<button type="button" data-sort="' + key + '" data-label="' + esc(t(label)) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(t(label)) + esc(sortMark(key)) + "</button>";
    }
    return '<div class="chips" role="group" aria-label="' + esc(t("sortLabel")) + '">' + btn("time", "sortTime") + btn("amount", "sortAmount") + "</div>";
  }
  function xferForm() {
    var editing = !!SR.editXfer;
    return '<form data-form="xfer" class="card"><div class="fields">'
      + '<label class="field"><span>' + esc(t("col.time")) + '</span><input id="xf-time" data-bind="xfer.time" type="datetime-local" class="ltr" dir="ltr" value="' + val("xfer.time") + '"></label>'
      + '<label class="field"><span>' + esc(t("col.from")) + '</span><input id="xf-from" data-bind="xfer.from" autocomplete="off" value="' + val("xfer.from") + '"></label>'
      + '<label class="field"><span>' + esc(t("col.to")) + '</span><input id="xf-to" data-bind="xfer.to" autocomplete="off" value="' + val("xfer.to") + '"></label>'
      + '<label class="field"><span>' + esc(t("col.asset")) + '</span><input id="xf-asset" data-bind="xfer.asset" class="ltr" dir="ltr" autocomplete="off" value="' + val("xfer.asset") + '"></label>'
      + '<label class="field"><span>' + esc(t("col.amount")) + '</span><input id="xf-amount" data-bind="xfer.amount" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off" value="' + val("xfer.amount") + '"></label>'
      + '</div><p id="form-msg" class="err" role="alert"></p><div class="actions">'
      + '<button type="submit" class="solid">' + esc(editing ? t("save") : t("add")) + "</button>"
      + (editing ? '<button type="button" class="text-btn" data-act="cancel-x">' + esc(t("cancel")) + "</button>" : "")
      + "</div></form>";
  }
  function xferStage() {
    var rows = xferRows();
    if (!rows.length) return '<p class="muted">' + esc(t("empty")) + "</p>";
    var body = rows.map(function (r) {
      var when = String(r.time || "").replace("T", " ");
      return "<tr><td><span class=\"ltr\" dir=\"ltr\">" + esc(when) + "</span></td><td class=\"isolate\">" + esc(r.from) + "</td><td class=\"isolate\">" + esc(r.to) + "</td><td class=\"isolate\">" + esc(r.asset) + "</td><td>" + numHTML(Number(r.amount)) + "</td>"
        + '<td class="row-actions"><button type="button" class="text-btn" data-act="edit-x" data-id="' + esc(r.id) + '">' + esc(t("edit")) + '</button><button type="button" class="text-btn" data-act="del-x" data-id="' + esc(r.id) + '">' + esc(t("remove")) + "</button></td></tr>";
    }).join("");
    var sums = {};
    var order = [];
    rows.forEach(function (r) {
      var asset = String(r.asset);
      if (!Object.prototype.hasOwnProperty.call(sums, asset)) { sums[asset] = 0; order.push(asset); }
      sums[asset] += Number(r.amount);
    });
    var totals = order.map(function (asset) {
      return '<tr><td class="isolate">' + esc(asset) + "</td><td>" + numHTML(sums[asset]) + "</td></tr>";
    }).join("");
    return '<div class="table-scroll"><table class="sheet"><thead><tr><th>' + esc(t("col.time")) + "</th><th>" + esc(t("col.from")) + "</th><th>" + esc(t("col.to")) + "</th><th>" + esc(t("col.asset")) + "</th><th>" + esc(t("col.amount")) + "</th><th>" + esc(t("rowActions")) + "</th></tr></thead><tbody>"
      + body + "</tbody></table></div><h2>" + esc(t("total")) + '</h2><table class="sheet totals"><thead><tr><th>' + esc(t("col.asset")) + "</th><th>" + esc(t("col.amount")) + "</th></tr></thead><tbody>" + totals + "</tbody></table>";
  }
  function blankXfer() { SR.editXfer = ""; SR.form.xfer = { time: "", from: "", to: "", asset: "", amount: "" }; }
  function saveXfer() {
    var row = {
      time: document.getElementById("xf-time").value.trim(),
      from: document.getElementById("xf-from").value.trim(),
      to: document.getElementById("xf-to").value.trim(),
      asset: document.getElementById("xf-asset").value.trim(),
      amount: document.getElementById("xf-amount").value.trim()
    };
    var n = Number(row.amount);
    if (!row.time || !row.from || !row.to || !row.asset || !isFinite(n) || !(n > 0)) {
      var msg = document.getElementById("form-msg");
      if (msg) msg.textContent = t("badRow");
      return;
    }
    var list = readArr("sr-transfers");
    if (SR.editXfer) {
      list = list.map(function (r) {
        if (r.id !== SR.editXfer) return r;
        return { id: r.id, time: row.time, from: row.from, to: row.to, asset: row.asset, amount: n };
      });
    } else {
      list.push({ id: uid(), time: row.time, from: row.from, to: row.to, asset: row.asset, amount: n });
    }
    writeArr("sr-transfers", list);
    blankXfer();
    render(false);
  }
  function tokenMetaHTML() {
    if (!SR.tokenId) return '<p class="muted">' + esc(t("pickToken")) + "</p>";
    var e = entity(SR.tokenId);
    if (!e) return '<p class="muted">' + esc(t("pickToken")) + "</p>";
    return "<h2>" + esc(t(e.nameKey)) + "</h2>"
      + '<p class="meta"><span>' + esc(t("tokChain")) + "</span><b>" + esc(t(e.netKey)) + "</b></p>"
      + '<p class="meta"><span>' + esc(t("tokTicker")) + '</span><b class="ltr" dir="ltr">' + esc(e.ticker) + "</b></p>";
  }
  function tokenStage() {
    var q = qtext();
    var list = CATALOG.filter(function (e) { return e.kind === "asset" && matchEntity(e, q); });
    if (!list.length) return '<p class="muted">' + esc(t("empty")) + "</p>";
    return '<div class="token-list">' + list.map(function (e) {
      var on = SR.tokenId === e.id;
      return '<button type="button" class="token-btn" data-token="' + esc(e.id) + '" aria-pressed="' + (on ? "true" : "false") + '"><span>' + esc(t(e.nameKey)) + '</span><span class="ltr" dir="ltr">' + esc(e.ticker) + "</span></button>";
    }).join("") + "</div>";
  }
  function posOut() {
    if (!SR.tokenId) return '<p class="muted">' + esc(t("pickToken")) + "</p>";
    var ps = String(SR.form.pos.price).trim();
    var qs = String(SR.form.pos.qty).trim();
    var fs = String(SR.form.pos.fee).trim();
    if (!ps && !qs && !fs) return '<p class="muted">' + esc(t("awaitInput")) + "</p>";
    var price = Number(ps);
    var qty = Number(qs);
    var fee = fs === "" ? 0 : Number(fs);
    if (!ps || !qs || (ps && !isFinite(price)) || (qs && !isFinite(qty)) || !isFinite(fee) || (ps && price < 0) || (qs && qty < 0) || fee < 0 || fee > 100) {
      if (!ps || !qs) {
        if ((ps && !isFinite(price)) || (qs && !isFinite(qty)) || (fs && (!isFinite(fee) || fee < 0 || fee > 100))) {
          return '<p class="err" role="alert">' + esc(t("badCalc")) + "</p>";
        }
        return '<p class="muted">' + esc(t("awaitInput")) + "</p>";
      }
      return '<p class="err" role="alert">' + esc(t("badCalc")) + "</p>";
    }
    var notional = price * qty;
    var feeVal = notional * (fee / 100);
    if (!isFinite(notional) || !isFinite(feeVal)) return '<p class="err" role="alert">' + esc(t("badCalc")) + "</p>";
    return '<dl class="stats">' + stat(t("notional"), numHTML(notional)) + stat(t("feeOut"), numHTML(feeVal)) + "</dl>";
  }
  function saveTokenPrice() {
    if (!SR.tokenId) return;
    if (String(SR.form.pos.price).trim() === "") return;
    var n = Number(SR.form.pos.price);
    if (!isFinite(n) || n < 0) return;
    var map = readObj("sr-prices");
    map[SR.tokenId] = String(n);
    writeObj("sr-prices", map);
  }
  function numField(labelKey, id, bind) {
    return '<label class="field"><span>' + esc(t(labelKey)) + '</span><input id="' + id + '" data-bind="' + bind + '" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off" value="' + val(bind) + '"></label>';
  }
  function gridFields() {
    return '<div class="fields">'
      + numField("gridLower", "grid-lower", "grid.lower")
      + numField("gridUpper", "grid-upper", "grid.upper")
      + numField("gridCount", "grid-count", "grid.count")
      + numField("gridQuote", "grid-quote", "grid.quote")
      + "</div>";
  }
  function dcaFields() {
    return '<div class="fields">'
      + numField("dcaStart", "dca-start", "dca.start")
      + numField("dcaBase", "dca-base", "dca.base")
      + numField("dcaSafety", "dca-safety", "dca.safety")
      + numField("dcaDrop", "dca-drop", "dca.drop")
      + numField("dcaScale", "dca-scale", "dca.scale")
      + "</div>";
  }
  function allFilled(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) if (String(obj[keys[i]]).trim() === "") return false;
    return keys.length > 0;
  }
  function gridOut() {
    if (!allFilled(SR.form.grid)) return '<p class="muted">' + esc(t("awaitInput")) + "</p>";
    var r = window.SRCalc.gridCalc(SR.form.grid);
    if (!r.ok) return '<p class="err" role="alert">' + esc(errText(r.error)) + "</p>";
    var rows = r.lines.map(function (price, i) {
      return "<tr><td>" + numHTML(i + 1) + "</td><td>" + numHTML(price) + "</td></tr>";
    }).join("");
    return '<dl class="stats">' + stat(t("gridStep"), numHTML(r.step)) + stat(t("quoteLine"), numHTML(r.quotePerLine)) + stat(t("profitPct"), pctHTML(r.profitPct)) + "</dl>"
      + "<h3>" + esc(t("lines")) + '</h3><div class="table-scroll"><table class="sheet"><thead><tr><th>' + esc(t("col.index")) + "</th><th>" + esc(t("gridLine")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function dcaOut() {
    if (!allFilled(SR.form.dca)) return '<p class="muted">' + esc(t("awaitInput")) + "</p>";
    var r = window.SRCalc.dcaCalc(SR.form.dca);
    if (!r.ok) return '<p class="err" role="alert">' + esc(errText(r.error)) + "</p>";
    var rows = r.orders.map(function (o, i) {
      var name = i === 0 ? esc(t("baseName")) : esc(t("safetyName")) + " " + numHTML(i);
      return "<tr><td>" + name + "</td><td>" + numHTML(o.price) + "</td><td>" + numHTML(o.quote) + "</td></tr>";
    }).join("");
    return '<dl class="stats">' + stat(t("totalQuote"), numHTML(r.totalQuote)) + stat(t("avgEntry"), numHTML(r.avg)) + "</dl>"
      + "<h3>" + esc(t("orders")) + '</h3><div class="table-scroll"><table class="sheet"><thead><tr><th>' + esc(t("orders")) + "</th><th>" + esc(t("orderPrice")) + "</th><th>" + esc(t("orderQuote")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function presetHTML() {
    if (!SR.presetId) return "";
    var e = entity(SR.presetId);
    if (!e) return "";
    var saved = readObj("sr-prices")[e.id];
    var extra = saved == null || saved === "" ? '<p class="muted">' + esc(t("presetEmpty")) + "</p>" : "";
    var tick = e.ticker ? ' <span class="ltr" dir="ltr">' + esc(e.ticker) + "</span>" : "";
    return '<p class="pin"><span>' + esc(t("presetFor")) + "</span> <b>" + esc(t(e.nameKey)) + "</b>" + tick + "</p>" + extra;
  }
  function modeBtn(mode, key) {
    var on = SR.botMode === mode;
    return '<button type="button" data-bot="' + mode + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(t(key)) + "</button>";
  }
  function applyPreset(id) {
    var e = entity(id);
    if (!e || e.kind !== "asset") return;
    SR.presetId = id;
    SR.botMode = "grid";
    var saved = readObj("sr-prices")[id];
    var p = Number(saved);
    if (saved != null && saved !== "" && isFinite(p) && p > 0) {
      SR.form.grid.lower = fmt(p * 0.95);
      SR.form.grid.upper = fmt(p * 1.05);
      if (!String(SR.form.grid.count).trim()) SR.form.grid.count = "8";
    }
  }
  function taxScoped() {
    return readArr("sr-tax").filter(function (r) {
      return !SR.taxAsset || r.asset === SR.taxAsset;
    });
  }
  function taxMatch(r, q) {
    if (!q) return true;
    var side = r.side === "sell" ? t("side.sell") : t("side.buy");
    var blob = [r.date, r.asset, side, r.side, r.qty, r.price].join(" ").toLowerCase();
    return blob.indexOf(q) !== -1;
  }
  function fifo(rows) {
    var by = {};
    rows.forEach(function (r) {
      var k = String(r.asset);
      if (!by[k]) by[k] = [];
      by[k].push(r);
    });
    var proceeds = 0;
    var cost = 0;
    var unmatched = 0;
    Object.keys(by).forEach(function (asset) {
      var lots = [];
      var list = by[asset].slice().sort(function (a, b) {
        var c = String(a.date).localeCompare(String(b.date));
        if (c === 0) c = String(a.id).localeCompare(String(b.id));
        return c;
      });
      list.forEach(function (r) {
        var qty = Number(r.qty);
        var price = Number(r.price);
        if (!isFinite(qty) || !isFinite(price)) return;
        if (r.side === "buy") { lots.push({ qty: qty, price: price }); return; }
        if (r.side !== "sell") return;
        var left = qty;
        proceeds += left * price;
        while (left > 1e-12 && lots.length) {
          var take = Math.min(left, lots[0].qty);
          cost += take * lots[0].price;
          lots[0].qty -= take;
          left -= take;
          if (lots[0].qty <= 1e-12) lots.shift();
        }
        if (left > 1e-8) unmatched += left;
      });
    });
    return { proceeds: proceeds, cost: cost, gain: proceeds - cost, unmatched: unmatched };
  }
  function taxAssetOptions() {
    var seen = {};
    var out = [];
    readArr("sr-tax").forEach(function (r) {
      var asset = String(r.asset);
      if (!seen[asset]) { seen[asset] = 1; out.push(asset); }
    });
    out.sort();
    if (SR.taxAsset && out.indexOf(SR.taxAsset) === -1) SR.taxAsset = "";
    var html = '<option value="">' + esc(t("taxAll")) + "</option>";
    out.forEach(function (asset) {
      html += '<option value="' + esc(asset) + '"' + (asset === SR.taxAsset ? " selected" : "") + ">" + esc(asset) + "</option>";
    });
    return html;
  }
  function taxForm() {
    var side = SR.form.tax.side === "sell" ? "sell" : "buy";
    return '<form data-form="tax" class="card"><div class="fields">'
      + '<label class="field"><span>' + esc(t("taxDate")) + '</span><input id="tax-date" data-bind="tax.date" type="date" class="ltr" dir="ltr" value="' + val("tax.date") + '"></label>'
      + '<label class="field"><span>' + esc(t("col.asset")) + '</span><input id="tax-asset-text" data-bind="tax.asset" class="ltr" dir="ltr" autocomplete="off" value="' + val("tax.asset") + '"></label>'
      + '<label class="field"><span>' + esc(t("taxSide")) + '</span><select id="tax-side" data-bind="tax.side"><option value="buy"' + (side === "buy" ? " selected" : "") + ">" + esc(t("side.buy")) + '</option><option value="sell"' + (side === "sell" ? " selected" : "") + ">" + esc(t("side.sell")) + "</option></select></label>"
      + '<label class="field"><span>' + esc(t("taxQty")) + '</span><input id="tax-qty" data-bind="tax.qty" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off" value="' + val("tax.qty") + '"></label>'
      + '<label class="field"><span>' + esc(t("taxPrice")) + '</span><input id="tax-price" data-bind="tax.price" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off" value="' + val("tax.price") + '"></label>'
      + '</div><p id="form-msg" class="err" role="alert"></p><div class="actions"><button type="submit" class="solid">' + esc(t("add")) + "</button></div></form>";
  }
  function taxStage() {
    var scoped = taxScoped();
    var q = qtext();
    var shown = scoped.filter(function (r) { return taxMatch(r, q); });
    if (!scoped.length) return '<p class="muted">' + esc(t("empty")) + "</p>";
    var body = shown.map(function (r) {
      var side = r.side === "sell" ? t("side.sell") : t("side.buy");
      return "<tr><td><span class=\"ltr\" dir=\"ltr\">" + esc(r.date) + '</span></td><td class="isolate">' + esc(r.asset) + "</td><td>" + esc(side) + "</td><td>" + numHTML(Number(r.qty)) + "</td><td>" + numHTML(Number(r.price)) + "</td>"
        + '<td><button type="button" class="text-btn" data-act="del-tax" data-id="' + esc(r.id) + '">' + esc(t("remove")) + "</button></td></tr>";
    }).join("");
    var table = shown.length
      ? '<div class="table-scroll"><table class="sheet"><thead><tr><th>' + esc(t("taxDate")) + "</th><th>" + esc(t("col.asset")) + "</th><th>" + esc(t("taxSide")) + "</th><th>" + esc(t("taxQty")) + "</th><th>" + esc(t("taxPrice")) + "</th><th>" + esc(t("rowActions")) + "</th></tr></thead><tbody>" + body + "</tbody></table></div>"
      : '<p class="muted">' + esc(t("empty")) + "</p>";
    var sum = fifo(scoped);
    var warn = sum.unmatched > 1e-8 ? '<p class="err" role="alert">' + esc(t("taxWarn")) + " " + numHTML(sum.unmatched) + "</p>" : "";
    return table + '<section class="card"><h2>' + esc(t("summary")) + '</h2><p class="muted">' + esc(t("taxScope")) + '</p><dl class="stats">'
      + stat(t("proceeds"), numHTML(sum.proceeds)) + stat(t("cost"), numHTML(sum.cost)) + stat(t("gain"), gainHTML(sum.gain)) + "</dl>" + warn + "</section>";
  }
  function assetOptions(selected) {
    return CATALOG.filter(function (e) { return e.kind === "asset"; }).map(function (e) {
      return '<option value="' + esc(e.id) + '"' + (e.id === selected ? " selected" : "") + ">" + esc(t(e.nameKey)) + "</option>";
    }).join("");
  }
  function alertRows() {
    var q = qtext();
    return readArr("sr-alerts").map(function (a) {
      var dir = a.dir === "down" || a.dir === "below" ? "below" : "above";
      var asset = a.asset || (a.symbol ? String(a.symbol).toLowerCase() : "");
      var level = a.level != null ? a.level : a.threshold;
      return { id: String(a.id), asset: asset, dir: dir, level: level };
    }).filter(function (a) {
      if (!q) return true;
      var e = entity(a.asset);
      var name = e ? t(e.nameKey) : a.asset;
      var blob = [name, a.asset, e ? e.ticker : "", a.dir, a.level].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }
  function evalAlert(a) {
    var prices = readObj("sr-prices");
    if (prices[a.asset] == null || prices[a.asset] === "") return { state: "none" };
    var price = Number(prices[a.asset]);
    var level = Number(a.level);
    if (!isFinite(price) || !isFinite(level)) return { state: "none" };
    var met = a.dir === "below" ? price <= level : price >= level;
    return { state: met ? "met" : "wait", price: price };
  }
  function alertForm() {
    var dir = SR.form.alert.dir === "below" ? "below" : "above";
    var asset = SR.form.alert.asset || "btc";
    return '<form data-form="alert" class="card"><div class="fields">'
      + '<label class="field"><span>' + esc(t("alertAsset")) + '</span><select id="alert-asset" data-bind="alert.asset">' + assetOptions(asset) + "</select></label>"
      + '<label class="field"><span>' + esc(t("alertDir")) + '</span><select id="alert-dir" data-bind="alert.dir"><option value="above"' + (dir === "above" ? " selected" : "") + ">" + esc(t("dir.above")) + '</option><option value="below"' + (dir === "below" ? " selected" : "") + ">" + esc(t("dir.below")) + "</option></select></label>"
      + '<label class="field"><span>' + esc(t("alertLevel")) + '</span><input id="alert-level" data-bind="alert.level" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off" value="' + val("alert.level") + '"></label>'
      + '</div><p id="form-msg" class="err" role="alert"></p><div class="actions"><button type="submit" class="solid">' + esc(t("add")) + "</button></div></form>";
  }
  function alertStage() {
    var rows = alertRows();
    if (!rows.length) return '<p class="muted">' + esc(t("empty")) + "</p>";
    return "<ul class=\"hops\">" + rows.map(function (a) {
      var e = entity(a.asset);
      var name = e ? esc(t(e.nameKey)) : '<span class="isolate">' + esc(a.asset) + "</span>";
      var tick = e && e.ticker ? ' <span class="ltr" dir="ltr">' + esc(e.ticker) + "</span>" : "";
      var dir = a.dir === "below" ? t("dir.below") : t("dir.above");
      var ev = evalAlert(a);
      var status = ev.state === "none"
        ? esc(t("alertNone"))
        : esc(t("lastTyped")) + " " + numHTML(ev.price) + " " + esc(ev.state === "met" ? t("alertMet") : t("alertWait"));
      return "<li>" + name + tick + " " + esc(dir) + " " + numHTML(Number(a.level)) + '<p class="muted">' + status + '</p><button type="button" class="text-btn" data-act="del-alert" data-id="' + esc(a.id) + '">' + esc(t("remove")) + "</button></li>";
    }).join("") + "</ul>";
  }
  function posField(labelKey, id, bind) {
    var dis = SR.tokenId ? "" : " disabled";
    return '<label class="field"><span>' + esc(t(labelKey)) + '</span><input id="' + id + '" data-bind="' + bind + '" inputmode="decimal" class="ltr" dir="ltr" autocomplete="off"' + dis + ' value="' + val(bind) + '"></label>';
  }
  function viewBtn(view, key) {
    var cur = SR.view === view ? ' aria-current="page"' : "";
    return '<button type="button" data-view="' + view + '"' + cur + ">" + esc(t(key)) + "</button>";
  }
  function navHTML() {
    return '<nav class="nav">'
      + viewBtn("home", "nav.home")
      + viewBtn("transfers", "nav.transfers")
      + viewBtn("tokens", "nav.tokens")
      + viewBtn("bots", "nav.bots")
      + viewBtn("tax", "nav.tax")
      + viewBtn("alerts", "nav.alerts")
      + "</nav>";
  }
  function homeView() {
    return '<div class="view"><h1>' + esc(t("homeTitle")) + '</h1><p class="muted">' + esc(t("homeLead")) + '</p><div id="stage">' + homeStage() + "</div></div>";
  }
  function transfersView() {
    return '<div class="view"><h1>' + esc(t("nav.transfers")) + '</h1><p class="muted">' + esc(t("xferHint")) + "</p>" + pinHTML() + xferForm() + sortHTML() + '<div id="stage">' + xferStage() + "</div></div>";
  }
  function tokensView() {
    return '<div class="view"><h1>' + esc(t("nav.tokens")) + '</h1><div class="split"><div id="stage">' + tokenStage() + '</div><section class="card calc-card"><div id="tok-meta">' + tokenMetaHTML() + '</div><div class="fields">'
      + posField("tokPrice", "pos-price", "pos.price")
      + posField("tokQty", "pos-qty", "pos.qty")
      + posField("tokFee", "pos-fee", "pos.fee")
      + '</div><div id="pos-out" aria-live="polite">' + posOut() + "</div></section></div></div>";
  }
  function botsView() {
    var modes = '<div class="chips" role="group">' + modeBtn("grid", "botGrid") + modeBtn("dca", "botDca") + modeBtn("compare", "botCompare") + "</div>";
    var body;
    if (SR.botMode === "compare") {
      body = '<div class="compare"><section class="card"><h2>' + esc(t("botGrid")) + "</h2>" + gridFields() + '<div id="grid-out" aria-live="polite">' + gridOut() + '</div></section><section class="card"><h2>' + esc(t("botDca")) + "</h2>" + dcaFields() + '<div id="dca-out" aria-live="polite">' + dcaOut() + "</div></section></div>";
    } else if (SR.botMode === "dca") {
      body = '<section class="card"><h2>' + esc(t("botDca")) + "</h2>" + dcaFields() + '<div id="dca-out" aria-live="polite">' + dcaOut() + "</div></section>";
    } else {
      body = '<section class="card"><h2>' + esc(t("botGrid")) + "</h2>" + gridFields() + '<div id="grid-out" aria-live="polite">' + gridOut() + "</div></section>";
    }
    return '<div class="view"><h1>' + esc(t("nav.bots")) + "</h1>" + presetHTML() + modes + body + "</div>";
  }
  function taxView() {
    return '<div class="view"><h1>' + esc(t("nav.tax")) + '</h1><p class="muted">' + esc(t("taxHint")) + "</p>" + taxForm()
      + '<label class="field filter-field"><span>' + esc(t("assetFilter")) + '</span><select id="tax-asset">' + taxAssetOptions() + "</select></label>"
      + '<div id="stage">' + taxStage() + "</div></div>";
  }
  function alertsView() {
    return '<div class="view"><h1>' + esc(t("nav.alerts")) + '</h1><p class="muted">' + esc(t("alertHint")) + " " + esc(t("deviceOnly")) + "</p>" + alertForm() + '<div id="stage">' + alertStage() + "</div></div>";
  }
  function viewHTML() {
    if (SR.view === "transfers") return transfersView();
    if (SR.view === "tokens") return tokensView();
    if (SR.view === "bots") return botsView();
    if (SR.view === "tax") return taxView();
    if (SR.view === "alerts") return alertsView();
    return homeView();
  }
  function stageHTML() {
    if (SR.view === "transfers") return xferStage();
    if (SR.view === "tokens") return tokenStage();
    if (SR.view === "tax") return taxStage();
    if (SR.view === "alerts") return alertStage();
    return homeStage();
  }
  function render(scroll) {
    window.SRX.applyDocument();
    document.getElementById("app").innerHTML = window.SRX.headerHTML({
      search: true,
      nav: navHTML(),
      extra: '<a class="tool-link" href="stop.html">' + esc(t("deviceLink")) + "</a>"
    }) + '<div class="page-body"><div id="main" tabindex="-1">' + viewHTML() + "</div></div>" + window.SRX.footerHTML();
    if (scroll) window.scrollTo(0, 0);
  }
  function paintStage() {
    var el = document.getElementById("stage");
    if (el) el.innerHTML = stageHTML();
  }
  function paintBots() {
    var g = document.getElementById("grid-out");
    if (g) g.innerHTML = gridOut();
    var d = document.getElementById("dca-out");
    if (d) d.innerHTML = dcaOut();
  }
  function paintPos() {
    var el = document.getElementById("pos-out");
    if (el) el.innerHTML = posOut();
  }
  function selectToken(id) {
    SR.tokenId = id;
    var saved = readObj("sr-prices")[id];
    SR.form.pos.price = saved != null && saved !== "" ? String(saved) : "";
    var priceEl = document.getElementById("pos-price");
    if (priceEl) { priceEl.disabled = false; priceEl.value = SR.form.pos.price; }
    ["pos-qty", "pos-fee"].forEach(function (fid) {
      var el = document.getElementById(fid);
      if (el) el.disabled = false;
    });
    document.querySelectorAll("[data-token]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-token") === id ? "true" : "false");
    });
    var meta = document.getElementById("tok-meta");
    if (meta) meta.innerHTML = tokenMetaHTML();
    paintPos();
  }
  function syncSort() {
    document.querySelectorAll("[data-sort]").forEach(function (b) {
      var key = b.getAttribute("data-sort");
      var on = SR.xferSort.key === key;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.textContent = (b.getAttribute("data-label") || "") + (on ? sortMark(key) : "");
    });
  }
  function onField(e) {
    if (!e.target || !e.target.id && !e.target.getAttribute) return;
    if (e.target.id === "q") {
      SR.q = e.target.value;
      paintStage();
      return;
    }
    if (e.target.id === "tax-asset") {
      SR.taxAsset = e.target.value;
      paintStage();
      return;
    }
    var key = e.target.getAttribute("data-bind");
    if (!key) return;
    setPath(SR.form, key, e.target.value);
    if (key.indexOf("grid.") === 0 || key.indexOf("dca.") === 0) paintBots();
    if (key.indexOf("pos.") === 0) {
      if (key === "pos.price") saveTokenPrice();
      paintPos();
    }
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-set-lang],[data-set-theme],[data-skip]")) return;
    var viewEl = e.target.closest("[data-view]");
    if (viewEl) {
      SR.view = viewEl.getAttribute("data-view") || "home";
      render(true);
      return;
    }
    var sortEl = e.target.closest("[data-sort]");
    if (sortEl) {
      var key = sortEl.getAttribute("data-sort");
      if (SR.xferSort.key === key) SR.xferSort.dir = -SR.xferSort.dir;
      else SR.xferSort = { key: key, dir: -1 };
      syncSort();
      paintStage();
      return;
    }
    var opener = e.target.closest("[data-open]");
    if (opener) {
      var oid = opener.getAttribute("data-open");
      SR.openId = SR.openId === oid ? "" : oid;
      paintStage();
      return;
    }
    var tok = e.target.closest("[data-token]");
    if (tok) { selectToken(tok.getAttribute("data-token")); return; }
    var bot = e.target.closest("[data-bot]");
    if (bot) { SR.botMode = bot.getAttribute("data-bot") || "grid"; render(false); return; }
    var act = e.target.closest("[data-act]");
    if (!act) return;
    var action = act.getAttribute("data-act");
    var id = act.getAttribute("data-id");
    if (action === "clear-pin") { SR.pin = ""; render(false); return; }
    if (action === "open-x") {
      var dest = act.getAttribute("data-dest");
      if (dest === "transfers") { SR.pin = id; SR.view = "transfers"; }
      else if (dest === "tokens") {
        SR.tokenId = id;
        var saved = readObj("sr-prices")[id];
        SR.form.pos.price = saved != null && saved !== "" ? String(saved) : "";
        SR.view = "tokens";
      } else if (dest === "bots") { applyPreset(id); SR.view = "bots"; }
      render(true);
      return;
    }
    if (action === "edit-x") {
      var row = readArr("sr-transfers").filter(function (r) { return r.id === id; })[0];
      if (!row) return;
      SR.editXfer = row.id;
      SR.form.xfer = { time: row.time, from: row.from, to: row.to, asset: row.asset, amount: String(row.amount) };
      render(false);
      return;
    }
    if (action === "cancel-x") { blankXfer(); render(false); return; }
    if (action === "del-x") {
      writeArr("sr-transfers", readArr("sr-transfers").filter(function (r) { return r.id !== id; }));
      if (SR.editXfer === id) blankXfer();
      render(false);
      return;
    }
    if (action === "del-tax") {
      writeArr("sr-tax", readArr("sr-tax").filter(function (r) { return r.id !== id; }));
      render(false);
      return;
    }
    if (action === "del-alert") {
      writeArr("sr-alerts", readArr("sr-alerts").filter(function (r) { return String(r.id) !== id; }));
      render(false);
    }
  });
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.getAttribute) return;
    var kind = form.getAttribute("data-form");
    if (!kind) return;
    e.preventDefault();
    if (kind === "xfer") { saveXfer(); return; }
    if (kind === "tax") {
      var date = document.getElementById("tax-date").value.trim();
      var asset = document.getElementById("tax-asset-text").value.trim();
      var side = document.getElementById("tax-side").value === "sell" ? "sell" : "buy";
      var qty = Number(document.getElementById("tax-qty").value);
      var price = Number(document.getElementById("tax-price").value);
      if (!date || !asset || !isFinite(qty) || !(qty > 0) || !isFinite(price) || !(price > 0)) {
        var msg = document.getElementById("form-msg");
        if (msg) msg.textContent = t("badTax");
        return;
      }
      var list = readArr("sr-tax");
      list.push({ id: uid(), date: date, asset: asset, side: side, qty: qty, price: price });
      writeArr("sr-tax", list);
      SR.form.tax = { date: "", asset: "", side: "buy", qty: "", price: "" };
      render(false);
      return;
    }
    if (kind === "alert") {
      var assetId = document.getElementById("alert-asset").value;
      var dir = document.getElementById("alert-dir").value === "below" ? "below" : "above";
      var level = Number(document.getElementById("alert-level").value);
      var ent = entity(assetId);
      if (!ent || ent.kind !== "asset" || !isFinite(level)) {
        var msgA = document.getElementById("form-msg");
        if (msgA) msgA.textContent = t("errBad");
        return;
      }
      var alerts = readArr("sr-alerts");
      alerts.push({ id: uid(), asset: assetId, dir: dir, level: level });
      writeArr("sr-alerts", alerts);
      SR.form.alert.level = "";
      SR.form.alert.asset = assetId;
      SR.form.alert.dir = dir;
      render(false);
    }
  });
  document.addEventListener("input", onField);
  document.addEventListener("change", onField);
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === "/" && tag !== "INPUT" && tag !== "SELECT" && tag !== "TEXTAREA") {
      var q = document.getElementById("q");
      if (q) { e.preventDefault(); q.focus(); }
    }
  });

  SR.view = "home";
  SR.q = SR.q || "";
  SR.openId = "";
  SR.tokenId = "";
  SR.pin = "";
  SR.presetId = "";
  SR.botMode = "grid";
  SR.xferSort = { key: "time", dir: -1 };
  SR.taxAsset = "";
  SR.editXfer = "";
  SR.form = freshForm();
  window.SRX.initChrome();
  SR.onChange = function () { render(false); };
  render(false);
})();
