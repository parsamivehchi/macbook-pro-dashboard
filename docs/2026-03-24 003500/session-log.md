# Session Log: 2026-03-24 00:00 - 00:35 PDT

## Cold-Start Summary

> This session covered three major workstreams: (1) building a 19-widget, 2-line Claude Code statusline HUD at `~/.claude/statusline.sh` with context bars, rate limit countdowns, token speed, git OSC 8 links, and conditional vim/agent/worktree indicators, tested at 55ms warm cache; (2) committing two projects -- the brand-new macbook-pro-dashboard (MBP Observatory, 15-page React 19 + Vite 8 + Recharts chip comparison app) and heatmapfinance.com (v2 platform overhaul with 370 files, +33k lines, AI analysis, screener, PWA, geo maps); (3) attempting deployment of heatmapfinance.com to Vercel (blocked by expired token) and backup push to OneDrive (blocked by 40+ merge conflicts). All builds pass clean. To resume: run `vercel login` then `cd ~/Desktop/DEV/heatmapfinance.com && vercel --prod`.

---

## What Was Built or Changed

### 1. Claude Code Statusline HUD (`~/.claude/statusline.sh`)

**Type**: New file (374 lines bash)

**What it does**: Replaces the basic 1-line `statusline-command.sh` with a dense 2-line "fighter pilot cockpit" HUD at the bottom of every Claude Code CLI window.

**LINE 1 -- Session Metrics (left to right)**:
- Model name (bold white)
- Context window: 10-char progress bar (green <50%, yellow 50-75%, red >75%) + percentage + absolute tokens (e.g., `85k/200k`)
- Cache efficiency: `cache_read / total_cache_input * 100` -- only after first API call
- Session cost: color-coded ($green <$2, yellow <$5, red >=$5)
- Burn rate: `$/hr` with fire emoji
- Token speed: `tok/s` from `total_output / api_duration` -- only after first API call
- Lines changed: green `+N`, red `-N`

**LINE 2 -- Rate Limits + Git + Context**:
- 5h rate limit: 8-char bar + percentage + countdown timer (`Xh Ym` until reset)
- 7d rate limit: compact percentage
- Git branch: cyan, OSC 8 clickable link to GitHub (Cmd+click in Ghostty)
- Git dirty state: green `+staged`, yellow `~modified`, red `?untracked`
- Worktree name (magenta, only when in worktree)
- Vim mode (`VIM:NOR` / `VIM:INS`, only when vim mode active)
- Agent name (only when running as subagent)
- `>200k` warning (red, only when `exceeds_200k_tokens` is true)
- Output style (only when non-default)
- Session elapsed time
- Claude Code version

**Architecture decisions**:
- Single `jq` call with `@sh` quoting extracts ALL 25+ fields at once into shell variables -- this is the #1 performance optimization (1 process instead of 20+)
- Cost cents and burn rate pre-computed inside `jq` to eliminate all `awk` calls from bash
- Token speed uses pure bash integer math: `$(( TOTAL_OUT * 1000 / API_DURATION_MS ))`
- Dual-source rate limits: native JSON (primary, zero overhead) + OAuth API fallback (only when `rate_limits` absent in JSON, cached 60s, keychain token extraction)
- Git data cached at `/tmp/claude-sl-git` (5s TTL), remote URL at `/tmp/claude-sl-remote` (300s TTL)
- `printf '%b'` for escape sequences (not `echo -e`) per official docs recommendation
- Stable cache filenames (not `$$` or `$PPID` which change per invocation)

**Performance**: 55-57ms warm cache, ~320ms cold (git cache miss). Well within 300ms debounce.

**Research sources**: Official Claude Code docs (full JSON schema), ccstatusline (3.1k stars, 30+ widgets), Boris Cherny's tips, Karpathy's workflow, Hannah Stulberg's OAuth discovery, Dan Does Code's minimal approach, rz1989s atomic components.

