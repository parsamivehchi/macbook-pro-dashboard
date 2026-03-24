# Ghostty + Claude Code Workflow Notes

> Optimizing the MacBook Pro for Ghostty terminal, Claude Code, and local LLM development workflows.

## Ghostty Performance on Apple Silicon

### What Ghostty Actually Needs

Ghostty uses Metal for GPU-accelerated terminal rendering, but terminal rendering is an extraordinarily lightweight GPU workload. The rendering pipeline:

1. **Background fill** (trivial)
2. **Cell background rendering** (trivial)
3. **Text glyph rendering** from texture atlases (lightweight)
4. **Optional image rendering** (only when displaying images inline)
5. **Optional custom shader effects** (CRT, retro styles)

Each CellText struct is 32 bytes, optimized for GPU cache efficiency. Ghostty renders on demand: zero GPU work at idle, ~2 fps with cursor blinking, 400-600+ fps in synthetic stress tests.

**Bottom line:** Even the weakest chip in this comparison (M3 base with 10 GPU cores) is massive overkill for Ghostty. You will never perceive a difference between any of these chips for terminal rendering.

### What Actually Matters for Ghostty Performance

1. **Single-core CPU speed** for I/O parsing (SIMD/NEON operations on terminal escape sequences)
2. **SSD speed** for scrollback buffer management with large outputs
3. **ProMotion 120Hz** display support (all 14" MacBook Pros have this)

### Known Issues

**Cursor blinking on ProMotion displays:** Ghostty's cursor blink triggers ~10-15% CPU on 120Hz displays because each blink cycle redraws at the display's native refresh rate. This affects ALL 14" MacBook Pros equally. Mitigations:
- Set `cursor-style = block` with `cursor-style-blink = false` in your Ghostty config
- Or set `window-vsync = false` to reduce idle CPU

**Custom shaders:** CRT/retro shader effects consume ~1% CPU and ~2% GPU. Negligible on any Apple Silicon chip.

### Recommended Ghostty Config Optimizations

```toml
# ~/.config/ghostty/config

# Performance: disable cursor blink to save CPU on ProMotion
cursor-style-blink = false

# Or if you want blink, reduce ProMotion CPU hit
# window-vsync = false

# Font: use a font with good glyph caching
font-family = "JetBrains Mono"
font-size = 13

# GPU: Metal is automatic on macOS, no config needed
# Ghostty auto-detects Metal and uses it

# Shell integration (helps with semantic prompts)
shell-integration = zsh
```

## Claude Code Performance Considerations

### How Claude Code Uses System Resources

Claude Code is a CLI tool that:
1. Runs in your terminal (Ghostty)
2. Makes API calls to Anthropic's servers (network-bound)
3. Reads/writes local files (SSD-bound)
4. Runs subprocesses (compilation, linting, testing)

Claude Code itself is not compute-intensive. The bottlenecks are:
- **Network latency** to Anthropic API (WiFi quality matters)
- **SSD speed** for reading large codebases into context
- **Single-core CPU** for running the tools Claude Code invokes (compilers, linters, test runners)

### Chip Impact on Claude Code Workflows

| Workflow Step | Bottleneck | Best Metric |
|---|---|---|
| Sending prompts to API | Network | WiFi 7 > WiFi 6E |
| Reading project files | Disk I/O | SSD speed (14.5 GB/s M5 Pro/Max) |
| Running builds/tests | CPU | Single-core (M5: 4,226+) |
| Git operations | Disk + CPU | SSD + single-core |
| Docker container ops | Disk + multi-core | SSD + multi-core |

**M5 Pro/Max advantage:** WiFi 7 reduces API latency, 14.5 GB/s SSD makes file reading near-instant, and 4,289 single-core makes subprocess execution snappy.

### MCP Server Setup Notes

If running MCP servers locally with Claude Code:
- MCP servers are lightweight Node.js/Python processes
- RAM impact: ~50-100MB per server
- CPU impact: negligible (event-loop based)
- On 24GB RAM: comfortable running 3-5 MCP servers alongside your dev tools and a 7B model

### AECOM VPN Considerations

Based on previous experience with AECOM's VPN and SSL inspection blocking API access:
- Claude Code API calls may be blocked by AECOM's SSL inspection proxy
- Workaround: Use Claude Code on your personal Mac, not the AECOM Windows machine
- Parsec from iPad Pro to your Mac bypasses AECOM network entirely
- Consider a mobile hotspot for on-site API access if AECOM WiFi blocks Anthropic endpoints

## Local LLM Setup Guide

### Recommended Stack

```
┌─────────────────────────────────────────────┐
│  LM Studio (GUI) or mlx-lm (CLI)           │
│  ↕ MLX backend (fastest on Apple Silicon)   │
│  ↕ Unified Memory (shared CPU/GPU)          │
│  ↕ Your MacBook Pro chip                    │
└─────────────────────────────────────────────┘
```

### Installation

```bash
# MLX (Apple's framework, fastest on Apple Silicon)
pip install mlx mlx-lm

# Download a model
mlx_lm.convert --hf-path meta-llama/Llama-3.1-8B-Instruct -q

# Or use LM Studio (GUI, supports MLX backend)
# Download from: https://lmstudio.ai
```

### Model Recommendations by Chip

| Your Chip | Best Models | Framework | Expected Speed |
|---|---|---|---|
| M5 Pro 24GB | Llama 3.1 8B, Qwen2.5 14B | MLX | 72 / 28 tok/s |
| M5 Max 36GB | Above + DeepSeek-R1 27B | MLX | 99 / 38 / 15 tok/s |
| M5 Max 48GB | Above + Qwen2.5 32B | MLX | 123 / 48 / 20 tok/s |
| M2 Max 32GB | Llama 3.1 8B, Qwen2.5 14B | MLX | 83 / 31 tok/s |
| M2 Max 64GB | Above + Llama 3.1 70B (tight) | MLX | 83 / 31 / ~8 tok/s |

### Running Local Models Alongside Dev Tools

Memory budget on 24GB machine:
- macOS + system: ~6 GB
- VS Code + extensions: ~2 GB
- Ghostty + shells: ~0.5 GB
- Docker containers: ~2-4 GB
- Browser (20 tabs): ~2-3 GB
- **Available for models: ~10-12 GB**

This comfortably fits 7B-8B models (4.5 GB). 14B models (8.5 GB) will work but leave minimal headroom. Close Docker/browser to free RAM for 14B.

On 32GB+ machines, you can run 14B models alongside a full dev environment without juggling.

## Parsec Remote Access Notes

### iPad Pro M4 to Mac via Parsec

Parsec performance depends on:
1. **WiFi latency** (most critical): WiFi 7 on M5 Pro/Max reduces jitter
2. **Encoder quality**: Apple Silicon's hardware H.265 encoder is excellent
3. **Network stability**: 5 GHz or 6 GHz band preferred

### Optimization Tips

- Connect Mac to WiFi on 5 GHz or 6 GHz band
- Use Parsec's "Prefer desktop resolution" mode for crisp text
- Set Parsec to H.265 codec (uses hardware encoder, lower latency)
- If on AECOM network, Parsec traffic may be throttled. Use personal hotspot.

### Display Considerations

The iPad Pro M4's 2732x2048 display pairs well with the MacBook Pro's 3024x1964 native resolution. Parsec will scale appropriately. For coding, set your IDE font size to 14-15pt for comfortable reading through Parsec.
