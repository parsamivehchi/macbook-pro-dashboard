import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RTooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, TIER_COLORS, GENS, fmt, fD, label } from '../utils/format';

/* ---------- Data ---------- */
const WORKFLOW_DATA = [
  { name: 'IDE (Cursor/VS Code)', value: 35, color: 'var(--color-accent)' },
  { name: 'LLM (Ollama/Claude)', value: 20, color: 'var(--color-gen-m5)' },
  { name: 'Ghostty Terminal', value: 15, color: 'var(--color-gen-m4)' },
  { name: 'HEC-RAS', value: 15, color: 'var(--color-gen-m3)' },
  { name: 'Parsec', value: 10, color: 'var(--color-gen-m2)' },
  { name: 'Personal', value: 5, color: 'var(--color-muted)' },
];

const WEIGHTED_METRICS = [
  { metric: 'Single-Core CPU', weight: 5, rationale: 'IDE responsiveness, compilation, and CLI tools are single-threaded bottlenecks' },
  { metric: 'Memory Bandwidth', weight: 5, rationale: 'Critical for LLM inference tok/s -- the #1 differentiator for local models' },
  { metric: 'RAM Capacity', weight: 4, rationale: 'IDE + Docker + browser + LLM model all compete for memory' },
  { metric: 'LLM Speed (7B)', weight: 4, rationale: 'Direct measure of daily LLM workflow speed' },
  { metric: 'Battery Life', weight: 4, rationale: 'Mobile engineering work requires all-day battery' },
  { metric: 'SSD Speed', weight: 3, rationale: 'Project switching, Git operations, Docker image loading' },
  { metric: 'Multi-Core CPU', weight: 3, rationale: 'Parallel compilation and Docker builds benefit but are less frequent' },
  { metric: 'GPU Compute', weight: 2, rationale: 'Not primary workload -- occasional ML experiments only' },
  { metric: 'Display Quality', weight: 2, rationale: 'All recent MacBook Pros have excellent displays' },
  { metric: 'Price / Value', weight: 4, rationale: 'Must justify cost against productivity gains' },
];

type Tab = 'overall' | 'llm' | 'budget';

interface RankEntry {
  rank: number;
  chip: string;
  score: number;
  price: string;
  highlight?: string;
}

const RANKINGS: Record<Tab, RankEntry[]> = {
  overall: [
    { rank: 1, chip: 'M5 Pro 18-Core / 24GB', score: 91, price: '$2,749', highlight: 'Best all-around for Parsa\'s workflow' },
    { rank: 2, chip: 'M5 Pro 15-Core / 24GB', score: 89, price: '$2,149', highlight: 'Best value pick' },
    { rank: 3, chip: 'M5 Max 32-GPU / 36GB', score: 87, price: '$3,549', highlight: 'Future-proof option' },
    { rank: 4, chip: 'M5 Base / 24GB', score: 82, price: '$1,799' },
    { rank: 5, chip: 'M4 Pro 14-Core / 24GB', score: 80, price: '$2,149' },
  ],
  llm: [
    { rank: 1, chip: 'M5 Max 40-GPU / 48GB', score: 96, price: '$4,049', highlight: '48GB fits 30B+ models' },
    { rank: 2, chip: 'M4 Max 40-GPU / 48GB', score: 93, price: '~$3,200', highlight: 'Clearance pricing' },
    { rank: 3, chip: 'M5 Max 32-GPU / 36GB', score: 90, price: '$3,549' },
    { rank: 4, chip: 'M2 Max 38-GPU / 64GB', score: 88, price: '~$2,100 used', highlight: 'Maximum RAM for the dollar' },
    { rank: 5, chip: 'M5 Pro 18-Core / 24GB', score: 72, price: '$2,749' },
  ],
  budget: [
    { rank: 1, chip: 'M5 Pro 15-Core / 24GB', score: 89, price: '$2,149', highlight: 'Top pick: best perf/$' },
    { rank: 2, chip: 'M4 Pro 14-Core / 24GB', score: 80, price: '$2,149', highlight: 'More GPU cores than M5 Pro 15C' },
    { rank: 3, chip: 'M4 Pro 12-Core / 24GB', score: 78, price: '$1,799' },
    { rank: 4, chip: 'M5 Base / 24GB', score: 82, price: '$1,799', highlight: 'Best battery in range' },
    { rank: 5, chip: 'M2 Max 38-GPU / 32GB', score: 75, price: '~$1,600 used', highlight: 'Best LLM value' },
  ],
};

