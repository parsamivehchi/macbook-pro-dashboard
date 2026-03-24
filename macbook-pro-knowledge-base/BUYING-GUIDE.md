# Buying Guide

> Use-case-based recommendations and decision trees for picking the right 14-inch MacBook Pro.

## Decision Tree: Start Here

```
What is your PRIMARY use case?
│
├─── Daily coding (IDE, terminal, browser, Docker)
│    ├─── Budget under $1,800? → M4 Pro 12C/24GB ($1,799)
│    ├─── Want latest features? → M5 Pro 15C/24GB ($2,149)
│    └─── Need lots of RAM for containers? → M4 Pro 14C/48GB ($2,500)
│
├─── Local LLM inference (primary workflow)
│    ├─── Budget under $1,800? → M2 Max 38G/32GB ($1,600 used)
│    ├─── Want 14B+ models fast? → M4 Max 40G/48GB ($3,200)
│    ├─── Want the absolute best? → M5 Max 40G/48GB ($4,049)
│    └─── Need 70B models? → M5 Max 40G/128GB or M5 Pro 18C/64GB
│
├─── GPU-heavy work (ML training, rendering, Blender)
│    ├─── Budget-conscious? → M3 Max 16C/40G/48GB ($2,600 used)
│    ├─── Current gen? → M4 Max 16C/40G/48GB ($3,200)
│    └─── Latest and greatest? → M5 Max 18C/40G/48GB ($4,049)
│
├─── Maximum battery life & portability
│    ├─── Budget pick → M5 Base/24GB ($1,799) — 24 hours
│    ├─── With more power → M5 Pro 15C/24GB ($2,149) — 22 hours
│    └─── Older but cheap → M3 Base/24GB ($1,100 used) — 22 hours
│
└─── Best all-rounder (good at everything)
     ├─── Budget pick → M4 Pro 14C/24GB ($2,149)
     ├─── Sweet spot → M5 Pro 18C/24GB ($2,749)
     └─── No compromises → M5 Max 32G/36GB ($3,549)
```

## Use Case Scoring Matrix

Each chip scored 1-10 across key use cases. Scores factor in relevant benchmarks, features, and price.

### Daily Coding & IDE

Key metrics: Single-core speed (compilation, IDE responsiveness), SSD speed (indexing, Docker), battery life.

| Rank | Config | Score | Why |
|---|---|---|---|
| 1 | M5 Pro 18C/24GB | 9.5 | Fastest single-core (4,289), TB5, WiFi 7, 14.5 GB/s SSD |
| 2 | M5 Pro 15C/24GB | 9.3 | Same single-core, slightly fewer cores for parallel builds |
| 3 | M5 Base/24GB | 9.0 | Single-core king (4,226), 24h battery, but TB4 and WiFi 6E |
| 4 | M4 Pro 14C/24GB | 8.5 | Strong single-core (3,851), TB5, good value at $2,149 |
| 5 | M4 Pro 12C/24GB | 8.3 | Best value at $1,799, TB5, still excellent single-core |

### Local LLM Inference

Key metrics: Memory bandwidth (GB/s), RAM capacity, token generation speed.

| Rank | Config | Score | Why |
|---|---|---|---|
| 1 | M5 Max 40G/48GB | 10 | 614 GB/s, 98 tok/s for 7B, 36 tok/s for 14B |
| 2 | M4 Max 40G/48GB | 9.0 | 546 GB/s, 83 tok/s, available $3,200 used |
| 3 | M5 Max 32G/36GB | 8.5 | 460 GB/s, 79 tok/s, good balance of price and perf |
| 4 | M4 Max 32G/36GB | 8.0 | 410 GB/s, 70 tok/s, $2,999 used |
| 5 | M2 Max 38G/32GB | 7.5 | 400 GB/s, 66 tok/s, incredible value at $1,600 |

### Battery Warrior

Key metrics: Battery hours, weight, fan noise, efficiency.

| Rank | Config | Score | Why |
|---|---|---|---|
| 1 | M5 Base/24GB | 10 | 24 hours, 3.4 lbs, nearly silent |
| 2 | M4 Base/24GB | 9.5 | 24 hours, 3.4 lbs, nearly silent |
| 3 | M3 Base/24GB | 9.0 | 22 hours, 3.4 lbs |
| 4 | M5 Pro 15C/24GB | 8.5 | 22 hours with significantly more power |
| 5 | M4 Pro 12C/24GB | 8.0 | 22 hours, good all-rounder |

### Budget Champion (Performance per dollar)

| Rank | Config | Street Price | LLM 7B tok/s | GB6 Multi | tok/s per $1K |
|---|---|---|---|---|---|
| 1 | M2 Max 38G/32GB | $1,600 | 66 | 14,700 | 41.3 |
| 2 | M2 Max 30G/32GB | $1,500 | 61 | 14,600 | 40.7 |
| 3 | M3 Max 16C/48GB | $2,600 | 66 | 21,100 | 25.4 |
| 4 | M2 Pro 10C/16GB | $750 | 38 | 12,347 | 50.7 |
| 5 | M3 Pro 11C/18GB | $1,050 | 31 | 14,029 | 29.5 |

## When to Buy New vs. Used

**Buy new (M5) if:**
- You value warranty and AppleCare eligibility
- TB5, WiFi 7, or 14.5 GB/s SSD matter to your workflow
- You plan to keep the machine 3+ years
- You want the latest Neural Engine capabilities

**Buy used (M2/M3) if:**
- Budget is the primary constraint
- You need maximum LLM bandwidth per dollar
- You're comfortable with third-party warranties
- The machine is a secondary or specialized device

**Buy clearance (M4) if:**
- You want a balance of recency and discount
- TB5 is important but you don't need M5's SSD speed
- Discounts of 10-20% make M4 Pro/Max compelling
- You want Apple Certified Refurbished with full warranty

## Upgrade Path Recommendations

If you currently have an M1 Pro/Max: The M5 Pro is a meaningful upgrade (70%+ single-core gain, TB5, WiFi 7). M4 Pro at clearance prices is also compelling.

If you have an M2 Pro: Wait for M5 Pro prices to settle or grab an M4 Pro at clearance. The jump isn't massive for daily coding unless you need LLM performance.

If you have an M2 Max: Hold. Your bandwidth (400 GB/s) still beats M4 Pro and M5 Pro for LLM work. Only M5 Max offers a meaningful bandwidth upgrade.

If you have an M3 Pro: The M5 Pro at $2,199 doubles your bandwidth (150 → 307 GB/s) and adds TB5/WiFi 7. Worth it if LLM work matters.
