# P4 · Design System

- **手機優先 390px**；最大寬度 `max-w-5xl`
- **不使用聯盟與球隊 Logo、官方字體**；球隊以文字名稱 + 中性色塊（縮寫方塊）呈現
- 聯盟色塊（中性、非官方）：MLB `sky-100`、NBA `amber-100`、NFL `emerald-100`
- 字體：Geist + 系統中文字體（PingFang TC / Noto Sans TC / 微軟正黑體）

## 核心元件
| 元件 | 檔案 | 規格 |
|---|---|---|
| 賽程卡 GameCard | `src/components/game-card.tsx` | 台灣時間大字 `text-2xl`，當地時間小字；延賽顯示「延賽 Postponed」；示範資料標註 |
| 付費牆卡片 | `src/components/paywall-card.tsx` | 深色卡、查看方案 / 登入 |

## 內容審查清單（每篇發佈前）
- [ ] 每個數字都有來源 URL
- [ ] 沒有 `[待查證]` 殘留
- [ ] 無賠率、明牌、博弈網站連結
- [ ] 無 Logo、官方照片、比賽影片