const TRADEOFF_METRICS = [
  { metric: 'Generation', m5pro: 'M5 (3nm 2nd gen)', m2max: 'M2 (5nm)' },
  { metric: 'CPU Cores', m5pro: '12 (6P + 6E)', m2max: '12 (8P + 4E)' },
  { metric: 'GPU Cores', m5pro: '15', m2max: '38' },
  { metric: 'RAM', m5pro: '24 GB', m2max: '32 GB' },
  { metric: 'Memory Bandwidth', m5pro: '~273 GB/s', m2max: '400 GB/s' },
  { metric: 'Geekbench Single', m5pro: '~3,800', m2max: '~2,750' },
  { metric: 'Geekbench Multi', m5pro: '~19,500', m2max: '~14,500' },
  { metric: 'Geekbench GPU', m5pro: '~85,000', m2max: '~112,000' },
  { metric: 'LLM 7B (tok/s)', m5pro: '~42', m2max: '~52' },
  { metric: 'Battery (hrs)', m5pro: '~22', m2max: '~15' },
  { metric: 'MSRP / Price', m5pro: '$2,149 (new)', m2max: '~$1,600 (used)' },
  { metric: 'Wi-Fi', m5pro: 'Wi-Fi 7', m2max: 'Wi-Fi 6E' },
  { metric: 'Thunderbolt', m5pro: 'TB5', m2max: 'TB4' },
];

const FINAL_RATIONALE = [
  'Single-core performance is 38% faster than M2 Max -- IDE and compilation feel instant',
  'Wi-Fi 7 and Thunderbolt 5 are meaningful daily-use upgrades',
  'Battery life (22 hrs) vs M2 Max (15 hrs) is a 47% improvement for mobile work',
  '$2,149 new with warranty vs $1,600 used with unknown battery health',
  '24GB is tight but sufficient with disciplined memory management',
  'For LLM inference: M2 Max wins on tok/s, but the gap narrows with 7B models',
  'M5 Pro 18C at $2,749 is the upgrade path if 15C feels limiting',
  '3nm process means better thermals and sustained performance under load',
];

