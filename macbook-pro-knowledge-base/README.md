# MacBook Pro 14" Knowledge Base

> Every 14-inch MacBook Pro configuration from M2 Pro (Jan 2023) through M5 Max (March 2026).
> 29 configurations, 4 generations, full benchmarks, LLM performance data, pricing, and an interactive React dashboard.

## Quick Stats

| Metric | Value |
|---|---|
| Total configurations covered | 29 |
| Generations | M2, M3, M4, M5 |
| Chip tiers | Base, Pro, Max |
| RAM range | 8 GB to 128 GB |
| Price range (street) | $593 to $7,249 |
| Fastest LLM (7B Q4) | 98 tok/s (M5 Max 40G) |
| Max memory bandwidth | 614 GB/s (M5 Max 40G) |
| Peak GB6 multi-core | 29,400 (M5 Max) |

## Repository Structure

```
macbook-pro-knowledge-base/
├── README.md                          ← You are here
│
├── data/                              ← Raw specs, benchmarks, prices
│   ├── CHIPS.md                       ← Complete chip database (all 29 configs)
│   ├── BENCHMARKS.md                  ← Geekbench 6, Cinebench, Metal scores
│   ├── LLM-PERFORMANCE.md            ← Token speeds, model fit, bandwidth analysis
│   └── PRICING.md                     ← MSRP, street, refurb, depreciation
│
├── analysis/                          ← Insights and recommendations
│   ├── BUYING-GUIDE.md                ← Use case recs, decision trees
│   ├── FEATURES-EVOLUTION.md          ← TB, WiFi, camera, SSD, display across gens
│   └── VALUE-ANALYSIS.md              ← Perf/dollar, TCO, cost-per-year
│
├── builder/                           ← Dashboard code architecture
│   ├── DASHBOARD-ARCHITECTURE.md      ← React component tree, data model
│   ├── COMPONENT-REFERENCE.md         ← Reusable component API docs
│   └── DATA-SOURCES.md                ← Every URL, methodology, freshness
│
└── personal/                          ← Personalized to Parsa's workflow
    ├── DECISION-MATRIX.md             ← Personal weighted scoring
    └── WORKFLOW-NOTES.md              ← Ghostty + Claude Code + AECOM notes
```

## How to Use This Knowledge Base

**If you want raw data:** Start with `data/CHIPS.md` for the master spec table, then `data/BENCHMARKS.md` for performance numbers.

**If you want to make a buying decision:** Go straight to `analysis/BUYING-GUIDE.md` for use-case-based recommendations, or `personal/DECISION-MATRIX.md` for a scoring framework tailored to your workflow.

**If you want to extend the dashboard:** Read `builder/DASHBOARD-ARCHITECTURE.md` for the component tree and data model, then `builder/COMPONENT-REFERENCE.md` for reusable component APIs.

**If you want to verify data:** Check `builder/DATA-SOURCES.md` for every source URL, methodology note, and data freshness status.

## Key Findings

1. **Memory bandwidth determines LLM speed.** The relationship is near-linear. An M2 Max (400 GB/s, $1,500 used) generates tokens faster than an M4 Pro (273 GB/s, $1,799 new).

2. **Depreciation creates massive value opportunities.** M2 Pro models have lost 55-70% of MSRP. M3 Pro models on Back Market start at $1,033.

3. **Single-core CPU improved ~60% in 3 years.** From M2 Pro (~2,650) to M5 Max (~4,300) in Geekbench 6 single-core.

4. **The M5 Pro/Max (March 2026) is a generational leap.** First multi-die "Fusion Architecture," TB5, WiFi 7, 14.5 GB/s SSD, up to 614 GB/s bandwidth.

5. **For Ghostty + Claude Code workflows, single-core speed and SSD matter most.** Terminal rendering is trivial for any of these GPUs.

## Data Freshness

All data current as of **March 23, 2026**. Street prices fluctuate daily. Benchmark scores are averages from Geekbench Browser with large sample sizes (1,000+ submissions per chip). M5 Pro/Max scores are early results (shipping began March 11, 2026) and may shift slightly as more results come in.

## License

Personal knowledge base. Data compiled from public sources cited in `builder/DATA-SOURCES.md`.
