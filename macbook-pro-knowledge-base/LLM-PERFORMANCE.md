# LLM Performance Analysis

> Local LLM inference is memory-bandwidth-bound. This file covers token generation speeds,
> model fit calculations, framework comparisons, and the physics of why bandwidth matters.

## The Fundamental Rule

**Token generation speed is determined by memory bandwidth, not compute.**

During the decode phase (generating one token at a time), the model weights must be read from memory for every single token. The formula is approximately:

```
tokens_per_second ≈ memory_bandwidth / model_weight_size × efficiency_factor
```

The efficiency factor is typically 0.80-0.90 depending on the framework (MLX is highest on Apple Silicon).

This means: doubling bandwidth roughly doubles token speed. More GPU cores do NOT help. More CPU cores do NOT help. Only bandwidth and model size matter.

## Token Generation Speed: 7B/8B Models (Q4 quantization)

| Chip | BW (GB/s) | llama.cpp Q4_0 | llama.cpp Q4_K_M | MLX (est.) | Data Quality |
|---|---|---|---|---|---|
| M3 Base | 100 | 21 tok/s | ~13 tok/s | ~27 tok/s | Real |
| M4 Base | 120 | 24 tok/s | ~17 tok/s | ~31 tok/s | Real |
| M5 Base | 153 | ~30 tok/s | ~21 tok/s | ~38 tok/s | Estimated |
| M3 Pro | 150 | 31 tok/s | ~19 tok/s | ~39 tok/s | Real |
| M2 Pro | 200 | 38 tok/s | ~24 tok/s | ~48 tok/s | Real |
| M4 Pro 12C | 273 | 50 tok/s | ~30 tok/s | ~63 tok/s | Real |
| M4 Pro 14C | 273 | 51 tok/s | ~33 tok/s | ~64 tok/s | Real |
| M3 Max 30G | 300 | 57 tok/s | ~25 tok/s | ~71 tok/s | Real |
| M5 Pro | 307 | ~57 tok/s | ~37 tok/s | ~72 tok/s | Estimated |
| M2 Max | 400 | 66 tok/s | ~33 tok/s | ~83 tok/s | Real |
| M3 Max 40G | 400 | 66 tok/s | ~33 tok/s | ~83 tok/s | Real |
| M4 Max 32G | 410 | 70 tok/s | ~38 tok/s | ~88 tok/s | Real |
| M5 Max 32G | 460 | ~79 tok/s | ~48 tok/s | ~99 tok/s | Estimated |
| M4 Max 40G | 546 | 83 tok/s | ~52 tok/s | ~104 tok/s | Real |
| M5 Max 40G | 614 | ~98 tok/s | ~60 tok/s | ~123 tok/s | Estimated |

## Token Generation Speed: 14B Models (Q4_K_M)

| Chip | BW (GB/s) | 14B tok/s | Data Quality | Needs min RAM |
|---|---|---|---|---|
| M3 Base 24GB | 100 | ~9 | Estimated | 24GB |
| M3 Pro | 150 | ~10-11 | Estimated | 18GB+ |
| M2 Pro | 200 | ~13.5 | Estimated | 24GB+ |
| M4 Pro 12C | 273 | 16.8 | Real (LocalScore) | 24GB |
| M4 Pro 14C | 273 | 18.0 | Real (LocalScore) | 24GB |
| M3 Max 30G | 300 | 20.0 | Real (LocalScore) | 36GB |
| M5 Pro | 307 | ~22 | Estimated | 24GB |
| M2 Max 38G | 400 | 25.0 | Real (LocalScore) | 32GB |
| M4 Max 32G | 410 | 24.0 | Real (LocalScore) | 36GB |
| M5 Max 32G | 460 | ~30 | Estimated | 36GB |
| M4 Max 40G | 546 | 29.0 | Real (LocalScore) | 48GB |
| M5 Max 40G | 614 | 36.3 | Real (LocalScore) | 48GB |

## LLM Model Fit Calculator

OS and system overhead typically consume 6-8GB of RAM. The remaining "model headroom" determines what you can run.

| Model | Q4 Weight | Min RAM Needed | Fits 16GB? | Fits 24GB? | Fits 32GB? | Fits 48GB? | Fits 64GB? |
|---|---|---|---|---|---|---|---|
| Llama 3.1 8B | ~4.5 GB | 12 GB | Yes | Yes | Yes | Yes | Yes |
| Qwen2.5 14B | ~8.5 GB | 18 GB | No | Yes | Yes | Yes | Yes |
| DeepSeek-R1 27B | ~17 GB | 24 GB | No | Barely | Yes | Yes | Yes |
| Qwen2.5 32B | ~19 GB | 28 GB | No | No | Yes | Yes | Yes |
| Llama 3.1 70B | ~40 GB | 48 GB | No | No | No | Barely | Yes |