**Files**:
- `~/.claude/statusline.sh` -- the HUD script (created)
- `~/.claude/settings.json` -- updated `statusLine.command` to point to new script, `padding: 0`
- `~/.claude/statusline-command.sh.bak` -- old basic script (backed up)

---

### 2. macbook-pro-dashboard (MBP Observatory)

**Type**: New project, first commit

**Stack**: React 19 + Vite 8 + Tailwind v4 + Recharts + TypeScript

**What it is**: A comprehensive MacBook Pro 14" comparison dashboard covering M2 through M5 generations (29 chip configurations), with 15 lazy-loaded pages:

| Page | Purpose |
|------|---------|
| DashboardOverview | Summary stats, top picks, quick comparisons |
| HeadToHead | Side-by-side chip comparison |
| DataTable | Full specs table with sorting/filtering |
| FeaturesMatrix | Feature comparison grid |
| LLMPerformance | Local LLM inference calculator (which models run on which RAM/bandwidth) |
| BenchmarkExplorer | Geekbench 6 single/multi/GPU analysis |
| CostAnalysis | Price breakdowns, cost per core/GB |
| PerfDollar | Performance-per-dollar scatter plots |
| LLMBandwidth | Memory bandwidth impact on LLM speed |
| FeaturesTimeline | Feature evolution across generations |
| BudgetPicker | Budget-constrained recommendations |
| UseCaseRanker | Weighted scoring by use case (coding, LLM, GPU, battery, all-rounder, budget) |
| BuyingGuide | Narrative recommendations |
| DecisionMatrix | Multi-criteria decision analysis |
| WorkflowNotes | Developer workflow observations |
| DataSources | Data provenance and methodology |

**Data**: 29 chip configurations from M2 Pro 10C/16GB through M5 Max 40G/48GB. Each has: CPU/GPU core counts, RAM, bandwidth, Geekbench 6 scores (single/multi/GPU), Llama 7B tok/s, Llama 14B tok/s, Neural Engine TOPS, MSRP, Speedometer score, battery hours, SSD speed, TB version, WiFi, camera, display nits, year.

**LLM models tracked**: Llama 3.1 8B, Qwen2.5 14B, DeepSeek-R1 27B, Qwen2.5 32B, Llama 3.1 70B (with Q4 VRAM requirements).

**Theme**: "Obsidian Editorial" -- premium dark with generation-coded colors (M2 amber, M3 cyan, M4 purple, M5 blue) and tier-coded colors (Base slate, Pro teal, Max orange).

**Build**: Clean in 565ms. No TypeScript errors.

**Files**: `src/` (5,582 lines), `macbook-pro-ultimate-dashboard.jsx` (732 lines standalone version), `macbook-pro-knowledge-base/` (reference data)

---

### 3. heatmapfinance.com (v2 Platform Overhaul)

**Type**: Major update (370 files changed, +33,427 / -2,613 lines)

**What changed since last commit** (comprehensive audit + v2 overhaul):

**New features**:
- AI analysis panel (Atlas) with Supabase edge function backend
- ETF screener with filter builder, column customizer, preset bar, export
- Country profile pages with comparison sidebar, filter bar
- S&P 500 heatmap page (63 KB bundle)
- Portfolio builder with analytics dashboard (correlation matrix, drawdown chart, risk metrics)
- Social features: leaderboard, portfolio sharing, comments, likes, follow
- PWA: service worker, install prompt, offline indicator
- Notification center and alert system (with Supabase evaluate-alerts function)
- Search overlay with fuzzy matching and search index
- Dashboard widgets: diversification, earnings calendar, index cards, market status bar, mini heatmap preview, movers split view, news ticker, portfolio summary, sector heatbar, sentiment gauge, watchlist quickview
- Leaflet geo map (interactive, 160 KB bundle)
- World map canvas with choropleth controls, region/leaderboard/country sidebars
- Chart components: toolbar, comparison, fullscreen, interactive card, lightweight (TradingView)
- Help page with shortcuts modal
- API docs page
- Planner page
- Diversification analysis page

