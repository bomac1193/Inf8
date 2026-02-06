# ∞8 ARCH - TODO

## 🎯 Current Focus

- [x] ∞8 ARCH rebranding complete
- [x] Frontend styling (brutalist monochrome)
- [x] Prisma schema updated for PostgreSQL
- [x] RainbowKit wallet integration styled
- [x] Declaration form UI polished
- [ ] **IN PROGRESS:** Pinata IPFS integration
- [ ] **NEXT:** Deploy to Vercel
- [ ] **NEXT:** Suno extension integration

---

## 📋 Phase 1: MVP Deployment (Week 1)

### **Deployment** ✅
- [x] Update README (remove blue ocean strategy)
- [x] Rename GitHub repo to `inf8`
- [x] Update git remote to inf8
- [ ] Get Pinata API key (pinFileToIPFS + pinJSONToIPFS only)
- [ ] Deploy to Vercel
  - [ ] Set Root Directory to `frontend`
  - [ ] Create Vercel Postgres database
  - [ ] Add `NEXT_PUBLIC_PINATA_JWT` environment variable
  - [ ] Run `npx prisma db push` with Vercel DATABASE_URL
  - [ ] Redeploy after env vars configured
- [ ] Test live deployment
  - [ ] Homepage loads
  - [ ] Wallet connect works
  - [ ] Declaration form loads
  - [ ] File upload works (with Pinata)

### **API Keys (Add Later)**
- [ ] Get WalletConnect Project ID
  - URL: https://cloud.walletconnect.com/sign-in
  - Add to Vercel: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- [ ] Get Alchemy API URL (Polygon Amoy)
  - URL: https://dashboard.alchemy.com/
  - Add to Vercel: `NEXT_PUBLIC_ALCHEMY_AMOY_URL`
- [ ] Redeploy after adding these

---

## 🎵 Phase 2: Suno Integration (Week 2)

### **Suno Extension Strategy**
**Goal:** Make it trivial for Suno users to create declarations

**Option 1: Browser Bookmarklet (Simplest)**
- [ ] Create bookmarklet that:
  - Extracts track data from Suno UI
  - Pre-fills ∞8 ARCH declaration form
  - Opens `/new` page with data
- [ ] Add bookmarklet to homepage ("Suno users: drag this to your bookmarks bar")
- [ ] Test with Suno generated tracks

**Option 2: Chrome Extension (Better UX)**
- [ ] Build Chrome extension that:
  - Detects when on suno.com
  - Adds "Create ∞8 Declaration" button to Suno UI
  - Extracts track metadata automatically
  - Opens inf8.io/new with pre-filled data
- [ ] Publish to Chrome Web Store
- [ ] Add "Install Extension" link to homepage

**Option 3: API Integration (Long-term)**
- [ ] Contact Suno about official partnership
- [ ] Native "Export to ∞8 ARCH" button in Suno
- [ ] Revenue share model (future monetization)

**Decision:** Start with Option 1 (bookmarklet) for speed, then build Option 2 (extension).

### **Suno Bookmarklet Specs**
- [ ] Extract from Suno page:
  - Track title
  - Prompt used
  - Model version
  - Duration
  - Audio file URL
- [ ] Pre-fill ∞8 ARCH form:
  - Title → Track title
  - AI Models → "Suno v3" (or detected version)
  - AI Contribution → Composition: 100%, Arrangement: 100%
  - Methodology → Include Suno prompt
- [ ] Auto-download audio from Suno → Upload to Pinata
- [ ] Guide user through adding collaborators/other tools

---

## 🌐 Phase 3: Marketing & Growth (Month 1-3)

### **Domain & Branding**
- [ ] Acquire `inf8.io` domain
  - [ ] Purchase from registrar (Namecheap, Cloudflare, etc.)
  - [ ] Configure DNS for Vercel
  - [ ] Add domain to Vercel project
  - [ ] Set up email forwarding (hello@inf8.io → bomac1193@gmail.com)
- [ ] Social media presence
  - [ ] Twitter/X: @inf8arch
  - [ ] GitHub: Update all links to inf8
  - [ ] Discord community (optional)

### **First 100 Declarations**
- [ ] Create 5 showcase declarations (complex workflows)
- [ ] Share on:
  - [ ] r/WeAreTheMusicMakers
  - [ ] r/edmproduction
  - [ ] Music production Discord servers
  - [ ] Twitter/X music production community
- [ ] Get 5 producer testimonials
- [ ] Blog post: "Why I Built ∞8 ARCH"
- [ ] Reach 100 declarations milestone

