# Value Analysis

> Performance per dollar, total cost of ownership, and value scoring across all configurations.

## Performance Per $1,000 Spent

### LLM tok/s per $1,000 (7B Q4, llama.cpp)

| Rank | Config | Street $ | 7B tok/s | tok/s per $1K |
|---|---|---|---|---|
| 1 | M2 Pro 10C/16GB | $750 | 38 | **50.7** |
| 2 | M2 Max 30G/32GB | $1,500 | 61 | **40.7** |
| 3 | M2 Max 38G/32GB | $1,600 | 66 | **41.3** |
| 4 | M2 Pro 12C/16GB | $1,050 | 39 | **37.1** |
| 5 | M2 Max 38G/64GB | $1,900 | 66 | **34.7** |
| 6 | M3 Pro 11C/18GB | $1,050 | 31 | **29.5** |
| 7 | M3 Max 14C/36GB | $2,200 | 57 | **25.9** |
| 8 | M4 Pro 12C/24GB | $1,799 | 50 | **27.8** |
| 9 | M4 Max 40G/48GB | $3,200 | 83 | **25.9** |
| 10 | M5 Pro 15C/24GB | $2,149 | 57 | **26.5** |

**Winner: M2 Pro 10C at $750 delivers 50.7 tok/s per $1,000 spent.** Followed closely by M2 Max models. The depreciation of M2 chips makes them extraordinary LLM value.

### Geekbench 6 Multi-Core per $1,000

| Rank | Config | Street $ | GB6 MC | Score per $1K |
|---|---|---|---|---|
| 1 | M2 Pro 10C/16GB | $750 | 12,347 | **16,463** |
| 2 | M2 Pro 12C/16GB | $1,050 | 14,447 | **13,759** |
| 3 | M3 Pro 11C/18GB | $1,050 | 14,029 | **13,361** |
| 4 | M3 Base/8GB | $750 | 12,000 | **16,000** |
| 5 | M2 Max 30G/32GB | $1,500 | 14,600 | **9,733** |
| 6 | M5 Pro 18C/24GB | $2,749 | 28,534 | **10,380** |
| 7 | M4 Pro 12C/24GB | $1,799 | 19,950 | **11,089** |

### GPU Metal Score per $1,000

| Rank | Config | Street $ | Metal | Score per $1K |
|---|---|---|---|---|
| 1 | M2 Max 38G/32GB | $1,600 | 134,000 | **83,750** |
| 2 | M2 Max 30G/32GB | $1,500 | 110,000 | **73,333** |
| 3 | M2 Pro 10C/16GB | $750 | 74,900 | **99,867** |
| 4 | M3 Max 16C/48GB | $2,600 | 143,827 | **55,318** |
| 5 | M5 Pro 15C/24GB | $2,149 | 140,000 | **65,145** |

## Composite Value Score

Formula: `((GB6_multi / 1000) + (LLM_7B_tokps * 2) + (TOPS / 2)) / (street_price / 1000)`

Higher = more total performance per dollar spent. Weights LLM speed 2x because it's the primary interest area.

| Rank | Config | Street $ | Value Score | Category |
|---|---|---|---|---|
| 1 | M2 Pro 10C/16GB | $750 | **127.5** | Extreme value |
| 2 | M2 Pro 12C/16GB | $1,050 | **94.2** | Extreme value |
| 3 | M2 Max 30G/32GB | $1,500 | **83.1** | Great value |
| 4 | M2 Max 38G/32GB | $1,600 | **82.4** | Great value |
| 5 | M3 Pro 11C/18GB | $1,050 | **71.8** | Great value |
| 6 | M3 Base/8GB | $750 | **69.3** | Great value |
| 7 | M2 Max 38G/64GB | $1,900 | **69.8** | Good value |
| 8 | M3 Pro 12C/18GB | $1,400 | **57.1** | Good value |
| 9 | M4 Pro 12C/24GB | $1,799 | **55.7** | Good value |
| 10 | M5 Base/24GB | $1,799 | **42.3** | Fair value |
| 11 | M5 Pro 15C/24GB | $2,149 | **43.8** | Fair value |
| 12 | M5 Max 40G/48GB | $4,049 | **31.2** | Premium |

## Total Cost of Ownership Projections

Assuming each generation depreciates ~50% in 3 years (based on M2 data), projected residual values:

| Config (bought today) | Purchase Price | Projected 3yr Value | 3yr Cost | Cost/Month |
|---|---|---|---|---|
| M2 Max 38G/32GB (used) | $1,600 | ~$500 | $1,100 | **$31/mo** |
| M3 Pro 11C/18GB (used) | $1,050 | ~$400 | $650 | **$18/mo** |
| M4 Pro 12C/24GB (clearance) | $1,799 | ~$900 | $899 | **$25/mo** |
| M5 Pro 15C/24GB (new) | $2,149 | ~$1,075 | $1,074 | **$30/mo** |
| M5 Max 40G/48GB (new) | $4,049 | ~$2,025 | $2,024 | **$56/mo** |

**Best TCO: M3 Pro 11C at ~$18/month over 3 years.** If it meets your performance needs, it's remarkably cheap to own.

## The "Just Right" Framework

For most developers, the optimal chip lives in a sweet spot where:
- Single-core is at least 3,500+ (M4 or M5 territory) for snappy IDE response
- Memory bandwidth is at least 250+ GB/s for reasonable LLM speeds
- RAM is at least 24GB for 14B models
- Price is under $2,500

Only 4 chips meet ALL these criteria:
1. **M4 Pro 12C/24GB** at $1,799 (273 GB/s, GB6 SC 3,853)
2. **M4 Pro 14C/24GB** at $2,149 (273 GB/s, GB6 SC 3,851)
3. **M5 Pro 15C/24GB** at $2,149 (307 GB/s, GB6 SC 4,289)
4. **M5 Pro 18C/24GB** at $2,749 (307 GB/s, GB6 SC 4,289)

Of these, the **M5 Pro 15C at $2,149** is the standout: highest single-core, most bandwidth, TB5, WiFi 7, 14.5 GB/s SSD, and only $350 more than the M4 Pro 12C.
