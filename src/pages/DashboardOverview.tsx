import { Link } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { CHIPS } from '../data/chips';
import { GEN_COLORS } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';

const NAV_CARDS = [
  { path: '/compare/head-to-head', icon: '\u2694\uFE0F', name: 'Head-to-Head', desc: 'Compare any two chips side by side' },
  { path: '/compare/data-table', icon: '\uD83D\uDCCA', name: 'Data Table', desc: 'Sortable table of all configurations' },
  { path: '/compare/features', icon: '\uD83D\uDD32', name: 'Features Matrix', desc: 'Heatmap & feature checklist' },
  { path: '/analyze/llm', icon: '\uD83E\uDDE0', name: 'LLM Performance', desc: 'Model fit & inference speed' },
  { path: '/analyze/benchmarks', icon: '\uD83C\uDFAF', name: 'Benchmarks', desc: 'GB6, Metal GPU deep dive' },
  { path: '/analyze/cost', icon: '\uD83D\uDCB5', name: 'Cost Analysis', desc: 'Depreciation & street prices' },
  { path: '/analyze/perf-dollar', icon: '\uD83D\uDCC8', name: 'Perf / Dollar', desc: 'Value efficiency rankings' },
  { path: '/analyze/llm-bandwidth', icon: '\uD83D\uDD2C', name: 'LLM x BW', desc: 'Bandwidth & LLM correlation' },
  { path: '/analyze/features-timeline', icon: '\u23F3', name: 'Timeline', desc: 'Feature evolution across gens' },
  { path: '/guide/budget', icon: '\uD83D\uDCB0', name: 'Budget Picker', desc: 'Best chip for your budget' },
  { path: '/guide/use-cases', icon: '\uD83C\uDFAF', name: 'Use Cases', desc: 'Ranked by workflow fit' },
  { path: '/guide/buying-guide', icon: '\uD83D\uDED2', name: 'Buying Guide', desc: 'Decision framework & recs' },
  { path: '/guide/decision-matrix', icon: '\u2696\uFE0F', name: 'Decision Matrix', desc: 'Weighted scoring system' },
  { path: '/guide/workflow', icon: '\uD83D\uDEE0\uFE0F', name: 'Workflow', desc: 'Dev workflow notes & tips' },
  { path: '/reference/sources', icon: '\uD83D\uDCCB', name: 'Data Sources', desc: 'Where the numbers come from' },
];

const QUICK_PICKS = [
  {
    title: 'Best for LLM',
    chip: 'M5 Max 40G 48GB',
    why: '614 GB/s bandwidth, 98 tok/s on 7B models. Runs 70B quantized with headroom.',
    color: GEN_COLORS.M5,
  },
  {
    title: 'Best Value',
    chip: 'M2 Pro 10C 16GB',
    why: '62% depreciation = $750 street price. Still handles 8B models at 38 tok/s.',
    color: GEN_COLORS.M2,
  },
  {
    title: 'Best All-Rounder',
    chip: 'M5 Pro 15C 24GB',
    why: '307 GB/s BW, 14,500 MB/s SSD, WiFi 7, TB5. The sweet spot for dev workflows.',
    color: 'var(--color-green)',
  },
];

const INSIGHTS = [
  {
    title: 'Bandwidth determines LLM speed',
    body: 'Memory bandwidth is the #1 predictor of local LLM inference speed. The M5 Max 40G\'s 614 GB/s delivers 98 tok/s on 7B models -- 2.6x faster than base M5.',
    accent: 'var(--color-accent)',
  },
  {
    title: 'Depreciation creates opportunity',
    body: 'M2 Pro/Max configs have depreciated 49-62%, putting high-end silicon in the $750-$1,900 range. These remain very capable machines for most workflows.',
    accent: GEN_COLORS.M2,
  },
  {
    title: '60% single-core improvement in 3 years',
    body: 'Geekbench 6 single-core went from 2,650 (M2 Pro) to 4,300 (M5 Max) -- a 62% generational leap that compounds across every workload.',
    accent: 'var(--color-green)',
  },
  {
    title: 'M5 Pro/Max is a generational leap',
    body: 'WiFi 7, 14,500 MB/s SSD, TB5, and up to 18 CPU cores. The M5 generation isn\'t incremental -- it\'s a platform shift with 2.8x SSD throughput.',
    accent: GEN_COLORS.M5,
  },
  {
    title: 'SC + SSD matter most for dev workflows',
    body: 'Single-core speed determines IDE responsiveness, build latency, and TypeScript compilation. Paired with fast SSD, these two metrics define the daily developer experience.',
    accent: 'var(--color-amber)',
  },
];

export default function DashboardOverview() {
  const { filtered } = useFilters();

  const allPrices = CHIPS.map(c => c.st);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const maxBW = Math.max(...CHIPS.map(c => c.bw));
  const maxL7 = Math.max(...CHIPS.filter(c => c.l7 != null).map(c => c.l7!));

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\u2302"
        title="MBP Observatory"
        subtitle={`${filtered.length} of ${CHIPS.length} configurations visible -- every MacBook Pro chip from M2 to M5`}
      />

      {/* Hero Stats Row */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <StatCard label="Configurations" value={String(CHIPS.length)} sub="M2 through M5" />
        <StatCard label="Generations" value="4" sub="2023 -- 2026" color="var(--color-green)" />
        <StatCard
          label="Price Range"
          value={`$${minPrice.toLocaleString()} -- $${maxPrice.toLocaleString()}`}
          sub="Street price (USD)"
          color="var(--color-amber)"
        />
        <StatCard label="Fastest LLM 7B" value={`${maxL7} tok/s`} sub="M5 Max 40G" color={GEN_COLORS.M5} />
        <StatCard label="Max Bandwidth" value={`${maxBW} GB/s`} sub="M5 Max 40G" color={GEN_COLORS.M5} />
      </div>

      {/* Quick Picks */}
      <div className="mb-8">
        <h3
          className="text-[13px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-muted)' }}
        >
          Quick Picks
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {QUICK_PICKS.map(pick => (
            <div
              key={pick.title}
              className="rounded-xl border border-border bg-card p-5"
              style={{ borderTopWidth: 3, borderTopColor: pick.color }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: pick.color }}>
                {pick.title}
              </div>
              <div className="text-[16px] font-extrabold font-mono mb-2" style={{ color: 'var(--color-text)' }}>
                {pick.chip}
              </div>
              <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-sub)' }}>
                {pick.why}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="mb-8">
        <h3
          className="text-[13px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-muted)' }}
        >
          Key Findings
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {INSIGHTS.map(ins => (
            <InsightCard key={ins.title} title={ins.title} body={ins.body} accent={ins.accent} />
          ))}
        </div>
      </div>

      {/* Page Navigation Grid */}
      <div className="mb-4">
        <h3
          className="text-[13px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-muted)' }}
        >
          Explore
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {NAV_CARDS.map(card => (
            <Link
              key={card.path}
              to={card.path}
              className="rounded-xl border border-border bg-card p-4 no-underline transition-all duration-150 hover:border-accent"
              style={{ textDecoration: 'none' }}
            >
              <div className="text-[20px] mb-1.5">{card.icon}</div>
              <div className="text-[12px] font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>
                {card.name}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                {card.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
