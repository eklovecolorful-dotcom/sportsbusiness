# P3 · PRD

## 三層產品
| 層級 | 內容 | 路由 |
|---|---|---|
| 免費 | 台灣時間賽程、球隊頁、聯盟入門、重要日期、產業商業、深度分析、免費週報 | `/`, `/schedule/*`, `/teams/*`, `/leagues/*`, `/calendar`, `/business/*`, `/insights/*`, `/brief` |
| 付費 | 運動商業週報（Stripe 訂閱 + RLS） | `/pricing`, `/brief/[slug]`, `/account` |
| 高單價 | 美國觀賽旅遊（轉介合法旅行社） | `/trips` |

## 非功能需求
- 390px 手機優先
- 時間一律存 UTC，顯示 Asia/Taipei；DST 週必測
- 資料延遲 > 30 分鐘告警（待實作）
- SEO：球隊頁靜態預渲染（92 隊）

## 範圍外（v1）
即時比分推播 App、自營旅行團、任何博弈功能。
