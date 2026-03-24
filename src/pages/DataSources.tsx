import { useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, TIER_COLORS, GENS, fmt, fD, label } from '../utils/format';

/* ---------- Source data ---------- */
interface Source {
  name: string;
  url: string;
}

interface SourceCategory {
  category: string;
  color: string;
  sources: Source[];
}

const SOURCE_CATEGORIES: SourceCategory[] = [
  {
    category: 'Apple Official',
    color: 'var(--color-accent)',
    sources: [
      { name: 'MacBook Pro Tech Specs (M5)', url: 'https://www.apple.com/macbook-pro/specs/' },
      { name: 'MacBook Pro Tech Specs (M4)', url: 'https://support.apple.com/kb/SP917' },
      { name: 'MacBook Pro Tech Specs (M3)', url: 'https://support.apple.com/kb/SP904' },
      { name: 'MacBook Pro Tech Specs (M2)', url: 'https://support.apple.com/kb/SP889' },
      { name: 'Apple Silicon Overview', url: 'https://www.apple.com/apple-silicon/' },
      { name: 'Apple Newsroom -- M5 Announcement', url: 'https://www.apple.com/newsroom/' },
      { name: 'Apple Compare Macs', url: 'https://www.apple.com/shop/buy-mac/macbook-pro' },
      { name: 'Apple Refurbished Store', url: 'https://www.apple.com/shop/refurbished/mac/macbook-pro' },
      { name: 'Apple Trade-In Values', url: 'https://www.apple.com/shop/trade-in' },
      { name: 'Apple Developer -- Metal Performance', url: 'https://developer.apple.com/metal/' },
    ],
  },
  {
    category: 'Benchmark Sources',
    color: 'var(--color-gen-m5)',
    sources: [
      { name: 'Geekbench 6 Browser', url: 'https://browser.geekbench.com/' },
      { name: 'Geekbench ML Browser', url: 'https://browser.geekbench.com/ml/v1' },
      { name: 'Cinebench R24 Database', url: 'https://www.maxon.net/en/cinebench' },
      { name: 'PassMark CPU Benchmark', url: 'https://www.passmark.com/products/performancetest/' },
    ],
  },
  {
    category: 'Pricing Sources',
    color: 'var(--color-green)',
    sources: [
      { name: 'Apple Store (current MSRP)', url: 'https://www.apple.com/shop/buy-mac/macbook-pro' },
      { name: 'Swappa (used Mac pricing)', url: 'https://swappa.com/laptops/apple-macbook-pro' },
      { name: 'Mac Price Guide (Mac2Sell)', url: 'https://mac2sell.net/' },
      { name: 'EveryMac Specifications', url: 'https://everymac.com/' },
      { name: 'Amazon MacBook Pro Listings', url: 'https://www.amazon.com/s?k=macbook+pro' },
    ],
  },
  {
    category: 'Reviews & Analysis',
    color: 'var(--color-gen-m4)',
    sources: [
      { name: 'AnandTech / Tom\'s Hardware Apple Reviews', url: 'https://www.tomshardware.com/reviews/apple' },
      { name: 'Ars Technica Apple Reviews', url: 'https://arstechnica.com/tag/apple-silicon/' },
      { name: 'Notebookcheck MacBook Reviews', url: 'https://www.notebookcheck.net/Apple-MacBook-Pro.html' },
      { name: 'Max Tech YouTube (benchmarks)', url: 'https://www.youtube.com/@MaxTech' },
      { name: 'Dave Lee YouTube (reviews)', url: 'https://www.youtube.com/@DaveLee' },
      { name: 'The Verge MacBook Pro Reviews', url: 'https://www.theverge.com/laptop-review' },
      { name: 'MacRumors Buyer\'s Guide', url: 'https://buyersguide.macrumors.com/' },
      { name: 'Bare Feats Mac Benchmarks', url: 'https://barefeats.com/' },
    ],
  },
  {
    category: 'Technical References',
    color: 'var(--color-gen-m3)',
    sources: [
      { name: 'llama.cpp Apple Silicon Benchmarks', url: 'https://github.com/ggerganov/llama.cpp/discussions' },
      { name: 'Ollama Documentation', url: 'https://ollama.com/' },
      { name: 'GGUF Model Repository (HuggingFace)', url: 'https://huggingface.co/models?sort=trending&search=gguf' },
      { name: 'Apple Metal Feature Set Tables', url: 'https://developer.apple.com/metal/gpu-family/' },
      { name: 'Unified Memory Architecture Paper', url: 'https://machinelearning.apple.com/' },
      { name: 'MLX Framework (Apple ML)', url: 'https://github.com/ml-explore/mlx' },
      { name: 'AsahiLinux GPU Reverse Engineering', url: 'https://asahilinux.org/' },
    ],
  },
];

