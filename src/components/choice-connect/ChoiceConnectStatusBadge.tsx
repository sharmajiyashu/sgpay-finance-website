export function ChoiceConnectStatusBadge({
  onboarded,
  agentCode,
}: {
  onboarded?: boolean;
  agentCode?: string;
}) {
  if (onboarded) {
    return (
      <span className="inline-flex flex-col gap-0.5">
        <span className="w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
          Onboarded
        </span>
        {agentCode ? (
          <span className="font-mono text-[11px] text-muted-foreground">{agentCode}</span>
        ) : null}
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
      Pending
    </span>
  );
}