**New Supabase infrastructure**:
- 5 edge functions: `atlas-chat`, `refresh-market-data`, `evaluate-alerts`, `join-waitlist`, `backup-data`, `api-v1`, `fetch-fear-greed`
- 5 migrations: cron/views, alerts/notifications, social tables, waitlist, backup storage
- `.env.production` with `VITE_BETA_MODE=true`

**New data/config files**: country profiles, province allocation, Russell 2000 constituents, TSX equivalents, mock prices, constants, state name mapping, GICS sectors, provider metadata

**Deleted**: `SearchCommand.tsx` (replaced by `SearchOverlay`), `useSearch.ts` (replaced by `useGlobalSearch`), `search.ts` (replaced by `search-index.ts`)

**28 design specs** documented in `docs/specs/2026-03-23/` (master plan through data accuracy QA)

**Build**: Clean in 487ms.

---

## Key Decisions and Why

| Decision | Why |
|----------|-----|
| **Statusline: bash over Node.js/Python** | Fastest cold-start (<5ms vs 50ms+). jq already installed. Community benchmarks confirm bash wins for statusline scripts. |
| **Statusline: single jq call** | Extracting 25+ fields with separate `echo \| jq` calls would spawn 25+ processes. One `eval "$(jq -r @sh ...)"` call does it all. |
| **Statusline: pre-compute in jq** | Moving cost_cents and burn_rate computation into the jq expression eliminated all awk calls, saving ~8ms per invocation. |
| **Statusline: dual rate limit sources** | User chose "both" -- native JSON is primary (zero overhead), OAuth API is fallback for edge cases before first API response. |
| **Statusline: all extra widgets** | User chose "all of them" -- vim mode, agent name, worktree, 200k warning, version, output style, OSC 8 links. All conditional (hidden when irrelevant). |
| **MBP Dashboard: Vite + React 19 (not Next.js)** | Pure client-side SPA -- no server data, no auth, no SEO needs. Vite builds in 565ms vs multi-second Next.js builds. |
| **Heatmap: abort rebase, skip backup push** | OneDrive remote diverged with 40+ merge conflicts across core files. Too risky to resolve in a sweep session. Will need dedicated conflict resolution. |
| **Heatmap: `.claude/` and `.superpowers/` added to .gitignore** | Internal Claude Code state files should not be committed to the repo. |

---

## What Is Working

- Statusline HUD renders correctly in all test scenarios (full, minimal, git repo, no git, vim mode, agent mode, worktree, 200k warning, all color thresholds)
- MBP Dashboard builds and runs (`localhost:8766`), all 15 pages load, filters work
- HeatMap Finance builds and runs (`localhost:8767`), dashboard renders with real ETF data
- Both projects committed to git with clean working trees
- All existing projects (squared.engineering, LLM-BENCH) remain clean and unaffected

## What Is Not Working / Known Issues

| Issue | Status | Impact |
|-------|--------|--------|
| **Vercel token expired** | Blocked | Cannot deploy heatmapfinance.com to production. Need `vercel login`. |
| **OneDrive backup diverged** | Blocked | 40+ merge conflicts. heatmapfinance.com backup push rejected. Need dedicated resolution session or force push. |
| **HeatMap Finance dark screenshot** | Cosmetic | agent-browser screenshot was near-black on first load. Likely splash/auth screen. App renders fine on direct navigation. |
| **Statusline 55ms > 50ms target** | Minor | 55ms warm cache is 5ms over aspirational target. jq itself takes ~30ms which is the floor. Well within 300ms debounce. |
| **macbook-pro-dashboard no remote** | Setup needed | Git repo exists locally but has no GitHub remote. Not deployable yet. |
| **OAuth statusline fallback untested live** | Unknown | The OAuth API call path (keychain extraction + curl) hasn't been tested with a real session where `rate_limits` is absent from JSON. Should work but unverified. |

---

## Blockers

