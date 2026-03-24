import { useState, useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { GEN_COLORS, label } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import { Pill } from '../components/shared/Pill';
import type { ChipConfig } from '../data/chips';

type ViewMode = 'heatmap' | 'checklist';

interface HeatmapMetric {
  key: keyof ChipConfig;
  label: string;
  unit: string;
}

const HEATMAP_METRICS: HeatmapMetric[] = [
  { key: 'g6s', label: 'SC', unit: '' },
  { key: 'g6m', label: 'MC', unit: '' },
  { key: 'g6g', label: 'GPU', unit: '' },
  { key: 'bw', label: 'BW', unit: ' GB/s' },
  { key: 'l7', label: '7B', unit: ' tok/s' },
  { key: 'l14', label: '14B', unit: ' tok/s' },
  { key: 'tops', label: 'TOPS', unit: '' },
  { key: 'bat', label: 'Battery', unit: ' hrs' },
  { key: 'ssd', label: 'SSD', unit: '' },
  { key: 'nit', label: 'Nits', unit: '' },
  { key: 'ram', label: 'RAM', unit: ' GB' },
];

interface FeatureRow {
  label: string;
  getValue: (c: ChipConfig) => string;
  getColor: (val: string) => string;
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    label: 'Thunderbolt',
    getValue: c => c.tb,
    getColor: v => v === 'TB5' ? 'var(--color-green)' : v === 'TB4' ? 'var(--color-accent)' : 'var(--color-amber)',
  },
  {
    label: 'WiFi',
    getValue: c => `WiFi ${c.wifi}`,
    getColor: v => v.includes('7') ? 'var(--color-green)' : 'var(--color-accent)',
  },
  {
    label: 'Camera',
    getValue: c => c.cam,
    getColor: v => v === '12MP' ? 'var(--color-green)' : 'var(--color-muted)',
  },
  {
    label: 'Ray Tracing',
    getValue: c => {
      if (c.gen === 'M2') return 'None';
      if (c.gen === 'M3') return 'Gen 1';
      if (c.gen === 'M4') return 'Gen 2';
      return 'Gen 3';
    },
    getColor: v => {
      if (v === 'None') return 'var(--color-muted)';
      if (v === 'Gen 1') return 'var(--color-amber)';
      if (v === 'Gen 2') return 'var(--color-accent)';
      return 'var(--color-green)';
    },
  },
  {
    label: 'AV1 Encode',
    getValue: c => c.gen === 'M2' || c.gen === 'M3' ? 'Decode Only' : 'Encode + Decode',
    getColor: v => v.includes('Encode') ? 'var(--color-green)' : 'var(--color-muted)',
  },
  {
    label: 'Nano-texture',
    getValue: c => (c.gen === 'M4' || c.gen === 'M5') && c.tier !== 'Base' ? 'Available' : 'N/A',
    getColor: v => v === 'Available' ? 'var(--color-accent)' : 'var(--color-muted)',
  },
  {
    label: 'ProRes Engine',
    getValue: c => c.tier === 'Max' ? 'Dual' : c.tier === 'Pro' ? 'Single' : 'Single',
    getColor: v => v === 'Dual' ? 'var(--color-green)' : 'var(--color-sub)',
  },
];

function heatColor(ratio: number): string {
  // 0 = cold (muted), 1 = hot (green)
  if (ratio < 0.25) return 'rgba(85, 85, 112, 0.3)';
  if (ratio < 0.50) return 'rgba(59, 130, 246, 0.25)';
  if (ratio < 0.75) return 'rgba(52, 211, 153, 0.25)';
  return 'rgba(52, 211, 153, 0.45)';
}

function heatTextColor(ratio: number): string {
  if (ratio < 0.25) return 'var(--color-muted)';
  if (ratio < 0.75) return 'var(--color-sub)';
  return 'var(--color-green)';
}

