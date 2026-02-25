# o8 Gaming GTM: Sonic Identity for Games

**Date:** 2026-02-07
**Focus:** Gaming as Primary Vertical
**Tagline:** "100 hours of consistent music. No licensing nightmare."

---

## The Opportunity

### The Pain Point

| Problem | Reality | Cost |
|---------|---------|------|
| **Licensing Hell** | AAA games need 100+ hours of music. Each track = legal clearance. | 30% of audio budget (~$9M per AAA) |
| **Consistency Gap** | Procedural/adaptive music lacks aesthetic coherence | Player immersion breaks |
| **AI Uncertainty** | Studios want AI-generated music but fear lawsuits | Legal paralysis |
| **No Identity Standard** | "Make it sound like our game" has no quantifiable spec | Endless revision cycles |

### The Solution

> **Sonic Identity Profile:** A quantified, licensable aesthetic DNA that AI can generate against—with full provenance.

```
Studio defines Sonic Identity (genre, energy, palette)
    ↓
AI generates music matching that identity
    ↓
All output stamped with o8 provenance
    ↓
Clear attribution, no legal ambiguity
```

---

## Market Sizing

### Total Market

| Segment | Count | Avg Audio Budget | Total |
|---------|-------|------------------|-------|
| AAA Studios | 50 | $30M | $1.5B |
| AA Studios | 200 | $5M | $1.0B |
| Indie (funded) | 5,000 | $100K | $500M |
| Indie (bootstrap) | 50,000 | $10K | $500M |
| **Total Audio Market** | | | **$3.5B** |

### Our Addressable (Sonic Identity Layer)

| Segment | % Addressable | Value |
|---------|---------------|-------|
| AAA | 10% of audio budget | $150M |
| AA | 15% of audio budget | $150M |
| Indie (funded) | 20% of audio budget | $100M |
| Indie (bootstrap) | 10% of audio budget | $50M |
| **SAM** | | **$450M** |

### Year 1-5 Target

| Year | Clients | Avg Deal | Revenue |
|------|---------|----------|---------|
| 1 | 5 pilots | $50K | $250K |
| 2 | 25 | $75K | $1.9M |
| 3 | 75 | $100K | $7.5M |
| 5 | 200 | $150K | $30M |

---

## Product: Game Sonic Identity Console

### What It Is

A web console where game studios:
1. **Define** their game's Sonic Identity Profile
2. **Generate** AI music that matches the identity
3. **Verify** all output with o8 provenance
4. **Integrate** via SDK into Unity/Unreal/Wwise/FMOD

### Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Identity Builder** | Define sonic palette, energy curves, genre constraints | P0 |
| **Reference Tracks** | Upload 5-10 tracks that define "your sound" | P0 |
| **DNA Extraction** | Auto-generate Sonic Identity from references (via Starforge) | P0 |
| **AI Generation** | Generate music matching identity (MusicGen/partner API) | P1 |
| **Provenance Stamp** | All output stamped with o8 declaration | P0 |
| **Export** | Download stems + provenance metadata | P0 |

### Phase 2 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Unity SDK** | Runtime identity + provenance in-engine | P1 |
| **Unreal SDK** | Same for Unreal | P1 |
| **Wwise Integration** | Middleware plugin | P2 |
| **FMOD Integration** | Middleware plugin | P2 |
| **Adaptive Music** | Real-time generation matching game state | P2 |
| **Voice Identity** | Character voice DNA (via Chromox) | P2 |

---

