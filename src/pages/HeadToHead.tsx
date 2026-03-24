import { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, label } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import { ChipSelect } from '../components/shared/ChipSelect';
import { DeltaBar } from '../components/shared/DeltaBar';
import { CustomTooltip } from '../components/shared/CustomTooltip';
import { Pill } from '../components/shared/Pill';

const PRESETS: { label: string; a: string; b: string }[] = [
  { label: 'M4 Pro vs M5 Pro', a: 'm4pro-14-20-24', b: 'm5pro-18-20-24' },
  { label: 'M3 Max vs M5 Max', a: 'm3max-16-40-48', b: 'm5max-18-40-48' },
  { label: 'M2 Pro vs M4 Pro', a: 'm2pro-12-19-16', b: 'm4pro-14-20-24' },
  { label: 'M4 Base vs M5 Base', a: 'm4-10-10-16', b: 'm5-10-10-16' },
  { label: 'M5 Pro vs M5 Max', a: 'm5pro-18-20-24', b: 'm5max-18-40-48' },
];

function normalize(val: number | null, max: number): number {
  if (val == null) return 0;
  return Math.round((val / max) * 100);
}

export default function HeadToHead() {
  useFilters();
  const [idA, setIdA] = useState('m4pro-14-20-24');
  const [idB, setIdB] = useState('m5pro-18-20-24');

  const chipA = CHIPS.find(c => c.id === idA);
  const chipB = CHIPS.find(c => c.id === idB);

  const maxes = useMemo(() => ({
    g6s: Math.max(...CHIPS.map(c => c.g6s)),
    g6m: Math.max(...CHIPS.map(c => c.g6m)),
    g6g: Math.max(...CHIPS.map(c => c.g6g)),
    bw: Math.max(...CHIPS.map(c => c.bw)),
    l7: Math.max(...CHIPS.filter(c => c.l7 != null).map(c => c.l7!)),
    bat: Math.max(...CHIPS.map(c => c.bat)),
    ssd: Math.max(...CHIPS.map(c => c.ssd)),
    tops: Math.max(...CHIPS.map(c => c.tops)),
  }), []);

  const radarData = useMemo(() => {
    if (!chipA || !chipB) return [];
    return [
      { metric: 'SC', A: normalize(chipA.g6s, maxes.g6s), B: normalize(chipB.g6s, maxes.g6s) },
      { metric: 'MC', A: normalize(chipA.g6m, maxes.g6m), B: normalize(chipB.g6m, maxes.g6m) },
      { metric: 'GPU', A: normalize(chipA.g6g, maxes.g6g), B: normalize(chipB.g6g, maxes.g6g) },
      { metric: 'BW', A: normalize(chipA.bw, maxes.bw), B: normalize(chipB.bw, maxes.bw) },
      { metric: 'LLM 7B', A: normalize(chipA.l7, maxes.l7), B: normalize(chipB.l7, maxes.l7) },
      { metric: 'Battery', A: normalize(chipA.bat, maxes.bat), B: normalize(chipB.bat, maxes.bat) },
      { metric: 'SSD', A: normalize(chipA.ssd, maxes.ssd), B: normalize(chipB.ssd, maxes.ssd) },
      { metric: 'TOPS', A: normalize(chipA.tops, maxes.tops), B: normalize(chipB.tops, maxes.tops) },
    ];
  }, [chipA, chipB, maxes]);

  const verdict = useMemo(() => {
    if (!chipA || !chipB) return { aWins: 0, bWins: 0, tie: 0, summary: '' };
    const metrics = [
      { name: 'SC', a: chipA.g6s, b: chipB.g6s, hb: true },
      { name: 'MC', a: chipA.g6m, b: chipB.g6m, hb: true },
      { name: 'GPU', a: chipA.g6g, b: chipB.g6g, hb: true },
      { name: 'BW', a: chipA.bw, b: chipB.bw, hb: true },
      { name: 'LLM 7B', a: chipA.l7 ?? 0, b: chipB.l7 ?? 0, hb: true },
      { name: 'LLM 14B', a: chipA.l14 ?? 0, b: chipB.l14 ?? 0, hb: true },
      { name: 'Battery', a: chipA.bat, b: chipB.bat, hb: true },
      { name: 'SSD', a: chipA.ssd, b: chipB.ssd, hb: true },
      { name: 'Price', a: chipA.st, b: chipB.st, hb: false },
    ];
    let aW = 0, bW = 0, tie = 0;
    metrics.forEach(m => {
      const aWins = m.hb ? m.a > m.b : m.a < m.b;
      const bWins = m.hb ? m.b > m.a : m.b < m.a;
      if (aWins) aW++;
      else if (bWins) bW++;
      else tie++;
    });
    const winner = aW > bW ? label(chipA) : aW < bW ? label(chipB) : 'Tie';
    const summary = aW === bW
      ? 'Dead even across all metrics. Choose based on generation preference or feature needs.'
      : `${winner} wins ${Math.max(aW, bW)} of 9 metrics. ${aW > bW ? label(chipB) : label(chipA)} takes ${Math.min(aW, bW)}${tie ? ` (${tie} tied)` : ''}.`;
    return { aWins: aW, bWins: bW, tie, summary };
  }, [chipA, chipB]);

  const colorA = chipA ? GEN_COLORS[chipA.gen] : 'var(--color-accent)';
  const colorB = chipB ? GEN_COLORS[chipB.gen] : 'var(--color-green)';

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\u2694\uFE0F"
        title="Head-to-Head"
        subtitle="Compare any two MacBook Pro configurations across every metric"
      />

      {/* Chip Selectors */}
      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: colorA }}>
            Chip A
          </div>
          <ChipSelect value={idA} onChange={setIdA} exclude={[idB]} />
        </div>
        <button
          onClick={() => { setIdA(idB); setIdB(idA); }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-[18px] cursor-pointer hover:border-accent transition-colors mt-3"
          style={{ background: 'var(--color-card)' }}
          title="Swap chips"
        >
          \u21C4
        </button>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: colorB }}>
            Chip B
          </div>
          <ChipSelect value={idB} onChange={setIdB} exclude={[idA]} />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PRESETS.map(p => (
          <Pill
            key={p.label}
            label={p.label}
            active={idA === p.a && idB === p.b}
            color="var(--color-accent)"
            onClick={() => { setIdA(p.a); setIdB(p.b); }}
            small
          />
        ))}
      </div>

      {chipA && chipB && (
        <>
          {/* Radar + Deltas Layout */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Radar Chart */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
                Performance Radar (Normalized 0-100)
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: 'var(--color-sub)', fontSize: 11, fontFamily: 'var(--font-display)' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--color-muted)', fontSize: 9 }}
                    axisLine={false}
                  />
                  <Radar name={label(chipA)} dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.15} strokeWidth={2} />
                  <Radar name={label(chipB)} dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.15} strokeWidth={2} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-display)', color: 'var(--color-sub)' }}
                  />
                  <RTooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Delta Bars */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
                Metric Comparison
              </div>
              <div className="flex items-center gap-3 mb-4 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-[8px] h-[8px] rounded-full inline-block" style={{ background: colorA }} />
                  <span style={{ color: colorA }}>{label(chipA)}</span>
                </span>
                <span style={{ color: 'var(--color-muted)' }}>vs</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-[8px] h-[8px] rounded-full inline-block" style={{ background: colorB }} />
                  <span style={{ color: colorB }}>{label(chipB)}</span>
                </span>
              </div>
              <DeltaBar label="Single-Core" a={chipA.g6s} b={chipB.g6s} />
              <DeltaBar label="Multi-Core" a={chipA.g6m} b={chipB.g6m} />
              <DeltaBar label="Metal GPU" a={chipA.g6g} b={chipB.g6g} />
              <DeltaBar label="Bandwidth" a={chipA.bw} b={chipB.bw} unit=" GB/s" />
              <DeltaBar label="LLM 7B" a={chipA.l7} b={chipB.l7} unit=" tok/s" />
              <DeltaBar label="LLM 14B" a={chipA.l14} b={chipB.l14} unit=" tok/s" />
              <DeltaBar label="Battery" a={chipA.bat} b={chipB.bat} unit=" hrs" />
              <DeltaBar label="SSD Speed" a={chipA.ssd} b={chipB.ssd} unit=" MB/s" />
              <DeltaBar label="Street Price" a={chipA.st} b={chipB.st} higherBetter={false} />
            </div>
          </div>

          {/* Verdict */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-accent)' }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[13px] font-bold" style={{ color: 'var(--color-text)' }}>Verdict</div>
              <div className="flex gap-2 font-mono text-[12px]">
                <span style={{ color: colorA }}>{label(chipA)}: {verdict.aWins}</span>
                <span style={{ color: 'var(--color-muted)' }}>|</span>
                <span style={{ color: colorB }}>{label(chipB)}: {verdict.bWins}</span>
                {verdict.tie > 0 && (
                  <>
                    <span style={{ color: 'var(--color-muted)' }}>|</span>
                    <span style={{ color: 'var(--color-muted)' }}>Tied: {verdict.tie}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-[12px] leading-relaxed" style={{ color: 'var(--color-sub)' }}>
              {verdict.summary}
            </div>
          </div>

          {/* Features Comparison Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-widest p-4 pb-2" style={{ color: 'var(--color-muted)' }}>
              Features Comparison
            </div>
            <table className="w-full text-[12px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left px-4 py-2 font-semibold" style={{ color: 'var(--color-muted)' }}>Feature</th>
                  <th className="text-center px-4 py-2 font-semibold" style={{ color: colorA }}>{label(chipA)}</th>
                  <th className="text-center px-4 py-2 font-semibold" style={{ color: colorB }}>{label(chipB)}</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { feat: 'Thunderbolt', key: 'tb' },
                  { feat: 'WiFi', key: 'wifi' },
                  { feat: 'Camera', key: 'cam' },
                  { feat: 'Brightness', key: 'nit', suffix: ' nits' },
                  { feat: 'SSD Speed', key: 'ssd', suffix: ' MB/s' },
                  { feat: 'RAM', key: 'ram', suffix: ' GB' },
                  { feat: 'Process', key: 'process' },
                  { feat: 'TOPS', key: 'tops' },
                  { feat: 'MSRP', key: 'msrp', dollar: true },
                  { feat: 'Street Price', key: 'st', dollar: true },
                ] as const).map((row) => {
                  const valA = (chipA as Record<string, unknown>)[row.key];
                  const valB = (chipB as Record<string, unknown>)[row.key];
                  const fmtVal = (v: unknown) => {
                    if (v == null) return '\u2014';
                    if ('dollar' in row && row.dollar) return `$${Number(v).toLocaleString()}`;
                    if ('suffix' in row && row.suffix) return `${Number(v).toLocaleString()}${row.suffix}`;
                    return String(v);
                  };
                  return (
                    <tr key={row.feat} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-4 py-2 font-semibold" style={{ color: 'var(--color-sub)' }}>{row.feat}</td>
                      <td className="text-center px-4 py-2 font-mono" style={{ color: 'var(--color-text)' }}>{fmtVal(valA)}</td>
                      <td className="text-center px-4 py-2 font-mono" style={{ color: 'var(--color-text)' }}>{fmtVal(valB)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