export default function DecisionMatrix() {
  const { filtered } = useFilters();
  const [activeTab, setActiveTab] = useState<Tab>('overall');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    { key: 'llm', label: 'LLM-Heavy' },
    { key: 'budget', label: 'Budget ($1.8-2.5K)' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        icon="\u{1F9ED}"
        title="Decision Matrix"
        subtitle="Parsa's personalized chip ranking and trade-off analysis"
      />

      {/* Workflow profile */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-sub)' }}>
            Workflow Profile
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={WORKFLOW_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {WORKFLOW_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <RTooltip
                contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--color-text)' }}
                itemStyle={{ color: 'var(--color-sub)' }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(val: string) => <span style={{ color: 'var(--color-text)', fontSize: 11 }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weighted metrics */}
        <div
          className="rounded-2xl p-6 overflow-auto"
          style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-sub)' }}>
            Weighted Metrics
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: 'var(--color-muted)' }}>
                <th className="text-left pb-2 font-medium">Metric</th>
                <th className="text-center pb-2 font-medium w-24">Weight</th>
                <th className="text-left pb-2 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTED_METRICS.map((row) => (
                <tr
                  key={row.metric}
                  className="border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <td className="py-2 font-medium" style={{ color: 'var(--color-text)' }}>{row.metric}</td>
                  <td className="py-2 text-center" style={{ color: 'var(--color-amber)' }}>
                    {'*'.repeat(row.weight)}
                    <span style={{ color: 'var(--color-border)' }}>{'*'.repeat(5 - row.weight)}</span>
                  </td>
                  <td className="py-2" style={{ color: 'var(--color-muted)' }}>{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top 5 Rankings */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-sub)' }}>
          Top 5 Rankings
        </h3>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-lg mb-4" style={{ background: 'var(--color-surface)' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all"
              style={{
                background: activeTab === t.key ? 'var(--color-card)' : 'transparent',
                color: activeTab === t.key ? 'var(--color-accent)' : 'var(--color-muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {RANKINGS[activeTab].map((entry) => (
            <div
              key={entry.chip}
              className="flex items-center gap-4 px-4 py-3 rounded-xl"
              style={{
                background: entry.rank === 1
                  ? 'color-mix(in srgb, var(--color-accent) 10%, var(--color-surface))'
                  : 'var(--color-surface)',
                border: '1px solid',
                borderColor: entry.rank === 1 ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            >
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: entry.rank === 1 ? 'var(--color-accent)' : 'transparent',
                  color: entry.rank === 1 ? '#000' : 'var(--color-muted)',
                  border: entry.rank === 1 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {entry.rank}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {entry.chip}
                </span>
                {entry.highlight && (
                  <span className="ml-2 text-[10px]" style={{ color: 'var(--color-accent)' }}>
                    {entry.highlight}
                  </span>
                )}
              </div>
              <span className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>{entry.score}</span>
              <span className="text-xs w-24 text-right" style={{ color: 'var(--color-sub)' }}>{entry.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Key trade-off: M5 Pro 15C vs M2 Max 38G */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-sub)' }}>
          Key Trade-Off: M5 Pro 15C vs M2 Max 38G
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: 'var(--color-muted)' }}>
                <th className="text-left pb-3 font-medium">Metric</th>
                <th className="text-center pb-3 font-medium" style={{ color: 'var(--color-gen-m5)' }}>M5 Pro 15C</th>
                <th className="text-center pb-3 font-medium" style={{ color: 'var(--color-gen-m2)' }}>M2 Max 38G</th>
              </tr>
            </thead>
            <tbody>
              {TRADEOFF_METRICS.map((row) => {
                const m5Better = [
                  'Geekbench Single', 'Geekbench Multi', 'Battery (hrs)',
                  'Wi-Fi', 'Thunderbolt', 'Generation',
                ].includes(row.metric);
                const m2Better = [
                  'GPU Cores', 'RAM', 'Memory Bandwidth',
                  'Geekbench GPU', 'LLM 7B (tok/s)', 'MSRP / Price',
                ].includes(row.metric);
                return (
                  <tr key={row.metric} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-2 font-medium" style={{ color: 'var(--color-text)' }}>{row.metric}</td>
                    <td
                      className="py-2 text-center"
                      style={{ color: m5Better ? 'var(--color-green)' : m2Better ? 'var(--color-text)' : 'var(--color-text)' }}
                    >
                      {row.m5pro}
                    </td>
                    <td
                      className="py-2 text-center"
                      style={{ color: m2Better ? 'var(--color-green)' : m5Better ? 'var(--color-text)' : 'var(--color-text)' }}
                    >
                      {row.m2max}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="mt-4 rounded-lg p-4 text-sm leading-relaxed"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>Verdict: </span>
          The M5 Pro 15C wins for daily coding and general productivity with vastly better single-core performance,
          battery life, and modern connectivity. The M2 Max 38G wins for LLM inference and GPU-heavy workloads
          thanks to 47% more memory bandwidth and 32GB RAM. For Parsa's 80/20 split (coding/LLM), the M5 Pro 15C
          is the better daily driver, with cloud or desktop offload handling the heaviest LLM models.
        </div>
      </section>

      {/* Final recommendation */}
      <section
        className="rounded-2xl p-6"
        style={{
          background: 'color-mix(in srgb, var(--color-accent) 6%, var(--color-card))',
          border: '2px solid var(--color-accent)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">*</span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
              Final Recommendation: M5 Pro 15C / 24GB
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-sub)' }}>$2,149 -- Apple MacBook Pro 16"</p>
          </div>
        </div>
        <ol className="space-y-2 list-decimal list-inside">
          {FINAL_RATIONALE.map((point, i) => (
            <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {point}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
