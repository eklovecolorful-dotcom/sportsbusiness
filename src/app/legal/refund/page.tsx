import type { Metadata } from "next";

export const metadata: Metadata = { title: "訂閱退款政策" };

// DRAFT — P7 go-live gate: have this reviewed before launch.
export default function RefundPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-black text-slate-900">訂閱退款政策（草稿）</h1>
      <p>付費週報為數位內容，可隨時於「我的帳號 → 管理訂閱」取消，取消後於當期結束前仍可閱讀。</p>
      <p>首次訂閱 7 天內未閱讀任何付費文章者，可來信申請全額退款。</p>
      <p>觀賽旅遊之費用與退款依合作旅行社之旅遊契約辦理，並附延賽／取消條款。</p>
    </article>
  );
}
