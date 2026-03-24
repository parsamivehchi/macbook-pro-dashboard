import { Pill } from '../shared/Pill';
import { useFilters } from '../../hooks/useFilters';
import { GENS, TIERS, GEN_COLORS, TIER_COLORS } from '../../utils/format';

export function FilterBar() {
  const { genFilter, tierFilter, toggleGen, toggleTier } = useFilters();

  return (
    <div
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: 'var(--color-bg)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: 'var(--color-muted)' }}>
          Filter
        </span>
        {GENS.map(g => (
          <Pill key={g} label={g} active={genFilter.has(g)} color={GEN_COLORS[g]} onClick={() => toggleGen(g)} small />
        ))}
        <span className="w-px h-5 mx-0.5" style={{ background: 'var(--color-border)' }} />
        {TIERS.map(t => (
          <Pill key={t} label={t} active={tierFilter.has(t)} color={TIER_COLORS[t]} onClick={() => toggleTier(t)} small />
        ))}
        <span className="flex-1" />
        <span className="text-[10px] font-mono" style={{ color: 'var(--color-muted)' }}>
          29 configs · M2–M5
        </span>
      </div>
    </div>
  );
}