const METHODOLOGY_CARDS = [
  {
    title: 'Benchmarks',
    color: 'var(--color-accent)',
    body: 'Geekbench 6 scores (single, multi, GPU) are sourced from the Geekbench Browser using median scores from verified results. We exclude outliers and prefer results with at least 5 submissions. Cinebench R24 is used for sustained multi-core validation.',
  },
  {
    title: 'LLM Speeds',
    color: 'var(--color-gen-m5)',
    body: 'LLM inference speeds (tok/s) are measured using llama.cpp with Llama 3.1 7B (Q4_K_M quantization) and Llama 2 14B (Q4_K_M). Tests run with Metal GPU acceleration enabled, 2048 token context, and batch size 512. Numbers represent token generation speed (eval), not prompt processing.',
  },
  {
    title: 'Pricing',
    color: 'var(--color-green)',
    body: 'MSRP prices are from Apple\'s US store (before tax). Used/clearance prices are median asking prices from Swappa and eBay sold listings as of March 2026. Depreciation curves are calculated from historical pricing data across 4 generations of Apple Silicon MacBook Pros.',
  },
  {
    title: 'Depreciation',
    color: 'var(--color-amber)',
    body: 'Depreciation percentages represent estimated value retention after 1 year of ownership. Values are derived from historical resale data: M1 (4 years old, ~45% retained), M2 (3 years, ~55%), M3 (2 years, ~65%), M4 (1 year, ~78%), M5 (current, 95%). Pro/Max tiers retain ~3-5% more value than base models.',
  },
];

const DATA_LIMITATIONS = [
  'M5 benchmarks include some projected/estimated values where independent reviews are pending. These are marked with approximation indicators in the data.',
  'LLM inference speeds vary significantly based on quantization level, context length, batch size, and thermal conditions. Numbers represent best-case sustained performance.',
  'Used pricing is highly variable by condition, battery cycle count, and seller. Listed prices are median "good condition" asking prices and may not reflect actual sale prices.',
  'Battery life figures are Apple\'s claimed hours for video playback. Real-world battery life under development workloads is typically 40-60% of these figures.',
  'TOPS (Neural Engine) figures are Apple\'s theoretical maximums. Real-world ML inference depends heavily on framework support (Core ML, Metal, MLX) and model architecture.',
];

export default function DataSources() {
  const { filtered } = useFilters();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon="\u{1F4DA}"
        title="Data Sources"
        subtitle="References, methodology, and data limitations"
      />

      {/* Freshness indicator */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'color-mix(in srgb, var(--color-green) 15%, var(--color-surface))',
            color: 'var(--color-green)',
            border: '1px solid color-mix(in srgb, var(--color-green) 30%, var(--color-border))',
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-green)' }} />
          All data current as of March 23, 2026
        </span>
      </div>

      {/* Source categories */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Sources by Category
        </h2>
        <div className="space-y-3">
          {SOURCE_CATEGORIES.map((cat) => {
            const isOpen = expanded[cat.category] ?? false;
            return (
              <div
                key={cat.category}
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <button
                  onClick={() => toggle(cat.category)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm" style={{ background: cat.color }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      {cat.category}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--color-surface)', color: 'var(--color-muted)' }}
                    >
                      {cat.sources.length}
                    </span>
                  </div>
                  <span
                    className="text-xs transition-transform"
                    style={{
                      color: 'var(--color-muted)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    v
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <ul className="space-y-2">
                      {cat.sources.map((src) => (
                        <li key={src.name} className="flex items-start gap-2">
                          <span className="mt-1 text-[10px]" style={{ color: cat.color }}>--</span>
                          <div>
                            <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                              {src.name}
                            </span>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[10px] hover:underline truncate max-w-md"
                              style={{ color: 'var(--color-accent)' }}
                            >
                              {src.url}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology cards */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Methodology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METHODOLOGY_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: card.color }}>
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Data limitations */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Data Limitations
        </h3>
        <div className="space-y-3">
          {DATA_LIMITATIONS.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ background: 'var(--color-amber)', color: '#000' }}
              >
                {i + 1}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
