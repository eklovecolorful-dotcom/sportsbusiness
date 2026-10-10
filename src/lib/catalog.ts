// Static reference data: leagues and teams (text only — no logos, P4).
// Source of truth for supabase/seed.sql (regenerate with `npm run db:seed:gen`).
// Keep this file free of imports so Node can load it directly from scripts/.

export type LeagueId = "NFL" | "NBA" | "MLB";

export type League = {
  id: LeagueId;
  name: string;
  nameZh: string;
  slug: string;
  season: string;
  /** Tailwind classes for the neutral league chip. */
  chip: string;
};

export type Team = {
  id: string;
  leagueId: LeagueId;
  abbr: string;
  name: string;
  nameZh: string;
  city: string;
  venueTz: string;
};

export const LEAGUES: League[] = [
  { id: "MLB", name: "MLB", nameZh: "美國職棒", slug: "mlb", season: "3 月–9 月 · 世界大賽 10–11 月", chip: "bg-sky-100 text-sky-900" },
  { id: "NBA", name: "NBA", nameZh: "美國職籃", slug: "nba", season: "10 月–4 月 · 總冠軍賽 6 月", chip: "bg-amber-100 text-amber-900" },
  { id: "NFL", name: "NFL", nameZh: "國家美式足球聯盟", slug: "nfl", season: "9 月–1 月 · 超級盃 2 月", chip: "bg-emerald-100 text-emerald-900" },
];

export function leagueBySlug(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug.toLowerCase());
}

const ET = "America/New_York";
const CT = "America/Chicago";
const MT = "America/Denver";
const PT = "America/Los_Angeles";
const AZ = "America/Phoenix";
const DET = "America/Detroit";
const TOR = "America/Toronto";
const IND = "America/Indiana/Indianapolis";

type Row = [abbr: string, city: string, name: string, nameZh: string, tz: string];

const MLB: Row[] = [
  ["ARI", "Phoenix", "Arizona Diamondbacks", "亞利桑那響尾蛇", AZ],
  ["ATL", "Atlanta", "Atlanta Braves", "亞特蘭大勇士", ET],
  ["BAL", "Baltimore", "Baltimore Orioles", "巴爾的摩金鶯", ET],
  ["BOS", "Boston", "Boston Red Sox", "波士頓紅襪", ET],
  ["CHC", "Chicago", "Chicago Cubs", "芝加哥小熊", CT],
  ["CWS", "Chicago", "Chicago White Sox", "芝加哥白襪", CT],
  ["CIN", "Cincinnati", "Cincinnati Reds", "辛辛那提紅人", ET],
  ["CLE", "Cleveland", "Cleveland Guardians", "克里夫蘭守護者", ET],
  ["COL", "Denver", "Colorado Rockies", "科羅拉多洛磯", MT],
  ["DET", "Detroit", "Detroit Tigers", "底特律老虎", DET],
  ["HOU", "Houston", "Houston Astros", "休士頓太空人", CT],
  ["KC", "Kansas City", "Kansas City Royals", "堪薩斯市皇家", CT],
  ["LAA", "Anaheim", "Los Angeles Angels", "洛杉磯天使", PT],
  ["LAD", "Los Angeles", "Los Angeles Dodgers", "洛杉磯道奇", PT],
  ["MIA", "Miami", "Miami Marlins", "邁阿密馬林魚", ET],
  ["MIL", "Milwaukee", "Milwaukee Brewers", "密爾瓦基釀酒人", CT],
  ["MIN", "Minneapolis", "Minnesota Twins", "明尼蘇達雙城", CT],
  ["NYM", "New York", "New York Mets", "紐約大都會", ET],
  ["NYY", "New York", "New York Yankees", "紐約洋基", ET],
  ["ATH", "Sacramento", "Athletics", "運動家", PT],
  ["PHI", "Philadelphia", "Philadelphia Phillies", "費城費城人", ET],
  ["PIT", "Pittsburgh", "Pittsburgh Pirates", "匹茲堡海盜", ET],
  ["SD", "San Diego", "San Diego Padres", "聖地牙哥教士", PT],
  ["SF", "San Francisco", "San Francisco Giants", "舊金山巨人", PT],
  ["SEA", "Seattle", "Seattle Mariners", "西雅圖水手", PT],
  ["STL", "St. Louis", "St. Louis Cardinals", "聖路易紅雀", CT],
  ["TB", "Tampa Bay", "Tampa Bay Rays", "坦帕灣光芒", ET],
  ["TEX", "Arlington", "Texas Rangers", "德州遊騎兵", CT],
  ["TOR", "Toronto", "Toronto Blue Jays", "多倫多藍鳥", TOR],
  ["WSH", "Washington", "Washington Nationals", "華盛頓國民", ET],
];

