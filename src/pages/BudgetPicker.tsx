import { useMemo, useState, useCallback } from 'react';
import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { Pill } from '../components/shared/Pill';
import { GEN_COLORS, fmt } from '../utils/format';
import type { ChipConfig } from '../data/chips';

type SortKey = 'llm' | 'sc' | 'mc' | 'bat' | 'value';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'llm', label: 'LLM tok/s' },
  { key: 'sc', label: 'Single-Core' },
  { key: 'mc', label: 'Multi-Core' },
  { key: 'bat', label: 'Battery' },
  { key: 'value', label: 'Value Score' },
];

const QUICK_TIERS = [800, 1200, 1800, 2500, 3500, 4000];

function sortChips(chips: ChipConfig[], key: SortKey): ChipConfig[] {
  const sorted = [...chips];
  switch (key) {
    case 'llm':
      return sorted.sort((a, b) => (b.l7 ?? 0) - (a.l7 ?? 0));
    case 'sc':
      return sorted.sort((a, b) => (b.g6s ?? 0) - (a.g6s ?? 0));
    case 'mc':
      return sorted.sort((a, b) => (b.g6m ?? 0) - (a.g6m ?? 0));
    case 'bat':
      return sorted.sort((a, b) => (b.bat ?? 0) - (a.bat ?? 0));
    case 'value': {
      const vs = (c: ChipConfig) => {
        const st = c.st ?? c.msrp;
        if (!st) return 0;
        const perK = st / 1000;
        return (
          ((c.g6m ?? 0) / 1000 + (c.l7 ?? 0) * 2 + (c.tops ?? 0) / 2) / perK
        );
      };
      return sorted.sort((a, b) => vs(b) - vs(a));
    }
    default:
      return sorted;
  }
}

function primaryMetric(c: ChipConfig, key: SortKey): string {
  switch (key) {
    case 'llm':
      return `${c.l7 ?? '?'} tok/s`;
    case 'sc':
      return `SC ${fmt(c.g6s ?? 0)}`;
    case 'mc':
      return `MC ${fmt(c.g6m ?? 0)}`;
    case 'bat':
      return `${c.bat ?? '?'}h battery`;
    case 'value': {
      const st = c.st ?? c.msrp;
      if (!st) return 'N/A';
      const perK = st / 1000;
      const vs =
        ((c.g6m ?? 0) / 1000 + (c.l7 ?? 0) * 2 + (c.tops ?? 0) / 2) / perK;
      return `VS ${vs.toFixed(1)}`;
    }
    default:
      return '';
  }
}

export default function BudgetPicker() {
  const { filtered } = useFilters();
  const [budget, setBudget] = useState(2500);
  const [sortBy, setSortBy] = useState<SortKey>('value');

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBudget(Number(e.target.value));
    },
    []
  );

  const results = useMemo(() => {
    const underBudget = filtered.filter(
      (c) => (c.st ?? c.msrp) <= budget
    );
    return sortChips(underBudget, sortBy).slice(0, 8);
  }, [filtered, budget, sortBy]);

  const totalUnder = useMemo(
    () => filtered.filter((c) => (c.st ?? c.msrp) <= budget).length,
    [filtered, budget]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        icon="?"
        title="Budget Picker"
        subtitle="Find the best MacBook Pro for your budget"
      />

      {/* Budget Slider Section */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <div
              className="text-5xl font-bold tracking-tight"
              style={{ color: 'var(--color-accent)' }}
            >
              ${fmt(budget)}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: 'var(--color-muted)' }}
            >
              {totalUnder} chip{totalUnder !== 1 ? 's' : ''} under budget
            </div>
          </div>

          <input
            type="range"
            min={500}
            max={7500}
            step={50}
            value={budget}
            onChange={handleSlider}
            className="w-full max-w-xl h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-accent) ${((budget - 500) / 7000) * 100}%, var(--color-surface) ${((budget - 500) / 7000) * 100}%)`,
            }}
          />

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span
              className="text-xs mr-1"
              style={{ color: 'var(--color-muted)' }}
            >
              Quick:
            </span>
            {QUICK_TIERS.map((tier) => (
              <button
                key={tier}
                onClick={() => setBudget(tier)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background:
                    budget === tier
                      ? 'var(--color-accent)'
                      : 'var(--color-surface)',
                  color: budget === tier ? '#000' : 'var(--color-sub)',
                }}
              >
                {tier >= 4000 ? `$${(tier / 1000).toFixed(0)}K+` : `$${tier >= 1000 ? `${(tier / 1000).toFixed(1)}K` : tier}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sort Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          Sort by:
        </span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background:
                sortBy === opt.key
                  ? 'var(--color-accent)'
                  : 'var(--color-surface)',
              color: sortBy === opt.key ? '#000' : 'var(--color-sub)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <section>
        {results.length === 0 ? (
          <div
            className="text-center py-16 text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            No chips found under ${fmt(budget)}. Try increasing your budget.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((c, i) => {
              const street = c.st ?? c.msrp;
              const genColor =
                GEN_COLORS[c.gen as keyof typeof GEN_COLORS] ??
                'var(--color-accent)';
              return (
                <div
                  key={c.chip}
                  className="rounded-xl p-5 border space-y-3 relative"
                  style={{
                    background: 'var(--color-card)',
                    borderColor:
                      i === 0 ? 'var(--color-green)' : 'var(--color-border)',
                  }}
                >
                  {/* Rank badge */}
                  <div
                    className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        i === 0
                          ? 'var(--color-green)'
                          : i === 1
                            ? 'var(--color-accent)'
                            : 'var(--color-surface)',
                      color: i < 2 ? '#000' : 'var(--color-sub)',
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: genColor }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {c.chip}
                    </span>
                  </div>

                  {/* Primary metric */}
                  <div
                    className="text-lg font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {primaryMetric(c, sortBy)}
                  </div>

                  {/* Key stats */}
                  <div
                    className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs"
                    style={{ color: 'var(--color-sub)' }}
                  >
                    <span>{c.l7 ?? '?'} tok/s (7B)</span>
                    <span>SC {fmt(c.g6s ?? 0)}</span>
                    <span>MC {fmt(c.g6m ?? 0)}</span>
                    <span>{c.ram ?? '?'} GB / {c.bw ?? '?'} GB/s</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-base font-bold"
                      style={{ color: 'var(--color-green)' }}
                    >
                      ${fmt(street)}
                    </span>
                    {c.st && c.st < c.msrp && (
                      <span
                        className="text-xs line-through"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        ${fmt(c.msrp)}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    <Pill label={c.gen} active={false} color={genColor} onClick={() => {}} />
                    {c.tier && (
                      <Pill label={c.tier} active={false} color="var(--color-surface)" onClick={() => {}} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