export default function FeaturesMatrix() {
  const { filtered } = useFilters();
  const [mode, setMode] = useState<ViewMode>('heatmap');

  // Compute min/max for each heatmap metric
  const ranges = useMemo(() => {
    const r: Record<string, { min: number; max: number }> = {};
    HEATMAP_METRICS.forEach(m => {
      const vals = filtered
        .map(c => (c as Record<string, unknown>)[m.key as string])
        .filter((v): v is number => v != null && typeof v === 'number');
      r[m.key as string] = {
        min: vals.length ? Math.min(...vals) : 0,
        max: vals.length ? Math.max(...vals) : 1,
      };
    });
    return r;
  }, [filtered]);

  const getRatio = (chip: ChipConfig, key: string): number => {
    const v = (chip as Record<string, unknown>)[key];
    if (v == null || typeof v !== 'number') return -1;
    const { min, max } = ranges[key] || { min: 0, max: 1 };
    const range = max - min || 1;
    return (v - min) / range;
  };

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\uD83D\uDD32"
        title="Features Matrix"
        subtitle={`${filtered.length} configurations -- heatmap intensities & discrete features`}
      />

      {/* View Toggle */}
      <div className="flex gap-2 mb-5">
        <Pill
          label="Numeric Heatmap"
          active={mode === 'heatmap'}
          color="var(--color-accent)"
          onClick={() => setMode('heatmap')}
        />
        <Pill
          label="Feature Checklist"
          active={mode === 'checklist'}
          color="var(--color-green)"
          onClick={() => setMode('checklist')}
        />
      </div>

      {mode === 'heatmap' ? (
        /* Numeric Heatmap */
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
                <th
                  className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-widest sticky left-0"
                  style={{ color: 'var(--color-muted)', background: 'var(--color-card)', zIndex: 1 }}
                >
                  Chip
                </th>
                {HEATMAP_METRICS.map(m => (
                  <th
                    key={m.key as string}
                    className="px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)',
                  }}
                >
                  <td
                    className="px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap sticky left-0"
                    style={{ color: GEN_COLORS[c.gen], background: i % 2 === 0 ? 'var(--color-card)' : 'var(--color-surface)', zIndex: 1 }}
                  >
                    {label(c)}
                  </td>
                  {HEATMAP_METRICS.map(m => {
                    const v = (c as Record<string, unknown>)[m.key as string];
                    const ratio = getRatio(c, m.key as string);
                    const isNull = v == null || ratio < 0;
                    return (
                      <td
                        key={m.key as string}
                        className="px-2 py-1.5 text-center font-mono text-[10px]"
                        style={{
                          background: isNull ? 'transparent' : heatColor(ratio),
                          color: isNull ? 'var(--color-muted)' : heatTextColor(ratio),
                        }}
                      >
                        {isNull ? '\u2014' : typeof v === 'number' ? v.toLocaleString() : String(v)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-[13px]" style={{ color: 'var(--color-muted)' }}>
              No chips match your filters.
            </div>
          )}
          {/* Heatmap Legend */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-muted)' }}>
              Intensity
            </span>
            <div className="flex gap-1">
              {[0.1, 0.35, 0.6, 0.9].map(r => (
                <div
                  key={r}
                  className="w-6 h-3 rounded"
                  style={{ background: heatColor(r) }}
                />
              ))}
            </div>
            <span className="text-[9px]" style={{ color: 'var(--color-muted)' }}>Low \u2192 High</span>
          </div>
        </div>
      ) : (
        /* Feature Checklist */
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
                <th
                  className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-widest sticky left-0"
                  style={{ color: 'var(--color-muted)', background: 'var(--color-card)', zIndex: 1 }}
                >
                  Chip
                </th>
                {FEATURE_ROWS.map(f => (
                  <th
                    key={f.label}
                    className="px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)',
                  }}
                >
                  <td
                    className="px-3 py-2 text-[11px] font-semibold whitespace-nowrap sticky left-0"
                    style={{ color: GEN_COLORS[c.gen], background: i % 2 === 0 ? 'var(--color-card)' : 'var(--color-surface)', zIndex: 1 }}
                  >
                    {label(c)}
                  </td>
                  {FEATURE_ROWS.map(f => {
                    const val = f.getValue(c);
                    const color = f.getColor(val);
                    return (
                      <td key={f.label} className="px-2 py-2 text-center">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{
                            color,
                            background: color + '18',
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {val}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-[13px]" style={{ color: 'var(--color-muted)' }}>
              No chips match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
