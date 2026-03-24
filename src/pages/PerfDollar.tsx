import { useMemo } from 'react';
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
  Legend,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';
import { CustomTooltip } from '../components/shared/CustomTooltip';
import { GEN_COLORS, GENS, fmt, fD, label } from '../utils/format';
import type { ChipConfig } from '../data/chips';

function valueScore(c: ChipConfig): number {
  const street = c.st ?? c.msrp;
  if (!street) return 0;
  const perK = street / 1000;
  return ((c.g6m ?? 0) / 1000 + (c.l7 ?? 0) * 2 + (c.tops ?? 0) / 2) / perK;
}

function llmPerK(c: ChipConfig): number {
  const street = c.st ?? c.msrp;
  if (!street || !c.l7) return 0;
  return c.l7 / (street / 1000);
}

export default function PerfDollar() {
  const { filtered } = useFilters();

  const scatterLLM = useMemo(
    () =>
      filtered
        .filter((c) => c.l7 && c.st)
        .map((c) => ({
          chip: c.chip,
          gen: c.gen,
          x: c.st ?? c.msrp,
          y: c.l7,
          z: c.ram ?? 16,
        })),
    [filtered]
  );

  const scatterGB6 = useMemo(
    () =>
      filtered
        .filter((c) => c.g6m && c.st)
        .map((c) => ({
          chip: c.chip,
          gen: c.gen,
          x: c.st ?? c.msrp,
          y: c.g6m,
          z: c.ram ?? 16,
        })),
    [filtered]
  );

  const topLLMPerK = useMemo(
    () =>
      filtered
        .filter((c) => c.l7 && c.st)
        .map((c) => ({ ...c, score: llmPerK(c) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6),
    [filtered]
  );

  const valueRanked = useMemo(
    () =>
      filtered
        .filter((c) => c.g6m && c.l7 && c.st)
        .map((c) => ({ ...c, vs: valueScore(c) }))
        .sort((a, b) => b.vs - a.vs),
    [filtered]
  );

  const justRight = useMemo(
    () =>
      filtered.filter(
        (c) =>
          (c.g6s ?? 0) >= 3500 &&
          (c.bw ?? 0) >= 250 &&
          (c.ram ?? 0) >= 24 &&
          (c.st ?? c.msrp) <= 2500
      ),
    [filtered]
  );

  const genEntries = Object.entries(GEN_COLORS) as [string, string][];

  return (
    <div className="space-y-8">
      <PageHeader
        icon="/"
        title="Performance per Dollar"
        subtitle="Scatter plots, value scores, and the sweet-spot framework"
      />

      {/* Dual Scatter Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLM vs Price */}
        <section
          className="rounded-2xl p-6 border"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            LLM 7B tok/s vs Street Price
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="x"
                name="Price"
                tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
                tickFormatter={(v: number) => `$${fmt(v)}`}
                label={{
                  value: 'Street Price ($)',
                  position: 'insideBottom',
                  offset: -5,
                  fill: 'var(--color-muted)',
                  fontSize: 11,
                }}
              />
              <YAxis
                dataKey="y"
                name="tok/s"
                tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
                label={{
                  value: '7B Q4 tok/s',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'var(--color-muted)',
                  fontSize: 11,
                }}
              />
              <ZAxis dataKey="z" range={[40, 400]} name="RAM" />
              <RTooltip
                content={
                  <CustomTooltip
                    formatter={(val: number, name: string) =>
                      name === 'Price' ? `$${fmt(val)}` : `${val}`
                    }
                  />
                }
              />
              <Scatter data={scatterLLM} name="Chips">
                {scatterLLM.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      GEN_COLORS[d.gen as keyof typeof GEN_COLORS] ??
                      'var(--color-accent)'
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 flex-wrap">
            {genEntries.map(([g, c]) => (
              <span
                key={g}
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--color-sub)' }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: c }}
                />
                {g}
              </span>
            ))}
          </div>
        </section>

        {/* GB6 Multi vs Price */}
        <section
          className="rounded-2xl p-6 border"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Geekbench 6 Multi vs Street Price
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="x"
                name="Price"
                tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
                tickFormatter={(v: number) => `$${fmt(v)}`}
                label={{
                  value: 'Street Price ($)',
                  position: 'insideBottom',
                  offset: -5,
                  fill: 'var(--color-muted)',
                  fontSize: 11,
                }}
              />
              <YAxis
                dataKey="y"
                name="Multi"
                tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
                label={{
                  value: 'GB6 Multi-Core',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'var(--color-muted)',
                  fontSize: 11,
                }}
              />
              <ZAxis dataKey="z" range={[40, 400]} name="RAM" />
              <RTooltip
                content={
                  <CustomTooltip
                    formatter={(val: number, name: string) =>
                      name === 'Price' ? `$${fmt(val)}` : fmt(val)
                    }
                  />
                }
              />
              <Scatter data={scatterGB6} name="Chips">
                {scatterGB6.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      GEN_COLORS[d.gen as keyof typeof GEN_COLORS] ??
                      'var(--color-accent)'
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 flex-wrap">
            {genEntries.map(([g, c]) => (
              <span
                key={g}
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--color-sub)' }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: c }}
                />
                {g}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Best LLM per $1K */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Best LLM tok/s per $1K
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topLLMPerK.map((c, i) => (
            <div
              key={c.chip}
              className="rounded-xl p-4 border space-y-1"
              style={{
                background: 'var(--color-card)',
                borderColor:
                  i === 0 ? 'var(--color-green)' : 'var(--color-border)',
              }}
            >
              <div
                className="text-xs font-bold"
                style={{ color: 'var(--color-muted)' }}
              >
                #{i + 1}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {c.chip}
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: 'var(--color-accent)' }}
              >
                {c.score.toFixed(1)} tok/s/$K
              </div>
              <div
                className="text-xs"
                style={{ color: 'var(--color-sub)' }}
              >
                {c.l7} tok/s | ${fmt(c.st ?? c.msrp)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Composite Value Score Table */}
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
          Composite Value Score
        </h2>
        <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
          Formula: ((GB6 Multi/1000) + (7B tok/s * 2) + (TOPS/2)) / (Street
          Price / $1K)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: 'var(--color-muted)' }}>
                <th className="text-left py-2 px-3">#</th>
                <th className="text-left py-2 px-3">Chip</th>
                <th className="text-right py-2 px-3">Score</th>
                <th className="text-right py-2 px-3">GB6 M</th>
                <th className="text-right py-2 px-3">7B tok/s</th>
                <th className="text-right py-2 px-3">TOPS</th>
                <th className="text-right py-2 px-3">Street</th>
              </tr>
            </thead>
            <tbody>
              {valueRanked.slice(0, 15).map((c, i) => (
                <tr
                  key={c.chip}
                  className="border-t"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-sub)',
                  }}
                >
                  <td className="py-2 px-3 font-bold" style={{ color: 'var(--color-muted)' }}>
                    {i + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold" style={{ color: 'var(--color-text)' }}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                          background:
                            GEN_COLORS[c.gen as keyof typeof GEN_COLORS] ??
                            'var(--color-accent)',
                        }}
                      />
                      {c.chip}
                    </span>
                  </td>
                  <td
                    className="py-2 px-3 text-right font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {c.vs.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right">{fmt(c.g6m ?? 0)}</td>
                  <td className="py-2 px-3 text-right">{c.l7}</td>
                  <td className="py-2 px-3 text-right">{c.tops}</td>
                  <td className="py-2 px-3 text-right">${fmt(c.st ?? c.msrp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* "Just Right" Framework */}
      <section>
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          "Just Right" Sweet Spot
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-sub)' }}>
          Chips meeting: Single-Core &ge; 3500, Bandwidth &ge; 250 GB/s, RAM
          &ge; 24 GB, Street &le; $2,500
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {justRight.length === 0 && (
            <p className="text-sm italic col-span-4" style={{ color: 'var(--color-muted)' }}>
              No chips match all criteria with current filters.
            </p>
          )}
          {justRight.slice(0, 4).map((c) => (
            <div
              key={c.chip}
              className="rounded-xl p-5 border-2 space-y-2"
              style={{
                background: 'var(--color-card)',
                borderColor: 'var(--color-green)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-base font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {c.chip}
                </span>
                <Pill color="var(--color-green)">Sweet Spot</Pill>
              </div>
              <div
                className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs"
                style={{ color: 'var(--color-sub)' }}
              >
                <span>SC: {fmt(c.g6s ?? 0)}</span>
                <span>BW: {c.bw} GB/s</span>
                <span>RAM: {c.ram} GB</span>
                <span>7B: {c.l7} tok/s</span>
                <span>TOPS: {c.tops}</span>
                <span
                  className="font-semibold"
                  style={{ color: 'var(--color-accent)' }}
                >
                  ${fmt(c.st ?? c.msrp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
