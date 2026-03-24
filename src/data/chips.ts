export interface ChipConfig {
  [key: string]: unknown;
  id: string;
  gen: 'M2' | 'M3' | 'M4' | 'M5';
  tier: 'Base' | 'Pro' | 'Max';
  chip: string;
  cpu: number;
  gpu: number;
  ram: number;
  bw: number;
  g6s: number;
  g6m: number;
  g6g: number;
  l7: number | null;
  l14: number | null;
  tops: number;
  msrp: number;
  st: number;
  bat: number;
  ssd: number;
  tb: string;
  wifi: string;
  cam: string;
  nit: number;
  yr: number;
  process: string;
  depreciation: number;
}

export const CHIPS: ChipConfig[] = [
  { id: 'm2pro-10-16-16', gen: 'M2', tier: 'Pro', chip: 'M2 Pro 10C', cpu: 10, gpu: 16, ram: 16, bw: 200, g6s: 2650, g6m: 12347, g6g: 74900, l7: 38, l14: 13.5, tops: 15.8, msrp: 1999, st: 750, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 62 },
  { id: 'm2pro-10-16-32', gen: 'M2', tier: 'Pro', chip: 'M2 Pro 10C', cpu: 10, gpu: 16, ram: 32, bw: 200, g6s: 2650, g6m: 12347, g6g: 74900, l7: 38, l14: 13.5, tops: 15.8, msrp: 2199, st: 950, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 57 },
  { id: 'm2pro-12-19-16', gen: 'M2', tier: 'Pro', chip: 'M2 Pro 12C', cpu: 12, gpu: 19, ram: 16, bw: 200, g6s: 2656, g6m: 14447, g6g: 83210, l7: 39, l14: 13.5, tops: 15.8, msrp: 2499, st: 1050, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 58 },
  { id: 'm2max-30-32', gen: 'M2', tier: 'Max', chip: 'M2 Max 30G', cpu: 12, gpu: 30, ram: 32, bw: 400, g6s: 2720, g6m: 14600, g6g: 110000, l7: 61, l14: 24, tops: 15.8, msrp: 3099, st: 1500, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 52 },
  { id: 'm2max-38-32', gen: 'M2', tier: 'Max', chip: 'M2 Max 38G', cpu: 12, gpu: 38, ram: 32, bw: 400, g6s: 2740, g6m: 14700, g6g: 134000, l7: 66, l14: 25, tops: 15.8, msrp: 3299, st: 1600, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 52 },
  { id: 'm2max-38-64', gen: 'M2', tier: 'Max', chip: 'M2 Max 38G', cpu: 12, gpu: 38, ram: 64, bw: 400, g6s: 2740, g6m: 14700, g6g: 134000, l7: 66, l14: 25, tops: 15.8, msrp: 3699, st: 1900, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 500, yr: 2023, process: '5nm N5P', depreciation: 49 },
  { id: 'm3-8-10-8', gen: 'M3', tier: 'Base', chip: 'M3', cpu: 8, gpu: 10, ram: 8, bw: 100, g6s: 3076, g6m: 12000, g6g: 46370, l7: 21, l14: null, tops: 18, msrp: 1599, st: 750, bat: 22, ssd: 5200, tb: 'TB3', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 53 },
  { id: 'm3-8-10-16', gen: 'M3', tier: 'Base', chip: 'M3', cpu: 8, gpu: 10, ram: 16, bw: 100, g6s: 3076, g6m: 12000, g6g: 46370, l7: 21, l14: null, tops: 18, msrp: 1799, st: 900, bat: 22, ssd: 5200, tb: 'TB3', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 50 },
  { id: 'm3-8-10-24', gen: 'M3', tier: 'Base', chip: 'M3', cpu: 8, gpu: 10, ram: 24, bw: 100, g6s: 3076, g6m: 12000, g6g: 46370, l7: 21, l14: 9, tops: 18, msrp: 1999, st: 1100, bat: 22, ssd: 5200, tb: 'TB3', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 45 },
  { id: 'm3pro-11-14-18', gen: 'M3', tier: 'Pro', chip: 'M3 Pro 11C', cpu: 11, gpu: 14, ram: 18, bw: 150, g6s: 3089, g6m: 14029, g6g: 74425, l7: 31, l14: 10, tops: 18, msrp: 1999, st: 1050, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 47 },
  { id: 'm3pro-12-18-18', gen: 'M3', tier: 'Pro', chip: 'M3 Pro 12C', cpu: 12, gpu: 18, ram: 18, bw: 150, g6s: 3100, g6m: 14600, g6g: 74425, l7: 31, l14: 10, tops: 18, msrp: 2399, st: 1400, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 42 },
  { id: 'm3pro-12-18-36', gen: 'M3', tier: 'Pro', chip: 'M3 Pro 12C', cpu: 12, gpu: 18, ram: 36, bw: 150, g6s: 3100, g6m: 14600, g6g: 74425, l7: 31, l14: 10, tops: 18, msrp: 2599, st: 1600, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 38 },
  { id: 'm3max-14-30-36', gen: 'M3', tier: 'Max', chip: 'M3 Max 30G', cpu: 14, gpu: 30, ram: 36, bw: 300, g6s: 3107, g6m: 18935, g6g: 110000, l7: 57, l14: 20, tops: 18, msrp: 3199, st: 2200, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 31 },
  { id: 'm3max-16-40-48', gen: 'M3', tier: 'Max', chip: 'M3 Max 40G', cpu: 16, gpu: 40, ram: 48, bw: 400, g6s: 3102, g6m: 21100, g6g: 143827, l7: 66, l14: 25, tops: 18, msrp: 3599, st: 2600, bat: 18, ssd: 5200, tb: 'TB4', wifi: '6E', cam: '1080p', nit: 600, yr: 2023, process: '3nm N3B', depreciation: 28 },
  { id: 'm4-10-10-16', gen: 'M4', tier: 'Base', chip: 'M4', cpu: 10, gpu: 10, ram: 16, bw: 120, g6s: 3754, g6m: 14900, g6g: 58000, l7: 24, l14: null, tops: 38, msrp: 1599, st: 1300, bat: 24, ssd: 5100, tb: 'TB4', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 19 },
  { id: 'm4-10-10-24', gen: 'M4', tier: 'Base', chip: 'M4', cpu: 10, gpu: 10, ram: 24, bw: 120, g6s: 3754, g6m: 14900, g6g: 58000, l7: 24, l14: 10, tops: 38, msrp: 1799, st: 1500, bat: 24, ssd: 5100, tb: 'TB4', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 17 },
  { id: 'm4pro-12-16-24', gen: 'M4', tier: 'Pro', chip: 'M4 Pro 12C', cpu: 12, gpu: 16, ram: 24, bw: 273, g6s: 3853, g6m: 19950, g6g: 97000, l7: 50, l14: 17, tops: 38, msrp: 1999, st: 1799, bat: 22, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 10 },
  { id: 'm4pro-14-20-24', gen: 'M4', tier: 'Pro', chip: 'M4 Pro 14C', cpu: 14, gpu: 20, ram: 24, bw: 273, g6s: 3851, g6m: 22500, g6g: 120000, l7: 51, l14: 18, tops: 38, msrp: 2399, st: 2149, bat: 22, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 10 },
  { id: 'm4pro-14-20-48', gen: 'M4', tier: 'Pro', chip: 'M4 Pro 14C', cpu: 14, gpu: 20, ram: 48, bw: 273, g6s: 3851, g6m: 22500, g6g: 120000, l7: 51, l14: 18, tops: 38, msrp: 2799, st: 2500, bat: 22, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 11 },
  { id: 'm4max-14-32-36', gen: 'M4', tier: 'Max', chip: 'M4 Max 32G', cpu: 14, gpu: 32, ram: 36, bw: 410, g6s: 3867, g6m: 23150, g6g: 150000, l7: 70, l14: 24, tops: 38, msrp: 3199, st: 2999, bat: 18, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 6 },
  { id: 'm4max-16-40-48', gen: 'M4', tier: 'Max', chip: 'M4 Max 40G', cpu: 16, gpu: 40, ram: 48, bw: 546, g6s: 3884, g6m: 25649, g6g: 186690, l7: 83, l14: 29, tops: 38, msrp: 3499, st: 3200, bat: 18, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 9 },
  { id: 'm4max-16-40-64', gen: 'M4', tier: 'Max', chip: 'M4 Max 40G', cpu: 16, gpu: 40, ram: 64, bw: 546, g6s: 3884, g6m: 25649, g6g: 186690, l7: 83, l14: 29, tops: 38, msrp: 4399, st: 4000, bat: 18, ssd: 5100, tb: 'TB5', wifi: '6E', cam: '12MP', nit: 1000, yr: 2024, process: '3nm N3E', depreciation: 9 },
  { id: 'm5-10-10-16', gen: 'M5', tier: 'Base', chip: 'M5', cpu: 10, gpu: 10, ram: 16, bw: 153, g6s: 4226, g6m: 17453, g6g: 74000, l7: 30, l14: null, tops: 38, msrp: 1699, st: 1549, bat: 24, ssd: 6725, tb: 'TB4', wifi: '6E', cam: '12MP', nit: 1000, yr: 2025, process: '3nm N3P', depreciation: 9 },
  { id: 'm5-10-10-24', gen: 'M5', tier: 'Base', chip: 'M5', cpu: 10, gpu: 10, ram: 24, bw: 153, g6s: 4226, g6m: 17453, g6g: 74000, l7: 30, l14: 12, tops: 38, msrp: 1899, st: 1799, bat: 24, ssd: 6725, tb: 'TB4', wifi: '6E', cam: '12MP', nit: 1000, yr: 2025, process: '3nm N3P', depreciation: 5 },
  { id: 'm5pro-15-16-24', gen: 'M5', tier: 'Pro', chip: 'M5 Pro 15C', cpu: 15, gpu: 16, ram: 24, bw: 307, g6s: 4289, g6m: 26000, g6g: 140000, l7: 57, l14: 22, tops: 38, msrp: 2199, st: 2149, bat: 22, ssd: 14500, tb: 'TB5', wifi: '7', cam: '12MP', nit: 1000, yr: 2026, process: '3nm N3P', depreciation: 2 },
  { id: 'm5pro-18-20-24', gen: 'M5', tier: 'Pro', chip: 'M5 Pro 18C', cpu: 18, gpu: 20, ram: 24, bw: 307, g6s: 4289, g6m: 28534, g6g: 160000, l7: 57, l14: 22, tops: 38, msrp: 2799, st: 2749, bat: 22, ssd: 14500, tb: 'TB5', wifi: '7', cam: '12MP', nit: 1000, yr: 2026, process: '3nm N3P', depreciation: 2 },
  { id: 'm5pro-18-20-64', gen: 'M5', tier: 'Pro', chip: 'M5 Pro 18C', cpu: 18, gpu: 20, ram: 64, bw: 307, g6s: 4289, g6m: 28534, g6g: 160000, l7: 57, l14: 22, tops: 38, msrp: 3399, st: 3349, bat: 22, ssd: 14500, tb: 'TB5', wifi: '7', cam: '12MP', nit: 1000, yr: 2026, process: '3nm N3P', depreciation: 1 },
  { id: 'm5max-18-32-36', gen: 'M5', tier: 'Max', chip: 'M5 Max 32G', cpu: 18, gpu: 32, ram: 36, bw: 460, g6s: 4300, g6m: 29000, g6g: 200000, l7: 79, l14: 30, tops: 38, msrp: 3599, st: 3549, bat: 20, ssd: 14500, tb: 'TB5', wifi: '7', cam: '12MP', nit: 1000, yr: 2026, process: '3nm N3P', depreciation: 1 },
  { id: 'm5max-18-40-48', gen: 'M5', tier: 'Max', chip: 'M5 Max 40G', cpu: 18, gpu: 40, ram: 48, bw: 614, g6s: 4300, g6m: 29400, g6g: 225000, l7: 98, l14: 36, tops: 38, msrp: 4099, st: 4049, bat: 20, ssd: 14500, tb: 'TB5', wifi: '7', cam: '12MP', nit: 1000, yr: 2026, process: '3nm N3P', depreciation: 1 },
];
