# IPFS vs ISRC: Provenance Architecture

## Overview

This document explains how **IPFS CID + SHA-256** work in ∞8 ARCH's provenance system and how they relate to traditional music industry identifiers like ISRC.

**TL;DR:** They don't replace each other—they're complementary layers. ISRC identifies recordings for royalty collection; IPFS+SHA-256 proves file integrity and enables decentralized provenance.

---

## What They Are

### IPFS CID (Content Identifier)

```
Example: Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD
Or: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

**Properties:**
- **Content-addressed** - The hash IS the address
- **Immutable** - If file changes, CID changes
- **Decentralized** - Stored across IPFS network
- **Permanent** - Can't be deleted (while pinned)

**In ∞8 ARCH:**
- Points to actual audio file (master, stems, samples)
- Enables verifiable playback
- Supports derivative tracking
- NFT metadata references

### SHA-256 Hash

```
Example: a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a
```

**Properties:**
- **Cryptographic fingerprint** of audio file
- **Collision-resistant** - Virtually impossible to fake
- **Deterministic** - Same file = same hash
- **Tamper-evident** - One bit change = different hash

**In ∞8 ARCH:**
- Proves file integrity
- Audio fingerprinting
- Copyright dispute evidence
- Version control

### ISRC (International Standard Recording Code)

```
Example: USRC17607839
         ││││└──────── Recording number
         │││└────────── Year of reference
         ││└─────────── Registrant code
         └└──────────── Country code
```

**Properties:**
- Centralized database (recording industry)
- Manually registered
- Points to metadata (title, artist, duration)
- Does NOT point to actual file
- Does NOT prove possession
- Does NOT prevent tampering

**Used for:**
- Radio play tracking
- Streaming royalties
- PRO distributions (ASCAP, BMI, SESAC)

---

## Comparison Matrix

| Feature | IPFS CID + SHA-256 | ISRC |
|---------|-------------------|------|
| **Purpose** | File provenance & integrity | Recording identification |
| **Storage** | Decentralized (IPFS network) | Centralized (industry database) |
| **Registration** | Automatic (cryptographic) | Manual (申请 required) |
| **Points to** | Actual audio file | Metadata only |
| **Proves possession** | ✅ Yes (file + timestamp) | ❌ No |
| **Tamper-proof** | ✅ Yes (hash verification) | ❌ No |
| **Royalty collection** | 🔄 Future (smart contracts) | ✅ Yes (current system) |
| **Derivative tracking** | ✅ Yes (parent CID references) | ❌ No |
| **NFT minting** | ✅ Yes (permanent metadata) | ❌ No |
| **Copyright disputes** | ✅ Yes (blockchain timestamp) | 🔄 Limited (registration date) |
| **Cost** | Free (gas fees only) | Varies (registration fees) |
| **Immutable** | ✅ Yes | ❌ No (can be updated) |

---

## How They Work Together (Layers)

```
┌─────────────────────────────────────────────────┐
│  TRADITIONAL LAYER (Royalty Collection)         │
├─────────────────────────────────────────────────┤
│  ISRC: USRC17607839                             │
│  ISWC: T-345.246.800-1                          │
│  PRO: ASCAP Member #123456                      │
│                                                  │
│  → Tracks: Radio plays, streams, performances   │
│  → Pays: Via centralized systems (quarterly)    │
└─────────────────────────────────────────────────┘
                      ↓
         These identify the RECORDING
                      ↓
┌─────────────────────────────────────────────────┐
│  PROVENANCE LAYER (∞8 ARCH)                     │
├─────────────────────────────────────────────────┤
│  IPFS CID: Qmf412jQ...                          │
│  SHA-256: a7ffc6f8bf1...                        │
│  Declaration ID: ∞8-cm5x8k2...                  │
│  Parent CID: Qmf987xY... (if derivative)        │
│                                                  │
│  → Proves: This exact file, this exact date     │
│  → Tracks: Creative lineage, tool usage, AI%    │
│  → Enables: Smart contract splits, NFTs         │
└─────────────────────────────────────────────────┘
                      ↓
         These verify the FILE & PROCESS
                      ↓
┌─────────────────────────────────────────────────┐
│  BLOCKCHAIN LAYER (On-chain Settlement)         │
├─────────────────────────────────────────────────┤
│  NFT Token ID: #42                              │
│  Contract: 0x742d35Cc...                        │
│  Smart Contract Splits:                         │
│    → Artist A: 60%                              │
│    → Producer B: 30%                            │
│    → Engineer C: 10%                            │
│                                                  │
│  → Revenue: Instant, automatic, transparent     │
└─────────────────────────────────────────────────┘
```

---

## Real-World Use Cases

### 1. Copyright Dispute Resolution

**Old way (ISRC only):**
```
Artist A: "I made this track"
Artist B: "No, I made it first"

