import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { InsightCard } from '../components/shared/InsightCard';
import { GEN_COLORS, fmt } from '../utils/format';
import type { ChipConfig } from '../data/chips';

interface CalloutDef {
  label: string;
  detail: string;
  matchFn: (c: ChipConfig) => boolean;
}

const CALLOUTS: CalloutDef[] = [
  {
    label: 'M2 Max (~$1,500 used)',
    detail: '400 GB/s bandwidth, 96GB RAM option',
    matchFn: (c) => c.chip.includes('M2 Max') && (c.gpu ?? 0) >= 38,
  },
  {
    label: 'M5 Pro',
    detail: '307 GB/s, newest Pro-tier silicon',
    matchFn: (c) => c.chip.includes('M5 Pro') && !c.chip.includes('Max'),
  },
  {
    label: 'M5 Max 40G',
    detail: '614 GB/s, flagship bandwidth',
    matchFn: (c) => c.chip.includes('M5 Max') && (c.gpu ?? 0) >= 40,
  },
];

export default function LLMBandwidth() {
  const { filtered } = useFilters();
  const [show14B, setShow14B] = useState(false);

  const scatterData = useMemo(
    () =>
      filtered
        .filter((c) => c.bw && (show14B ? c.l14 : c.l7))
        .map((c) => ({
          chip: c.chip,
          gen: c.gen,
          x: c.bw!,
          y: show14B ? (c.l14 ?? 0) : (c.l7 ?? 0),
          z: c.ram ?? 16,
          bw: c.bw!,
          toks: show14B ? (c.l14 ?? 0) : (c.l7 ?? 0),
          ram: c.ram ?? 16,
          st: c.st ?? c.msrp,
        })),
    [filtered, show14B]
  );

  const calloutChips = useMemo(() => {
    return CALLOUTS.map((co) => {
      const match = filtered.find(co.matchFn);
      return { ...co, chip: match };
    });
  }, [filtered]);

  const genEntries = Object.entries(GEN_COLORS) as [string, string][];

  // Zone rendering helper for shaded performance zones
  const zones = [
    { y1: 0, y2: 30, fill: 'var(--color-red)', label: 'Slow (<30)' },
    { y1: 30, y2: 50, fill: 'var(--color-amber)', label: 'Usable (30-50)' },
    { y1: 50, y2: 999, fill: 'var(--color-green)', label: 'Fast (>50)' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        icon="~"
        title="LLM & Bandwidth"
        subtitle="Memory bandwidth is THE bottleneck for local LLM inference"
      />

      {/* Toggle */}
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          Model size:
        </span>
        <button
          onClick={() => setShow14B(false)}
          className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          style={{
            background: !show14B ? 'var(--color-accent)' : 'var(--color-surface)',
            color: !show14B ? '#000' : 'var(--color-sub)',
          }}
        >
          7B Q4
        </button>
        <button
          onClick={() => setShow14B(true)}
          className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          style={{
            background: show14B ? 'var(--color-accent)' : 'var(--color-surface)',
            color: show14B ? '#000' : 'var(--color-sub)',
          }}
        >
          14B Q4
        </button>
      </div>

      {/* Main Scatter Chart */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Memory Bandwidth vs {show14B ? '14B' : '7B'} Q4 Inference Speed
        </h2>
        <ResponsiveContainer width="100%" height={480}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="x"
              name="Bandwidth"
              tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
              tickFormatter={(v: number) => `${v}`}
              label={{
                value: 'Memory Bandwidth (GB/s)',
                position: 'insideBottom',
                offset: -10,
                fill: 'var(--color-muted)',
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="y"
              name="tok/s"
              tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
              label={{
                value: `${show14B ? '14B' : '7B'} Q4 tok/s`,
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--color-muted)',
                fontSize: 12,
              }}
            />
            <ZAxis dataKey="z" range={[60, 500]} name="RAM (GB)" />

            {/* Shaded zones via reference areas - using reference lines for boundaries */}
            <ReferenceLine
              y={30}
              stroke="var(--color-amber)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: 'Usable threshold (30 tok/s)',
                position: 'right',
                fill: 'var(--color-amber)',
                fontSize: 11,
              }}
            />
            <ReferenceLine
              y={50}
              stroke="var(--color-green)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: 'Fast (50 tok/s)',
                position: 'right',
                fill: 'var(--color-green)',
                fontSize: 11,
              }}
            />

            <RTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div
                    className="rounded-lg p-3 text-xs shadow-lg border"
                    style={{
                      background: 'var(--color-card)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <div className="font-semibold mb-1">{d.chip}</div>
                    <div style={{ color: 'var(--color-sub)' }}>
                      BW: {d.bw} GB/s
                    </div>
                    <div style={{ color: 'var(--color-sub)' }}>
                      {show14B ? '14B' : '7B'}: {d.toks} tok/s
                    </div>
                    <div style={{ color: 'var(--color-sub)' }}>
                      RAM: {d.ram} GB
                    </div>
                    <div style={{ color: 'var(--color-accent)' }}>
                      Street: ${fmt(d.st)}
                    </div>
                  </div>
                );
              }}
            />

            <Scatter data={scatterData} name="Chips">
              {scatterData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    GEN_COLORS[d.gen as keyof typeof GEN_COLORS] ??
                    'var(--color-accent)'
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex gap-4 mt-3 flex-wrap items-center">
          {genEntries.map(([g, c]) => (
            <span
              key={g}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--color-sub)' }}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: c }}
              />
              {g}
            </span>
          ))}
          <span className="mx-2 text-xs" style={{ color: 'var(--color-muted)' }}>
            |
          </span>
          {zones.map((z) => (
            <span
              key={z.label}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: z.fill }}
            >
              <span
                className="inline-block w-4 h-0.5"
                style={{ background: z.fill }}
              />
              {z.label}
            </span>
          ))}
          <span
            className="text-xs"
            style={{ color: 'var(--color-muted)' }}
          >
            Bubble size = RAM
          </span>
        </div>
      </section>

      {/* Key Callout Annotations */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Key Callouts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {calloutChips.map((co) => (
            <div
              key={co.label}
              className="rounded-xl p-5 border space-y-2"
              style={{
                background: 'var(--color-card)',
                borderColor: co.chip
                  ? GEN_COLORS[co.chip.gen as keyof typeof GEN_COLORS] ??
                    'var(--color-border)'
                  : 'var(--color-border)',
              }}
            >
              <div
                className="text-sm font-bold"
                style={{ color: 'var(--color-text)' }}
              >
                {co.label}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-sub)' }}>
                {co.detail}
              </div>
              {co.chip && (
                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1"
                  style={{ color: 'var(--color-sub)' }}
                >
                  <span>BW: {co.chip.bw} GB/s</span>
                  <span>RAM: {co.chip.ram} GB</span>
                  <span>
                    7B: {co.chip.l7} tok/s
                  </span>
                  <span>
                    14B: {co.chip.l14 ?? 'N/A'} tok/s
                  </span>
                  <span
                    className="font-semibold col-span-2"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Street: ${fmt(co.chip.st ?? co.chip.msrp)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Insight Card */}
      <InsightCard
        title="Why Bandwidth Matters"
        body="The near-linear relationship between memory bandwidth and token generation speed proves bandwidth is THE bottleneck for local LLM inference. Every additional GB/s of bandwidth translates almost directly to faster inference. This makes the Max chips -- with their wider memory bus -- disproportionately better for LLM workloads compared to their compute benchmarks."
        accent="var(--color-accent)"
      />
    </div>
  );
}
