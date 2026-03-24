export function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: Record<string, unknown>; color?: string; name?: string; value?: unknown }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-xl border border-border p-3 text-xs text-text max-w-[260px]"
      style={{ background: 'var(--color-card)', boxShadow: '0 12px 40px rgba(0,0,0,.25)' }}>
      <div className="font-bold mb-1">
        {(d.chip as string) || (d.name as string)} {d.ram ? `${d.ram}GB` : ''}
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-1.5 items-center" style={{ color: 'var(--color-sub)' }}>
          <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: p.color }} />
          {p.name}: <strong className="text-text">
            {typeof p.value === 'number' ? p.value.toLocaleString() : String(p.value)}
          </strong>
        </div>
      ))}
    </div>
  );
}
