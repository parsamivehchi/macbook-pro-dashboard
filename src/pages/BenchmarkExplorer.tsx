import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { GEN_COLORS, GENS, fmt, label } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import { Pill } from '../components/shared/Pill';
import { CustomTooltip } from '../components/shared/CustomTooltip';
import { InsightCard } from '../components/shared/InsightCard';
import type { ChipConfig } from '../data/chips';

type BenchTab = 'sc' | 'mc' | 'gpu';

const TABS: { key: BenchTab; label: string; dataKey: keyof ChipConfig; unit: string }[] = [
  { key: 'sc', label: 'GB6 Single', dataKey: 'g6s', unit: '' },
  { key: 'mc', label: 'GB6 Multi', dataKey: 'g6m', unit: '' },
  { key: 'gpu', label: 'Metal GPU', dataKey: 'g6g', unit: '' },
];

export default function BenchmarkExplorer() {
  const { filtered } = useFilters();
  const [tab, setTab] = useState<BenchTab>('sc');

  const activeTab = TABS.find(t => t.key === tab)!;

  // Bar chart data: all chips sorted by score
  const barData = useMemo(() => {
    return [...filtered]
      .sort((a, b) => {
        const va = (a as Record<string, unknown>)[activeTab.dataKey as string] as number ?? 0;
        const vb = (b as Record<string, unknown>)[activeTab.dataKey as string] as number ?? 0;
        return va - vb;
      })
      .map(c => ({
        name: label(c),
        value: (c as Record<string, unknown>)[activeTab.dataKey as string] as number ?? 0,
        gen: c.gen,
        chip: c.chip,
        ram: c.ram,
      }));
  }, [filtered, activeTab]);

  // Generational progression: average SC per gen over time
  const genProgression = useMemo(() => {
    const byGen: Record<string, { sum: number; count: number; yr: number }> = {};
    filtered.forEach(c => {
      if (!byGen[c.gen]) byGen[c.gen] = { sum: 0, count: 0, yr: c.yr };
      byGen[c.gen].sum += c.g6s;
      byGen[c.gen].count += 1;
    });
    return GENS
      .filter(g => byGen[g])
      .map(g => ({
        gen: g,
        year: byGen[g].yr,
        avgSC: Math.round(byGen[g].sum / byGen[g].count),
        avgMC: 0,
        avgGPU: 0,
      }));
  }, [filtered]);

  // Enrich genProgression with MC and GPU averages
  useMemo(() => {
    const byGen: Record<string, { sumMC: number; sumGPU: number; count: number }> = {};
    filtered.forEach(c => {
      if (!byGen[c.gen]) byGen[c.gen] = { sumMC: 0, sumGPU: 0, count: 0 };
      byGen[c.gen].sumMC += c.g6m;
      byGen[c.gen].sumGPU += c.g6g;
      byGen[c.gen].count += 1;
    });
    genProgression.forEach(gp => {
      const d = byGen[gp.gen];
      if (d) {
        gp.avgMC = Math.round(d.sumMC / d.count);
        gp.avgGPU = Math.round(d.sumGPU / d.count);
      }
    });
  }, [filtered, genProgression]);

  // GPU efficiency table: Metal score / GPU cores
  const gpuEfficiency = useMemo(() => {
    // De-dup by chip name + ram (since same chip config has same gpu score)
    const seen = new Set<string>();
    return [...filtered]
      .filter(c => {
        const key = `${c.chip}-${c.gpu}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(c => ({
        chip: c.chip,
        gen: c.gen,
        gpuCores: c.gpu,
        metalScore: c.g6g,
        efficiency: Math.round(c.g6g / c.gpu),
        ram: c.ram,
      }))
      .sort((a, b) => b.efficiency - a.efficiency);
  }, [filtered]);

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\uD83C\uDFAF"
        title="Benchmark Explorer"
        subtitle={`Geekbench 6 & Metal GPU deep dive across ${filtered.length} configurations`}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <Pill
            key={t.key}
            label={t.label}
            active={tab === t.key}
            color="var(--color-accent)"
            onClick={() => setTab(t.key)}
          />
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
          {activeTab.label} -- All Chips Ranked
        </div>
        <ResponsiveContainer width="100%" height={Math.max(400, barData.length * 28)}>
          <BarChart data={barData} layout="vertical" margin={{ left: 120, right: 30, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(v: number) => v.toLocaleString()}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--color-sub)', fontSize: 10, fontFamily: 'var(--font-display)' }}
              width={115}
            />
            <RTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface)' }} />
            <Bar dataKey="value" name={activeTab.label} radius={[0, 4, 4, 0]} barSize={16}>
              {barData.map((d, i) => (
                <Cell key={i} fill={GEN_COLORS[d.gen] || 'var(--color-accent)'} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Gen Legend */}
        <div className="flex gap-4 mt-2 justify-center">
          {GENS.map(g => (
            <div key={g} className="flex items-center gap-1.5 text-[10px]" style={{ color: GEN_COLORS[g] }}>
              <span className="w-[8px] h-[8px] rounded-full" style={{ background: GEN_COLORS[g] }} />
              {g}
            </div>
          ))}
        </div>
      </div>

      {/* Generational Progression */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
            Generational Progression (Avg Single-Core)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={genProgression} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="gen"
                tick={{ fill: 'var(--color-sub)', fontSize: 11, fontFamily: 'var(--font-display)' }}
              />
              <YAxis
                tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => v.toLocaleString()}
              />
              <RTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgSC"
                name="Avg SC"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                dot={{ fill: 'var(--color-accent)', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[10px] mt-2 text-center" style={{ color: 'var(--color-muted)' }}>
            {genProgression.length >= 2 && (
              <>
                {genProgression[0].gen} to {genProgression[genProgression.length - 1].gen}:{' '}
                <span style={{ color: 'var(--color-green)' }}>
                  +{Math.round(((genProgression[genProgression.length - 1].avgSC - genProgression[0].avgSC) / genProgression[0].avgSC) * 100)}%
                </span>
                {' '}improvement
              </>
            )}
          </div>
        </div>

        {/* GPU Efficiency Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-widest p-4 pb-2" style={{ color: 'var(--color-muted)' }}>
            GPU Efficiency (Metal Score / GPU Cores)
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
            <table className="w-full text-[11px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
                  <th className="px-3 py-2 text-left text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Chip</th>
                  <th className="px-2 py-2 text-right text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Cores</th>
                  <th className="px-2 py-2 text-right text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Metal</th>
                  <th className="px-3 py-2 text-right text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Per Core</th>
                </tr>
              </thead>
              <tbody>
                {gpuEfficiency.map((row, i) => {
                  const maxEff = gpuEfficiency[0]?.efficiency || 1;
                  const ratio = row.efficiency / maxEff;
                  return (
                    <tr key={`${row.chip}-${i}`} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-3 py-1.5 font-semibold" style={{ color: GEN_COLORS[row.gen] }}>
                        {row.chip}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: 'var(--color-sub)' }}>
                        {row.gpuCores}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ color: 'var(--color-text)' }}>
                        {fmt(row.metalScore)}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold" style={{
                        color: ratio >= 0.9 ? 'var(--color-green)' : ratio >= 0.7 ? 'var(--color-text)' : 'var(--color-sub)',
                      }}>
                        {fmt(row.efficiency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* What Benchmarks Mean */}
      <div className="mb-4">
        <h3
          className="text-[13px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-muted)' }}
        >
          What Benchmarks Mean
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <InsightCard
            title="Single-Core (SC)"
            body="Measures single-threaded CPU speed. Determines IDE responsiveness, TypeScript compilation, Git operations, and any task that can't parallelize. The most important metric for day-to-day developer experience."
            accent="var(--color-accent)"
          />
          <InsightCard
            title="Multi-Core (MC)"
            body="Measures parallel CPU throughput across all cores. Matters for Xcode builds, Docker multi-container workloads, CI/CD pipelines, video encoding, and heavy compilation. Scales with core count."
            accent="var(--color-green)"
          />
          <InsightCard
            title="Metal GPU"
            body="Measures GPU compute and rendering via Apple's Metal API. Critical for ML training, GPU-accelerated rendering (Blender, DaVinci Resolve), shader compilation, and any workload offloaded to the GPU. Scales with GPU core count."
            accent="var(--color-amber)"
          />
        </div>
      </div>
    </div>
  );
}
