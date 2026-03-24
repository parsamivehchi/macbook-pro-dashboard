import type { ChipConfig } from '../data/chips';

export const fmt = (n: number | null | undefined): string =>
  n == null ? '—' : n.toLocaleString();

export const fD = (n: number | null | undefined): string =>
  n == null ? '—' : `$${n.toLocaleString()}`;

export const label = (c: ChipConfig): string =>
  `${c.chip} ${c.ram}GB`;

export const pct = (a: number, b: number): number =>
  b ? Math.round(((a - b) / b) * 100) : 0;

export const GEN_COLORS: Record<string, string> = {
  M2: '#F59E0B',
  M3: '#06B6D4',
  M4: '#A78BFA',
  M5: '#3B82F6',
};

export const TIER_COLORS: Record<string, string> = {
  Base: '#94A3B8',
  Pro: '#2DD4BF',
  Max: '#FB923C',
};

export const GENS = ['M2', 'M3', 'M4', 'M5'] as const;
export const TIERS = ['Base', 'Pro', 'Max'] as const;
