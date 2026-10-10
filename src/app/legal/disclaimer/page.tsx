import type { Metadata } from "next";

export const metadata: Metadata = { title: "免責聲明" };

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-black text-slate-900">免責聲明</h1>
      <p>本站與 NFL、NBA、MLB 及其所屬球隊無任何關聯。球隊名稱僅作識別用途，本站不使用任何聯盟或球隊商標、官方字體與比賽影像。</p>
      <p>營收、估值等數字為公開報導之估算，非經審計之財務報表，並均附來源。投資、購票前請以官方最新公告為準。</p>
      <p>本站可能分析運動博弈產業之商業模式，但不提供賠率、明牌或任何博弈網站連結。台灣境內僅台灣運彩為合法運動彩券。</p>
      <p>觀賽旅遊由合作之合法旅行社承辦、收費並開立代收轉付收據；本站提供行程設計與中文導覽內容。</p>
    </article>
  );
}
