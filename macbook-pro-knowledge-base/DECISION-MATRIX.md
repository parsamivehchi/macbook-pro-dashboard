# Personal Decision Matrix

> Weighted scoring framework tailored to Parsa's specific workflow: water resources engineering at AECOM, local LLM work with Claude Code, Ghostty terminal, and personal projects.

## Your Workflow Profile

| Activity | Time Share | Key Metrics | Current Machine |
|---|---|---|---|
| IDE/code (VS Code, Python, TypeScript) | ~35% | Single-core, SSD, RAM | Mac (Apple Silicon) |
| Claude Code / local LLM experiments | ~20% | Memory bandwidth, RAM | Mac |
| Ghostty terminal (multiple sessions) | ~15% | Single-core, GPU (minimal) | Mac |
| HEC-RAS, PCSWMM, InfoWorks ICM | ~15% | Windows only (AECOM machine) | Windows at AECOM |
| Remote access via Parsec (iPad Pro M4) | ~10% | WiFi latency, display quality | iPad Pro M4 |
| Personal projects (dashboards, tools) | ~5% | Single-core, React dev server | Mac |

## Weighted Scoring: Parsa's Priorities

Based on your workflow, here's how each metric should be weighted:

| Metric | Weight (1-5) | Rationale |
|---|---|---|
| Single-core CPU (GB6 SC) | **5** | IDE snappiness, compilation, terminal responsiveness |
| Memory bandwidth (GB/s) | **4** | Local LLM tok/s, Claude Code experiments |
| RAM capacity | **3** | 14B+ models, Docker containers, browser tabs |
| SSD speed | **3** | Large Git repos, Docker images, project indexing |
| Battery life | **3** | On-site work in Sea-to-Sky, field visits |
| LLM 7B tok/s | **4** | Daily Claude Code and local model usage |
| WiFi quality | **2** | Parsec latency, on-site connectivity |
| Thunderbolt | **1** | Nice to have, not critical for your workflow |
| GPU cores | **1** | Ghostty doesn't need them, no GPU rendering |
| Price | **3** | Value-conscious, but willing to invest in tools |

## Your Personalized Rankings

Applying your weights to every configuration:

### Top 5 Overall (Your Workflow)

| Rank | Config | Score | Price | Key Strengths |
|---|---|---|---|---|
| 1 | **M5 Pro 18C/24GB** | 91 | $2,749 | Best single-core (4,289), 307 GB/s, TB5, WiFi 7, 14.5 GB/s SSD |
| 2 | **M5 Pro 15C/24GB** | 89 | $2,149 | Same SC, 307 GB/s, TB5, WiFi 7. Best value M5 Pro. |
| 3 | **M5 Max 32G/36GB** | 87 | $3,549 | 460 GB/s for LLM, 36GB fits 27B models, TB5, WiFi 7 |
| 4 | **M5 Base/24GB** | 82 | $1,799 | Excellent SC (4,226), 24h battery, but TB4/WiFi 6E |
| 5 | **M4 Pro 14C/24GB** | 80 | $2,149 | Strong SC (3,851), 273 GB/s, TB5, great clearance value |

### Best for LLM-Heavy Workflow

If you find yourself running local models daily (not just experimenting):

| Rank | Config | Price | BW | 7B tok/s | 14B tok/s | Verdict |
|---|---|---|---|---|---|---|
| 1 | M5 Max 40G/48GB | $4,049 | 614 | 98 | 36 | The ultimate. 48GB fits everything up to 32B. |
| 2 | M5 Max 32G/36GB | $3,549 | 460 | 79 | 30 | Great BW, 36GB enough for 27B models. |
| 3 | M2 Max 38G/64GB | $1,900 | 400 | 66 | 25 | 64GB! Runs 32B+ models. $1,900 is incredible. |
| 4 | M4 Max 40G/48GB | $3,200 | 546 | 83 | 29 | Clearance deal. 546 GB/s is excellent. |

### Best for Your Budget Sweet Spot ($1,800-2,500)

| Config | Price | GB6 SC | BW | 7B tok/s | WiFi | TB |
|---|---|---|---|---|---|---|
| **M5 Pro 15C/24GB** | $2,149 | 4,289 | 307 | 57 | 7 | TB5 |
| M4 Pro 14C/24GB | $2,149 | 3,851 | 273 | 51 | 6E | TB5 |
| M4 Pro 12C/24GB | $1,799 | 3,853 | 273 | 50 | 6E | TB5 |
| M5 Base/24GB | $1,799 | 4,226 | 153 | 30 | 6E | TB4 |
| M2 Max 38G/32GB | $1,600 | 2,740 | 400 | 66 | 6E | TB4 |

## The Key Trade-off: M5 Pro 15C vs M2 Max 38G

This is your real decision at the ~$2,000 price point:

| Metric | M5 Pro 15C ($2,149) | M2 Max 38G ($1,600) | Winner |
|---|---|---|---|
| Single-core CPU | 4,289 | 2,740 | **M5 Pro (+57%)** |
| Multi-core CPU | 26,000 | 14,700 | **M5 Pro (+77%)** |
| Memory bandwidth | 307 GB/s | 400 GB/s | **M2 Max (+30%)** |
| LLM 7B tok/s | ~57 | 66 | **M2 Max (+16%)** |
| RAM | 24 GB | 32 GB | **M2 Max (+33%)** |
| GPU Metal | 140,000 | 134,000 | M5 Pro (marginal) |
| Battery | 22h | 18h | **M5 Pro (+22%)** |
| SSD | 14,500 MB/s | 5,200 MB/s | **M5 Pro (+179%)** |
| WiFi | 7 | 6E | **M5 Pro** |
| Thunderbolt | TB5 120 Gb/s | TB4 40 Gb/s | **M5 Pro** |
| Camera | 12MP | 1080p | **M5 Pro** |
| Display | 1,000 nit | 500 nit | **M5 Pro** |
| Warranty | Full | None (used) | **M5 Pro** |

**Verdict:** The M5 Pro 15C wins 10 out of 13 categories but loses on the 3 that matter most for LLM work (bandwidth, tok/s, RAM). If daily coding is your 80% activity and LLM is your 20%, the M5 Pro is the clear choice. If you're serious about running 14B+ models locally as a core workflow, the M2 Max is a compelling second machine at $1,600.

## Recommendation

**Primary machine: M5 Pro 15C/24GB at $2,149.**

Rationale:
- Fastest single-core for daily IDE/terminal/compilation work (your 50%+ use case)
- 307 GB/s is enough for comfortable 7B LLM use (~57 tok/s, above the 30 tok/s threshold)
- 14.5 GB/s SSD dramatically improves Docker, Git, and project switching
- WiFi 7 helps with Parsec latency to your iPad Pro M4
- TB5 future-proofs for external storage and displays
- 24GB fits 14B models, which is the sweet spot for local coding assistants
- 22h battery for Sea-to-Sky field work
- Full warranty, AppleCare eligible

**If LLM work becomes a primary workflow:** Consider adding an M2 Max 38G/64GB at $1,900 as a dedicated local inference machine. The 64GB RAM + 400 GB/s bandwidth runs 32B models that won't fit on 24GB.
