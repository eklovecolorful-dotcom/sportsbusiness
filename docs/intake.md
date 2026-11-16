# Intake — Sports（美國三大職業運動中文平台）

> 建立：2026-11-16。來源：Playbook 02（`docs/research/`）、`docs/02-strategy.md` 中由創辦人拍板的 P2 決定。
> 全部欄位已於 2026-11-16 定案。

mode: C（已有現成手冊：`docs/research/us-big-three-sports-business-playbook.md`，Playbook 02，數據截至 2026-10）

topic: none（T1–T10 沒有運動類主題設定）

one_liner: 給台灣的美國職業運動球迷：用台灣時間看懂每一場比賽，用中文看懂比賽背後的錢。

audience: (max 3)
1. 台灣 MLB／NBA 深度球迷，含早上通勤看球的上班族（主要）
2. 計畫赴美看球的球迷（觀賽旅遊，由合法旅行社承辦）
3. 運動產業學生與品牌行銷人（B2B：運動商業內容、企業講座）

domain: 運動媒體 × 運動商業分析 × 觀賽旅遊轉介（NFL、NBA、MLB）

existing_material:
- `docs/research/us-big-three-sports-business-playbook.md`（Playbook 02）
- `docs/01-discovery.md`（P1 草稿，證據 0 / 60）
- `docs/02-strategy.md`（P2 已拍板）
- 已上線網站 https://sportsbusiness.vercel.app 與程式碼（P3–P5 大部分已完成）

monthly_budget_twd: **NT$1,500／月**（硬上限，前 90 天驗證期；約 US$45）
- 只支應網域與必要的雲端額度（Supabase、Vercel、Resend）。
- 不購買商業授權賽程 API；名單破 100 且付費驗證通過後再擴充。
- 損益兩平：NT$1,500 ÷ NT$150 = 10 位付費訂戶（未計手續費；含手續費約 11 位）。
- ⚠️ 與 ADR-0001「只用授權資料」衝突，待修訂（見 `docs/02-strategy.md` §5）。

constraints:
- 一人經營，內容產能有限。
- 只用授權賽程資料，不爬蟲（ADR-0001）；目前尚未簽約，賽程為示範或開發用資料。
- 內容紅線（ADR-0002）：不用聯盟／球隊 Logo 與比賽影像；不提供賠率、明牌、境外博弈連結；觀賽行程只由合法旅行社承辦與收費。
- 金流：以台灣身分開通 Stripe 有限制，上線初期不開正式收款，改為免費候補登記；名單破 100 人再決定 TapPay／藍新或海外 Stripe。
- 時機：MLB 勞資協議 2026-12-01 到期，2027 MLB 觀賽行程在協議落定前只開放候補。

success_metric_90d: 2026-11-16 → 2027-02-14
- 主指標：Email 候補／訂閱名單 **500 人**
- 次指標：付費訂閱（或候補表單中願意以 NT$150／月或 NT$1,500／年付費）**30 人**
- 檢查點：50 人（P1 行為證據達標）→ 100 人（決定金流）→ 2/14 寫 P8 學習紀錄

languages: 繁體中文為主，重要標籤、技術術語與錯誤訊息附英文（例如「延賽 Postponed」）；現階段不做完整英文版與 hreflang，集中台灣與華語受眾。（2026-11-16 定案）

non_goals:
- 不做第二個 ESPN：即時比分、數據 App
- 不做台灣球員追蹤（v1，2026-11-16 決定，避免同質化成戰報網站）
- 不自營旅行團、不收團費
- 不做任何博弈相關功能或導流
- 不使用 Logo、官方照片、比賽影片

brand_adjectives: (3)
1. 俐落
2. 商業視角
3. 有憑有據（數據說話）

anti_references: (3 sites it must not look like)
1. 傳統入口網站體育版（雜亂、廣告多）
2. 運彩分析／報牌網站（博弈感）
3. 純粉絲應援論壇（情緒化、沒有數據）
