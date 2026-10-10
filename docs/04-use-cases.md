# P3 · Use Cases

| UC | 主流程 | 例外 | 實作 |
|---|---|---|---|
| UC-01 | 選擇聯盟 → 今日賽程（台灣時間）→ 球隊頁 | 延賽 → 推播更新 | `src/app/schedule/[league]/page.tsx`, `src/app/api/cron/sync-schedule/route.ts`（寫入 `notifications` outbox） |
| UC-02 | 訂閱付費週報 → Stripe Checkout → 解鎖文章 | 付款失敗 → 保留免費版 | `src/app/api/stripe/*`, RLS `brief body by entitlement` |
| UC-03 | 填寫觀賽需求 → 比對賽程 → 轉介合作旅行社 | MLB 2027 未定 → 顯示勞資風險、改登記候補 | `src/app/trips/*`, `src/lib/trips.ts` |

BDD: `features/*.feature`
