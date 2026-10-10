// Sports-business content for /business. Every figure carries a source URL
// (docs/06-design-system.md content checklist). Valuations and sale prices
// are reported estimates, not audited figures. Last reviewed: 2026-10-10.

import type { LeagueId } from "@/lib/catalog";

export const BUSINESS_REVIEWED_AT = "2026-10-10";

export type Source = { label: string; url: string };

export type Kpi = { value: string; label: string; source: Source };

export const KPIS: Kpi[] = [
  {
    value: "$23B+",
    label: "NFL 總營收",
    source: { label: "Sportico", url: "https://www.sportico.com/leagues/football/2026/nfl-2025-national-revenue-per-team-1234939659/" },
  },
  {
    value: "~$14.3B",
    label: "NBA 營收預估（超越 MLB）",
    source: { label: "OpenCourt / Sports Value", url: "https://www.opencourt-basketball.com/2026/09/19/nba-surpasses-mlb-in-revenue-becomes-worlds-second-richest-sports-league/" },
  },
  {
    value: "~$11.8B",
    label: "MLB 營收預估",
    source: { label: "OpenCourt / Sports Value", url: "https://www.opencourt-basketball.com/2026/09/19/nba-surpasses-mlb-in-revenue-becomes-worlds-second-richest-sports-league/" },
  },
  {
    value: "$166.9B",
    label: "2025 美國合法運彩投注額",
    source: { label: "AGA via Track360", url: "https://track360.io/blog/us-sports-betting-legal-states-tracker-2026" },
  },
];

export type CompareRow = { item: string; NFL: string; NBA: string; MLB: string };

export const LEAGUE_COMPARISON: CompareRow[] = [
  { item: "球隊數", NFL: "32", NBA: "30（擴編西雅圖、拉斯維加斯評估中）", MLB: "30" },
  { item: "例行賽", NFL: "17 場 · 9 月–1 月", NBA: "82 場 · 10 月–4 月", MLB: "162 場 · 3 月–9 月" },
  { item: "冠軍賽", NFL: "超級盃（2 月）", NBA: "總冠軍賽（6 月）", MLB: "世界大賽（10–11 月）" },
  {
    item: "薪資制度",
    NFL: "硬上限 2026：3.012 億美元",
    NBA: "軟上限 2026-27：1.6496 億；第一／二 Apron 2.09／2.217 億",
    MLB: "無上限、奢侈稅；資方提案上限 2.45 億／下限 1.71 億",
  },
  {
    item: "全國轉播",
    NFL: "11 年約 1,250 億美元（2029 球季後可退出）",
    NBA: "11 年 760 億美元（Disney、NBC、Amazon）",
    MLB: "2026–28：Fox、NBC/Peacock、Netflix、ESPN",
  },
  { item: "最高估值", NFL: "達拉斯牛仔 170 億（Forbes 2026）", NBA: "勇士 108 億（CNBC 2026）", MLB: "洋基 85 億（Forbes 2026）" },
  { item: "勞資協議", NFL: "穩定", NBA: "穩定", MLB: "2026/12 初到期，預期封館" },
];

export const REVENUE_ENGINES = [
  { name: "轉播權", what: "聯盟最大單一收入，全國合約均分給各隊", trend: "串流平台（Netflix、Amazon、YouTube、Peacock）大舉進場" },
  { name: "門票與場館", what: "門票、包廂、餐飲；新球場是估值引擎", trend: "動態票價、場館周邊地產開發" },
  { name: "贊助", what: "球衣廣告、場館冠名、聯盟夥伴", trend: "NBA、MLB 球衣廣告常態化" },
  { name: "授權商品", what: "球衣、周邊、遊戲授權", trend: "海外市場（含亞洲）成長" },
  { name: "運彩合作", what: "39 州 + DC 合法；2025 營收 169.6 億美元", trend: "官方數據授權給博弈商成為新收入" },
];

