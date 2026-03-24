import type { ChipConfig } from '../data/chips';

export const fmt = (n: number | null | undefined): string =>
  n == null ? '—' : n.toLocaleString();

export const fD = (n: number | null | undefined): string =>
  n == null ? '—' : `$${n.toLocaleString()}`;

export const label = (c: ChipConfig): string =>
  `${c.chip} ${c.ram}GB`;

export const pct = (a: number, b: number): number =>
  b ? Math.round(((a - b) / b) * 100) : 0;

function getCSSVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Fallback hex values for SSR / initial render, overridden by CSS vars at runtime
const GEN_FALLBACKS = { M2: '#D97706', M3: '#0891B2', M4: '#7C3AED', M5: '#2563EB' };
const TIER_FALLBACKS = { Base: '#64748B', Pro: '#0D9488', Max: '#EA580C' };

export const getGenColor = (gen: string): string =>
  getCSSVar(`--color-gen-${gen.toLowerCase()}`) || GEN_FALLBACKS[gen as keyof typeof GEN_FALLBACKS] || '#888';

export const getTierColor = (tier: string): string =>
  getCSSVar(`--color-tier-${tier.toLowerCase()}`) || TIER_FALLBACKS[tier as keyof typeof TIER_FALLBACKS] || '#888';

// Static objects for backwards compat (used by components that don't re-render on theme change)
// These use the light-mode fallbacks; for dynamic colors, use getGenColor/getTierColor
export const GEN_COLORS: Record<string, string> = GEN_FALLBACKS;
export const TIER_COLORS: Record<string, string> = TIER_FALLBACKS;

export const GENS = ['M2', 'M3', 'M4', 'M5'] as const;
export const TIERS = ['Base', 'Pro', 'Max'] as const;
