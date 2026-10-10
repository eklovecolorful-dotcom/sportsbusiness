import type { ScheduleSource } from "@/lib/sports-data/provider";

/** Explains why no (or only demo) games are shown. Renders nothing for live data. */
export function DataSourceNotice({ source }: { source: ScheduleSource }) {
  if (source === "live") return null;
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      {source === "none" ? (
        <>
          <p className="font-bold">即時賽程與比分尚未連線</p>
          <p className="mt-1">
            本站只使用授權資料供應商的賽程與比分（ADR-0001）。授權資料源接上之前不顯示比賽，以免出現錯誤的對戰或比數。
            下方列出已查證的近期重要賽事日期。
          </p>
        </>
      ) : (
        <p>
          <strong>示範模式：</strong>以下對戰組合為隨機產生的版面測試資料，不是真實賽程，也不顯示比分。
        </p>
      )}
    </div>
  );
}
