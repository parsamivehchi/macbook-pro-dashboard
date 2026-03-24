import { fmt } from '../../utils/format';

interface DeltaBarProps {
  label: string;
  a: number | null;
  b: number | null;
  unit?: string;
  higherBetter?: boolean;
}

export function DeltaBar({ label, a, b, unit = '', higherBetter = true }: DeltaBarProps) {
  if (a == null || b == null) return null;
  const pctVal = b !== 0 ? Math.round(((a - b) / b) * 100) : 0;
  const aWins = higherBetter ? a >= b : a <= b;

  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold" style={{ color: 'var(--color-sub)' }}>{label}</span>
        <span
          className="font-bold font-mono text-[11px]"
          style={{ color: pctVal === 0 ? 'var(--color-muted)' : aWins ? 'var(--color-green)' : 'var(--color-red)' }}
        >
          {pctVal > 0 ? '+' : ''}{pctVal}%
        </span>
      </div>
      <div className="flex gap-1 items-center">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
            <div
              className="h-full rounded-full transition-all duration-800"
              style={{
                background: aWins ? 'var(--color-green)' : 'var(--color-red)',
                width: `${Math.min(100, (a / Math.max(a, b)) * 100)}%`,
              }}
            />
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
            <div
              className="h-full rounded-full transition-all duration-800"
              style={{
                background: !aWins ? 'var(--color-green)' : 'var(--color-red)',
                width: `${Math.min(100, (b / Math.max(a, b)) * 100)}%`,
              }}
            />
          </div>
        </div>
        <div className="min-w-[70px] text-right font-mono text-[11px]">
          <div style={{ color: aWins ? 'var(--color-green)' : 'var(--color-text)' }}>{fmt(a)}{unit}</div>
          <div style={{ color: !aWins ? 'var(--color-green)' : 'var(--color-text)' }}>{fmt(b)}{unit}</div>
        </div>
      </div>
    </div>
  );
}
