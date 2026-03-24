# Data Sources

> Every source URL, methodology note, and data freshness status.
> Last updated: March 23, 2026.

## Primary Sources

### Apple Official
| Source | URL | Used For |
|---|---|---|
| Apple Newsroom (M5 Pro/Max) | https://www.apple.com/newsroom/2026/03/apple-introduces-macbook-pro-with-all-new-m5-pro-and-m5-max/ | M5 Pro/Max specs, pricing, launch date |
| Apple Newsroom (M5 Base) | https://www.apple.com/newsroom/2025/10/apple-unveils-new-14-inch-macbook-pro-powered-by-the-m5-chip/ | M5 base specs |
| Apple Tech Specs (M5 Pro/Max) | https://www.apple.com/macbook-pro/specs/ | Official specs page |
| Apple Tech Specs (M5 Base) | https://support.apple.com/en-us/125405 | Battery, ports, display |
| Apple Tech Specs (M4 Pro/Max) | https://support.apple.com/en-us/121553 | Full spec sheet |
| Apple Tech Specs (M4 Base) | https://support.apple.com/en-us/121552 | Full spec sheet |
| Apple Tech Specs (M3 Pro/Max) | https://support.apple.com/en-us/117736 | Full spec sheet |
| Apple Tech Specs (M2 Pro/Max) | https://support.apple.com/en-us/111340 | Full spec sheet |
| Apple Refurbished Store | https://www.apple.com/shop/refurbished/mac/macbook-pro | Certified refurb prices |
| Apple ML Research (M5 LLM) | https://machinelearning.apple.com/research/exploring-llms-mlx-m5 | MLX + Neural Accelerator LLM benchmarks |

### Benchmark Sources
| Source | URL | Used For |
|---|---|---|
| Geekbench Browser (CPU) | https://browser.geekbench.com | Single/multi-core scores, sample sizes |
| Geekbench Browser (Metal) | https://browser.geekbench.com/metal-benchmarks | GPU Metal scores |
| LocalScore | https://localscore.ai | LLM-specific benchmarks per chip |
| Notebookcheck (M2 Max) | https://www.notebookcheck.net/Apple-M2-Max-Processor-Benchmarks-and-Specs.682771.0.html | Cross-validated benchmark data |

### Pricing Sources
| Source | URL | Used For | Freshness |
|---|---|---|---|
| Amazon | https://www.amazon.com | New, renewed, and used prices | Daily fluctuation |
| Swappa | https://swappa.com | Used market prices, lowest listings | Daily |
| Back Market | https://www.backmarket.com | Refurbished prices | Daily |
| RefurbMe | https://www.refurb.me | Price comparison across refurb retailers | Aggregator |
| B&H Photo | https://www.bhphotovideo.com | New retail prices | Weekly |

### Review & Analysis Sources
| Source | URL | Used For |
|---|---|---|
| Macworld (M5 benchmarks) | https://www.macworld.com/article/2959129/m4-versus-m5-macbook-pro-benchmarks.html | Real-world M5 vs M4 benchmarks |
| Macworld (M5 review) | https://www.macworld.com/article/2946344/m5-macbook-pro-review.html | M5 base chip review |
| Macworld (M5 Pro/Max guide) | https://www.macworld.com/article/2942089/macbook-pro-m5-pro-max-release-specs-price.html | Specs, pricing, analysis |
| Macworld (pricing analysis) | https://www.macworld.com/article/3076520/apple-changes-prices-new-m5-macbook-air-m5-pro-max-macbook-pro.html | Price changes with M5 launch |
| MacRumors (M5 Max benchmark) | https://www.macrumors.com/2026/03/05/m5-max-geekbench-benchmarks/ | First M5 Max Geekbench scores |
| AppleInsider (M5 vs M4 Pro) | https://appleinsider.com/articles/26/03/10/m5-pro-14-inch-macbook-pro-vs-m4-pro-14-inch-macbook-pro-compared | Comparison review |
| Tanmay.me (M5 dev review) | https://tanmay.me/posts/macbook-pro-m5-review/ | Developer-focused M5 review |
| InsiderLLM (local AI guide) | https://insiderllm.com/guides/apple-m5-pro-max-local-ai/ | M5 LLM inference analysis |
| ModelFit (M5 LLM) | https://modelfit.io/blog/m5-pro-max-local-llm-2026/ | Local LLM benchmark data |
| AwesomeAgents (70B models) | https://awesomeagents.ai/news/apple-m5-pro-max-70b-models-portable/ | Large model portability analysis |

### Technical Sources
| Source | URL | Used For |
|---|---|---|
| Wikipedia (M5) | https://en.wikipedia.org/wiki/Apple_M5 | Transistor counts, architecture details |
| Wikipedia (M3) | https://en.wikipedia.org/wiki/Apple_M3 | M3 architecture reference |
| Wikipedia (M2) | https://en.wikipedia.org/wiki/Apple_M2 | M2 architecture reference |
| CPU Monkey (M2 Max vs M5) | https://www.cpu-monkey.com/en/compare_cpu-apple_m2_max_30_gpu-vs-apple_m5 | Cross-chip comparison data |
| EveryMac (M5 specs) | https://everymac.com/systems/apple/macbook_pro/specs/macbook-pro-m5-10-core-cpu-10-core-gpu-14-2025-specs.html | Detailed spec sheets |
| Ghostty GitHub | https://github.com/ghostty-org/ghostty | Ghostty architecture, Metal usage |
| Ghostty DeepWiki | https://deepwiki.com/ghostty-org/ghostty/5.3-rendering-pipeline-and-shaders | Rendering pipeline details |

## Methodology Notes

### Benchmark Scores
- Geekbench 6 scores are **averages** from browser.geekbench.com, not cherry-picked peaks
- Sample sizes vary: M2/M3/M4 have thousands of submissions. M5 Pro/Max have early results (hundreds)
- Metal GPU scores for 14" models sometimes use 16" data where 14" samples are limited (noted)
- Cinebench 2024 scores are from review publications, not large databases

### LLM Token Speeds
- "Real" data comes from LocalScore benchmarks and published community results
- "Estimated" data uses the formula: `bandwidth / model_size * efficiency_factor` with 0.85 efficiency
- All speeds are for **token generation** (decode phase), not prompt processing (prefill)
- MLX estimates multiply llama.cpp numbers by 1.25 (conservative, real gains are 20-30%)

### Pricing
- Street prices represent the **midpoint** of typical listings, not the absolute minimum
- Swappa prices are for "good" condition with functional devices
- Amazon Renewed prices fluctuate daily, ranges represent March 2026 observations
- Apple Certified Refurbished availability changes frequently
- M5 Pro/Max "street" prices are near MSRP since they just launched (March 11, 2026)

### Depreciation
- Calculated as: `(1 - street_price / msrp) * 100`
- Projected future depreciation assumes ~50% loss over 3 years (based on M2 historical data)
- Actual depreciation varies by config: Max chips hold value better than Base/Pro

## Data Limitations

1. M5 Pro/Max benchmark data is preliminary (2-3 weeks of submissions as of March 23, 2026)
2. LLM benchmarks across different frameworks are not perfectly comparable
3. Used market prices have high variance based on condition, accessories, and seller
4. Apple's claimed battery life (video playback) doesn't match real-world mixed usage
5. Some CTO configurations (128GB RAM, 8TB storage) have very limited pricing data
