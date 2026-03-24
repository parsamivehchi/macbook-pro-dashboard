interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function StatCard({ label, value, sub, color = 'var(--color-accent)' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-extrabold" style={{ color }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px]" style={{ color: 'var(--color-sub)' }}>{sub}</div>}
    </div>
  );
}