export type Topic = "轉播權" | "勞資" | "球隊交易" | "擴編" | "國際化" | "運彩" | "大型賽事";

/** Topic channels for /business/topics/[topic], modelled on Sports Business Journal's beats. */
export const TOPICS: { id: Topic; slug: string; blurb: string }[] = [
  { id: "轉播權", slug: "media", blurb: "全國轉播合約、串流平台與地方轉播（RSN）的重組。" },
  { id: "勞資", slug: "labor", blurb: "勞資協議、薪資上限、封館與罷工風險。" },
  { id: "球隊交易", slug: "finance", blurb: "球隊估值、易主交易與私募資金入場。" },
  { id: "擴編", slug: "expansion", blurb: "新球隊、擴編費與市場選擇。" },
  { id: "國際化", slug: "international", blurb: "海外例行賽、國際轉播與亞洲市場。" },
  { id: "運彩", slug: "betting", blurb: "運彩產業與聯盟數據授權的商業面（本站不提供賠率或投注連結）。" },
  { id: "大型賽事", slug: "events", blurb: "超級盃、明星賽、世界大賽的主辦城市與廣告經濟。" },
];

export function topicBySlug(slug: string) {
  return TOPICS.find((t) => t.slug === slug);
}

export function topicSlug(topic: Topic): string {
  return TOPICS.find((t) => t.id === topic)!.slug;
}

export type CaseStudy = {
  slug: string;
  title: string;
  league: LeagueId | "ALL";
  topic: Topic;
  date: string; // YYYY-MM-DD of the latest development covered
  summary: string;
  facts: { text: string; source: Source }[];
  money: string[]; // 錢怎麼流
  fanImpact: string[]; // 對球迷／台灣的影響
  watch: string[]; // 接下來要看什麼
};

