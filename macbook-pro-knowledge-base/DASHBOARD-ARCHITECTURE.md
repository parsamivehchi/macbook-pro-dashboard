# Dashboard Architecture

> React component tree, data model, state management, and extension guide for the MacBook Pro comparison dashboard.

## Tech Stack

- **Framework:** React 18 (functional components, hooks)
- **Charts:** Recharts (BarChart, ScatterChart, RadarChart, LineChart)
- **Styling:** Inline styles with CSS variable tokens (no Tailwind in artifact mode)
- **Fonts:** Manrope (display/body) + IBM Plex Mono (data/numbers)
- **State:** useState + useMemo (no external state library needed)

## File Structure (if extracting to a local project)

```
src/
├── App.jsx                    # Main router + layout shell
├── data/
│   └── chips.js               # CHIPS array (29 configs)
├── theme/
│   └── tokens.js              # Color tokens, gen colors, tier colors
├── hooks/
│   ├── useFilters.js           # Gen/tier filter state
│   ├── useSorting.js           # Column sort logic
│   └── useScoring.js           # Use case scoring engine
├── pages/
│   ├── HeadToHead.jsx          # ⚔️ Radar + delta bars + verdict
│   ├── DataTable.jsx           # 📊 Sortable mega-table
│   ├── LLMCalculator.jsx       # 🧠 Model fit heatmap
│   ├── UseCaseRanker.jsx       # 🎯 Weighted rankings
│   ├── FeaturesMatrix.jsx      # 🔲 Heatmap grid
│   ├── CostAnalysis.jsx        # 💵 TCO charts
│   ├── PerfDensity.jsx         # 📈 Scatter plots
│   ├── ScatterBW.jsx           # 🔬 LLM x bandwidth
│   └── BudgetPicker.jsx        # 💰 Slider recommender
├── components/
│   ├── Pill.jsx                # Filter toggle button
│   ├── StatCard.jsx            # Hero stat display
│   ├── DeltaBar.jsx            # Animated comparison bars
│   ├── ChipSelect.jsx          # Dropdown selector
│   ├── InfoTooltip.jsx         # Hover info bubble
│   └── CustomTooltip.jsx       # Recharts tooltip wrapper
└── utils/
    ├── format.js               # fmt(), fmtD(), pct()
    └── scoring.js              # scoreUseCase() algorithm
```

## Data Model

### CHIPS Array (core data)

```typescript
interface ChipConfig {
  id: string;          // Unique key: "m5pro-18-20-24"
  gen: "M2"|"M3"|"M4"|"M5";
  tier: "Base"|"Pro"|"Max";
  chip: string;        // Display name: "M5 Pro 18C"
  cpu: number;         // Total CPU cores
  gpu: number;         // GPU cores
  ram: number;         // GB unified memory
  bw: number;          // Memory bandwidth GB/s
  g6s: number;         // Geekbench 6 single-core
  g6m: number;         // Geekbench 6 multi-core
  g6g: number;         // Geekbench 6 Metal GPU
  l7: number|null;     // LLM 7B Q4 tok/s (llama.cpp)
  l14: number|null;    // LLM 14B Q4 tok/s
  tops: number;        // Neural Engine TOPS
  msrp: number;        // Original MSRP USD
  st: number;          // Current street price USD
  bat: number;         // Battery hours (video playback)
  ssd: number;         // SSD read speed MB/s
  tb: string;          // "TB3"|"TB4"|"TB5"
  wifi: string;        // "6E"|"7"
  cam: string;         // "1080p"|"12MP"
  nit: number;         // SDR brightness nits
  yr: number;          // Launch year
}
```

### LLM_MODELS Array

```typescript
interface LLMModel {
  name: string;       // "Llama 3.1 8B"
  param: number;      // 8 (billion parameters)
  q4gb: number;       // 4.5 (Q4 quantization weight in GB)
  minRam: number;     // 12 (minimum RAM to load)
}
```

### USE_CASES Array

```typescript
interface UseCase {
  id: string;
  name: string;
  icon: string;
  weights: Record<string, number>;  // Metric key -> weight (0-5)
  invertPrice?: boolean;            // If true, lower price = higher score
}
```

## State Management

### Global Filter State
```jsx
const [genFilter, setGenFilter] = useState(new Set(["M2","M3","M4","M5"]));
const [tierFilter, setTierFilter] = useState(new Set(["Base","Pro","Max"]));
```

These filters apply globally across ALL pages. Every page's data is derived from `filtered`:

```jsx
const filtered = useMemo(() =>
  CHIPS.filter(c => genFilter.has(c.gen) && tierFilter.has(c.tier)),
[genFilter, tierFilter]);
```

### Page-Specific State
Each page manages its own local state (sort column, selected chips, budget slider, etc.) independently.

## Scoring Algorithm

The `scoreUseCase()` function normalizes each metric to 0-100 (value / max_possible) then applies weighted sum:

```javascript
function scoreUseCase(chip, useCase) {
  const maxes = {
    g6s: 4300, g6m: 29400, bat: 24, ssd: 14500,
    l7: 98, bw: 614, ram: 128, g6g: 225000
  };
  let score = 0, totalWeight = 0;
  
  Object.entries(useCase.weights).forEach(([key, weight]) => {
    if (!weight) return;
    totalWeight += weight;
    score += weight * ((chip[key] || 0) / maxes[key]);
  });
  
  if (useCase.invertPrice) {
    score = totalWeight > 0
      ? (score / totalWeight) * (1 - chip.st / 7500) * 2
      : 0;
  } else {
    score = totalWeight > 0 ? score / totalWeight : 0;
  }
  
  return Math.round(score * 100);
}
```

## How to Extend

### Adding a new chip config
Add an entry to the CHIPS array in `data/chips.js`. All pages will automatically pick it up.

### Adding a new page
1. Create a component in `pages/`
2. Add an entry to the `pages` array in `App.jsx`
3. Add the page's `case` in the content renderer

### Adding a new metric column
1. Add the field to the ChipConfig interface and all CHIPS entries
2. Add a column definition in DataTable's `columns` array
3. Add to the FeaturesMatrix `metrics` array
4. Update HeadToHead delta bars if relevant

### Adding a new use case
Add an entry to the USE_CASES array with appropriate weights. The scoring engine handles everything automatically.

### Migrating to a full project
1. `npx create-react-app macbook-dashboard` or `npm create vite@latest`
2. Install: `npm install recharts`
3. Split the single file into the structure above
4. Replace inline styles with Tailwind or CSS modules
5. Add react-router for proper page routing
6. Add persistent state with localStorage or URL params
