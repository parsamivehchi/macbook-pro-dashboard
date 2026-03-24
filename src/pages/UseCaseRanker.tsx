import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, fD } from '../utils/format';
import { USE_CASES, scoreUseCase } from '../data/use-cases';

const METRIC_KEYS = ['g6s', 'g6m', 'g6g', 'bw', 'l7', 'ram', 'bat', 'ssd'] as const;
type MetricKey = (typeof METRIC_KEYS)[number];

const METRIC_LABELS: Record<MetricKey, string> = {
  g6s: 'Geekbench Single',
  g6m: 'Geekbench Multi',
  g6g: 'Geekbench GPU',
  bw: 'Memory Bandwidth',
  l7: 'LLM (Llama 7B)',
  ram: 'RAM',
  bat: 'Battery Life',
  ssd: 'SSD Speed',
};

const PARSA_WEIGHTS: Record<MetricKey, number> = {
  g6s: 5, bw: 4, ram: 3, ssd: 3, bat: 3, l7: 4, g6m: 0, g6g: 0,
};

const UC_ICONS = [
  '\u2328\uFE0F', '\u{1F9E0}', '\u{1F3A8}', '\u{1F50B}',
  '\u{1F4CA}', '\u{1F916}', '\u{1F3AC}', '\u26A1',
];

export default function UseCaseRanker() {
  const { filtered } = useFilters();
  const [selectedUC, setSelectedUC] = useState(0);
  const [customWeights, setCustomWeights] = useState<Record<MetricKey, number>>(
    Object.fromEntries(METRIC_KEYS.map((k) => [k, 0])) as Record<MetricKey, number>,
  );
  const [useCustom, setUseCustom] = useState(false);

  const ranked = useMemo(() => {
    const chips = filtered.length > 0 ? filtered : CHIPS;
    const scored = chips.map((c) => {
      const score = useCustom
        ? scoreUseCase(c, { id: 'custom', name: 'Custom', icon: '', weights: customWeights })
        : scoreUseCase(c, USE_CASES[selectedUC]);
      return { ...c, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 12);
  }, [filtered, selectedUC, customWeights, useCustom]);

  const activeLabel = useCustom ? 'Custom Weights' : USE_CASES[selectedUC]?.name ?? '';

  return (
    <div className="space-y-8">
      <PageHeader
        icon="\u{1F3AF}"
        title="Use Case Ranker"
        subtitle="Score and rank chips by workload profile"
      />

      {/* Use case selector */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-sub)' }}>
          Select Use Case
        </h2>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc, i) => (
            <button
              key={uc.name}
              onClick={() => { setSelectedUC(i); setUseCustom(false); }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: !useCustom && selectedUC === i ? 'var(--color-accent)' : 'var(--color-surface)',
                color: !useCustom && selectedUC === i ? '#000' : 'var(--color-text)',
                border: '1px solid',
                borderColor: !useCustom && selectedUC === i ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              <span className="mr-1.5">{UC_ICONS[i] ?? '\u2699\uFE0F'}</span>
              {uc.name}
            </button>
          ))}
        </div>
      </section>

      {/* Ranked results */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-sub)' }}>
          Top 12 &mdash; {activeLabel}
        </h2>
        <div className="space-y-2">
          {ranked.map((chip, i) => {
            const genColor = GEN_COLORS[chip.gen] ?? 'var(--color-text)';
            const isFirst = i === 0;
            const isTop3 = i < 3;
            return (
              <div
                key={chip.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isFirst
                    ? 'color-mix(in srgb, var(--color-accent) 12%, var(--color-card))'
                    : isTop3
                      ? 'color-mix(in srgb, var(--color-accent) 5%, var(--color-card))'
                      : 'var(--color-card)',
                  border: '1px solid',
                  borderColor: isFirst ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                {/* Rank badge */}
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isFirst ? 'var(--color-accent)' : isTop3 ? 'var(--color-surface)' : 'transparent',
                    color: isFirst ? '#000' : 'var(--color-sub)',
                    border: isFirst ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {i + 1}
                </span>

                {/* Chip name */}
                <span className="flex-1 font-semibold text-sm" style={{ color: genColor }}>
                  {chip.chip}
                </span>

                {/* Score */}
                <span className="text-right w-16 font-mono text-sm" style={{ color: 'var(--color-text)' }}>
                  {chip.score.toFixed(1)}<span style={{ color: 'var(--color-muted)' }}>/100</span>
                </span>

                {/* Price */}
                <span className="text-right w-20 text-xs" style={{ color: 'var(--color-sub)' }}>
                  {chip.msrp ? fD(chip.msrp) : '--'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bar chart */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-sub)' }}>Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ranked} layout="vertical" margin={{ left: 120, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <YAxis
              dataKey="chip"
              type="category"
              tick={{ fill: 'var(--color-text)', fontSize: 11 }}
              width={110}
            />
            <RTooltip
              contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--color-text)' }}
              itemStyle={{ color: 'var(--color-sub)' }}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]}>
              {ranked.map((c, i) => (
                <Cell key={c.id} fill={GEN_COLORS[c.gen] ?? 'var(--color-accent)'} opacity={i === 0 ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Custom weight builder */}
      <section
        className="rounded-2xl p-6 space-y-5"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-sub)' }}>Custom Weight Builder</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCustomWeights({ ...PARSA_WEIGHTS });
                setUseCustom(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
              }}
            >
              Parsa's Workflow
            </button>
            <button
              onClick={() => {
                setCustomWeights(Object.fromEntries(METRIC_KEYS.map((k) => [k, 0])) as Record<MetricKey, number>);
                setUseCustom(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRIC_KEYS.map((key) => (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--color-text)' }}>{METRIC_LABELS[key]}</span>
                <span className="font-mono" style={{ color: 'var(--color-accent)' }}>{customWeights[key]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={customWeights[key]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomWeights((prev) => ({ ...prev, [key]: val }));
                  setUseCustom(true);
                }}
                className="w-full accent-[var(--color-accent)] h-1.5"
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--color-muted)' }}>
                <span>0</span>
                <span>5</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
