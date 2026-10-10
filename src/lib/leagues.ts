// Beginner league guides for /leagues/[league] (the "how it works" pages that
// league sites and ESPN offer, rewritten for Taiwanese newcomers). Text only.

import type { LeagueId } from "@/lib/catalog";
import type { Source } from "@/lib/business";

export type LeagueGuide = {
  intro: string;
  structure: string;
  postseason: string;
  tips: string[];
  source: Source;
};

export const LEAGUE_GUIDES: Record<LeagueId, LeagueGuide> = {
  MLB: {
    intro: "賽季最長、幾乎天天有比賽；台灣球迷最熟悉的美國職業運動。",
    structure: "30 隊分為美國聯盟、國家聯盟，各再分東、中、西 3 個分區。",
    postseason: "12 隊晉級（每個聯盟 6 隊）：外卡系列賽三戰兩勝 → 分區系列賽五戰三勝 → 聯盟冠軍賽七戰四勝 → 世界大賽七戰四勝。",
    tips: ["例行賽多為連續 3–4 場的系列賽，適合追同一組對戰。", "季後賽每天都有比賽，10 月是追球的黃金期。"],
    source: { label: "MLB.com", url: "https://www.mlb.com/postseason" },
  },
  NBA: {
    intro: "球星驅動、全球化程度最高的聯盟；季後賽每輪都是七戰四勝。",
    structure: "30 隊分為東、西區，各再分 3 個分區。",
    postseason: "各區第 7–10 名先打附加賽（Play-In）決定最後 4 席，16 隊進季後賽，每輪七戰四勝，總冠軍賽於 6 月。",
    tips: ["聖誕大戰與明星賽是例行賽的焦點日。", "交易截止日與自由市場（7 月）是商業新聞最多的時候。"],
    source: { label: "NBA.com", url: "https://www.nba.com/playoffs" },
  },
  NFL: {
    intro: "美國收視與營收第一的聯盟；每隊每週只打一場，每場都很關鍵。",
    structure: "32 隊分為 AFC、NFC 兩個聯會，各再分東、北、南、西 4 個分區。",
    postseason: "14 隊晉級（每個聯會 7 隊），單場淘汰；各聯會頭號種子首輪輪空，最後於 2 月超級盃決勝。",
    tips: ["例行賽集中在美國週日，台灣多為週一凌晨至上午。", "國際賽（倫敦、德國等）開打時間較適合亞洲觀眾。"],
    source: { label: "NFL.com", url: "https://www.nfl.com/playoffs/" },
  },
};
