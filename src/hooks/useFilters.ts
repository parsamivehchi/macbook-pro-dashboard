import { createContext, useContext } from 'react';
import type { ChipConfig } from '../data/chips';

export interface FilterState {
  genFilter: Set<string>;
  tierFilter: Set<string>;
  toggleGen: (g: string) => void;
  toggleTier: (t: string) => void;
  filtered: ChipConfig[];
}

export const FilterContext = createContext<FilterState>(null!);
export const useFilters = () => useContext(FilterContext);