## Integration Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    GAME STUDIO WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DEFINE                    2. GENERATE                    │
│  ┌─────────────────────┐     ┌─────────────────────┐        │
│  │ Game Sonic Identity │     │ AI Music Generation │        │
│  │ Console (Web App)   │────►│ (MusicGen / Partner)│        │
│  │                     │     │                     │        │
│  │ • Genre: Dark Synth │     │ • 100+ hours output │        │
│  │ • BPM: 80-120       │     │ • Matches identity  │        │
│  │ • Energy: Tense     │     │ • Stems available   │        │
│  │ • Reference tracks  │     │                     │        │
│  └─────────────────────┘     └──────────┬──────────┘        │
│                                         │                    │
│  3. VERIFY                              │                    │
│  ┌─────────────────────┐               │                    │
│  │ o8 Provenance Layer │◄──────────────┘                    │
│  │                     │                                     │
│  │ • Identity hash     │                                     │
│  │ • Generation params │                                     │
│  │ • Timestamp         │                                     │
│  │ • License terms     │                                     │
│  └──────────┬──────────┘                                     │
│             │                                                │
│  4. INTEGRATE                                                │
│  ┌──────────▼──────────┐                                     │
│  │ Game Engine / DAW   │                                     │
│  │                     │                                     │
│  │ • Unity SDK         │                                     │
│  │ • Unreal SDK        │                                     │
│  │ • Wwise plugin      │                                     │
│  │ • FMOD plugin       │                                     │
│  └─────────────────────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Technical Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Console Frontend** | Next.js / React | Same stack as o8 frontend |
| **Identity API** | Node.js + Starforge DNA | Existing infrastructure |
| **AI Generation** | MusicGen API / Replicate | Partner, don't build |
| **Provenance** | o8 declarations + IPFS | Existing infrastructure |
| **Unity SDK** | C# package | New build |
| **Unreal SDK** | C++ plugin | New build |

---

## Go-To-Market

### Target Segments (Priority Order)

#### Tier 1: Indie Studios (Funded)
- **Profile:** $1-10M budget, 10-50 person team, shipping in 12-24 months
- **Pain:** Can't afford composer for 20+ hours of music. AI is attractive but risky.
- **Deal Size:** $20-50K
- **Sales Cycle:** 2-4 weeks
- **Volume:** 100+ potential clients

#### Tier 2: AA Studios
- **Profile:** $10-50M budget, 50-200 person team, established IP
- **Pain:** Need 50+ hours of adaptive music. Licensing is a nightmare.
- **Deal Size:** $75-150K
- **Sales Cycle:** 2-3 months
- **Volume:** 50+ potential clients

#### Tier 3: AAA Studios (Later)
- **Profile:** $100M+ budget, 500+ person team
- **Pain:** Legal risk of AI. Need enterprise-grade provenance.
- **Deal Size:** $250K-1M
- **Sales Cycle:** 6-12 months
- **Volume:** 20 potential clients

### Channel Strategy

| Channel | Approach | Timeline |
|---------|----------|----------|
| **Direct Outreach** | LinkedIn, email to audio directors | Month 1-3 |
| **Game Dev Communities** | Reddit, Discord, game dev forums | Month 1-6 |
| **Conferences** | GDC, PAX Dev, Game Audio Network Guild | Month 6-12 |
| **Middleware Partners** | Wwise, FMOD co-marketing | Month 6-12 |
| **Engine Marketplaces** | Unity Asset Store, Unreal Marketplace | Month 9-12 |

### Target Accounts (First 20)

| Studio | Game | Why Target |
|--------|------|------------|
| Supergiant Games | Hades follow-up | Known for distinctive audio |
| Klei Entertainment | Don't Starve universe | Procedural games, need adaptive music |
| Devolver Digital portfolio | Various | Indie publisher, 20+ studios |
| Raw Fury portfolio | Various | Indie publisher, cares about quality |
| Annapurna Interactive | Various | Premium indie, audio-focused |
| Team Cherry | Silksong | Massive indie, long dev cycle |
| Motion Twin | Dead Cells follow-up | Procedural, adaptive music |
| Subset Games | Into the Breach follow-up | Minimalist but distinctive |
| Mega Crit | Slay the Spire 2 | Roguelike, procedural |
| Hopoo Games | Risk of Rain 3 | Procedural, needs hours of music |

---

## Pricing

### Model: Annual License + Usage

