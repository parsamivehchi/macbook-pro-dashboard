import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
import { CustomTooltip } from '../components/shared/CustomTooltip';
import { GEN_COLORS, fmt, fD, label } from '../utils/format';
import type { ChipConfig } from '../data/chips';

const BUDGET_TIERS = [
  { label: '$800', max: 800 },
  { label: '$1.2K', max: 1200 },
  { label: '$1.8K', max: 1800 },
  { label: '$2.5K', max: 2500 },
  { label: '$3.5K', max: 3500 },
  { label: '$4K+', max: Infinity },
];

function bestAtTier(chips: ChipConfig[], max: number, min: number) {
  const inRange = chips.filter(
    (c) => (c.st ?? c.msrp) >= min && (c.st ?? c.msrp) < max
  );
  if (!inRange.length) return null;
  // Best value = lowest depreciation + good perf
  return inRange.sort(
    (a, b) => (a.depreciation ?? 100) - (b.depreciation ?? 100)
  )[0];
}

function tierStrength(c: ChipConfig): string {
  if ((c.l7 ?? 0) > 50) return 'Excellent LLM performance';
  if ((c.g6m ?? 0) > 15000) return 'Top multi-core power';
  if ((c.bat ?? 0) >= 22) return 'All-day battery life';
  if ((c.bw ?? 0) >= 400) return 'High memory bandwidth';
  if ((c.ram ?? 0) >= 48) return 'Massive unified memory';
  return 'Balanced performance';
}

