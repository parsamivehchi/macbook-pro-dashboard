import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { LLM_MODELS } from '../data/llm-models';
import { GEN_COLORS, fmt, label } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import { InsightCard } from '../components/shared/InsightCard';
import type { ChipConfig } from '../data/chips';

const FRAMEWORKS = [
  { name: 'llama.cpp', multiplier: 1.0, note: 'Baseline reference' },
  { name: 'MLX', multiplier: 1.25, note: 'Apple-optimized, +25% speed' },
  { name: 'Ollama', multiplier: 0.88, note: 'Convenience wrapper, -12% overhead' },
];

const FEELS_FAST_THRESHOLD = 30;

function estimateTokS(chip: ChipConfig, modelQ4GB: number): number {
  const availableRam = chip.ram - 8; // OS + basic overhead
  if (modelQ4GB > availableRam) return 0;
  return Math.round(chip.bw / modelQ4GB * 0.85);
}

function fitQuality(chip: ChipConfig, modelQ4GB: number, modelMinRam: number): 'green' | 'amber' | 'red' | 'none' {
  const availableRam = chip.ram - 8;
  if (modelQ4GB > availableRam) return 'none';
  const headroom = availableRam - modelQ4GB;
  const tokS = estimateTokS(chip, modelQ4GB);
  if (headroom >= 8 && tokS >= FEELS_FAST_THRESHOLD) return 'green';
  if (headroom >= 2 && tokS >= 15) return 'amber';
  return 'red';
}

function fitColor(quality: 'green' | 'amber' | 'red' | 'none'): string {
  switch (quality) {
    case 'green': return 'var(--color-green)';
    case 'amber': return 'var(--color-amber)';
    case 'red': return 'var(--color-red)';
    case 'none': return 'var(--color-muted)';
  }
}

function fitBg(quality: 'green' | 'amber' | 'red' | 'none'): string {
  switch (quality) {
    case 'green': return 'rgba(52, 211, 153, 0.12)';
    case 'amber': return 'rgba(251, 191, 36, 0.12)';
    case 'red': return 'rgba(248, 113, 113, 0.12)';
    case 'none': return 'rgba(85, 85, 112, 0.08)';
  }
}