| Tier | Annual Fee | Included | Overage |
|------|------------|----------|---------|
| **Indie** | $10K/yr | 10 hours generated, 1 game | $500/hr |
| **Pro** | $50K/yr | 50 hours generated, 3 games | $400/hr |
| **Studio** | $150K/yr | Unlimited generation, unlimited games | - |
| **Enterprise** | Custom | Custom SLA, dedicated support | - |

### What's Included

- Sonic Identity Profile creation
- AI music generation (via partner)
- Full o8 provenance on all output
- Stems + metadata export
- Basic Unity/Unreal SDK
- Email support

### Add-Ons

| Add-On | Price | Description |
|--------|-------|-------------|
| Voice Identity | +$10K/yr | Character voice DNA (Chromox) |
| Wwise Integration | +$5K/yr | Full middleware plugin |
| FMOD Integration | +$5K/yr | Full middleware plugin |
| Custom Training | +$25K | Fine-tune on your existing music |
| On-Site Workshop | +$10K | Team training, identity definition |

---

## 12-Month Roadmap

### Q1: Foundation (Month 1-3)

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1-2 | Sonic Identity schema | JSON spec for game audio identity |
| 3-4 | Console wireframes | Figma designs |
| 5-6 | Console MVP backend | Identity API + Starforge integration |
| 7-8 | Console MVP frontend | Working web app |
| 9-10 | AI generation integration | MusicGen/Replicate connected |
| 11-12 | Provenance integration | o8 stamps on all output |

**Exit Criteria:** Working console that can define identity, generate music, stamp provenance.

### Q2: Pilots (Month 4-6)

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 13-14 | Beta launch | 10 indie studios invited |
| 15-16 | Outbound campaign | 50 studios contacted |
| 17-18 | First pilot signed | $20-50K committed |
| 19-20 | Pilot delivery | Music generated for first game |
| 21-22 | Second pilot signed | $20-50K committed |
| 23-24 | Case study | Published results from Pilot 1 |

**Exit Criteria:** 3 signed pilots, $100K+ committed, 1 case study published.

### Q3: SDK & Scale (Month 7-9)

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 25-28 | Unity SDK alpha | Basic integration working |
| 29-32 | Unreal SDK alpha | Basic integration working |
| 33-36 | Public launch | Console open to all |

**Exit Criteria:** SDKs in alpha, 10+ paying customers, $250K+ revenue.

### Q4: Middleware & Growth (Month 10-12)

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 37-40 | Wwise plugin beta | Integration working |
| 41-44 | FMOD plugin beta | Integration working |
| 45-48 | GDC prep | Demo, booth, talks submitted |

**Exit Criteria:** Middleware integrations, 25+ paying customers, $500K+ revenue.

---

## Team Required

### Phase 1 (Month 1-6): 4 people

| Role | Responsibility | Existing? |
|------|----------------|-----------|
| **Product/Founder** | Strategy, sales, customer dev | Yes |
| **Full-Stack Engineer** | Console, API, integrations | Need 1 |
| **ML Engineer** | Starforge DNA, generation pipeline | Partial (Starforge exists) |
| **Designer** | Console UX, marketing | Need 1 |

### Phase 2 (Month 6-12): +2 people

| Role | Responsibility | Existing? |
|------|----------------|-----------|
| **Game Engine Engineer** | Unity/Unreal SDKs | Need 1 |
| **Sales/BD** | Outbound, partnerships | Need 1 |

### Total Year 1: 6 people

---

## Success Metrics

### Month 6 Checkpoint

| Metric | Target | Validation |
|--------|--------|------------|
| **Pilots Signed** | 3 | Revenue model works |
| **Revenue Committed** | $100K+ | Pricing validated |
| **Studios in Pipeline** | 20+ | Demand exists |
| **Music Generated** | 50+ hours | Product works |
| **Provenance Stamps** | 500+ | Infrastructure works |

### Month 12 Checkpoint

