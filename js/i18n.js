/* Visible copy lives only in SR_DICT. Add the same keys in en, hi, and ur before a new page is shown. */
globalThis.SR_DICT={
en:{htmlLang:"en",dir:"ltr",strings:{
  "brand": "Signal Room",
  "candle": {
    "open": "Open",
    "high": "High",
    "low": "Low",
    "close": "Close"
  },
  "note": "New pages are translated before they are written.",
  "sample": "Sample",
  "sampleLong": "These figures are a sample, not a live feed.",
  "loop": "This tape is a sample loop. It is not a socket.",
  "noOrders": "This desk does not send orders.",
  "deviceOnly": "Saved on this device only.",
  "notWatching": "These alerts are not watched live.",
  "noForecast": "This is not a forecast.",
  "searchPlaceholder": "Search the desk",
  "searchLabel": "Search",
  "skip": "Skip to content",
  "openMenu": "Open menu",
  "hits": "Matches",
  "empty": "Nothing matches.",
  "saved": "Saved on this device.",
  "badSymbol": "Use BTC or ETH.",
  "badNumber": "Enter a number above zero.",
  "remove": "Remove",
  "add": "Add",
  "yes": "Yes",
  "no": "No",
  "low": "Low",
  "mid": "Medium",
  "high": "High",
  "wide": "Wide sample band",
  "narrow": "Narrow sample band",
  "buy": "Buy",
  "sell": "Sell",
  "all": "All",
  "col": {
    "attention": "Attention",
    "holds": "Holds coins",
    "fit": "Fit",
    "style": "Style",
    "book": "Book",
    "kind": "Kind",
    "proceeds": "Proceeds",
    "cost": "Cost",
    "gain": "Gain",
    "type": "Type",
    "price": "Price",
    "change": "Change",
    "size": "Size",
    "window": "Window",
    "path": "Path"
  },
  "from": "From",
  "to": "To",
  "asset": "Asset",
  "amount": "Amount",
  "when": "When",
  "open": "Open",
  "close": "Close",
  "status": "Status",
  "upstream": "Upstream text",
  "waiting": "The live request is in flight.",
  "failed": "The live request failed.",
  "refused": "This place refused the live request.",
  "noStatus": "No status code. The viewer blocked or dropped the live request.",
  "refresh": "Request again",
  "last": "Last price",
  "chartTitle": "Price graph",
  "sourceTitle": "Price source",
  "sourceBody": "Price source: Binance public REST. The series is live when the browser can reach it.",
  "liveAttempt": "Live request",
  "tickerCap": "Price address",
  "klineCap": "Candle address",
  "tickerWeight": "GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT (request weight 2)",
  "klineWeight": "GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60 (request weight 2)",
  "limitLine": "Stated limit: 6000 request weight per minute per IP.",
  "weightsNote": "No order is sent. No socket is opened. No signed call is made. No key is used.",
  "sampleSeries": "SAMPLE",
  "liveSeries": "Live series",
  "sampleClock": "Clock marks are sample marks.",
  "liveClock": "Clock marks are hours and minutes on the world clock.",
  "pair": "BTC / USDT",
  "theme": {
    "dark": "Dark",
    "night": "Night",
    "auto": "Automatic"
  },
  "lang": {
    "en": "English",
    "hi": "Hindi",
    "ur": "Urdu"
  },
  "nav": {
    "search": "Search",
    "entities": "Entities",
    "transfers": "Transfers",
    "alerts": "Alerts",
    "labels": "Labels",
    "bots": "Bots",
    "tax": "Tax",
    "markets": "Markets",
    "api": "API",
    "more": "More",
    "spot": "Spot Grid",
    "futures": "Futures Grid",
    "dca": "DCA",
    "rebalance": "Rebalancing",
    "signal": "Signal",
    "catalog": "Marketplace",
    "paper": "Paper",
    "backtest": "Backtest",
    "visualizer": "Visualizer",
    "tracer": "Tracer",
    "insights": "Insights"
  },
  "searchLede": "Read the sample book: desks, routes, marks, alerts, tax layouts, and automation descriptions.",
  "entitiesIntro": "Sample desks. Balances are sample bands, not live custody.",
  "labelsIntro": "Marks stay on this device. They are not published.",
  "labelPh": "New mark",
  "assign": "Attach",
  "assignEntity": "Desk",
  "assignLabel": "Mark",
  "alertSymbol": "Asset",
  "alertDir": "Direction",
  "alertThreshold": "Level",
  "dir": {
    "up": "Above",
    "down": "Below"
  },
  "taxIntro": "A sample layout for reading a report.",
  "taxDisclaimer": "This is not tax advice and it prepares no filing.",
  "nothingOut": "Nothing leaves this page as a file.",
  "taxYear": "Year",
  "taxMethod": "Cost method",
  "method": {
    "first": "First lot out",
    "avg": "Average cost"
  },
  "tab": {
    "summary": "Summary",
    "disposals": "Disposals",
    "income": "Income",
    "holdings": "Holdings"
  },
  "income": {
    "stake": "Bond reward",
    "rebate": "Rebate"
  },
  "totalGain": "Sample gain",
  "totalIncome": "Sample income",
  "botsIntro": "Compare described styles side by side.",
  "fit": {
    "spot": "A calm range on the spot book.",
    "futures": "A range on a contract book.",
    "dca": "Buys on a clock, in small steps.",
    "rebalance": "Return a mix to target weights.",
    "signal": "A written rule. No live stream.",
    "catalog": "A shelf of descriptions. Nothing is bought.",
    "paper": "A described practice book that does not run.",
    "backtest": "A past sample tally."
  },
  "spotIntro": "A described spot band with even rungs.",
  "futuresIntro": "A described contract band. No contract is opened here.",
  "gridLower": "Lower",
  "gridUpper": "Upper",
  "gridLines": "Rungs",
  "gridCaption": "Sample band, not a live book.",
  "dcaIntro": "A described schedule of small buys.",
  "dcaBase": "First amount",
  "dcaStep": "Later amount",
  "dcaEvery": "Every",
  "dcaTimes": "Count",
  "dcaUnit": "days",
  "dcaCaption": "Sample clock, not an order.",
  "reIntro": "A described return to a target mix.",
  "reCaption": "Sample weights, not a live mix.",
  "signalIntro": "Written rules only. No stream is open.",
  "rule": {
    "fall": {
      "name": "Dip",
      "body": "A buy is described after a fall."
    },
    "clock": {
      "name": "Clock",
      "body": "A buy is described when the clock strikes."
    },
    "band": {
      "name": "Band",
      "body": "A close is described at the outer rung."
    }
  },
  "plan": {
    "start": "Start",
    "extra": "Extra buy",
    "exit": "Exit"
  },
  "catIntro": "A shelf of descriptions. Nothing is bought or installed.",
  "cat": {
    "all": "All",
    "range": "Range",
    "schedule": "Schedule",
    "mix": "Mix"
  },
  "item": {
    "walker": {
      "name": "Range walk",
      "body": "A described walk across a range."
    },
    "ladder": {
      "name": "Slow ladder",
      "body": "Small described buys on a clock."
    },
    "mix": {
      "name": "Quiet mix",
      "body": "A described return to target weights."
    },
    "gate": {
      "name": "Wait gate",
      "body": "A plan that waits for a written condition."
    },
    "twin": {
      "name": "Twin books",
      "body": "Two described bands, spot and contract."
    },
    "cap": {
      "name": "Drift cap",
      "body": "A described ceiling on how far a mix may drift."
    }
  },
  "paperIntro": "A sample fill list. The practice book does not run.",
  "backIntro": "A past sample tally. No prediction runs here.",
  "marketsIntro": "A display-only price graph, and a sample book that is not live.",
  "chip": {
    "spot": "Spot",
    "futures": "Futures"
  },
  "apiIntro": "A reading of public market reads. There is no private gate.",
  "api": {
    "1": "No key is kept here.",
    "2": "There is no order route.",
    "3": "The Markets view requests these public prices.",
    "4": "The two addresses, the weights, and the stated limit are written on that view."
  },
  "visIntro": "A sample map of desks. Places are invented.",
  "tracerIntro": "A sample path for transfer 1042. Not a live trace.",
  "hop": "Hop",
  "insightsIntro": "These cards count the sample book. They do not name a future price.",
  "ins": {
    "desks": {
      "title": "Concentration",
      "body": "Two desks hold most of the sample book."
    },
    "routes": {
      "title": "Routes",
      "body": "Most sample routes are short."
    },
    "marks": {
      "title": "Marks",
      "body": "Public and internal marks cover the sample set."
    }
  },
  "kind": {
    "exchange": "Exchange",
    "fund": "Fund",
    "desk": "Desk",
    "maker": "Maker",
    "bridge": "Bridge",
    "treasury": "Treasury"
  },
  "ent": {
    "harbor": {
      "name": "Harbor Custody",
      "blurb": "A large public custody desk in the sample book."
    },
    "north": {
      "name": "North Desk",
      "blurb": "A desk with short sample routes."
    },
    "lantern": {
      "name": "Lantern Fund",
      "blurb": "A fund that gathers sample holdings."
    },
    "quiet": {
      "name": "Quiet Maker",
      "blurb": "A maker that quotes on both sample books."
    },
    "span": {
      "name": "Span Bridge",
      "blurb": "A bridge between two sample books."
    },
    "civic": {
      "name": "Civic Treasury",
      "blurb": "A treasury with slow sample movement."
    }
  },
  "tag": {
    "treasury": "Treasury",
    "hot": "Hot",
    "cold": "Cold",
    "public": "Public",
    "internal": "Internal"
  },
  "book": {
    "spot": "Spot",
    "futures": "Futures",
    "both": "Both"
  }
}}
,
hi:{htmlLang:"hi",dir:"ltr",strings:{
  "brand": "संकेत कक्ष",
  "candle": {
    "open": "आरंभ भाव",
    "high": "ऊंचा भाव",
    "low": "नीचा भाव",
    "close": "अंत भाव"
  },
  "note": "नए पृष्ठ लिखे जाने से पहले अनूदित होते हैं।",
  "sample": "नमूना",
  "sampleLong": "ये आँकड़े नमूना हैं, जीवंत धारा नहीं।",
  "loop": "यह पट्टी नमूना चक्र है। यह कोई सतत कड़ी नहीं।",
  "noOrders": "यह मेज़ आदेश नहीं भेजती।",
  "deviceOnly": "केवल इस उपकरण पर सहेजा गया।",
  "notWatching": "ये चेतावनियाँ जीवंत रूप से नहीं देखी जातीं।",
  "noForecast": "यह भविष्य का कथन नहीं।",
  "searchPlaceholder": "मेज़ पर खोजें",
  "searchLabel": "खोज",
  "skip": "विषय पर जाएँ",
  "openMenu": "सूची खोलें",
  "hits": "मिलान",
  "empty": "कुछ नहीं मिला।",
  "saved": "इस उपकरण पर सहेजा गया।",
  "badSymbol": "BTC या ETH लिखें।",
  "badNumber": "शून्य से बड़ा अंक लिखें।",
  "remove": "हटाएँ",
  "add": "जोड़ें",
  "yes": "हाँ",
  "no": "नहीं",
  "low": "कम",
  "mid": "मध्यम",
  "high": "अधिक",
  "wide": "चौड़ा नमूना दायरा",
  "narrow": "संकीर्ण नमूना दायरा",
  "buy": "खरीद",
  "sell": "बिक्री",
  "all": "सब",
  "col": {
    "attention": "ध्यान",
    "holds": "सिक्के रखता है",
    "fit": "उपयुक्तता",
    "style": "शैली",
    "book": "पटल",
    "kind": "प्रकार",
    "proceeds": "प्राप्ति",
    "cost": "लागत",
    "gain": "लाभ",
    "type": "प्रकार",
    "price": "भाव",
    "change": "बदलाव",
    "size": "आकार",
    "window": "खिड़की",
    "path": "पथ"
  },
  "from": "से",
  "to": "तक",
  "asset": "संपत्ति",
  "amount": "मात्रा",
  "when": "समय",
  "open": "खोलें",
  "close": "बंद करें",
  "status": "स्थिति",
  "upstream": "ऊपर से आया पाठ",
  "waiting": "जीवंत अनुरोध चल रहा है।",
  "failed": "जीवंत अनुरोध विफल रहा।",
  "refused": "इस स्थान से जीवंत अनुरोध अस्वीकार हुआ।",
  "noStatus": "कोई स्थिति अंक नहीं। दर्शक ने जीवंत अनुरोध रोका या गिराया।",
  "refresh": "फिर माँगें",
  "last": "अंतिम भाव",
  "chartTitle": "भाव आलेख",
  "sourceTitle": "भाव का स्रोत",
  "sourceBody": "भाव स्रोत: Binance सार्वजनिक रीस्ट। शृंखला तब जीवंत है जब दर्शक तक पहुँच हो।",
  "liveAttempt": "जीवंत अनुरोध",
  "tickerCap": "भाव पता",
  "klineCap": "मोमबत्ती पता",
  "tickerWeight": "GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT (अनुरोध भार 2)",
  "klineWeight": "GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60 (अनुरोध भार 2)",
  "limitLine": "कथित सीमा: प्रति मिनट प्रति जाल पता 6000 अनुरोध भार।",
  "weightsNote": "कोई आदेश नहीं जाता। कोई सतत कड़ी नहीं खुलती। कोई हस्ताक्षरित पुकार नहीं होती। कोई कुंजी काम में नहीं आती।",
  "sampleSeries": "नमूना",
  "liveSeries": "जीवंत शृंखला",
  "sampleClock": "घड़ी के चिह्न नमूना हैं।",
  "liveClock": "घड़ी के चिह्न विश्व घड़ी के घंटे और मिनट हैं।",
  "pair": "BTC / USDT",
  "theme": {
    "dark": "गहरा",
    "night": "रात",
    "auto": "स्वचालित"
  },
  "lang": {
    "en": "अंग्रेज़ी",
    "hi": "हिन्दी",
    "ur": "उर्दू"
  },
  "nav": {
    "search": "खोज",
    "entities": "संस्थाएँ",
    "transfers": "स्थानांतरण",
    "alerts": "चेतावनियाँ",
    "labels": "नामपत्र",
    "bots": "यंत्र",
    "tax": "कर",
    "markets": "बाज़ार",
    "api": "अंतराफलक",
    "more": "अधिक",
    "spot": "हाजिर जाल",
    "futures": "वायदा जाल",
    "dca": "औसत लागत",
    "rebalance": "पुनर्संतुलन",
    "signal": "संकेत",
    "catalog": "मंडी",
    "paper": "कागज़ी",
    "backtest": "पूर्वपरीक्षा",
    "visualizer": "दृश्यक",
    "tracer": "पदलेखा",
    "insights": "अंतर्दृष्टि"
  },
  "searchLede": "नमूना बही पढ़ें: मेज़ें, मार्ग, नामपत्र, चेतावनियाँ, कर के रूप, और स्वचालन के वर्णन।",
  "entitiesIntro": "नमूना मेज़ें। शेष नमूना दायरे हैं, जीवंत अभिरक्षा नहीं।",
  "labelsIntro": "नामपत्र इसी उपकरण पर रहते हैं। वे प्रकाशित नहीं होते।",
  "labelPh": "नया नामपत्र",
  "assign": "जोड़ें",
  "assignEntity": "मेज़",
  "assignLabel": "नामपत्र",
  "alertSymbol": "संपत्ति",
  "alertDir": "दिशा",
  "alertThreshold": "स्तर",
  "dir": {
    "up": "ऊपर",
    "down": "नीचे"
  },
  "taxIntro": "रिपोर्ट पढ़ने का नमूना रूप।",
  "taxDisclaimer": "यह कर सलाह नहीं और कोई दाखिल तैयार नहीं करता।",
  "nothingOut": "इस पृष्ठ से कोई फ़ाइल बाहर नहीं जाती।",
  "taxYear": "वर्ष",
  "taxMethod": "लागत विधि",
  "method": {
    "first": "पहले टुकड़े से",
    "avg": "औसत लागत"
  },
  "tab": {
    "summary": "सार",
    "disposals": "निपटान",
    "income": "आय",
    "holdings": "धारण"
  },
  "income": {
    "stake": "बंधन पुरस्कार",
    "rebate": "छूट वापसी"
  },
  "totalGain": "नमूना लाभ",
  "totalIncome": "नमूना आय",
  "botsIntro": "वर्णित शैलियों की साथ-साथ तुलना।",
  "fit": {
    "spot": "हाजिर पटल पर शांत दायरा।",
    "futures": "वायदा पटल पर एक दायरा।",
    "dca": "घड़ी पर छोटी खरीद।",
    "rebalance": "मिश्रण को लक्ष्य भार पर लाना।",
    "signal": "लिखित नियम। कोई जीवंत धारा नहीं।",
    "catalog": "वर्णनों की ताक। कुछ खरीदा नहीं जाता।",
    "paper": "एक वर्णित अभ्यास बही जो चलती नहीं।",
    "backtest": "बीती नमूना गिनती।"
  },
  "spotIntro": "समान पायदानों वाला वर्णित हाजिर दायरा।",
  "futuresIntro": "वर्णित वायदा दायरा। यहाँ कोई अनुबंध नहीं खुलता।",
  "gridLower": "निचला",
  "gridUpper": "ऊपरी",
  "gridLines": "पायदान",
  "gridCaption": "नमूना दायरा, जीवंत पटल नहीं।",
  "dcaIntro": "छोटी खरीद की वर्णित ताल।",
  "dcaBase": "पहली मात्रा",
  "dcaStep": "बाद की मात्रा",
  "dcaEvery": "प्रत्येक",
  "dcaTimes": "गिनती",
  "dcaUnit": "दिन",
  "dcaCaption": "नमूना घड़ी, आदेश नहीं।",
  "reIntro": "लक्ष्य मिश्रण की ओर वर्णित वापसी।",
  "reCaption": "नमूना भार, जीवंत मिश्रण नहीं।",
  "signalIntro": "केवल लिखित नियम। कोई धारा खुली नहीं।",
  "rule": {
    "fall": {
      "name": "गिरावट",
      "body": "गिरावट के बाद खरीद वर्णित है।"
    },
    "clock": {
      "name": "घड़ी",
      "body": "घड़ी बजने पर खरीद वर्णित है।"
    },
    "band": {
      "name": "दायरा",
      "body": "बाहरी पायदान पर समापन वर्णित है।"
    }
  },
  "plan": {
    "start": "आरंभ",
    "extra": "अतिरिक्त खरीद",
    "exit": "निकास"
  },
  "catIntro": "वर्णनों की ताक। कुछ खरीदा या बैठाया नहीं जाता।",
  "cat": {
    "all": "सब",
    "range": "दायरा",
    "schedule": "ताल",
    "mix": "मिश्रण"
  },
  "item": {
    "walker": {
      "name": "दायरा चाल",
      "body": "दायरे पर वर्णित चाल।"
    },
    "ladder": {
      "name": "धीमी सीढ़ी",
      "body": "घड़ी पर छोटी वर्णित खरीद।"
    },
    "mix": {
      "name": "शांत मिश्रण",
      "body": "लक्ष्य भार की ओर वर्णित वापसी।"
    },
    "gate": {
      "name": "प्रतीक्षा द्वार",
      "body": "योजना लिखित शर्त की प्रतीक्षा करती है।"
    },
    "twin": {
      "name": "दो पटल",
      "body": "हाजिर और वायदा, दो वर्णित दायरे।"
    },
    "cap": {
      "name": "विचलन सीमा",
      "body": "मिश्रण कितना भटक सकता है, उसकी वर्णित छत।"
    }
  },
  "paperIntro": "नमूना भरती सूची। अभ्यास बही चलती नहीं।",
  "backIntro": "बीती नमूना गिनती। यहाँ कोई भविष्य-कथन नहीं चलता।",
  "marketsIntro": "केवल दिखाने वाला भाव आलेख, और एक नमूना बही जो जीवंत नहीं।",
  "chip": {
    "spot": "हाजिर",
    "futures": "वायदा"
  },
  "apiIntro": "सार्वजनिक बाज़ार पठन का विवरण। कोई निजी द्वार नहीं।",
  "api": {
    "1": "यहाँ कोई कुंजी नहीं रखी जाती।",
    "2": "कोई आदेश मार्ग नहीं है।",
    "3": "बाज़ार दृश्य ये सार्वजनिक भाव माँगता है।",
    "4": "दो पते, भार, और कथित सीमा उसी दृश्य पर लिखी हैं।"
  },
  "visIntro": "मेज़ों का नमूना नक्शा। स्थान गढ़े हुए हैं।",
  "tracerIntro": "स्थानांतरण 1042 का नमूना पथ। जीवंत खोज नहीं।",
  "hop": "कदम",
  "insightsIntro": "ये पत्र नमूना बही गिनते हैं। ये आने वाले भाव का नाम नहीं लेते।",
  "ins": {
    "desks": {
      "title": "संकेंद्रण",
      "body": "दो मेज़ें नमूना बही का अधिकांश रखती हैं।"
    },
    "routes": {
      "title": "मार्ग",
      "body": "अधिकांश नमूना मार्ग छोटे हैं।"
    },
    "marks": {
      "title": "नामपत्र",
      "body": "सार्वजनिक और भीतरी नामपत्र नमूना समूह को ढकते हैं।"
    }
  },
  "kind": {
    "exchange": "विनिमय",
    "fund": "कोष",
    "desk": "मेज़",
    "maker": "निर्माता",
    "bridge": "सेतु",
    "treasury": "कोषालय"
  },
  "ent": {
    "harbor": {
      "name": "बंदरगाह अभिरक्षा",
      "blurb": "नमूना बही में एक बड़ी सार्वजनिक अभिरक्षा मेज़।"
    },
    "north": {
      "name": "उत्तर मेज़",
      "blurb": "छोटे नमूना मार्गों वाली मेज़।"
    },
    "lantern": {
      "name": "दीप कोष",
      "blurb": "एक कोष जो नमूना धारण समेटता है।"
    },
    "quiet": {
      "name": "मौन निर्माता",
      "blurb": "एक निर्माता जो दोनों नमूना पटल पर भाव देता है।"
    },
    "span": {
      "name": "विस्तार सेतु",
      "blurb": "दो नमूना पटल के बीच एक सेतु।"
    },
    "civic": {
      "name": "नागरिक कोषालय",
      "blurb": "धीमी नमूना गति वाला कोषालय।"
    }
  },
  "tag": {
    "treasury": "कोष",
    "hot": "गरम",
    "cold": "शीत",
    "public": "सार्वजनिक",
    "internal": "भीतरी"
  },
  "book": {
    "spot": "हाजिर",
    "futures": "वायदा",
    "both": "दोनों"
  }
}}
,
ur:{htmlLang:"ur",dir:"rtl",strings:{
  "brand": "اشارہ خانہ",
  "candle": {
    "open": "آغاز بھاؤ",
    "high": "اونچا بھاؤ",
    "low": "نیچا بھاؤ",
    "close": "اختتام بھاؤ"
  },
  "note": "نئے صفحات لکھے جانے سے پہلے ترجمہ ہو جاتے ہیں۔",
  "sample": "نمونہ",
  "sampleLong": "یہ اعداد نمونہ ہیں، براہ راست دھار نہیں۔",
  "loop": "یہ پٹی نمونہ چکر ہے۔ یہ کوئی قائم ربط نہیں۔",
  "noOrders": "یہ میز حکم نہیں بھیجتی۔",
  "deviceOnly": "صرف اسی آلے پر محفوظ۔",
  "notWatching": "ان انتباہات کی براہ راست نگرانی نہیں ہوتی۔",
  "noForecast": "یہ مستقبل کا بیان نہیں۔",
  "searchPlaceholder": "میز پر تلاش",
  "searchLabel": "تلاش",
  "skip": "مواد پر جائیں",
  "openMenu": "فہرست کھولیں",
  "hits": "مطابقت",
  "empty": "کچھ نہیں ملا۔",
  "saved": "اسی آلے پر محفوظ ہو گیا۔",
  "badSymbol": "BTC یا ETH لکھیں۔",
  "badNumber": "صفر سے بڑا عدد لکھیں۔",
  "remove": "ہٹائیں",
  "add": "شامل",
  "yes": "ہاں",
  "no": "نہیں",
  "low": "کم",
  "mid": "درمیانہ",
  "high": "زیادہ",
  "wide": "چوڑا نمونہ دائرہ",
  "narrow": "تنگ نمونہ دائرہ",
  "buy": "خرید",
  "sell": "فروخت",
  "all": "سب",
  "col": {
    "attention": "دھیان",
    "holds": "سکے رکھتا ہے",
    "fit": "موزونیت",
    "style": "انداز",
    "book": "تختہ",
    "kind": "قسم",
    "proceeds": "وصولی",
    "cost": "لاگت",
    "gain": "فائدہ",
    "type": "قسم",
    "price": "بھاؤ",
    "change": "بدل",
    "size": "ناپ",
    "window": "کھڑکی",
    "path": "راستہ"
  },
  "from": "سے",
  "to": "تک",
  "asset": "اثاثہ",
  "amount": "مقدار",
  "when": "وقت",
  "open": "کھولیں",
  "close": "بند",
  "status": "حالت",
  "upstream": "اوپر سے آیا متن",
  "waiting": "براہ راست درخواست جاری ہے۔",
  "failed": "براہ راست درخواست ناکام رہی۔",
  "refused": "اس جگہ سے براہ راست درخواست رد ہوئی۔",
  "noStatus": "کوئی حالت عدد نہیں۔ ناظر نے براہ راست درخواست روکی یا گرائی۔",
  "refresh": "دوبارہ مانگیں",
  "last": "آخری بھاؤ",
  "chartTitle": "بھاؤ خاکہ",
  "sourceTitle": "بھاؤ کا منبع",
  "sourceBody": "بھاؤ کا منبع: Binance عوامی ریسٹ۔ سلسلہ اس وقت براہ راست ہے جب ناظر وہاں پہنچ سکے۔",
  "liveAttempt": "براہ راست درخواست",
  "tickerCap": "بھاؤ پتہ",
  "klineCap": "موم بتی پتہ",
  "tickerWeight": "GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT (درخواست وزن 2)",
  "klineWeight": "GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60 (درخواست وزن 2)",
  "limitLine": "بیان کردہ حد: ہر منٹ ہر جال پتے پر 6000 درخواست وزن۔",
  "weightsNote": "کوئی حکم نہیں جاتا۔ کوئی قائم ربط نہیں کھلتا۔ کوئی دستخط شدہ پکار نہیں ہوتی۔ کوئی کنجی استعمال نہیں ہوتی۔",
  "sampleSeries": "نمونہ",
  "liveSeries": "براہ راست سلسلہ",
  "sampleClock": "گھڑی کے نشان نمونہ ہیں۔",
  "liveClock": "گھڑی کے نشان عالمی گھڑی کے گھنٹے اور منٹ ہیں۔",
  "pair": "BTC / USDT",
  "theme": {
    "dark": "گہرا",
    "night": "رات",
    "auto": "خودکار"
  },
  "lang": {
    "en": "انگریزی",
    "hi": "ہندی",
    "ur": "اردو"
  },
  "nav": {
    "search": "تلاش",
    "entities": "ادارے",
    "transfers": "منتقلی",
    "alerts": "انتباہات",
    "labels": "نشانیاں",
    "bots": "آلات",
    "tax": "محصول",
    "markets": "بازار",
    "api": "رابط",
    "more": "مزید",
    "spot": "نقد جالی",
    "futures": "آئندہ جالی",
    "dca": "اوسط لاگت",
    "rebalance": "دوبارہ توازن",
    "signal": "اشارہ",
    "catalog": "بازارچہ",
    "paper": "کاغذی",
    "backtest": "سابقہ جانچ",
    "visualizer": "منظر",
    "tracer": "نقش قدم",
    "insights": "بصیرت"
  },
  "searchLede": "نمونہ بہی پڑھیں: میزیں، راستے، نشانیاں، انتباہات، محصول کے ڈھانچے، اور خودکار بیان۔",
  "entitiesIntro": "نمونہ میزیں۔ بقایا نمونہ دائرے ہیں، براہ راست امانت نہیں۔",
  "labelsIntro": "نشانیاں اسی آلے پر رہتی ہیں۔ وہ شائع نہیں ہوتیں۔",
  "labelPh": "نئی نشانی",
  "assign": "جوڑیں",
  "assignEntity": "میز",
  "assignLabel": "نشانی",
  "alertSymbol": "اثاثہ",
  "alertDir": "سمت",
  "alertThreshold": "سطح",
  "dir": {
    "up": "اوپر",
    "down": "نیچے"
  },
  "taxIntro": "رپورٹ پڑھنے کا نمونہ ڈھانچہ۔",
  "taxDisclaimer": "یہ محصول کا مشورہ نہیں اور کوئی درخواست تیار نہیں کرتا۔",
  "nothingOut": "اس صفحے سے کوئی فائل باہر نہیں جاتی۔",
  "taxYear": "سال",
  "taxMethod": "لاگت کا طریقہ",
  "method": {
    "first": "پہلے ٹکڑے سے",
    "avg": "اوسط لاگت"
  },
  "tab": {
    "summary": "خلاصہ",
    "disposals": "نکلنا",
    "income": "آمدنی",
    "holdings": "رکھے"
  },
  "income": {
    "stake": "بندش انعام",
    "rebate": "رعایت واپسی"
  },
  "totalGain": "نمونہ فائدہ",
  "totalIncome": "نمونہ آمدنی",
  "botsIntro": "بیان کردہ اندازوں کا ساتھ ساتھ موازنہ۔",
  "fit": {
    "spot": "نقد تختے پر خاموش دائرہ۔",
    "futures": "آئندہ تختے پر ایک دائرہ۔",
    "dca": "گھڑی پر چھوٹی خرید۔",
    "rebalance": "مرکب کو ہدف وزن پر لانا۔",
    "signal": "لکھا ہوا قاعدہ۔ کوئی براہ راست دھار نہیں۔",
    "catalog": "بیانوں کی تختی۔ کچھ خریدا نہیں جاتا۔",
    "paper": "ایک بیان کردہ مشق بہی جو چلتی نہیں۔",
    "backtest": "گزشتہ نمونہ گنتی۔"
  },
  "spotIntro": "برابر سیڑھیوں والا بیان کردہ نقد دائرہ۔",
  "futuresIntro": "بیان کردہ آئندہ دائرہ۔ یہاں کوئی معاہدہ نہیں کھلتا۔",
  "gridLower": "نچلا",
  "gridUpper": "اوپری",
  "gridLines": "سیڑھیاں",
  "gridCaption": "نمونہ دائرہ، براہ راست تختہ نہیں۔",
  "dcaIntro": "چھوٹی خرید کی بیان کردہ تال۔",
  "dcaBase": "پہلی مقدار",
  "dcaStep": "بعد کی مقدار",
  "dcaEvery": "ہر",
  "dcaTimes": "گنتی",
  "dcaUnit": "دن",
  "dcaCaption": "نمونہ گھڑی، حکم نہیں۔",
  "reIntro": "ہدف مرکب کی طرف بیان کردہ واپسی۔",
  "reCaption": "نمونہ وزن، براہ راست مرکب نہیں۔",
  "signalIntro": "صرف لکھے ہوئے قاعدے۔ کوئی دھار کھلی نہیں۔",
  "rule": {
    "fall": {
      "name": "گراوٹ",
      "body": "گراوٹ کے بعد خرید بیان ہے۔"
    },
    "clock": {
      "name": "گھڑی",
      "body": "گھڑی بجے تو خرید بیان ہے۔"
    },
    "band": {
      "name": "دائرہ",
      "body": "بیرونی سیڑھی پر اختتام بیان ہے۔"
    }
  },
  "plan": {
    "start": "آغاز",
    "extra": "اضافی خرید",
    "exit": "خروج"
  },
  "catIntro": "بیانوں کی تختی۔ کچھ خریدا یا بٹھایا نہیں جاتا۔",
  "cat": {
    "all": "سب",
    "range": "دائرہ",
    "schedule": "تال",
    "mix": "مرکب"
  },
  "item": {
    "walker": {
      "name": "دائرہ چال",
      "body": "دائرے پر بیان کردہ چال۔"
    },
    "ladder": {
      "name": "آہستہ سیڑھی",
      "body": "گھڑی پر چھوٹی بیان کردہ خرید۔"
    },
    "mix": {
      "name": "خاموش مرکب",
      "body": "ہدف وزن کی طرف بیان کردہ واپسی۔"
    },
    "gate": {
      "name": "انتظار دروازہ",
      "body": "منصوبہ لکھی شرط کا انتظار کرتا ہے۔"
    },
    "twin": {
      "name": "دو تختے",
      "body": "نقد اور آئندہ، دو بیان کردہ دائرے۔"
    },
    "cap": {
      "name": "بھٹک حد",
      "body": "مرکب کتنا بھٹک سکتا ہے، اس کی بیان کردہ چھت۔"
    }
  },
  "paperIntro": "نمونہ بھرائی فہرست۔ مشق بہی نہیں چلتی۔",
  "backIntro": "گزشتہ نمونہ گنتی۔ یہاں کوئی مستقبل بیان نہیں چلتا۔",
  "marketsIntro": "صرف دکھانے والا بھاؤ خاکہ، اور ایک نمونہ بہی جو براہ راست نہیں۔",
  "chip": {
    "spot": "نقد",
    "futures": "آئندہ"
  },
  "apiIntro": "عوامی بازار پڑھنے کا بیان۔ کوئی نجی دروازہ نہیں۔",
  "api": {
    "1": "یہاں کوئی کنجی نہیں رکھی جاتی۔",
    "2": "کوئی حکم راستہ نہیں ہے۔",
    "3": "بازار منظر یہ عوامی بھاؤ مانگتا ہے۔",
    "4": "دو پتے، وزن، اور بیان کردہ حد اسی منظر پر لکھی ہیں۔"
  },
  "visIntro": "میزوں کا نمونہ نقشہ۔ جگہیں گھڑی ہوئی ہیں۔",
  "tracerIntro": "منتقلی 1042 کا نمونہ راستہ۔ براہ راست تلاش نہیں۔",
  "hop": "قدم",
  "insightsIntro": "یہ کارٹ نمونہ بہی گنتے ہیں۔ یہ آنے والے بھاؤ کا نام نہیں لیتے۔",
  "ins": {
    "desks": {
      "title": "ارتکاز",
      "body": "دو میزیں نمونہ بہی کا بیشتر حصہ رکھتی ہیں۔"
    },
    "routes": {
      "title": "راستے",
      "body": "اکثر نمونہ راستے چھوٹے ہیں۔"
    },
    "marks": {
      "title": "نشانیاں",
      "body": "عوامی اور اندرونی نشانیاں نمونہ مجموعے کو ڈھانپتی ہیں۔"
    }
  },
  "kind": {
    "exchange": "تبادلہ",
    "fund": "صندوق",
    "desk": "میز",
    "maker": "ساز",
    "bridge": "پُل",
    "treasury": "خزانہ"
  },
  "ent": {
    "harbor": {
      "name": "بندرگاہ امانت",
      "blurb": "نمونہ بہی میں ایک بڑی عوامی امانت میز۔"
    },
    "north": {
      "name": "شمالی میز",
      "blurb": "چھوٹے نمونہ راستوں والی میز۔"
    },
    "lantern": {
      "name": "چراغ صندوق",
      "blurb": "ایک صندوق جو نمونہ رکھے جمع کرتا ہے۔"
    },
    "quiet": {
      "name": "خاموش ساز",
      "blurb": "ایک ساز جو دونوں نمونہ تختوں پر بھاؤ دیتا ہے۔"
    },
    "span": {
      "name": "وسیع پُل",
      "blurb": "دو نمونہ تختوں کے درمیان ایک پُل۔"
    },
    "civic": {
      "name": "شہری خزانہ",
      "blurb": "سست نمونہ حرکت والا خزانہ۔"
    }
  },
  "tag": {
    "treasury": "خزانہ",
    "hot": "گرم",
    "cold": "سرد",
    "public": "عوامی",
    "internal": "اندرونی"
  },
  "book": {
    "spot": "نقد",
    "futures": "آئندہ",
    "both": "دونوں"
  }
}}
};