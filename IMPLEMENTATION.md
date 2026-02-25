# ∞8 ARCH — Phase 1 Implementation

## Positioning

**Before:** "Creative provenance protocol for AI-native music"
**After:** "The professional standard for documenting how music gets made in the AI era"

Core message: **Prove your process.** Not identity, not IP protection, not cross-modal — just documentation done right.

## ICP (Ideal Customer Profile)

1. **Transparent Pro** — AI-native producer using Suno/Udio, wants professional credibility. Ships 3-5 tracks/week.
2. **Producer-Engineer** — Hybrid workflow (AI + DAW), needs to document complex multi-tool chains for collaborators.

## Changes Made

### 1. Landing Page Copy Rewrite (`frontend/src/app/page.tsx`)
- Hero subtitle: "The professional standard for documenting how music gets made in the AI era"
- Sub-hero: "Prove your process. Machine-readable declarations. Verifiable creative lineage. Free to use."
- "Who This Is For" — rewritten with two clear ICP callouts (AI-native producers, producer-engineers)
- Added EU AI Act Article 50 reference (August 2026 deadline)
- "Who This Is NOT For" → softened to "Not for everyone. That's the point." — single paragraph
- CTA: "Your process is your proof. Document it."

### 2. Quick Declaration Mode (`frontend/src/app/new/page.tsx`)
- **Quick/Full toggle** at top of create page — defaults to Quick
- Quick mode: 5 fields only
  - Track title
  - Artist name
  - Single AI% slider (0-100, sets all 5 phases uniformly)
  - Quick-pick buttons (0%, 25%, 50%, 75%, 100%)
  - Methodology (optional textarea)
  - Audio file upload (drag & drop)
- "Want more detail? Switch to Full Mode" link at bottom
- Full mode: existing form unchanged
- Rationale: simulation showed 60% bounce rate on form length for ICP-adjacent users

### 3. Producer Profile Pages (`frontend/src/app/profile/[artist]/page.tsx`)
- New route: `/profile/{artistName}`
- Shows: total declarations, avg transparency score, avg AI%, on-chain count
- Creative stack aggregate (all tools used across declarations)
- Badges earned aggregate
- Full declaration list with the same card format as gallery
- Artist names now clickable in gallery and declaration detail pages

### 4. Platform Integrations (from previous session)
- **Suno bookmarklet** — one-click metadata extraction from suno.com
- **Udio bookmarklet** — one-click metadata extraction from udio.com (`UDIO_BOOKMARKLET.js`)
- Both pre-fill the declaration form via URL parameters

### 5. Embed & Badge System (from previous session)
- **SVG badge API** — `GET /api/declarations/{id}/badge` returns embeddable 340x120 SVG
- **HTML embed API** — `GET /api/declarations/{id}/embed` returns self-contained iframe HTML
- **Embed & Share section** on declaration detail page with 4 copy formats

### 6. Smart Contract Deployment Prep (from previous session)
- Updated `hardhat.config.js` with Polygon Amoy network + verification
- Updated `deploy.js` to save addresses and print verification commands
- Created `DEPLOY_CONTRACTS.md` step-by-step guide

## Strategy Docs Created
- `BETA_SIMULATION.md` — 200-person cohort simulation (5 segments, pricing, ERRC, 4-year projections)
- `DEPLOY_CONTRACTS.md` — Smart contract deployment guide
- `UDIO_BOOKMARKLET.js` — Standalone bookmarklet source

## What's Next (Phase 2)
1. Deploy to Vercel — verify all changes work in production
2. Get 10 declarations from real users (not test data)
3. Social proof: share 3 declarations on X/Twitter with embed badges
4. Monitor: which mode do users pick (Quick vs Full)?
5. Monitor: do profile pages get visited?

## Architecture Notes
- No new dependencies added
- No database schema changes needed
- Profile page uses existing `/api/declarations?artistName=` filter
- Quick mode reuses all existing form state and submit logic