export const CASES: CaseStudy[] = [
  {
    slug: "mlb-cba-2026",
    title: "MLB 勞資談判：薪資上限之爭與 2027 封館風險",
    league: "MLB",
    topic: "勞資",
    date: "2026-10-08",
    summary:
      "勞資協議 12 月初到期。資方 1994 年以來首度提出薪資上限，球員工會拒絕；聯盟已發備忘錄要求各隊準備封館。",
    facts: [
      {
        text: "資方提案薪資上限 2.45 億美元、下限 1.71 億美元。",
        source: { label: "Sportico", url: "https://www.sportico.com/law/analysis/2026/mlb-lockout-looming-legal-issues-1234937370/" },
      },
      {
        text: "10/8 最新提案：例行賽縮減為 154 場，頭號種子可自選外卡對手。",
        source: { label: "Spokesman-Review", url: "https://spokesman.com/stories/2026/oct/08/mlb-proposes-154-game-regular-season-playoff-oppon" },
      },
      {
        text: "聯盟發給各隊 34 頁封館備忘錄，封館期間官網將移除球員肖像（同 2021–22）。",
        source: { label: "RG", url: "https://rg.org/en-ca/news/baseball/mlb-memo-lockout-playbook-cba-deadline" },
      },
      {
        text: "前例：2021/12/2 開始封館，歷時 99 天，2022/3/10 達成協議。",
        source: { label: "MLB.com", url: "https://www.mlb.com/news/mlb-mlbpa-agree-to-cba" },
      },
    ],
    money: [
      "MLB 是三大聯盟中唯一沒有薪資上限的聯盟，目前靠奢侈稅抑制大市場球隊支出。",
      "上限＋下限會同時限制洋基、道奇等高薪資球隊，並強迫低薪資球隊提高支出。",
      "154 場賽季代表門票與地方轉播庫存減少，需要用季後賽與全國轉播價值彌補。",
    ],
    fanImpact: [
      "2027 開季時間不確定；本站 2027 MLB 觀賽行程在協議落定前只收候補。",
      "封館期間不能簽約、交易，自由市場可能停擺，台灣旅美球員的合約進度也會受影響。",
    ],
    watch: ["12 月初的到期日前是否達成協議", "封館是否延燒到春訓（2 月）", "工會對上限提案的反提案"],
  },
  {
    slug: "lakers-record-sale",
    title: "湖人 125 億美元易主：北美職業球隊史上最高價",
    league: "NBA",
    topic: "球隊交易",
    date: "2026-08-24",
    summary: "報導指 Josh Kushner 與 Bob Iger 同意以 125 億美元自 Mark Walter 手中買下湖人多數股權。",
    facts: [
      {
        text: "成交價 125 億美元，為北美職業球隊史上最高（報導，尚非公開財報）。",
        source: { label: "CNBC", url: "https://www.cnbc.com/2026/08/24/los-angeles-lakers-worth-every-bit-of-12point5-billion-price-tag-76ers-and-commanders-owner-josh-harris.html" },
      },
      {
        text: "Walter 於 2025 年以 100 億美元入主，約 14 個月增值 25 億美元。",
        source: { label: "ESPN", url: "https://www.espn.com/nfl/story/_/id/34060289/most-expensive-sports-franchise-sales" },
      },
    ],
    money: [
      "NBA 新轉播合約（11 年 760 億美元）讓每隊每年的全國轉播分潤大幅提高，直接墊高估值。",
      "洛杉磯大市場＋品牌全球影響力，讓湖人享有超過平均的地方媒體與贊助收入。",
    ],
    fanImpact: ["球隊估值上升通常伴隨票價與周邊上漲。", "新老闆的媒體背景可能帶來內容與串流策略的改變。"],
    watch: ["交易是否完成聯盟審批", "其他 NBA 球隊估值是否跟漲"],
  },
  {
    slug: "nba-media-deal",
    title: "NBA 760 億美元轉播合約：營收首度超車 MLB",
    league: "NBA",
    topic: "轉播權",
    date: "2026-09-19",
    summary: "Disney、NBC、Amazon 的 11 年合約從 2025-26 起生效，Sports Value 估計 NBA 營收已超越 MLB，成為全球第二。",
    facts: [
      {
        text: "11 年總值 760 億美元，夥伴為 Disney、NBC、Amazon。",
        source: { label: "Gulf News", url: "https://gulfnews.com/business/nba-signs-11-year-media-deals-reportedly-worth-76-billion-1.1721885748069" },
      },
      {
        text: "NBA 營收預估約 143 億美元，MLB 約 118 億美元。",
        source: { label: "OpenCourt", url: "https://www.opencourt-basketball.com/2026/09/19/nba-surpasses-mlb-in-revenue-becomes-worlds-second-richest-sports-league/" },
      },
      {
        text: "2026-27 播出分工：Peacock 週一、ESPN/ABC 週三黃金時段、Prime Video 週四與 NBA 盃。",
        source: { label: "Fox Sports", url: "https://www.foxsports.com/stories/nba/when-does-2026-27-nba-season-start-opening-night-schedule" },
      },
    ],
    money: [
      "全國轉播收入由 30 隊均分，是薪資上限上升的主要原因（2026-27 軟上限 1.6496 億）。",
      "串流平台取得固定時段，換取訂閱用戶成長；聯盟則分散對有線電視的依賴。",
    ],
    fanImpact: ["比賽分散在多個平台，台灣觀眾的收看管道也會跟著改變。"],
    watch: ["新合約第二季的收視數據", "薪資上限與 Apron 的年度漲幅"],
  },
  {
    slug: "nba-expansion",
    title: "NBA 擴編西雅圖、拉斯維加斯：每隊入會費上看 100 億",
    league: "NBA",
    topic: "擴編",
    date: "2026-03-25",
    summary: "理事會 3 月全票通過啟動評估，委任 PJT Partners 擔任顧問；席佛表示年底前需要決定方向。",
    facts: [
      {
        text: "3/25 理事會 30 票全數同意啟動擴編評估。",
        source: { label: "NBA 官方新聞稿", url: "https://pr.nba.com/nba-board-of-governors-potential-expansion-las-vegas-seattle" },
      },
      {
        text: "每輪表決需 30 票中 23 票通過；目標 2028-29 球季加入，業界預估入會費 70–100 億美元。",
        source: { label: "ESPN", url: "https://www.espn.com/nba/story/_/id/48304338/sources-nba-votes-explore-vegas-seattle-expansion-bids" },
      },
    ],
    money: [
      "入會費由現有 30 隊均分：若兩隊各 70–100 億，每隊可分得約 4.7–6.7 億美元的一次性收入。",
      "代價是全國轉播收入從 30 份變 32 份，長期分潤被稀釋。",
    ],
    fanImpact: ["2028-29 若成真，賽程與分區將重新編排。"],
    watch: ["年底前的正式表決", "是否只擴一隊或兩隊都通過"],
  },
  {
    slug: "nfl-media-opt-out",
    title: "NFL 轉播合約：2029 退出條款與提前重談",
    league: "NFL",
    topic: "轉播權",
    date: "2026-08-06",
    summary: "古德爾曾表示最快 2026 年重啟轉播談判，但 Fox 明確拒絕提前修約；報導指 NFL 與 Paramount 洽談每年增加近 10 億美元。",
    facts: [
      {
        text: "現行 11 年約 1,250 億美元合約，2029 球季後 NFL 可退出（Disney 多一年）。",
        source: { label: "Front Office Sports", url: "https://frontofficesports.com/newsletter/tuned-in-nfl-eyes-another-payday/" },
      },
      {
        text: "Fox 執行長 Lachlan Murdoch：不會在退出期前修改 NFL 合約。",
        source: { label: "NewscastStudio", url: "https://www.newscaststudio.com/2026/08/06/lachlan-murdoch-says-fox-will-not-renegotiation-nfl-contract-early/" },
      },
    ],
    money: [
      "NFL 的籌碼來自收視：轉播商需要 NFL 撐起廣告與訂閱，聯盟藉此換取更高年費。",
      "提前重談＝以延長合約年限換取立即加價，對轉播商是現金流壓力。",
    ],
    fanImpact: ["更多比賽可能移往串流獨家播出。"],
    watch: ["Paramount 談判結果", "ESPN、NBC、Amazon 是否跟進"],
  },
  {
    slug: "nfl-international-2026",
    title: "NFL 國際賽 2026：7 城市 9 場，首度進軍巴黎、墨爾本、里約",
    league: "NFL",
    topic: "國際化",
    date: "2026-10-04",
    summary: "2026 球季國際賽橫跨四大洲 8 座球場，倫敦一地三場。",
    facts: [
      {
        text: "墨爾本、里約、倫敦（3 場）、巴黎、馬德里、慕尼黑、墨西哥城，共 9 場。",
        source: { label: "Pro Football Hall of Fame", url: "https://www.profootballhof.com/news/nfl-releases-schedule-of-international-games-for-2026" },
      },
    ],
    money: [
      "國際賽是授權商品、海外轉播與贊助的拓展工具，也為未來可能的海外球隊鋪路。",
      "主辦城市支付場地與行銷費用，換取觀光收入。",
    ],
    fanImpact: ["亞太地區首場例行賽在墨爾本舉行，對台灣球迷是較近的觀賽選項。"],
    watch: ["2027 國際賽城市名單", "亞洲是否有城市爭取主辦"],
  },
  {
    slug: "super-bowl-lxi",
    title: "超級盃 LXI：2027/2/14 洛杉磯 SoFi 球場",
    league: "NFL",
    topic: "大型賽事",
    date: "2026-10-10",
    summary: "第 61 屆超級盃將在 SoFi 球場舉行，由 ESPN/ABC 轉播，是 ESPN 首度轉播超級盃。",
    facts: [
      {
        text: "2027/2/14 於英格爾伍德 SoFi 球場舉行，SoFi 第二度主辦（上次 2022）。",
        source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Super_Bowl_LXI" },
      },
    ],
    money: [
      "超級盃廣告是全美單一節目最貴的廣告時段，轉播商靠它回收部分版權成本。",
      "主辦城市效益包含飯店、餐飲與周邊活動；但淨效益常被高估，分析時要看獨立研究。",
    ],
    fanImpact: ["台灣時間為 2/15（一）早上播出，是週報與社群內容的流量高峰。"],
    watch: ["廣告售價與廣告主名單", "中場秀演出者公布"],
  },
  {
    slug: "us-sports-betting",
    title: "美國運彩：1,669 億美元投注額背後的聯盟生意",
    league: "ALL",
    topic: "運彩",
    date: "2026-10-10",
    summary: "39 州加 DC 合法化後，聯盟透過官方數據授權與贊助從運彩獲利。本站只分析商業模式，不提供賠率或下注連結。",
    facts: [
      {
        text: "2025 年美國合法運彩投注額 1,669 億美元、營收 169.6 億美元；39 州 + DC 合法。",
        source: { label: "Track360", url: "https://track360.io/blog/us-sports-betting-legal-states-tracker-2026" },
      },
    ],
    money: [
      "聯盟把官方即時數據授權給博弈業者，按量計價，是新的高毛利收入。",
      "博弈業者也是球隊、場館與轉播的大贊助商。",
    ],
    fanImpact: ["台灣境內僅台灣運彩合法；經營或推廣境外運彩網站可能觸法。"],
    watch: ["更多州的合法化進度", "誠信事件對聯盟監管的影響"],
  },
];

