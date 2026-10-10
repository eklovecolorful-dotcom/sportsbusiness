import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-xs text-slate-500">
        <p>
          本站與 NFL、NBA、MLB 及各球隊無任何關聯，不使用聯盟或球隊商標與比賽影像。賽程資料來自授權資料供應商。
        </p>
        <p>本站不提供賠率、明牌或任何博弈網站連結。台灣境內僅台灣運彩為合法運動彩券。</p>
        <p>觀賽旅遊由合作之合法旅行社承辦與收費，本站僅提供行程設計與中文導覽內容。</p>
        <nav className="flex flex-wrap gap-4 pt-2">
          <Link href="/legal/privacy" className="hover:underline">隱私權政策</Link>
          <Link href="/legal/refund" className="hover:underline">訂閱退款政策</Link>
          <Link href="/legal/disclaimer" className="hover:underline">免責聲明</Link>
        </nav>
      </div>
    </footer>
  );
}
