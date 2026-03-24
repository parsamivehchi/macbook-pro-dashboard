# Benchmark Data

> Geekbench 6, Cinebench 2024, and Metal GPU scores for every 14-inch MacBook Pro chip.
> Scores are averages from browser.geekbench.com with sample sizes noted.

## Geekbench 6 CPU Scores

| Chip | Single-Core | Multi-Core | Sample Size | Notes |
|---|---|---|---|---|
| M2 Pro 10C | 2,650 | 12,347 | ~9,400 | Large, reliable sample |
| M2 Pro 12C | 2,656 | 14,447 | ~3,400 | Reliable |
| M2 Max 30G | ~2,720 | ~14,600 | Limited 14" | Mostly 16" data |
| M2 Max 38G | ~2,740 | ~14,700 | Limited 14" | Mostly 16" data |
| M3 | 3,076 | ~12,000 | Large | Base chip, fewer cores |
| M3 Pro 11C | 3,089 | 14,029 | Large | Entry Pro tier |
| M3 Pro 12C | 3,100 | ~14,600 | Large | Full-fat Pro |
| M3 Max 14C/30G | 3,107 | 18,935 | Large | |
| M3 Max 16C/40G | 3,102 | ~21,100 | Large | |
| M4 | 3,754 | ~14,900 | Large | Base chip |
| M4 Pro 12C | 3,853 | 19,950 | Large | Entry Pro |
| M4 Pro 14C | 3,851 | 22,500 | Large | Full-fat Pro |
| M4 Max 14C/32G | 3,867 | 23,150 | Large | |
| M4 Max 16C/40G | 3,884 | 25,649 | Large | |
| M5 | 4,226 | 17,453 | ~5,500 | |
| M5 Pro 15C | ~4,289 | ~26,000 | Early | Shipping Mar 11, 2026 |
| M5 Pro 18C | 4,289 | 28,534 | Early | |
| M5 Max 18C/32G | ~4,300 | ~29,000 | Early | |
| M5 Max 18C/40G | ~4,300 | ~29,400 | Early | Record for Apple Silicon |

### Generational Single-Core Progression

```
M2 Pro:  ████████████████████████████░░░░░░░░░░░░░░  2,650  (baseline)
M3 Pro:  ██████████████████████████████████░░░░░░░░░  3,100  (+17%)
M4 Pro:  ██████████████████████████████████████████░  3,853  (+24%)
M5 Pro:  ████████████████████████████████████████████  4,289  (+11%)
                                              Total: +62% over 3 years
```

## Geekbench 6 Metal GPU Scores

| Chip | Metal Score | GPU Cores | Score per Core |
|---|---|---|---|
| M3 Base (10G) | ~46,370 | 10 | 4,637 |
| M4 Base (10G) | ~58,000 | 10 | 5,800 |
| M5 Base (10G) | ~74,000 | 10 | 7,400 |
| M2 Pro (16G) | ~74,900 | 16 | 4,681 |
| M3 Pro (14/18G) | ~74,425 | 14-18 | ~4,400 |
| M2 Pro (19G) | ~83,210 | 19 | 4,380 |
| M4 Pro (16G) | ~97,000 | 16 | 6,063 |
| M2 Max (30G) | ~110,000 | 30 | 3,667 |
| M3 Max (30G) | ~110,000 | 30 | 3,667 |
| M4 Pro (20G) | ~120,000 | 20 | 6,000 |
| M2 Max (38G) | ~134,000 | 38 | 3,526 |
| M5 Pro (16G) | ~140,000 | 16 | 8,750 |
| M3 Max (40G) | ~143,827 | 40 | 3,596 |
| M4 Max (32G) | ~150,000 | 32 | 4,688 |
| M5 Pro (20G) | ~160,000 | 20 | 8,000 |
| M4 Max (40G) | 186,690 | 40 | 4,667 |
| M5 Max (32G) | ~200,000 | 32 | 6,250 |
| M5 Max (40G) | ~225,000 | 40 | 5,625 |

Key insight: GPU efficiency per core has roughly doubled from M2 to M5. The M5 Pro's 16 GPU cores now outperform the M3 Max's 40 cores.

## Cinebench 2024 Scores

