# Sports — 美國三大職業運動・台灣時間賽程 × 運動商業週報

依《美國三大職業運動：商業產業 × 賽事 × 中文平台事業手冊》（Playbook 02）建立的 Next.js 專案。

**三層產品**：免費台灣時間賽程與台灣球員追蹤 → 付費運動商業週報（Stripe）→ 美國觀賽旅遊（轉介合法旅行社）。

## 技術棧

| 項目 | 選擇 |
|---|---|
| 框架 | Next.js 16 App Router（Cache Components、Partial Prefetching）、TypeScript |
| 樣式 | Tailwind CSS v4，390px 手機優先 |
| 資料庫／登入 | Supabase（Postgres + RLS + Email magic link） |
| 金流 | Stripe Checkout + Customer Portal + Webhook |
| 排程 | Vercel Cron 每 15 分鐘同步賽程 |
| Email | Resend（觀賽詢價轉寄旅行社） |
| 測試 | Vitest（時區／夏令時間） |

## 快速開始（不需任何帳號）

```bash
npm install
npm run dev        # http://localhost:3000
```

沒有設定 Supabase 時，網站會使用**示範資料**（`src/lib/sports-data/mock.ts`、`content/brief/*.md`），每張賽程卡都會標示「示範資料」。

## 接上正式服務

```bash
cp .env.example .env.local   # 填入下列各項
```

### 1. Supabase

1. 到 [supabase.com](https://supabase.com) 建立專案，把 URL、Publishable key、Secret key 填進 `.env.local`
2. 套用資料表與 RLS，並匯入 92 支球隊：
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-ref>
   npm run db:push                       # supabase/migrations/*
   # 再到 Dashboard → SQL Editor 執行 supabase/seed.sql
   ```
3. Authentication → URL Configuration：Site URL 設為正式網址，Redirect URLs 加上 `https://<domain>/auth/callback`

### 2. Stripe

1. 建立產品「運動商業週報」與月繳、年繳兩個 recurring Price，把 Price ID 填進 `STRIPE_PRICE_BRIEF_MONTHLY` / `STRIPE_PRICE_BRIEF_YEARLY`
2. 本機測試 webhook：
   ```bash
   npm run stripe:listen     # 把顯示的 whsec_... 填進 STRIPE_WEBHOOK_SECRET
   ```
3. 正式環境：Webhook endpoint 設為 `https://<domain>/api/stripe/webhook`，訂閱事件：
   `checkout.session.completed`、`customer.subscription.created|updated|deleted`
4. 啟用 Customer Portal（Settings → Billing → Customer portal）
5. `/pricing` 頁顯示的價格目前是佔位文字，記得在 `src/lib/stripe.ts` 改成跟 Stripe Price 一致

### 3. 賽程資料（ADR-0001）

- **開發預覽**：`SPORTS_DATA_PROVIDER=espn` 會讀取 ESPN 公開比分（真實賽程與比分，免金鑰）。它不是授權資料，Vercel 正式環境會自動停用。
- **未連線**：`mock` 不顯示任何比賽（避免錯誤比分）；`DEMO_SCHEDULE=true` 只顯示隨機版面測試資料，不顯示比分。
- **正式上線**：簽好商用授權後改成 `sportsdataio`、填入 `SPORTSDATAIO_API_KEY`，並先對照你方案的 API 文件，確認 `src/lib/sports-data/sportsdataio.ts` 裡的欄位對應。

### 4. Vercel

- 在 Vercel 匯入專案、設定所有環境變數（包含 `CRON_SECRET`）
- `vercel.json` 已設定每 15 分鐘的 Cron。**注意：每 15 分鐘的頻率需要 Vercel Pro；Hobby 方案只能每天執行一次。**

## 專案結構

```
src/
  app/
    page.tsx                       首頁：今日賽程、MLB 勞資倒數、三層產品
    schedule/[league]/             台灣時間賽程（?date=YYYY-MM-DD）
    teams/[league]/[team]/         92 支球隊靜態頁（SEO）
    leagues/[league]/              聯盟入門：賽制、季後賽、制度、重要日期
    calendar/                      三大聯盟重要日期
    insights/ · insights/[slug]/   深度分析：經營模式、營運、商業故事（content/insights/*.md）
    business/ · business/topics/[topic]/  產業商業與主題頻道（轉播權、勞資…）
    brief/ · brief/[slug]/         週報列表／內文（RLS 付費牆）
    pricing/ · account/            訂閱方案／我的帳號
    trips/                         觀賽詢價（UC-03：2027 MLB 只收候補）
    login/ · auth/callback/        Email magic link
    api/stripe/{checkout,portal,webhook}
    api/cron/sync-schedule/        Vercel Cron → 授權 API → upsert games
    legal/                         隱私權、退款（草稿）、免責聲明
  components/                      GameCard、PaywallCard、TopicChips…
  lib/
    time.ts (+ test)               UTC ↔ Asia/Taipei，夏令時間安全
    catalog.ts                     聯盟、球隊（seed 的來源）
    data/                          'use cache' 資料存取層
    sports-data/                   資料供應商介面：mock / SportsDataIO
    supabase/                      server / client / public / admin / proxy
  proxy.ts                         更新 Supabase session、保護 /account
supabase/migrations/               0001_core.sql、0002_billing_content.sql
features/                          BDD 規格（台灣時間、付費牆、觀賽詢價）
docs/                              P1–P8 規劃文件、ADR、12 週路線
.claude/commands/                  /weekly-biz-brief、/sync-schedule、/gen-team-pages、/implement
content/brief/                     週報 Markdown
```

## 常用指令

| 指令 | 用途 |
|---|---|
| `npm run dev` / `build` / `start` | 開發／建置／正式啟動 |
| `npm test` | 時區與夏令時間測試 |
| `npm run typecheck` / `lint` | 型別檢查／ESLint |
| `npm run db:seed:gen` | 由 `catalog.ts` 重新產生 `supabase/seed.sql` |
| `npm run db:push` | 套用 migrations |
| `npm run brief:publish 2026-41` | 發佈已查證的週報（內文還有 `[待查證]` 時會拒絕發佈） |

## 三條紅線

1. 不使用聯盟／球隊 Logo 與比賽影片（球隊只用文字與中性色塊）
2. 不推廣境外博弈（不放賠率、明牌、下注連結）
3. 觀賽行程由合法旅行社承辦與收費

上線前檢查清單見 `docs/roadmap.md`。
