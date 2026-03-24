interface InsightCardProps {
  title: string;
  body: string;
  accent?: string;
}

export function InsightCard({ title, body, accent = 'var(--color-accent)' }: InsightCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5" style={{ borderLeftWidth: 3, borderLeftColor: accent }}>
      <div className="font-bold text-[13px] mb-1.5 text-text">{title}</div>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--color-sub)' }}>{body}</div>
    </div>
  );
}
