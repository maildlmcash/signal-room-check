  }
  function viewPred() {
    var cats = pills("pred", S.pred, [["politics", "predCat.politics"], ["sports", "predCat.sports"], ["crypto", "predCat.crypto"]]);
    var line = S.pred ? esc(t("predCat." + S.pred)) + " " + esc(t("predPicked")) : esc(t("predNone"));
    var extra = qnorm() ? '<p class="quiet">' + esc(t("predQuery")) + ' <span class="isolate">' + esc(window.SR.q) + "</span></p>" : "";
    return '<section class="block"><h1>' + esc(t("predTitle")) + '</h1><p class="banner">' + esc(t("predLead")) + "</p><p>" + line + "</p>" + extra + cats + "</section>";
  }