"Barely" means the model loads but context window will be very limited (1-2K tokens). "Yes" means comfortable operation with reasonable context windows.

## Framework Comparison

| Framework | Speed vs llama.cpp | Apple Silicon Optimization | Ease of Use |
|---|---|---|---|
| MLX | +20-30% faster | Best (Apple-built) | Good (Python API) |
| llama.cpp | Baseline | Very good (Metal backend) | CLI, many wrappers |
| Ollama | -10-15% slower | Good (uses llama.cpp) | Easiest (one-click) |
| LM Studio | Varies (MLX backend available) | Good (MLX or llama.cpp) | Best GUI |

**Recommendation for Apple Silicon:** Use MLX via LM Studio or directly via Python. Multiply the llama.cpp numbers above by ~1.25 for MLX estimates.

## Prompt Processing (Time to First Token)

Unlike token generation, prompt processing is **compute-bound** (not bandwidth-bound). This means:
- More GPU cores help significantly
- Neural Engine accelerators help (M5 has GPU Neural Accelerators)
- Apple claims M5 Max is 4x faster than M4 Max at prompt processing

For interactive use, TTFT matters when you submit a long prompt (e.g., pasting a document). For typical conversational queries, TTFT is fast enough on all chips.

## Key Insights for Buyers

1. **RAM does not affect speed if the model fits.** An M4 Pro 24GB and M4 Pro 48GB have identical token speeds for models under 16GB.

2. **The "feels fast" threshold is ~30 tok/s.** Below this, generation feels sluggish. Above 50 tok/s, speed is imperceptible.

3. **M2 Max at $1,500 used > M4 Pro at $1,799 new for LLM work.** The bandwidth advantage (400 vs 273 GB/s) directly translates to ~30% faster tokens.

4. **M5 Pro at 307 GB/s is the new sweet spot** for users who want both good LLM speed and latest features (TB5, WiFi 7).

5. **To run 70B models, you need 48GB+ RAM.** This limits you to M3 Max 48GB+, M4 Pro 48GB, M4 Max, M5 Pro 64GB, or M5 Max.

<details>
<summary><strong>Raw Token Speed Data (JSON, click to expand)</strong></summary>

```json
[
  {"chip":"M2 Pro","bw":200,"llm7b_llamacpp":38,"llm7b_mlx_est":48,"llm14b":13.5,"source":"real"},
  {"chip":"M2 Max 38G","bw":400,"llm7b_llamacpp":66,"llm7b_mlx_est":83,"llm14b":25,"source":"real"},
  {"chip":"M3","bw":100,"llm7b_llamacpp":21,"llm7b_mlx_est":27,"llm14b":null,"source":"real"},
  {"chip":"M3 Pro","bw":150,"llm7b_llamacpp":31,"llm7b_mlx_est":39,"llm14b":10,"source":"real"},
  {"chip":"M3 Max 30G","bw":300,"llm7b_llamacpp":57,"llm7b_mlx_est":71,"llm14b":20,"source":"real"},
  {"chip":"M3 Max 40G","bw":400,"llm7b_llamacpp":66,"llm7b_mlx_est":83,"llm14b":25,"source":"real"},
  {"chip":"M4","bw":120,"llm7b_llamacpp":24,"llm7b_mlx_est":31,"llm14b":null,"source":"real"},
  {"chip":"M4 Pro 12C","bw":273,"llm7b_llamacpp":50,"llm7b_mlx_est":63,"llm14b":17,"source":"real"},
  {"chip":"M4 Pro 14C","bw":273,"llm7b_llamacpp":51,"llm7b_mlx_est":64,"llm14b":18,"source":"real"},
  {"chip":"M4 Max 32G","bw":410,"llm7b_llamacpp":70,"llm7b_mlx_est":88,"llm14b":24,"source":"real"},
  {"chip":"M4 Max 40G","bw":546,"llm7b_llamacpp":83,"llm7b_mlx_est":104,"llm14b":29,"source":"real"},
  {"chip":"M5","bw":153,"llm7b_llamacpp":30,"llm7b_mlx_est":38,"llm14b":12,"source":"estimated"},
  {"chip":"M5 Pro","bw":307,"llm7b_llamacpp":57,"llm7b_mlx_est":72,"llm14b":22,"source":"estimated"},
  {"chip":"M5 Max 32G","bw":460,"llm7b_llamacpp":79,"llm7b_mlx_est":99,"llm14b":30,"source":"estimated"},
  {"chip":"M5 Max 40G","bw":614,"llm7b_llamacpp":98,"llm7b_mlx_est":123,"llm14b":36,"source":"real_localscore"}
]
```

</details>
