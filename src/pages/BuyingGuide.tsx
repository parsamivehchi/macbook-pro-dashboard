import { useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, TIER_COLORS, GENS, fmt, fD, label } from '../utils/format';

/* ---------- Types ---------- */
type UseCase = 'coding' | 'llm' | 'gpu' | 'battery' | 'allround';
type Budget = '<1800' | '1800-2500' | '2500-3500' | '3500+';

interface Recommendation {
  chip: string;
  price: string;
  bullets: string[];
}

/* ---------- Recommendation mapping ---------- */
const RECOMMENDATIONS: Record<UseCase, Record<Budget, Recommendation>> = {
  coding: {
    '<1800': {
      chip: 'M4 Pro 12-Core / 24GB',
      price: '$1,799',
      bullets: [
        'Excellent single-core for compilation',
        'Best value entry into Pro tier',
        'Clearance pricing on M4 generation',
        '24GB handles IDE + Docker + browser comfortably',
      ],
    },
    '1800-2500': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        'Latest gen with best single-thread perf',
        'Wi-Fi 7 and improved battery over M4',
        '15 GPU cores handle occasional GPU tasks',
        'Sweet spot for professional developers',
      ],
    },
    '2500-3500': {
      chip: 'M5 Pro 18-Core / 24GB',
      price: '$2,749',
      bullets: [
        'Maximum Pro-tier CPU and GPU cores',
        'Handles parallel builds and heavy workloads',
        '18 GPU cores for ML experimentation',
        'Future-proofed for 3-4 year lifecycle',
      ],
    },
    '3500+': {
      chip: 'M5 Max 32-GPU / 36GB',
      price: '$3,549',
      bullets: [
        'Max-tier memory bandwidth for heavy multitasking',
        '36GB unified memory for large codebases + Docker',
        'Overkill for coding alone but ideal for coding + LLM + GPU',
        'Best single-thread performance available',
      ],
    },
  },
  llm: {
    '<1800': {
      chip: 'M2 Max 38-GPU / 32GB (Used)',
      price: '~$1,600',
      bullets: [
        'Massive 400 GB/s memory bandwidth at used prices',
        '32GB fits 7B-13B models comfortably',
        'Best bandwidth-per-dollar on the market',
        'Used M2 Max 64GB models available around $2K',
      ],
    },
    '1800-2500': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        '24GB runs 7B models with good headroom',
        'Improved memory bandwidth over M4 Pro',
        'Latest Neural Engine for on-device ML',
        'Alternative: M4 Pro 14C/24GB at same price for more GPU',
      ],
    },
    '2500-3500': {
      chip: 'M5 Max 32-GPU / 36GB',
      price: '$3,549',
      bullets: [
        '36GB fits 13B-30B quantized models',
        'Max-tier bandwidth critical for LLM tok/s',
        '546 GB/s memory bandwidth',
        'Significant jump over Pro-tier for inference',
      ],
    },
    '3500+': {
      chip: 'M5 Max 40-GPU / 48GB',
      price: '$4,049',
      bullets: [
        '48GB fits 30B+ parameter models',
        'Maximum bandwidth at 546 GB/s',
        '40 GPU cores for parallel inference',
        'Best single-machine LLM experience on a laptop',
      ],
    },
  },
  gpu: {
    '<1800': {
      chip: 'M3 Max 40-GPU / 48GB (Used)',
      price: '~$2,600 used',
      bullets: [
        'Note: Slightly above budget even used',
        '40 GPU cores with hardware ray tracing',
        '48GB unified memory for large models/assets',
        'Consider M3 Pro 18C used around $1,500-1,800',
      ],
    },
    '1800-2500': {
      chip: 'M3 Max 30-GPU / 36GB (Used)',
      price: '~$2,200',
      bullets: [
        '30 GPU cores with hardware ray tracing (M3+)',
        '36GB handles large 3D scenes and datasets',
        'Ray tracing absent in M1/M2 generation',
        'Good value for GPU-heavy workflows',
      ],
    },
    '2500-3500': {
      chip: 'M4 Max 40-GPU / 48GB',
      price: '~$3,200',
      bullets: [
        'Clearance pricing on M4 Max',
        '48GB unified memory for massive GPU workloads',
        'Second-gen ray tracing hardware',
        'Excellent GPU compute throughput',
      ],
    },
    '3500+': {
      chip: 'M5 Max 40-GPU / 48GB',
      price: '$4,049',
      bullets: [
        'Latest generation GPU architecture',
        '48GB for the largest models and datasets',
        'Third-gen ray tracing hardware',
        'Maximum GPU performance in a laptop form factor',
      ],
    },
  },
  battery: {
    '<1800': {
      chip: 'M5 Base / 24GB',
      price: '$1,799',
      bullets: [
        'Best battery life of any MacBook Pro',
        '24+ hours for light workloads',
        'M5 efficiency cores are class-leading',
        '24GB is sufficient for most tasks',
      ],
    },
    '1800-2500': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        'Near-base battery life with Pro performance',
        'M5 Pro optimizes power better than M4 Pro',
        'Wi-Fi 7 is more power-efficient',
        'Best balance of battery and capability',
      ],
    },
    '2500-3500': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        'Same recommendation -- save the extra budget',
        'Battery life degrades significantly at Max tier',
        'Pro 15C handles 99% of workflows',
        'Put savings toward AppleCare or peripherals',
      ],
    },
    '3500+': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        'Battery and Max tier are fundamentally at odds',
        'M5 Pro 15C is the best battery/performance ratio',
        'If you must spend more: M5 Pro 18C at $2,749',
        'Extra budget better spent on external GPU or cloud',
      ],
    },
  },
  allround: {
    '<1800': {
      chip: 'M4 Pro 12-Core / 24GB',
      price: '$1,799',
      bullets: [
        'Best all-around value in the lineup',
        'Handles coding, media, browsing with ease',
        'Clearance M4 Pro pricing is excellent',
        '24GB sufficient for most professional workflows',
      ],
    },
    '1800-2500': {
      chip: 'M5 Pro 15-Core / 24GB',
      price: '$2,149',
      bullets: [
        'The jack-of-all-trades champion',
        'Latest gen across all metrics',
        'Great battery, great performance, great thermals',
        'Most popular configuration for good reason',
      ],
    },
    '2500-3500': {
      chip: 'M5 Pro 18-Core / 24GB',
      price: '$2,749',
      bullets: [
        'Maximum cores in Pro tier for versatility',
        '18 GPU cores open up creative workflows',
        'Still excellent battery life',
        'Premium all-rounder without Max-tier drawbacks',
      ],
    },
    '3500+': {
      chip: 'M5 Max 32-GPU / 36GB',
      price: '$3,549',
      bullets: [
        'No-compromise all-rounder',
        '36GB handles any combination of workloads',
        'Max bandwidth benefits everything from LLM to GPU',
        'Will stay relevant for 4-5 years minimum',
      ],
    },
  },
};