### **Press & Coverage**
- [ ] Submit to:
  - [ ] Hacker News
  - [ ] Product Hunt
  - [ ] MusicTech publications
  - [ ] AI music blogs
- [ ] Podcast outreach (music production podcasts)

---

## 💰 Phase 4: Monetization (Month 3-6)

### **Freemium Model (GBP)**
- [ ] Design Pro tier features:
  - Unlimited declarations (Free: keep unlimited for now)
  - Process Doc badge 🏷️
  - Multiplayer badge 👥
  - Export API
  - Priority IPFS storage
- [ ] Integrate Stripe
  - [ ] Create Stripe account
  - [ ] Set up GBP pricing: £8/mo Pro tier
  - [ ] Add payment flow to `/new` page
  - [ ] Implement badge system
- [ ] Add Label tier: £79/mo
  - Team accounts
  - White-label option
  - API priority
  - Private gallery

### **Badge Marketplace (Future)**
- [ ] One-time badge purchases (£15-50)
- [ ] Process Doc badge: £25
- [ ] Multiplayer badge: £50
- [ ] AI-Native badge: £100

---

## 🔗 Phase 5: Integrations (Month 6-12)

### **Platform Integrations**
- [ ] Streaming services
  - [ ] Spotify metadata integration
  - [ ] SoundCloud metadata
  - [ ] Apple Music
- [ ] NFT marketplaces
  - [ ] OpenSea metadata
  - [ ] Foundation
  - [ ] Catalog
- [ ] DAW plugins
  - [ ] Ableton Live export script
  - [ ] Logic Pro export
  - [ ] FL Studio integration

### **Blockchain Features**
- [ ] Deploy smart contracts to mainnet (Polygon or Base)
  - [ ] O8Registry contract
  - [ ] O8Token contract (optional)
- [ ] On-chain minting ($1-5 fee)
- [ ] NFT collection of declarations

---

## 🎨 Phase 6: Brand Evolution (Month 12+)

### **Visual Upgrades (v2.0 - 98/100)**
- [ ] Commission custom ∞8 glyph ($200-500)
  - Möbius 8 loop with chain nodes
  - Monoline brutalist style
  - Works at 16px and billboard scale
- [ ] Purchase Söhne font license ($200-500/year)
  - Replace Space Grotesk with Söhne
- [ ] Add subtle glitch/waveform energy to hero
  - PS1 aesthetic vibes
  - Monochrome only

### **Merch System**
- [ ] After 1K declarations: Launch Phase 1 merch
  - [ ] ∞8 ARCH hoodies (black, minimal logo)
  - [ ] ∞8 ARCH tees (white on black, black on white)
  - [ ] Sticker packs (custom glyph)
- [ ] After 10K declarations: Season 1 drop
  - [ ] Limited fashion collection
  - [ ] Artist collaborations
  - [ ] "Declared" badge merch

---

## 📊 Success Metrics

### **Month 1**
- [ ] 100 declarations created
- [ ] 10 showcase tracks in gallery
- [ ] 5 producer testimonials
- [ ] Featured in 1 music production blog/podcast

### **Month 3**
- [ ] 1,000 declarations created
- [ ] First tattoo (∞8 ARCH symbol)
- [ ] 100 Pro subscribers (£800/mo revenue)

### **Month 6**
- [ ] 10,000 declarations created
- [ ] Platform integration (Suno, Udio, or streaming service)
- [ ] 2,000 Pro subscribers (£16K/mo revenue)

### **Year 1**
- [ ] 50,000+ declarations
- [ ] Merch sales launched
- [ ] "∞8 ARCH" becomes verb ("Did you inf8 that track?")

---

## 🐛 Technical Debt & Bug Fixes

- [ ] Fix API route Prisma errors (background warnings)
- [ ] Add error handling for failed IPFS uploads
- [ ] Add loading states for async operations
- [ ] Optimize image assets
- [ ] Add SEO metadata to all pages
- [ ] Set up analytics (PostHog or Plausible)
- [ ] Add rate limiting to API routes
- [ ] Set up monitoring (Sentry or similar)

---

## 📝 Documentation

- [ ] API documentation (for Label tier customers)
- [ ] Declaration schema documentation
- [ ] Integration guides for platforms
- [ ] Video tutorial: Creating your first declaration
- [ ] FAQ page
- [ ] Press kit (logos, screenshots, brand assets)

---

**Last updated:** 2026-02-06
**Current Phase:** MVP Deployment → Suno Integration
**Next Milestone:** 100 declarations