export function casesByTopic(topic: Topic) {
  return CASES.filter((c) => c.topic === topic);
}

export function caseBySlug(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

export type NewsItem = { date: string; league: LeagueId | "ALL"; title: string; source: Source };

/** Latest business headlines (newest first). */
export const LATEST_NEWS: NewsItem[] = [
  {
    date: "2026-10-08",
    league: "MLB",
    title: "MLB 提案 154 場例行賽、頭號種子可自選季後賽對手",
    source: { label: "Spokesman-Review", url: "https://spokesman.com/stories/2026/oct/08/mlb-proposes-154-game-regular-season-playoff-oppon" },
  },
  {
    date: "2026-09-19",
    league: "NBA",
    title: "Sports Value：NBA 營收超越 MLB，成為全球第二",
    source: { label: "OpenCourt", url: "https://www.opencourt-basketball.com/2026/09/19/nba-surpasses-mlb-in-revenue-becomes-worlds-second-richest-sports-league/" },
  },
  {
    date: "2026-09-09",
    league: "NFL",
    title: "CNBC 2026 NFL 球隊估值出爐；海鷹易主案股權出資創紀錄",
    source: { label: "CNBC", url: "https://www.cnbc.com/2026/09/09/cnbcs-official-nfl-team-valuations-2026-heres-how-the-32-franchises-stack-up.html" },
  },
  {
    date: "2026-08-24",
    league: "NBA",
    title: "湖人 125 億美元易主，北美球隊交易新紀錄",
    source: { label: "CNBC", url: "https://www.cnbc.com/2026/08/24/los-angeles-lakers-worth-every-bit-of-12point5-billion-price-tag-76ers-and-commanders-owner-josh-harris.html" },
  },
  {
    date: "2026-08-06",
    league: "NFL",
    title: "Fox：不會在 2029 退出期前提前修改 NFL 轉播合約",
    source: { label: "NewscastStudio", url: "https://www.newscaststudio.com/2026/08/06/lachlan-murdoch-says-fox-will-not-renegotiation-nfl-contract-early/" },
  },
  {
    date: "2026-03-25",
    league: "NBA",
    title: "NBA 理事會全票通過評估擴編西雅圖、拉斯維加斯",
    source: { label: "NBA", url: "https://pr.nba.com/nba-board-of-governors-potential-expansion-las-vegas-seattle" },
  },
];

export type KeyDate = {
  date: string; // US local date
  league: LeagueId | "ALL";
  title: string;
  note?: string;
  source: Source;
};

/** Verified upcoming marquee dates (US local dates). */
export const KEY_DATES: KeyDate[] = [
  {
    date: "2026-10-11",
    league: "MLB",
    title: "國聯冠軍賽 NLCS 開打",
    note: "美聯 ALCS 10/12 開打",
    source: { label: "Dodger Blue", url: "https://dodgerblue.com/2026-mlb-postseason-schedule-wild-card-round-to-world-series-dates-tv-info/2026/08/10/amp/" },
  },
  {
    date: "2026-10-11",
    league: "NFL",
    title: "倫敦國際賽：老鷹 vs 美洲虎（熱刺球場）",
    source: { label: "Pro Football Hall of Fame", url: "https://www.profootballhof.com/news/nfl-releases-schedule-of-international-games-for-2026" },
  },
  {
    date: "2026-10-20",
    league: "NBA",
    title: "NBA 2026-27 開幕夜三連戰",
    note: "塞爾提克@活塞、76人@尼克、雷霆@馬刺（NBC/Peacock）",
    source: { label: "Fox Sports", url: "https://www.foxsports.com/stories/nba/when-does-2026-27-nba-season-start-opening-night-schedule" },
  },
  {
    date: "2026-10-23",
    league: "MLB",
    title: "世界大賽第 1 戰",
    note: "如需第 7 戰為 10/31；FOX 轉播",
    source: { label: "Fox Sports", url: "https://www.foxsports.com/stories/mlb/2026-mlb-playoff-schedule-dates-rounds-how-watch" },
  },
  {
    date: "2026-10-25",
    league: "NFL",
    title: "巴黎國際賽：鋼人 vs 聖徒（法蘭西體育場）",
    source: { label: "Pro Football Hall of Fame", url: "https://www.profootballhof.com/news/nfl-releases-schedule-of-international-games-for-2026" },
  },
  {
    date: "2026-10-30",
    league: "NBA",
    title: "NBA 盃（Emirates NBA Cup）分組賽開打",
    note: "冠軍戰 12/11 於印第安納波利斯",
    source: { label: "Dunkest", url: "https://www.dunkest.com/en/nba/news/244243/nba-schedule-opening-night-key-dates" },
  },
  {
    date: "2026-12-01",
    league: "MLB",
    title: "MLB 勞資協議到期（預期封館）",
    note: "部分報導為 12/2 午夜（美東）",
    source: { label: "Sportico", url: "https://www.sportico.com/law/analysis/2026/mlb-lockout-looming-legal-issues-1234937370/" },
  },
  {
    date: "2026-12-25",
    league: "NBA",
    title: "NBA 聖誕大戰",
    source: { label: "Dunkest", url: "https://www.dunkest.com/en/nba/news/244108/nba-schedule-opening-night-and-christmas-day/" },
  },
  {
    date: "2027-02-14",
    league: "NFL",
    title: "超級盃 LXI（洛杉磯 SoFi 球場）",
    note: "台灣時間 2/15（一）早上；ESPN/ABC 轉播",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Super_Bowl_LXI" },
  },
];

export const BUSINESS_CALENDAR = [
  { month: "10–11 月", events: "MLB 季後賽、世界大賽；NBA 開季；NFL 例行賽", theme: "季後賽商業懶人包、NBA 新轉播第二季觀察" },
  { month: "12 月", events: "MLB 勞資協議到期、冬季會議與自由市場", theme: "封館全解析（流量高峰）" },
  { month: "2 月", events: "超級盃", theme: "超級盃廣告經濟學、主辦城市效益" },
  { month: "3–4 月", events: "MLB 開季、NBA 季後賽前哨", theme: "開季球隊薪資排行、新球季轉播與贊助" },
  { month: "6–7 月", events: "NBA 總冠軍賽、選秀、自由市場；MLB 明星賽", theme: "薪資上限與 Apron 解析、選秀經濟學" },
];