const USE_CASE_OPTIONS: { key: UseCase; label: string; icon: string; desc: string }[] = [
  { key: 'coding', label: 'Daily Coding', icon: '\u2328\uFE0F', desc: 'IDE, compilers, Docker, Git' },
  { key: 'llm', label: 'Local LLM', icon: '\u{1F9E0}', desc: 'Ollama, llama.cpp, large models' },
  { key: 'gpu', label: 'GPU / ML', icon: '\u{1F3A8}', desc: '3D rendering, ML training, compute' },
  { key: 'battery', label: 'Battery Life', icon: '\u{1F50B}', desc: 'All-day mobile, travel, meetings' },
  { key: 'allround', label: 'All-Rounder', icon: '\u26A1', desc: 'Bit of everything, no specialization' },
];

const BUDGET_OPTIONS: { key: Budget; label: string }[] = [
  { key: '<1800', label: 'Under $1,800' },
  { key: '1800-2500', label: '$1,800 - $2,500' },
  { key: '2500-3500', label: '$2,500 - $3,500' },
  { key: '3500+', label: '$3,500+' },
];

const UPGRADE_PATHS: Record<string, string> = {
  M1: 'Significant gains across the board. M5 Pro offers 2x+ single-core, massively better GPU, Wi-Fi 7, and improved display. Strong upgrade at any tier.',
  'M1 Pro': 'Worthwhile upgrade. M5 Pro 15C roughly doubles multi-core and GPU performance. Battery life improvement is notable. Wait for clearance M5 pricing if budget-conscious.',
  'M1 Max': 'Moderate upgrade for CPU, large upgrade for GPU efficiency. If your M1 Max 64GB still handles your RAM needs, wait for M6 unless you need the latest features.',
  M2: 'Good upgrade path. M5 Pro is a generational leap in every metric. If you have M2 base, even M4 Pro clearance is a massive jump.',
  'M2 Pro': 'Solid upgrade. Roughly 1.5-1.8x across benchmarks. M5 Pro is the natural successor. Consider if your current machine still meets your needs.',
  'M2 Max': 'Hold unless you need more RAM or latest features. M2 Max 64GB is still excellent for LLM workloads due to massive bandwidth. M5 Max is faster but the bandwidth gap is smaller than you think.',
  M3: 'Good time to upgrade. M5 Pro 15C at $2,149 is a massive leap. Even base M5 at $1,799 is a significant improvement.',
  'M3 Pro': 'Modest upgrade. M5 Pro offers ~30-40% improvement. Worth it if you need Wi-Fi 7, better battery, or more GPU. Otherwise wait for M6.',
  'M3 Max': 'Skip this generation. M3 Max is still excellent. Wait for M6 Max for a meaningful upgrade.',
  M4: 'Too soon to upgrade. M4 base to M5 base is a small improvement. Only upgrade if moving to Pro/Max tier for specific needs.',
  'M4 Pro': 'Not recommended unless switching tiers. M5 Pro is ~15-20% faster. Wait for M6 Pro.',
  'M4 Max': 'Do not upgrade. M4 Max is current-gen equivalent in real-world performance.',
};