1. **`vercel login`** -- must be run interactively by user (`! vercel login` in Claude Code)
2. **OneDrive backup conflict resolution** -- 40+ files, needs dedicated session
3. **macbook-pro-dashboard GitHub remote** -- needs `git remote add origin` + GitHub repo creation

---

## Exact Next Steps to Continue from Cold Start

### Immediate (resume this work)

```bash
# 1. Deploy heatmapfinance.com
vercel login                    # interactive auth
cd ~/Desktop/DEV/heatmapfinance.com
vercel --prod                   # deploy to production

# 2. Verify statusline is rendering
# Just start a new Claude Code session -- the statusline should appear at the bottom
# If not showing, check: cat ~/.claude/settings.json | jq '.statusLine'

# 3. Resolve OneDrive backup (choose one):
# Option A: Force push (overwrites backup with local, losing any backup-only changes)
cd ~/Desktop/DEV/heatmapfinance.com
git push --force origin main

# Option B: Dedicated merge session (preserves both)
# This needs careful manual conflict resolution across 40+ files

# 4. Create GitHub remote for macbook-pro-dashboard
cd ~/Desktop/DEV/macbook-pro-dashboard
gh repo create parsamivehchi/macbook-pro-dashboard --private --source=. --push
```

### Short-term

- Test statusline OAuth fallback in a real fresh session
- Consider publishing macbook-pro-dashboard to GitHub Pages or Vercel
- Squared.engineering: ready for Q2 launch (already has Vercel deployment)
- Skills-dashboard: needs more commits, currently minimal

### Medium-term (from heatmap design specs)

- Live market data pipeline (spec #16)
- Real analytics tracking (currently mock data)
- Supabase paid tier upgrade (free tier 2-project limit)
- Yahoo Finance API dependency risk (unofficial, could break)

---

## Commands, Env Vars, and Setup Notes

### Dev Servers

```bash
# MBP Dashboard
cd ~/Desktop/DEV/macbook-pro-dashboard && npx vite --port 8766

# HeatMap Finance
cd ~/Desktop/DEV/heatmapfinance.com && npx vite --port 8767

# Squared Engineering
cd ~/Desktop/DEV/squared.engineering/web && npm run dev
```

### Statusline Testing

```bash
# Full mock test
echo '{"model":{"display_name":"Opus 4.6"},"workspace":{"current_dir":"/path"},"cost":{"total_cost_usd":0.85,"total_duration_ms":3600000,"total_api_duration_ms":120000,"total_lines_added":156,"total_lines_removed":23},"context_window":{"used_percentage":42.5,"context_window_size":200000,"total_input_tokens":85000,"total_output_tokens":12000,"current_usage":{"input_tokens":8500,"output_tokens":1200,"cache_creation_input_tokens":5000,"cache_read_input_tokens":45000}},"rate_limits":{"five_hour":{"used_percentage":38,"resets_at":'$(date -v+2H +%s)'},"seven_day":{"used_percentage":18,"resets_at":'$(date -v+5d +%s)'}}}' | ~/.claude/statusline.sh

# Minimal mock (fresh session)
echo '{"model":{"display_name":"Opus 4.6"}}' | ~/.claude/statusline.sh

# Performance benchmark
time echo '{"model":{"display_name":"Opus"}}' | ~/.claude/statusline.sh > /dev/null
```

### Key Env Vars

```bash
# HeatMap Finance (.env.local -- not committed)
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>

# Vercel (from vercel login)
# Token stored in ~/.config/vercel/auth.json after login

# Statusline OAuth (auto-extracted from macOS Keychain)
# security find-generic-password -s 'Claude Code-credentials' -w
```

### Key File Locations

```
~/.claude/statusline.sh              # The HUD script
~/.claude/statusline-command.sh.bak  # Old script (backup)
~/.claude/settings.json              # Claude Code settings (statusLine config lives here)
~/.claude/plans/sunny-giggling-frog.md  # The statusline implementation plan
~/Desktop/DEV/claude-status-line/statusline-master-prompt.md  # Research & reference guide
```
