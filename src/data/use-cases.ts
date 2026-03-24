import type { ChipConfig } from './chips';

export interface UseCase {
  id: string;
  name: string;
  icon: string;
  weights: Record<string, number>;
  invertPrice?: boolean;
}

export const USE_CASES: UseCase[] = [
  { id: 'coding', name: 'Daily Coding & IDE', icon: '\u2328\uFE0F', weights: { g6s: 3, g6m: 1, bat: 2, ssd: 2, l7: 0 } },
  { id: 'llm', name: 'Local LLM Inference', icon: '\uD83E\uDDE0', weights: { g6s: 0, g6m: 0, bat: 0, ssd: 0, l7: 5, bw: 3, ram: 2 } },
  { id: 'gpu', name: 'GPU Rendering / ML', icon: '\uD83C\uDFA8', weights: { g6s: 0, g6m: 1, bat: 0, ssd: 1, g6g: 5 } },
  { id: 'portable', name: 'Battery Warrior', icon: '\uD83D\uDD0B', weights: { g6s: 2, g6m: 0, bat: 5, ssd: 1, l7: 0 } },
  { id: 'allround', name: 'Best All-Rounder', icon: '\u26A1', weights: { g6s: 2, g6m: 2, bat: 1, ssd: 1, l7: 2, g6g: 1 } },
  { id: 'value', name: 'Budget Champion', icon: '\uD83D\uDCB0', weights: { g6s: 1, g6m: 1, bat: 1, ssd: 0, l7: 1 }, invertPrice: true },
  { id: 'remote', name: 'Remote Worker', icon: '\uD83C\uDF10', weights: { g6s: 2, g6m: 1, bat: 3, ssd: 1, l7: 1 } },
  { id: 'onsite', name: 'On-site Engineer', icon: '\uD83D\uDEE0\uFE0F', weights: { g6s: 3, g6m: 1, bat: 4, ssd: 2, l7: 0 } },
];

const MAXES: Record<string, number> = {
  g6s: 4300, g6m: 29400, bat: 24, ssd: 14500,
  l7: 98, bw: 614, ram: 128, g6g: 225000,
};

export function scoreUseCase(c: ChipConfig, uc: UseCase): number {
  const w = uc.weights;
  let s = 0, tw = 0;
  Object.entries(w).forEach(([k, v]) => {
    if (!v) return;
    tw += v;
    const val = (c as Record<string, unknown>)[k] as number || 0;
    const mx = MAXES[k] || 1;
    s += v * (val / mx);
  });
  if (uc.invertPrice) {
    s = tw > 0 ? (s / tw) * (1 - c.st / 7500) * 2 : 0;
  } else {
    s = tw > 0 ? s / tw : 0;
  }
  return Math.round(s * 100);
}