export default function BuyingGuide() {
  const { filtered } = useFilters();
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [currentChip, setCurrentChip] = useState('');

  const recommendation = useCase && budget ? RECOMMENDATIONS[useCase][budget] : null;

  const startOver = () => {
    setStep(1);
    setUseCase(null);
    setBudget(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon="\u{1F6D2}"
        title="Buying Guide"
        subtitle="Interactive decision tree to find your ideal MacBook Pro"
      />

      {/* Decision wizard */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step >= s ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: step >= s ? '#000' : 'var(--color-muted)',
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className="w-12 h-0.5"
                  style={{ background: step > s ? 'var(--color-accent)' : 'var(--color-border)' }}
                />
              )}
            </div>
          ))}
          {step > 1 && (
            <button
              onClick={startOver}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--color-surface)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
            >
              Start Over
            </button>
          )}
        </div>

        {/* Step 1: Use case */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              What's your primary use case?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {USE_CASE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setUseCase(opt.key); setStep(2); }}
                  className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{opt.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              What's your budget?
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
              Selected: <span style={{ color: 'var(--color-accent)' }}>{USE_CASE_OPTIONS.find((o) => o.key === useCase)?.label}</span>
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setBudget(opt.key); setStep(3); }}
                  className="p-4 rounded-xl text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recommendation */}
        {step === 3 && recommendation && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Our Recommendation
            </h3>
            <div
              className="rounded-xl p-6"
              style={{
                background: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-surface))',
                border: '2px solid var(--color-accent)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>
                    {recommendation.chip}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-sub)' }}>
                    {USE_CASE_OPTIONS.find((o) => o.key === useCase)?.label} &bull; {BUDGET_OPTIONS.find((o) => o.key === budget)?.label}
                  </p>
                </div>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-green)' }}>
                  {recommendation.price}
                </span>
              </div>
              <ul className="space-y-2">
                {recommendation.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                    <span style={{ color: 'var(--color-accent)' }} className="mt-0.5">&bull;</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Buy strategy cards */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-sub)' }}>
          Buying Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Buy New (M5)',
              color: 'var(--color-gen-m5)',
              items: [
                'You need the absolute latest performance',
                'Wi-Fi 7 and Thunderbolt 5 matter to you',
                'You plan to keep it 4+ years',
                'Battery life is a priority',
                'You want full AppleCare eligibility',
              ],
            },
            {
              title: 'Buy Clearance (M4)',
              color: 'var(--color-gen-m4)',
              items: [
                'You want new-in-box with warranty',
                'M5 performance bump doesn\'t justify premium',
                '10-20% discounts from retailers',
                'Still has Thunderbolt 4 and Wi-Fi 6E',
                'Best value for "current gen" feel',
              ],
            },
            {
              title: 'Buy Used (M2/M3)',
              color: 'var(--color-gen-m2)',
              items: [
                'Budget is the primary constraint',
                'You need maximum RAM (64GB M2 Max)',
                'LLM workloads where bandwidth matters most',
                'M2 Max 64GB still trades for ~$2,000-2,200',
                'Check battery cycle count and condition',
              ],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="font-semibold text-sm mb-3" style={{ color: card.color }}>
                {card.title}
              </h3>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text)' }}>
                    <span className="mt-0.5" style={{ color: card.color }}>&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade path */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Upgrade Path Advisor
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-64">
            <label className="text-xs block mb-1.5" style={{ color: 'var(--color-muted)' }}>
              What do you have now?
            </label>
            <select
              value={currentChip}
              onChange={(e) => setCurrentChip(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value="">Select your chip...</option>
              {Object.keys(UPGRADE_PATHS).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          {currentChip && UPGRADE_PATHS[currentChip] && (
            <div
              className="flex-1 rounded-xl p-4"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>
                Upgrading from {currentChip}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {UPGRADE_PATHS[currentChip]}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
