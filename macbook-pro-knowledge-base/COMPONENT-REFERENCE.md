# Component Reference

> API documentation for every reusable component in the dashboard.

## Pill

Toggleable filter button with active state indication.

```jsx
<Pill label="M5" active={true} color="#3B82F6" onClick={handler} small={false} />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | required | Button text |
| `active` | boolean | false | Whether the pill is toggled on |
| `color` | string | required | Active state color (hex) |
| `onClick` | function | required | Toggle handler |
| `small` | boolean | false | Compact size for nav bar |

## StatCard

Hero statistic display with label, value, and subtitle.

```jsx
<StatCard label="Fastest LLM" value="98 tok/s" sub="M5 Max 40G" color="#3B82F6" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | required | Metric name (uppercase) |
| `value` | string | required | Primary displayed value |
| `sub` | string | null | Subtitle/context |
| `color` | string | T.muted | Label accent color |

## DeltaBar

Animated dual-bar comparison showing two values with percentage delta.

```jsx
<DeltaBar
  label="GB6 Single-Core"
  a={4289}
  b={3851}
  unit=" pts"
  higherBetter={true}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | required | Metric name |
| `a` | number | required | First chip's value |
| `b` | number | required | Second chip's value |
| `unit` | string | "" | Unit suffix (e.g., " GB/s") |
| `higherBetter` | boolean | true | If false, lower value wins (price) |

Rendering behavior:
- Bars animate width from 0 to proportional width on mount
- Delta percentage shown in green (winner) or red (loser)
- Top bar = chip A, bottom bar = chip B
- Winner bar uses `T.green`, loser uses `T.red`

## ChipSelect

Dropdown selector with chips grouped by generation.

```jsx
<ChipSelect
  value="m5pro-18-20-24"
  onChange={setSelectedId}
  exclude={["m4pro-14-20-24"]}  // Hide already-selected chips
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | string | "" | Currently selected chip ID |
| `onChange` | function | required | Handler receiving new chip ID |
| `exclude` | string[] | [] | Chip IDs to hide from options |

## CustomTooltip (TT)

Recharts-compatible tooltip for scatter/bar charts.

```jsx
<RTooltip content={<TT />} />
```

Automatically renders chip name, RAM, and all payload values with colored dots. Used by passing as `content` prop to Recharts `<Tooltip>`.

## Spark (Mini Sparkline)

Inline SVG sparkline for table cells.

```jsx
<Spark values={[2650, 3100, 3850, 4289]} color="#3B82F6" w={60} h={20} />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `values` | number[] | required | Data points (min 2) |
| `color` | string | required | Stroke color |
| `w` | number | 60 | SVG width |
| `h` | number | 20 | SVG height |

## Theme Tokens

```javascript
// Generation colors
const G = { M2: "#F59E0B", M3: "#06B6D4", M4: "#A78BFA", M5: "#3B82F6" };

// Tier colors
const TR = { Base: "#94A3B8", Pro: "#2DD4BF", Max: "#FB923C" };

// Core theme
const T = {
  bg: "#08080D",       // Page background
  card: "#111118",     // Card background
  card2: "#16161F",    // Hover/alternate card
  border: "#1E1E2A",   // Primary borders
  border2: "#2A2A3A",  // Secondary borders
  text: "#EAEAF0",     // Primary text
  sub: "#8888A0",      // Secondary text
  muted: "#555570",    // Muted text
  accent: "#3B82F6",   // Interactive accent
  green: "#34D399",    // Positive/winner
  red: "#F87171",      // Negative/loser
  amber: "#FBBF24",    // Warning/neutral
  surface: "#0E0E15",  // Recessed surface
};
```

## Utility Functions

```javascript
// Format number with commas
const fmt = (n) => n == null ? "—" : n.toLocaleString();

// Format as USD
const fD = (n) => n == null ? "—" : `$${n.toLocaleString()}`;

// Get display label for a chip
const label = (c) => `${c.chip} ${c.ram}GB`;

// Calculate percentage difference
const pct = (a, b) => b ? Math.round(((a - b) / b) * 100) : 0;
```

## Recharts Patterns

### Bar Chart with Generation Colors
```jsx
<Bar dataKey="value" radius={[6, 6, 0, 0]}>
  {data.map((d, i) => <Cell key={i} fill={G[d.gen]} />)}
</Bar>
```

### Scatter Chart with Bubble Size
```jsx
<ZAxis type="number" dataKey="ram" range={[40, 300]} />
<Scatter data={filtered} fill={G[gen]} fillOpacity={0.85} />
```

### Radar Chart Overlay
```jsx
<Radar name="Chip A" dataKey="a" stroke={colorA} fill={colorA} fillOpacity={0.15} strokeWidth={2} />
<Radar name="Chip B" dataKey="b" stroke={colorB} fill={colorB} fillOpacity={0.15} strokeWidth={2} />
```
