import type { Metadata } from "next";

export const metadata: Metadata = { title: "隱私權政策" };

// DRAFT — P7 go-live gate: have this reviewed before launch.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-black text-slate-900">隱私權政策（草稿）</h1>
      <p>我們蒐集的資料：Email（登入與寄送週報）、追蹤的球隊與球員、觀賽旅遊需求表單內容、訂閱狀態。</p>
      <p>付款資料由 Stripe 處理，本站不儲存信用卡號碼。</p>
      <p>觀賽旅遊需求僅轉交合作之合法旅行社，用於提供報價與行程服務。</p>
      <p>你可以隨時來信要求查詢、更正或刪除個人資料。</p>
    </article>
  );
}