export default function LLMPerformance() {
  const { filtered } = useFilters();

  const sortedChips = useMemo(
    () => [...filtered].sort((a, b) => b.bw - a.bw),
    [filtered],
  );

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\uD83E\uDDE0"
        title="LLM Performance"
        subtitle={`Model fit heatmap & inference estimates for ${filtered.length} configurations`}
      />

      {/* "Feels Fast" threshold info */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-[10px] h-[10px] rounded-sm" style={{ background: 'var(--color-green)' }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--color-sub)' }}>Comfortable (&ge;30 tok/s, &ge;8GB headroom)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[10px] h-[10px] rounded-sm" style={{ background: 'var(--color-amber)' }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--color-sub)' }}>Tight (&ge;15 tok/s, &ge;2GB headroom)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[10px] h-[10px] rounded-sm" style={{ background: 'var(--color-red)' }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--color-sub)' }}>Barely (runs but constrained)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[10px] h-[10px] rounded-sm" style={{ background: 'var(--color-muted)', opacity: 0.4 }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--color-sub)' }}>Doesn't fit</span>
        </div>
      </div>

      {/* Model Fit Heatmap */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto mb-6">
        <div className="text-[10px] font-bold uppercase tracking-widest p-4 pb-2" style={{ color: 'var(--color-muted)' }}>
          Model Fit Heatmap (estimated tok/s at Q4)
        </div>
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
              <th
                className="px-3 py-2.5 text-left text-[9px] font-bold uppercase tracking-widest sticky left-0"
                style={{ color: 'var(--color-muted)', background: 'var(--color-card)', zIndex: 1 }}
              >
                Chip (BW)
              </th>
              {LLM_MODELS.map(m => (
                <th
                  key={m.name}
                  className="px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <div>{m.name}</div>
                  <div className="font-mono text-[8px] mt-0.5 font-normal" style={{ color: 'var(--color-muted)' }}>
                    {m.q4gb}GB Q4
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedChips.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)',
                }}
              >
                <td
                  className="px-3 py-2 text-[11px] font-semibold whitespace-nowrap sticky left-0"
                  style={{
                    color: GEN_COLORS[c.gen],
                    background: i % 2 === 0 ? 'var(--color-card)' : 'var(--color-surface)',
                    zIndex: 1,
                  }}
                >
                  {label(c)}
                  <span className="ml-1.5 font-mono text-[9px]" style={{ color: 'var(--color-muted)' }}>
                    {c.bw} GB/s
                  </span>
                </td>
                {LLM_MODELS.map(m => {
                  const quality = fitQuality(c, m.q4gb, m.minRam);
                  const tokS = estimateTokS(c, m.q4gb);
                  return (
                    <td
                      key={m.name}
                      className="px-2 py-2 text-center font-mono text-[11px] font-semibold"
                      style={{
                        background: fitBg(quality),
                        color: fitColor(quality),
                      }}
                    >
                      {quality === 'none' ? '\u2717' : `${tokS}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedChips.length === 0 && (
          <div className="p-8 text-center text-[13px]" style={{ color: 'var(--color-muted)' }}>
            No chips match your filters.
          </div>
        )}
      </div>

      {/* Framework Comparison */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-widest p-4 pb-2" style={{ color: 'var(--color-muted)' }}>
            Framework Speed Multipliers
          </div>
          <table className="w-full text-[12px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
                <th className="px-4 py-2 text-left text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Framework</th>
                <th className="px-4 py-2 text-center text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Multiplier</th>
                <th className="px-4 py-2 text-left text-[9px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {FRAMEWORKS.map(f => (
                <tr key={f.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-2.5 font-semibold" style={{ color: 'var(--color-text)' }}>{f.name}</td>
                  <td className="px-4 py-2.5 text-center font-mono font-bold" style={{
                    color: f.multiplier > 1 ? 'var(--color-green)' : f.multiplier < 1 ? 'var(--color-amber)' : 'var(--color-text)',
                  }}>
                    {f.multiplier > 1 ? '+' : ''}{Math.round((f.multiplier - 1) * 100)}%
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--color-sub)' }}>{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-[10px]" style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
            Heatmap values use llama.cpp baseline. Multiply by framework factor for adjusted estimates.
          </div>
        </div>

        {/* Memory Budget Info Card */}
        <div className="rounded-xl border border-border bg-card p-5" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--color-accent)' }}>
          <div className="text-[13px] font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Memory Budget Breakdown
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px]" style={{ color: 'var(--color-sub)' }}>macOS + system services</span>
              <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--color-red)' }}>6 - 8 GB</span>
            </div>
            <div className="h-px" style={{ background: 'var(--color-border)' }} />
            <div className="flex justify-between items-center">
              <span className="text-[12px]" style={{ color: 'var(--color-sub)' }}>Dev tools (IDE, browser, Docker)</span>
              <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--color-amber)' }}>4 - 6 GB</span>
            </div>
            <div className="h-px" style={{ background: 'var(--color-border)' }} />
            <div className="flex justify-between items-center">
              <span className="text-[12px]" style={{ color: 'var(--color-sub)' }}>Model weights (Q4 quantized)</span>
              <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--color-accent)' }}>varies</span>
            </div>
            <div className="h-px" style={{ background: 'var(--color-border)' }} />
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>Headroom (should be &ge; 4GB)</span>
              <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--color-green)' }}>remainder</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg p-3" style={{ background: 'var(--color-surface)' }}>
            <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-sub)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Rule of thumb:</strong> Subtract ~12GB from total RAM for OS + dev tools.
              The remainder is your model budget. 24GB machine = ~12GB for models (fits 8B-14B comfortably).
              48GB machine = ~36GB for models (fits 32B-70B).
            </div>
          </div>
        </div>
      </div>

      {/* "Feels Fast" Threshold Note */}
      <InsightCard
        title={`30 tok/s: The "feels fast" threshold`}
        body={`Below 30 tokens/second, LLM output feels sluggish and breaks flow. Above it, responses stream fast enough that you rarely notice waiting. This is the minimum target for a usable local LLM experience. For coding assistants with longer outputs, 40+ tok/s is ideal.`}
        accent="var(--color-green)"
      />
    </div>
  );
}
