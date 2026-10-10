export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="載入中">
      <div className="h-8 w-48 rounded-lg bg-slate-200" />
      <div className="h-4 w-72 rounded bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