| Chip | CB2024 Single | CB2024 Multi | CB2024 GPU |
|---|---|---|---|
| M2 Pro 10C | ~121 | ~801 | — |
| M3 Pro 12C | ~138 | ~830 | — |
| M3 Max 16C | ~142 | ~1,600 | — |
| M4 Pro 14C | ~177 | ~1,735 | — |
| M4 Max 16C | ~180 | ~1,930 | — |
| M5 Max 18C | — | CB2026: 9,426 | — |

Note: M5 Max results use the newer Cinebench 2026 version, which has a different scoring scale and is not directly comparable to CB2024 numbers.

## Interpreting Benchmark Scores

**Single-core** (GB6 SC, CB24 SC): Measures how fast a single thread runs. Critical for IDE responsiveness, compilation (often single-thread bottlenecked), terminal responsiveness, web browsing JavaScript execution.

**Multi-core** (GB6 MC, CB24 MC): Measures total parallel throughput. Critical for Xcode builds (large projects), Docker containers, parallel compilation (Rust, C++), video encoding.

**Metal GPU**: Measures GPU compute via Apple's Metal API. Critical for ML training, GPU rendering (Blender, DaVinci Resolve), Metal shader performance (affects Ghostty custom shaders marginally).

**For LLM inference**: None of these benchmarks directly measure LLM performance. Memory bandwidth is the primary determinant. See `LLM-PERFORMANCE.md`.

<details>
<summary><strong>Raw JSON Benchmark Data (click to expand)</strong></summary>

```json
[
  {"chip":"M2 Pro 10C","g6s":2650,"g6m":12347,"g6g":74900,"cb24s":121,"cb24m":801},
  {"chip":"M2 Pro 12C","g6s":2656,"g6m":14447,"g6g":83210,"cb24s":null,"cb24m":null},
  {"chip":"M2 Max 30G","g6s":2720,"g6m":14600,"g6g":110000,"cb24s":null,"cb24m":null},
  {"chip":"M2 Max 38G","g6s":2740,"g6m":14700,"g6g":134000,"cb24s":null,"cb24m":null},
  {"chip":"M3","g6s":3076,"g6m":12000,"g6g":46370,"cb24s":null,"cb24m":null},
  {"chip":"M3 Pro 11C","g6s":3089,"g6m":14029,"g6g":74425,"cb24s":null,"cb24m":null},
  {"chip":"M3 Pro 12C","g6s":3100,"g6m":14600,"g6g":74425,"cb24s":138,"cb24m":830},
  {"chip":"M3 Max 14C","g6s":3107,"g6m":18935,"g6g":110000,"cb24s":null,"cb24m":null},
  {"chip":"M3 Max 16C","g6s":3102,"g6m":21100,"g6g":143827,"cb24s":142,"cb24m":1600},
  {"chip":"M4","g6s":3754,"g6m":14900,"g6g":58000,"cb24s":null,"cb24m":null},
  {"chip":"M4 Pro 12C","g6s":3853,"g6m":19950,"g6g":97000,"cb24s":null,"cb24m":null},
  {"chip":"M4 Pro 14C","g6s":3851,"g6m":22500,"g6g":120000,"cb24s":177,"cb24m":1735},
  {"chip":"M4 Max 14C","g6s":3867,"g6m":23150,"g6g":150000,"cb24s":null,"cb24m":null},
  {"chip":"M4 Max 16C","g6s":3884,"g6m":25649,"g6g":186690,"cb24s":180,"cb24m":1930},
  {"chip":"M5","g6s":4226,"g6m":17453,"g6g":74000,"cb24s":null,"cb24m":null},
  {"chip":"M5 Pro 15C","g6s":4289,"g6m":26000,"g6g":140000,"cb24s":null,"cb24m":null},
  {"chip":"M5 Pro 18C","g6s":4289,"g6m":28534,"g6g":160000,"cb24s":null,"cb24m":null},
  {"chip":"M5 Max 32G","g6s":4300,"g6m":29000,"g6g":200000,"cb24s":null,"cb24m":null},
  {"chip":"M5 Max 40G","g6s":4300,"g6m":29400,"g6g":225000,"cb24s":null,"cb24m":null}
]
```

</details>
