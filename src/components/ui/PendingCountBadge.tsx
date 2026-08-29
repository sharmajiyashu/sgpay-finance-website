export function PendingCountBadge({
  count,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  if (!count || count <= 0) return null;

  return (
    <span
      className={`inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-slate-900 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