| Metric | Target | Validation |
|--------|--------|------------|
| **Paying Customers** | 25 | Product-market fit |
| **ARR** | $500K | Business viable |
| **SDK Installs** | 100+ | Integration works |
| **Case Studies** | 3 | Social proof |
| **GDC Presence** | Booth/talk | Industry recognition |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **AI music quality insufficient** | Medium | High | Use best-in-class models (MusicGen); offer hybrid workflow |
| **Studios build in-house** | Low | Medium | Focus on provenance (legal value) not just generation |
| **Slow sales cycles** | High | Medium | Start with indie (fast cycles), work up to AA/AAA |
| **Middleware resistance** | Medium | Medium | Build direct engine integration first; middleware is nice-to-have |
| **Legal challenges to AI music** | Medium | High | Provenance is the solution; we're positioned well |

---

## Competitive Positioning

### Who Else Is Here?

| Player | What They Do | Our Advantage |
|--------|--------------|---------------|
| **Epidemic Sound** | Licensed music library | We're generative + identity-matched |
| **AIVA** | AI composition | No provenance, no game integration |
| **Amper (Shutterstock)** | AI music for video | Not game-focused, no identity concept |
| **Soundraw** | AI music generation | No provenance, generic output |
| **In-house composers** | Custom scoring | Expensive, slow, doesn't scale |

### Our Unique Value

1. **Sonic Identity Profile** - Quantified "sound of your game" (no one else has this)
2. **o8 Provenance** - Legal clarity on AI-generated music (no one else has this)
3. **Cross-Domain Ready** - Voice DNA (Chromox) for characters, Visual DNA for world-building (future)
4. **Game-Native** - Built for Unity/Unreal/Wwise/FMOD (not afterthought)

---

## The Pitch

### For Indie Studios

> "You need 20 hours of music that sounds like YOUR game—not stock library generic.
>
> Define your Sonic Identity in 30 minutes. Generate unlimited music that matches. Ship with full legal provenance.
>
> $10K/year. Less than one week of composer time."

### For AA/AAA Studios

> "Your legal team is nervous about AI music. Your audio director wants 100 hours of adaptive content.
>
> Sonic Identity Profile + o8 Provenance = AI-generated music with enterprise-grade attribution.
>
> Every track traced to source identity. Every generation logged. Every license clear."

---

## Implementation Status

### Completed ✅

| Component | Location | Description |
|-----------|----------|-------------|
| **o8 Schema v2.0** | `/src/core/types.v2.ts` | Full TypeScript schema with multi-modal DNA |
| **BOVEDA Converters** | `/src/core/converters.ts` | Bidirectional BOVEDA ↔ o8 conversion |
| **Unified Identity API** | `/src/api/identity.ts` | 11 endpoints, DNA imports from STARFORGE/CLAROSA/CHROMOX |
| **IPFS Service** | `/src/provenance/ipfs-service.ts` | Multi-provider (local, Pinata, Web3.storage) with failover |
| **C2PA Manifests** | `/src/provenance/c2pa-manifest.ts` | C2PA 1.3 spec + o8 extensions (o8.identity, o8.audio_dna) |
| **Provenance API** | `/src/api/provenance.ts` | Stamp, verify, fetch declarations/manifests |
| **Game Console UI** | `burn-the-square/components/console/` | 4-tab console (Sonic Identity, State Matrix, Preview, Export) |
| **React Audio Hook** | `burn-the-square/lib/o8/use-o8-audio.ts` | o8-powered adaptive audio for React |
| **Engine Exports** | `burn-the-square/components/console/` | Unity C#, Unreal C++, Wwise XML, FMOD XML, JSON |

---

## Next Steps

### Phase 1: Production Infrastructure
- [ ] Configure IPFS credentials (Pinata API key, Web3.storage token)
- [ ] Deploy Identity API to hosting (Vercel/Railway/Fly)
- [ ] Deploy Provenance API alongside Identity API
- [ ] End-to-end test: create identity → stamp content → verify on IPFS
- [ ] Set up monitoring and error tracking