const NBA: Row[] = [
  ["ATL", "Atlanta", "Atlanta Hawks", "亞特蘭大老鷹", ET],
  ["BOS", "Boston", "Boston Celtics", "波士頓塞爾提克", ET],
  ["BKN", "Brooklyn", "Brooklyn Nets", "布魯克林籃網", ET],
  ["CHA", "Charlotte", "Charlotte Hornets", "夏洛特黃蜂", ET],
  ["CHI", "Chicago", "Chicago Bulls", "芝加哥公牛", CT],
  ["CLE", "Cleveland", "Cleveland Cavaliers", "克里夫蘭騎士", ET],
  ["DAL", "Dallas", "Dallas Mavericks", "達拉斯獨行俠", CT],
  ["DEN", "Denver", "Denver Nuggets", "丹佛金塊", MT],
  ["DET", "Detroit", "Detroit Pistons", "底特律活塞", DET],
  ["GSW", "San Francisco", "Golden State Warriors", "金州勇士", PT],
  ["HOU", "Houston", "Houston Rockets", "休士頓火箭", CT],
  ["IND", "Indianapolis", "Indiana Pacers", "印第安納溜馬", IND],
  ["LAC", "Los Angeles", "LA Clippers", "洛杉磯快艇", PT],
  ["LAL", "Los Angeles", "Los Angeles Lakers", "洛杉磯湖人", PT],
  ["MEM", "Memphis", "Memphis Grizzlies", "曼菲斯灰熊", CT],
  ["MIA", "Miami", "Miami Heat", "邁阿密熱火", ET],
  ["MIL", "Milwaukee", "Milwaukee Bucks", "密爾瓦基公鹿", CT],
  ["MIN", "Minneapolis", "Minnesota Timberwolves", "明尼蘇達灰狼", CT],
  ["NOP", "New Orleans", "New Orleans Pelicans", "紐奧良鵜鶘", CT],
  ["NYK", "New York", "New York Knicks", "紐約尼克", ET],
  ["OKC", "Oklahoma City", "Oklahoma City Thunder", "奧克拉荷馬市雷霆", CT],
  ["ORL", "Orlando", "Orlando Magic", "奧蘭多魔術", ET],
  ["PHI", "Philadelphia", "Philadelphia 76ers", "費城 76 人", ET],
  ["PHX", "Phoenix", "Phoenix Suns", "鳳凰城太陽", AZ],
  ["POR", "Portland", "Portland Trail Blazers", "波特蘭拓荒者", PT],
  ["SAC", "Sacramento", "Sacramento Kings", "沙加緬度國王", PT],
  ["SAS", "San Antonio", "San Antonio Spurs", "聖安東尼奧馬刺", CT],
  ["TOR", "Toronto", "Toronto Raptors", "多倫多暴龍", TOR],
  ["UTA", "Salt Lake City", "Utah Jazz", "猶他爵士", MT],
  ["WAS", "Washington", "Washington Wizards", "華盛頓巫師", ET],
];

const NFL: Row[] = [
  ["ARI", "Glendale", "Arizona Cardinals", "亞利桑那紅雀", AZ],
  ["ATL", "Atlanta", "Atlanta Falcons", "亞特蘭大獵鷹", ET],
  ["BAL", "Baltimore", "Baltimore Ravens", "巴爾的摩烏鴉", ET],
  ["BUF", "Orchard Park", "Buffalo Bills", "水牛城比爾", ET],
  ["CAR", "Charlotte", "Carolina Panthers", "卡羅萊納黑豹", ET],
  ["CHI", "Chicago", "Chicago Bears", "芝加哥熊", CT],
  ["CIN", "Cincinnati", "Cincinnati Bengals", "辛辛那提孟加拉虎", ET],
  ["CLE", "Cleveland", "Cleveland Browns", "克里夫蘭布朗", ET],
  ["DAL", "Arlington", "Dallas Cowboys", "達拉斯牛仔", CT],
  ["DEN", "Denver", "Denver Broncos", "丹佛野馬", MT],
  ["DET", "Detroit", "Detroit Lions", "底特律雄獅", DET],
  ["GB", "Green Bay", "Green Bay Packers", "綠灣包裝工", CT],
  ["HOU", "Houston", "Houston Texans", "休士頓德州人", CT],
  ["IND", "Indianapolis", "Indianapolis Colts", "印第安納波利斯小馬", IND],
  ["JAX", "Jacksonville", "Jacksonville Jaguars", "傑克森維爾美洲虎", ET],
  ["KC", "Kansas City", "Kansas City Chiefs", "堪薩斯市酋長", CT],
  ["LV", "Las Vegas", "Las Vegas Raiders", "拉斯維加斯突擊者", PT],
  ["LAC", "Inglewood", "Los Angeles Chargers", "洛杉磯閃電", PT],
  ["LAR", "Inglewood", "Los Angeles Rams", "洛杉磯公羊", PT],
  ["MIA", "Miami Gardens", "Miami Dolphins", "邁阿密海豚", ET],
  ["MIN", "Minneapolis", "Minnesota Vikings", "明尼蘇達維京人", CT],
  ["NE", "Foxborough", "New England Patriots", "新英格蘭愛國者", ET],
  ["NO", "New Orleans", "New Orleans Saints", "紐奧良聖徒", CT],
  ["NYG", "East Rutherford", "New York Giants", "紐約巨人", ET],
  ["NYJ", "East Rutherford", "New York Jets", "紐約噴射機", ET],
  ["PHI", "Philadelphia", "Philadelphia Eagles", "費城老鷹", ET],
  ["PIT", "Pittsburgh", "Pittsburgh Steelers", "匹茲堡鋼人", ET],
  ["SF", "Santa Clara", "San Francisco 49ers", "舊金山 49 人", PT],
  ["SEA", "Seattle", "Seattle Seahawks", "西雅圖海鷹", PT],
  ["TB", "Tampa", "Tampa Bay Buccaneers", "坦帕灣海盜", ET],
  ["TEN", "Nashville", "Tennessee Titans", "田納西泰坦", CT],
  ["WAS", "Landover", "Washington Commanders", "華盛頓指揮官", ET],
];

function toTeams(leagueId: LeagueId, rows: Row[]): Team[] {
  return rows.map(([abbr, city, name, nameZh, venueTz]) => ({
    id: `${leagueId}-${abbr}`,
    leagueId,
    abbr,
    name,
    nameZh,
    city,
    venueTz,
  }));
}

export const TEAMS: Team[] = [...toTeams("MLB", MLB), ...toTeams("NBA", NBA), ...toTeams("NFL", NFL)];

export function teamsByLeague(leagueId: LeagueId): Team[] {
  return TEAMS.filter((t) => t.leagueId === leagueId);
}

export function teamById(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}