Resolution:
- Check ISRC registration dates (can be backdated)
- Check upload dates (easily faked)
- Expensive legal battle
- Months/years to resolve
```

**New way (IPFS + SHA-256 + Blockchain):**
```
Artist A's declaration:
- IPFS CID: Qmf412... (uploaded Feb 1, 2024)
- SHA-256: a7ffc6f8... (proves exact file)
- Blockchain timestamp: Feb 1, 2024, 3:42 PM UTC
- Immutable, timestamped, public

Artist B's claim:
- No matching hash
- No earlier blockchain timestamp
- Case closed in minutes, not months
```

### 2. Sample Clearance

**Old way:**
```
Producer: "Did I clear this sample?"
Label: "We need proof of rights"

Process:
- Dig through emails
- Find contract paperwork
- Hope you have documentation
- Pay lawyer to verify
```

**New way:**
```
Declaration shows:
- Parent CID: Qmf987... (original sample)
- Parent relation: "sample"
- Rights granted: remixRights: true
- Smart contract: Auto-splits to original artist

Verification:
- Check parent declaration
- Verify rights = true
- Revenue auto-splits on-chain
- Instant, transparent, permanent
```

### 3. Derivative Works & Lineage

**Example: Suno → Ableton → Final Master**

```
Version 1: Pure Suno
├─ IPFS CID: QmfABC123... (Suno output)
├─ SHA-256: abc123...
└─ Declaration: "100% AI, Suno v4"

Version 2: Ableton Mix
├─ IPFS CID: QmfDEF456... (Ableton bounce)
├─ SHA-256: def456...
├─ Parent CID: QmfABC123... (references v1)
└─ Declaration: "52% AI, added human mixing"

Version 3: Final Master
├─ IPFS CID: QmfGHI789... (mastered file)
├─ SHA-256: ghi789...
├─ Parent CID: QmfDEF456... (references v2)
└─ Declaration: "46% AI, professional mastering"
```

**Benefits:**
- ✅ Full lineage visible on-chain
- ✅ Each version has immutable proof
- ✅ Can't claim v3 without showing v1 & v2
- ✅ Transparency score increases with documentation
- ✅ NFT buyers see full creative journey

### 4. NFT Minting

**Bad (centralized server):**
```json
{
  "name": "My Track NFT",
  "image": "https://myserver.com/art.jpg",
  "audio": "https://myserver.com/track.mp3"
}
```
❌ Server goes down = NFT broken
❌ Owner can change files (rug pull)
❌ No provenance proof

**Good (∞8 ARCH + IPFS):**
```json
{
  "name": "My Track NFT",
  "image": "ipfs://QmfABC.../art.jpg",
  "audio": "ipfs://QmfDEF.../track.mp3",
  "sha256": "a7ffc6f8bf1...",
  "declaration": "ipfs://QmfGHI.../declaration.json",
  "provenance": {
    "transparencyScore": 95,
    "aiContribution": 46,
    "lineage": ["QmfV1...", "QmfV2...", "QmfV3..."]
  }
}
```
✅ Permanent (IPFS distributed storage)
✅ Immutable (CID = hash of content)
✅ Verifiable (SHA-256 proves integrity)
✅ Provenance (full creative history)

---

## Future Scenarios

### Scenario 1: AI-Generated Sample Pack

```
Artist releases "Neo-Soul Drums Vol. 1"
- 100 Suno-generated drum loops
- Each loop has IPFS CID + SHA-256
- License: "Free to use, 5% split if commercial"

Producer uses Loop #42:
- References parent CID in declaration
- Smart contract auto-sends 5% royalties
- No paperwork, no lawyers, instant settlement
```

### Scenario 2: Remix Chain

```
Original Track (Artist A)
└─ Remix v1 (Artist B) → 10% to A
   └─ Remix v2 (Artist C) → 5% to A, 5% to B
      └─ Remix v3 (Artist D) → 3% to A, 3% to B, 4% to C

Smart contract propagates splits automatically
IPFS CID proves each version's source
No disputes, full transparency
```

### Scenario 3: Streaming Royalties (Future)

```
Current: Spotify → PRO → Publisher → Artist
         (90 days, 30% fees)

Future:  Streaming → Smart Contract → Artists
         (instant, <1% fees)

How:
- Track has IPFS CID + Declaration
- Smart contract knows splits (verified on-chain)
- Every stream = instant micropayment to all collaborators
- No middlemen, full transparency
```

---

## Key Concepts

### Content Addressing (IPFS)

**Traditional addressing:**
```
https://server.com/tracks/mysong.mp3
         └─ Location-based (where it is)
