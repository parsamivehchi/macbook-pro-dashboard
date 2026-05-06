# Deployment Checklist: 2026-03-24

## Project Status Matrix

| Project | Build | Committed | Remote | Deployable | Blocking |
|---------|-------|-----------|--------|------------|----------|
| **heatmapfinance.com** | PASS (487ms) | YES | OneDrive (diverged) | Vercel (linked) | `vercel login` expired token |
| **macbook-pro-dashboard** | PASS (565ms) | YES | NONE | Not yet | No GitHub remote, no Vercel project |
| **squared.engineering** | PASS | YES (clean) | GitHub | Vercel (linked) | None -- ready to deploy |
| **LLM-BENCH / tps.sh** | PASS | YES (clean) | GitHub | GitHub Pages | None -- already live |
| **claude-bridge** | N/A | YES | N/A | N/A | Not a web app |
| **statusline HUD** | PASS (55ms) | N/A (dotfile) | N/A | Active | None -- already live |

---

## heatmapfinance.com -- Deploy to Production

### Pre-deploy Checklist

- [x] Build passes clean (`npm run build` -- 487ms, 0 errors)
- [x] All changes committed (`06a7ec9`)
- [x] `.env.production` has `VITE_BETA_MODE=true` (safe, no secrets)
- [x] `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `dist`, `.claude/`, `.superpowers/`
- [x] Vercel project linked (`.vercel/project.json` -- `prj_sKorUxdwE2Ybva4139jwGrmLESM9`)
- [x] `vercel.json` configured (vite framework, SPA rewrites, legacy-peer-deps)
- [ ] **BLOCKER: Vercel token expired**

### Deploy Steps

```bash
# Step 1: Re-authenticate (INTERACTIVE -- user must run this)
vercel login

# Step 2: Deploy to production
cd ~/Desktop/DEV/heatmapfinance.com
vercel --prod

# Step 3: Verify
curl -sI https://heatmapfinance.com | head -5
# Should return 200 OK

# Step 4: Smoke test in browser
# Navigate to https://heatmapfinance.com
# Check: dashboard loads, heatmap renders, ETF data appears, dark/light toggle works
```

### Post-deploy

- [ ] Verify Supabase connection (login, portfolio, alerts)
- [ ] Check PWA manifest loads (`/manifest.json`)
- [ ] Test service worker registration
- [ ] Verify geo maps load (Leaflet tiles)

### Backup Push (Separate from Deploy)

```bash
# Option A: Force push to overwrite diverged OneDrive backup
cd ~/Desktop/DEV/heatmapfinance.com
git push --force origin main
# WARNING: Overwrites any backup-only changes on OneDrive

# Option B: Dedicated conflict resolution
git pull --rebase origin main
# Then resolve 40+ conflicts manually (LARGE effort)
# Then: git rebase --continue && git push origin main
```

---

## macbook-pro-dashboard -- Set Up for Deployment

### Pre-deploy Checklist

- [x] Build passes clean (`npx vite build` -- 565ms, 0 errors)
- [x] Initial commit made (`769883d`)
- [ ] **BLOCKER: No GitHub remote**
- [ ] **BLOCKER: No Vercel project linked**
- [ ] No custom domain configured

### Deploy Steps

```bash
# Step 1: Create GitHub repo
cd ~/Desktop/DEV/macbook-pro-dashboard
gh repo create parsamivehchi/macbook-pro-dashboard --private --source=. --push

# Step 2: Link to Vercel
vercel link
# Or deploy directly:
vercel --prod

# Step 3: (Optional) Set custom domain
vercel domains add mbp.parsamivehchi.com
```

### Alternative: GitHub Pages (free, static)

```bash
# Add gh-pages deploy script to package.json
npm install -D gh-pages
# Add: "deploy": "vite build && gh-pages -d dist"
npm run deploy
```

---

## squared.engineering -- Ready to Deploy

### Pre-deploy Checklist

- [x] Build passes (zero TypeScript errors, 69 pages generated)
- [x] All changes committed (clean working tree)
- [x] Vercel project linked
- [x] Custom domain: squared.engineering

### Deploy Steps

```bash
cd ~/Desktop/DEV/squared.engineering/web
vercel --prod
# Verify: https://squared.engineering
```

---

## LLM-BENCH / tps.sh -- Already Live

- Deployed to GitHub Pages at tps.sh
- Clean git status, no pending changes
- No action needed

---

## Global Blockers Summary

| Blocker | Affects | Resolution | Effort |
|---------|---------|------------|--------|
| Vercel token expired | heatmap, squared, MBP deploy | `vercel login` (interactive) | 30 seconds |
| OneDrive backup diverged | heatmap backup | Force push or manual merge | 30 sec or 2+ hours |
| No GitHub remote | MBP dashboard | `gh repo create` | 2 minutes |
| Supabase free tier limit | heatmap + squared sharing a project | Upgrade to paid ($25/mo) | 5 minutes |