export default function CostAnalysis() {
  const { filtered } = useFilters();

  const depreciationData = useMemo(
    () =>
      filtered
        .filter((c) => c.depreciation != null && c.st)
        .map((c) => {
          const street = c.st ?? c.msrp;
          const costPerYear = street * ((c.depreciation ?? 0) / 100);
          return {
            chip: c.chip,
            gen: c.gen,
            depreciation: c.depreciation,
            costPerYear: Math.round(costPerYear),
            street,
            msrp: c.msrp,
          };
        })
        .sort((a, b) => (a.depreciation ?? 0) - (b.depreciation ?? 0)),
    [filtered]
  );

  const costPerYearTop = useMemo(
    () =>
      depreciationData
        .filter((c) => c.costPerYear > 0)
        .sort((a, b) => a.costPerYear - b.costPerYear)
        .slice(0, 6),
    [depreciationData]
  );

  const budgetPicks = useMemo(() => {
    let prevMax = 0;
    return BUDGET_TIERS.map((tier) => {
      const pick = bestAtTier(filtered, tier.max, prevMax);
      prevMax = tier.max === Infinity ? 0 : tier.max;
      return { ...tier, pick };
    });
  }, [filtered]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon="$"
        title="Cost Analysis"
        subtitle="Depreciation, value tiers, and buy-new-vs-used breakdown"
      />

      {/* Depreciation Bar Chart */}
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
          Depreciation & Cost per Year
        </h2>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={depreciationData}
            margin={{ top: 10, right: 40, left: 10, bottom: 80 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="chip"
              angle={-45}
              textAnchor="end"
              tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
              interval={0}
              height={80}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
              label={{
                value: 'Depreciation %',
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--color-muted)',
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'var(--color-sub)', fontSize: 11 }}
              label={{
                value: 'Cost / Year ($)',
                angle: 90,
                position: 'insideRight',
                fill: 'var(--color-muted)',
                fontSize: 12,
              }}
            />
            <RTooltip
              content={
                <CustomTooltip
                  formatter={(val: number, name: string) =>
                    name === 'depreciation' ? `${val}%` : `$${fmt(val)}`
                  }
                />
              }
            />
            <Legend wrapperStyle={{ color: 'var(--color-sub)' }} />
            <Bar
              yAxisId="left"
              dataKey="depreciation"
              name="Depreciation %"
              radius={[4, 4, 0, 0]}
            >
              {depreciationData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    GEN_COLORS[d.gen as keyof typeof GEN_COLORS] ??
                    'var(--color-accent)'
                  }
                  fillOpacity={0.7}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="costPerYear"
              name="Cost / Year ($)"
              radius={[4, 4, 0, 0]}
            >
              {depreciationData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    GEN_COLORS[d.gen as keyof typeof GEN_COLORS] ??
                    'var(--color-accent)'
                  }
                  fillOpacity={0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Best Value by Budget Tier */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Best Value by Budget Tier
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {budgetPicks.map((tier) => (
            <div
              key={tier.label}
              className="rounded-xl p-4 border flex flex-col gap-2"
              style={{
                background: 'var(--color-card)',
                borderColor: tier.pick
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-muted)' }}
              >
                {tier.label}
              </span>
              {tier.pick ? (
                <>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {tier.pick.chip}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    ${fmt(tier.pick.st ?? tier.pick.msrp)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-sub)' }}
                  >
                    {tierStrength(tier.pick)}
                  </span>
                </>
              ) : (
                <span
                  className="text-xs italic"
                  style={{ color: 'var(--color-muted)' }}
                >
                  No chips in range
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Cost Per Year Cards */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Lowest Cost per Year
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {costPerYearTop.map((c, i) => (
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
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {c.chip}
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: 'var(--color-green)' }}
              >
                ${fmt(c.costPerYear)}/yr
              </div>
              <div className="text-xs" style={{ color: 'var(--color-sub)' }}>
                ${fmt(Math.round(c.costPerYear / 12))}/mo
              </div>
              <div
                className="text-xs"
                style={{ color: 'var(--color-muted)' }}
              >
                {c.depreciation}% dep | MSRP ${fmt(c.msrp)} | St $
                {fmt(c.street)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Buy New vs Used */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Buy New vs Used
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New M5 */}
          <div
            className="rounded-xl p-5 border space-y-3"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-gen-m5)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: 'var(--color-gen-m5)' }}
              />
              <span
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                New M5
              </span>
            </div>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-sub)' }}
            >
              <li>Latest architecture, best resale</li>
              <li>TB5, WiFi 7, 12MP camera</li>
              <li>Highest LLM tok/s at every tier</li>
              <li>Full AppleCare eligibility</li>
            </ul>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-red)' }}
            >
              <li>Premium pricing, highest upfront cost</li>
              <li>First-gen silicon may have quirks</li>
            </ul>
          </div>

          {/* Clearance M4 */}
          <div
            className="rounded-xl p-5 border space-y-3"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-gen-m4)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: 'var(--color-gen-m4)' }}
              />
              <span
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Clearance M4
              </span>
            </div>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-sub)' }}
            >
              <li>15-25% below MSRP on refurb/clearance</li>
              <li>TB4/TB5, 12MP, 1000 nit display</li>
              <li>Still very strong LLM & compute perf</li>
              <li>Proven reliability, mature firmware</li>
            </ul>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-red)' }}
            >
              <li>Resale drops faster once M5 is mainstream</li>
              <li>Limited stock at best prices</li>
            </ul>
          </div>

          {/* Used M2/M3 */}
          <div
            className="rounded-xl p-5 border space-y-3"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-gen-m2)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: 'var(--color-gen-m2)' }}
              />
              <span
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Used M2/M3
              </span>
            </div>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-sub)' }}
            >
              <li>40-60% below original MSRP</li>
              <li>M2 Max 96GB: best RAM/$ for large models</li>
              <li>M3 Max: strong single-core, good resale</li>
              <li>Lowest absolute cost of entry</li>
            </ul>
            <ul
              className="text-sm space-y-1 list-disc pl-4"
              style={{ color: 'var(--color-red)' }}
            >
              <li>Older features (WiFi 6E, 1080p cam, TB4)</li>
              <li>Battery degradation risk on used units</li>
              <li>No AppleCare on most used purchases</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
