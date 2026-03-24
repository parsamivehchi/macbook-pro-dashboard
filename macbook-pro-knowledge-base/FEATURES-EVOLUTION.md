# Features Evolution

> Hardware feature changes across all 4 generations of 14-inch MacBook Pro.
> Tracks Thunderbolt, WiFi, camera, display, SSD, battery, and more.

## Feature Comparison Matrix

| Feature | M2 Pro/Max (Jan 2023) | M3/Pro/Max (Nov 2023) | M4/Pro/Max (Nov 2024) | M5/Pro/Max (2025-2026) |
|---|---|---|---|---|
| **Thunderbolt** | TB4 (40 Gb/s), all | Base: TB3 (2 ports); Pro/Max: TB4 (3 ports) | Base: TB4; Pro/Max: **TB5 (120 Gb/s)** | Base: TB4; Pro/Max: **TB5 (120 Gb/s)** |
| **WiFi** | **6E** | 6E | 6E | Base: 6E; Pro/Max: **7 + BT 6** |
| **Bluetooth** | 5.3 | 5.3 | 5.3 | Base: 5.3; Pro/Max: **6** (N1 chip) |
| **Display SDR** | 500 nits | **600 nits** | **1,000 nits** | 1,000 nits |
| **Display HDR** | 1,600 nits | 1,600 nits | 1,600 nits | 1,600 nits |
| **Camera** | 1080p FaceTime HD | 1080p FaceTime HD | **12MP Center Stage** | 12MP Center Stage |
| **Nano-texture** | No | No | **Yes (+$150)** | Yes (+$150) |
| **Ray Tracing** | No | **Hardware RT (1st gen)** | RT (2nd gen) | RT (3rd gen) |
| **AV1 Decode** | No | **Yes** | Yes | Yes |
| **ProMotion** | 120 Hz adaptive | 120 Hz adaptive | 120 Hz adaptive | 120 Hz adaptive |
| **Resolution** | 3024 x 1964 | 3024 x 1964 | 3024 x 1964 | 3024 x 1964 |
| **SSD Speed (Read)** | ~5,200 MB/s | ~5,200 MB/s | ~5,100 MB/s | Base: 6,725; Pro/Max: **14,500 MB/s** |
| **Base Storage** | 512GB (Pro), 1TB (Max) | 512GB (Base/Pro), 1TB (Max) | 512GB (Base/Pro 12C), 1TB (others) | 1TB (Base/Pro), **2TB (Max)** |
| **Battery (Base)** | 18h | **22h** | **24h** | 24h |
| **Battery (Pro)** | 18h | 18h | **22h** | 22h |
| **Battery (Max)** | 18h | 18h | 18h | **20h** |
| **Colors** | Silver, Space Gray | Silver, **Space Black** (Pro/Max) | **Space Black (all)**, Silver | Space Black, Silver |
| **MagSafe** | MagSafe 3 | MagSafe 3 | MagSafe 3 | MagSafe 3 |
| **HDMI** | 2.1 | 2.1 | 2.1 | 2.1 |
| **SD Card** | SDXC | SDXC | SDXC | SDXC |
| **Headphone** | 3.5mm (impedance detect) | 3.5mm (impedance detect) | 3.5mm (impedance detect) | 3.5mm (impedance detect) |
| **Weight (Max)** | 3.6 lbs | 3.6 lbs | 3.6 lbs | 3.6 lbs |
| **Dimensions** | 0.61 x 12.31 x 8.71" | Same | Same | Same |

## Key Upgrade Milestones

### Thunderbolt 5 (M4 Pro/Max, Nov 2024)
TB5 delivers 120 Gb/s bandwidth (3x TB4). This matters for external displays (8K), external SSDs (full NVMe speed), eGPU-like use cases, and high-bandwidth docking stations. TB5 docks are still expensive ($200-400) but falling. If you use external displays or high-speed storage, TB5 is a significant upgrade.

### WiFi 7 + Bluetooth 6 (M5 Pro/Max, Mar 2026)
WiFi 7 via Apple's custom N1 wireless chip. Delivers 320 MHz channels, 4K QAM, multi-link operation, and theoretical speeds up to 46 Gb/s. Real-world benefit: faster large file transfers, better performance in congested environments, lower latency for video calls. WiFi 7 routers are now mainstream (~$200-400). Also adds Thread networking for smart home integration.

### 12MP Center Stage Camera (M4, Nov 2024)
Upgrade from 1080p to 12MP with Center Stage (auto-framing that follows you). Meaningful for video calls, which are a daily reality for most professionals. The jump from 1080p to 12MP is very noticeable in Teams/Zoom.

### 1,000 nit SDR Display (M4, Nov 2024)
Doubled from 500 nits (M2) to 1,000 nits. This is the outdoor-usability threshold. Working in bright environments (coffee shops, outdoor terraces) is dramatically better on M4/M5 vs. M2/M3 displays. If you work on-site in the Sea-to-Sky corridor, this matters.

### 14.5 GB/s SSD (M5 Pro/Max, Mar 2026)
Nearly triple the previous generation's SSD speeds. This accelerates: Xcode project indexing, Docker image operations, large Git repos, virtual machine disk I/O, swap performance (important when models are slightly larger than RAM). PCIe 5.0 lanes enable this.

## What Did NOT Change

The physical chassis has been identical since the 2021 MacBook Pro redesign. Same screen size (14.2"), same resolution (3024x1964), same port layout (3x TB + HDMI + MagSafe + SDXC + 3.5mm), same keyboard and trackpad, same speaker system, same ProMotion 120Hz display. The only visible difference is the color options expanding over time.

## Feature Importance for Developer Workflows

| Feature | Daily Coding | Local LLM | Remote (Parsec) | On-site Field Work |
|---|---|---|---|---|
| TB5 | Medium (fast SSD) | Low | Medium (eGPU) | Low |
| WiFi 7 | Low | Low | **High** (latency) | Medium |
| 12MP Camera | Medium (calls) | Low | Low | High (site calls) |
| 1000 nit display | Low (indoor) | Low | Low | **High** (outdoor) |
| 14.5 GB/s SSD | **High** (Docker, Git) | Medium (swap) | Low | Low |
| 24h battery | Medium | Low (plugged in) | Low | **High** |