### Phase 2: AI Music Generation
- [ ] Evaluate generation APIs (MusicGen, Replicate, Stability Audio)
- [ ] Build generation adapter interface
- [ ] Connect Sonic Identity Profile to generation prompts
- [ ] Auto-stamp all generated output with o8 provenance
- [ ] Implement stem separation for adaptive audio

### Phase 3: Game Sonic Identity Console (Full App)
- [ ] Design console wireframes (Figma)
- [ ] Build authentication/team management
- [ ] Reference track upload with Starforge DNA extraction
- [ ] Visual Sonic Identity builder (sliders, presets, comparisons)
- [ ] Generation queue with preview
- [ ] Export manager with format selection
- [ ] Provenance viewer/verifier

### Phase 4: Engine SDKs
- [ ] **Unity SDK (C#)**
  - [ ] NuGet/UPM package structure
  - [ ] Runtime identity loading
  - [ ] Adaptive audio state machine
  - [ ] Provenance verification
  - [ ] Sample project
- [ ] **Unreal SDK (C++)**
  - [ ] Plugin structure
  - [ ] Blueprint nodes for identity/provenance
  - [ ] MetaSounds integration
  - [ ] Sample project
- [ ] **Wwise Integration**
  - [ ] WAAPI plugin
  - [ ] State-to-RTPC mapping
  - [ ] Provenance metadata in soundbanks
- [ ] **FMOD Integration**
  - [ ] Studio plugin
  - [ ] Parameter automation from identity
  - [ ] Metadata embedding

### Phase 5: Pilot Outreach
- [ ] Build pitch deck with provenance demo
- [ ] Create 2-minute video walkthrough
- [ ] Contact first 10 studios:
  - [ ] Supergiant Games (Hades)
  - [ ] Klei Entertainment (Don't Starve)
  - [ ] Team Cherry (Hollow Knight/Silksong)
  - [ ] Motion Twin (Dead Cells)
  - [ ] Subset Games (Into the Breach)
  - [ ] Mega Crit (Slay the Spire)
  - [ ] Hopoo Games (Risk of Rain)
  - [ ] Devolver Digital (publisher)
  - [ ] Raw Fury (publisher)
  - [ ] Annapurna Interactive (publisher)
- [ ] Schedule demo calls
- [ ] Sign 3 paid pilots ($20-50K each)
- [ ] Publish first case study

---

## Quarterly Milestones

### Q1: Foundation (Current)
| Week | Focus | Exit Criteria |
|------|-------|---------------|
| 1-2 | Schema + Converters | ✅ Complete |
| 3-4 | Identity API | ✅ Complete |
| 5-6 | Provenance Layer | ✅ Complete |
| 7-8 | Production Deploy | API live, IPFS configured |
| 9-10 | AI Generation | MusicGen connected, stamping works |
| 11-12 | Console MVP | Working web app |

### Q2: Pilots
| Week | Focus | Exit Criteria |
|------|-------|---------------|
| 13-14 | Beta launch | 10 studios invited |
| 15-16 | Outbound | 50 studios contacted |
| 17-18 | First pilot | $20-50K signed |
| 19-20 | Delivery | Music generated for pilot |
| 21-24 | Scale | 3 pilots, $100K+ committed |

### Q3: SDKs
| Week | Focus | Exit Criteria |
|------|-------|---------------|
| 25-28 | Unity SDK | Alpha release |
| 29-32 | Unreal SDK | Alpha release |
| 33-36 | Public launch | Console open to all |

### Q4: Middleware & Growth
| Week | Focus | Exit Criteria |
|------|-------|---------------|
| 37-40 | Wwise plugin | Beta release |
| 41-44 | FMOD plugin | Beta release |
| 45-48 | GDC prep | Demo ready, talks submitted |

---

**Document Version:** 1.1
**Last Updated:** 2026-02-07
**Status:** Phase 1 In Progress