```
Problem: If server moves/dies, link breaks

**Content addressing:**
```
ipfs://Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD
       └─ Content-based (what it is)
```
Solution: Hash of content IS the address. Find it anywhere.

### Immutability

**IPFS CID changes if content changes:**
```
Original file: "mysong.mp3" → Qmf412...
Changed file:  "mysong.mp3" → QmfXYZ... (different CID!)
```

This is a **feature**, not a bug:
- Can't tamper with files without detection
- Version history is automatic
- "v1 → v2 → v3" all have different CIDs

### Tamper Evidence (SHA-256)

**One bit change = completely different hash:**
```
File A: "Hello World"
SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

File B: "Hello World!" (added !)
SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                                                         └─ Completely different
```

This proves file integrity:
- Can't claim you had a different version
- Can't modify declaration retroactively
- Blockchain timestamp locks it permanently

---

## Evolution Path

### Phase 1: Now (2024-2025)
**Use both systems:**
- ISRC for streaming royalties (Spotify, Apple Music)
- ∞8 ARCH for provenance (NFTs, copyright disputes, derivatives)

### Phase 2: Mid-term (2025-2027)
**Some platforms adopt smart contracts:**
- New streaming platforms accept declarations for payment
- NFT marketplaces require IPFS CID + provenance
- Sample packs use smart contract licensing

### Phase 3: Long-term (2027+)
**Smart contracts replace PROs:**
- Direct artist-to-fan streaming with instant splits
- AI training datasets require provenance proof
- Copyright system rebuilt on blockchain

---

## Technical Implementation

### How ∞8 ARCH Uses IPFS + SHA-256

**1. Upload audio to Pinata (IPFS pinning service):**
```typescript
const cid = await uploadToPinata(audioFile);
// Returns: "Qmf412jQZiuVUtdgnB36..."
```

**2. Compute SHA-256 hash:**
```typescript
const sha256 = await computeSHA256(audioFile);
// Returns: "a7ffc6f8bf1ed76651..."
```

**3. Save to declaration:**
```typescript
await prisma.declaration.create({
  data: {
    ipfsCID: cid,
    sha256: sha256,
    // ... other fields
  }
});
```

**4. Mint on-chain (optional):**
```solidity
function mintDeclaration(
  string memory ipfsCID,
  bytes32 sha256Hash,
  uint8 transparencyScore
) external {
  // Stores CID + hash on blockchain
  // Enables smart contract verification
}
```

### Verification Flow

**Anyone can verify authenticity:**

```bash
# 1. Fetch file from IPFS
ipfs get Qmf412jQZiuVUtdgnB36...

# 2. Compute SHA-256
sha256sum downloaded_file.mp3
# Output: a7ffc6f8bf1ed76651...

# 3. Compare with declaration
# If hashes match → File is authentic
# If hashes differ → File was tampered with
```

---

## Analogies

### ISRC = Social Security Number
- Identifies you in the old system
- Centralized registry
- Doesn't prove anything about you

### IPFS CID = DNA
- Proves this exact person/file
- Unique identifier
- Can't be faked

### SHA-256 = Fingerprint
- Unique pattern
- Tamper-evident
- Used for verification

### Declaration = Resume
- Full work history
- Shows evolution
- Proves experience

---

## Conclusion

**∞8 ARCH is NOT replacing ISRC/PROs (yet)**

**It's creating a NEW layer:**
- Provenance proof (IPFS + SHA-256 + blockchain)
- Creative lineage (parent → child relationships)
- Smart contract splits (instant, transparent revenue)
- NFT minting (permanent, verifiable metadata)

**Vision:**
Build the infrastructure for **post-streaming music economy** where:
- ✅ Artists control provenance
- ✅ Splits are automatic
- ✅ AI transparency is expected
- ✅ Derivatives respect lineage
- ✅ Revenue flows directly to creators

**Both systems can coexist:**
- Use ISRC for legacy streaming platforms
- Use ∞8 ARCH for everything else
- Eventually, smart contracts handle it all

---

## Further Reading

- [IPFS Documentation](https://docs.ipfs.tech/)
- [SHA-256 Specification](https://en.wikipedia.org/wiki/SHA-2)
- [ISRC Handbook](https://www.usisrc.org/)
- [Music Modernization Act](https://www.copyright.gov/music-modernization/)
- [Smart Contracts for Music Rights](https://medium.com/ujo-music)

---

*Last updated: 2024-02-06*
*Part of ∞8 ARCH — Creative Provenance Protocol*
