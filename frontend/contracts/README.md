# ∞8 ARCH Revenue System

Smart contracts for instant, transparent revenue distribution with derivative royalty propagation.

## Overview

The revenue system consists of two main contracts:

1. **RevenueRouter** - Central hub for receiving and routing revenue
2. **SplitDistributor** - Per-declaration contract that handles split distribution

## Key Features

✅ **Instant Settlement** - Revenue distributed in <1 second
✅ **Transparent** - All splits visible on-chain
✅ **Automatic Splits** - No manual calculation needed
✅ **Derivative Support** - Parent royalties propagate automatically
✅ **Low Fees** - 1% platform fee (adjustable, max 5%)
✅ **Multi-Source** - Streaming, NFTs, licensing, tips

---

## Contract Architecture

```
┌─────────────────────────────────────────────────────┐
│  RevenueRouter (Singleton)                          │
│                                                      │
│  • Receives all revenue                             │
│  • Takes 1% platform fee                            │
│  • Routes to declaration's SplitDistributor         │
│  • Tracks stats (total received, tx count)          │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Routes revenue to...
                   ↓
┌─────────────────────────────────────────────────────┐
│  SplitDistributor (Per-Declaration)                 │
│                                                      │
│  • Receives 99% of revenue (after platform fee)     │
│  • Sends parent royalty (if derivative work)        │
│  • Distributes remainder to collaborators           │
│  • Example splits:                                  │
│    → Artist: 60%                                    │
│    → Producer: 30%                                  │
│    → Engineer: 10%                                  │
└─────────────────────────────────────────────────────┘
```

---

## Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in:

```bash
# Required
DEPLOYER_PRIVATE_KEY="your_private_key"
MUMBAI_RPC_URL="https://rpc-mumbai.maticvigil.com"

# Optional (for verification)
POLYGONSCAN_API_KEY="your_api_key"
```

### 3. Deploy to Testnet

```bash
npm run deploy:mumbai
```

This will:
- Deploy RevenueRouter contract
- Deploy a test SplitDistributor (60/30/10 split)
- Register the split contract
- Send a test payment (0.01 ETH)
- Display contract addresses

### 4. Save Contract Addresses

Update your `.env` file:

```bash
NEXT_PUBLIC_REVENUE_ROUTER_ADDRESS="0x..."
```

---

## Usage Examples

### Scenario 1: Simple Payment (No Derivatives)

**Setup:**
- Artist creates declaration "Midnight Dreams"
- Splits: Artist 70%, Producer 30%
- No parent declaration

**Flow:**
```
Fan pays 1.0 ETH
  ↓
RevenueRouter takes 0.01 ETH (1% fee)
  ↓
SplitDistributor receives 0.99 ETH
  ↓
Artist gets 0.693 ETH (70% of 0.99)
Producer gets 0.297 ETH (30% of 0.99)
```

**Code:**
```typescript
await revenueRouter.sendRevenue(
  "∞8-cm5x8k2...",
  "streaming",
  { value: ethers.parseEther("1.0") }
);
```

### Scenario 2: Derivative Work (With Parent Royalties)

**Setup:**
- Original track: "Sunset Vibes" by Artist A
- Remix: "Sunset Vibes (Club Mix)" by Artist B
- Remix owes 15% royalty to original

**Flow:**
```
Fan pays 1.0 ETH to remix
  ↓
RevenueRouter takes 0.01 ETH (1% fee)
  ↓
Remix SplitDistributor receives 0.99 ETH
  ↓
Parent gets 0.1485 ETH (15% of 0.99)
  ↓
  └→ Original SplitDistributor distributes to Artist A
  ↓
Remix Artist B gets 0.8415 ETH (85% of 0.99)
```

**Contract Setup:**
```typescript
// Deploy original work's split contract
const originalSplit = await SplitDistributor.deploy(
  "∞8-original",
  [{ recipient: artistA, percentage: 10000, role: "artist" }],
  ethers.ZeroAddress,
  0
);

// Deploy remix's split contract (with parent reference)
const remixSplit = await SplitDistributor.deploy(
  "∞8-remix",
  [{ recipient: artistB, percentage: 8500, role: "artist" }],
  await originalSplit.getAddress(), // Parent contract
  1500 // 15% to parent
);
```

### Scenario 3: Multi-Collaborator Track

**Setup:**
- Track: "Collaborative Dream"
- Artist: 50%
- Producer: 30%
- Engineer: 15%
- Session Musician: 5%

**Flow:**
```
Fan pays 1.0 ETH
  ↓
RevenueRouter takes 0.01 ETH (1% fee)
  ↓
SplitDistributor receives 0.99 ETH
  ↓
Artist gets 0.495 ETH (50%)
Producer gets 0.297 ETH (30%)
Engineer gets 0.1485 ETH (15%)
Musician gets 0.0495 ETH (5%)
```

**Contract Setup:**
```typescript
const split = await SplitDistributor.deploy(
  "∞8-collab",
  [
    { recipient: artist, percentage: 5000, role: "artist" },
    { recipient: producer, percentage: 3000, role: "producer" },
    { recipient: engineer, percentage: 1500, role: "engineer" },
    { recipient: musician, percentage: 500, role: "musician" }
  ],
  ethers.ZeroAddress,
  0
);
```

---

## Revenue Sources

The system supports multiple revenue types:

| Source | Description | Typical Use |
|--------|-------------|-------------|
| `streaming` | Per-stream payments | Future streaming platforms |
| `nft` | NFT sales | Primary + secondary sales |
| `license` | Sample licensing | Sample pack usage |
| `tip` | Direct fan support | Patreon-style tips |
| `training` | AI training license | AI dataset licensing |
| `derivative` | Derivative royalties | Remix/cover royalties |

**Example:**
```typescript
// Streaming payment
await revenueRouter.sendRevenue(declarationId, "streaming", { value: amount });

// NFT sale
await revenueRouter.sendRevenue(declarationId, "nft", { value: salePrice });

// License fee
await revenueRouter.sendRevenue(declarationId, "license", { value: licensePrice });
```

---

## Testing

Run the comprehensive test suite:

```bash
npm run test:contracts
```

Tests cover:
- ✅ Basic revenue distribution
- ✅ Platform fee collection
- ✅ Multi-recipient splits
- ✅ Derivative royalty propagation
- ✅ Revenue stats tracking
- ✅ Edge cases (zero amounts, missing contracts)
- ✅ Access control (only owner can change fees)

---

## Security Features

### ReentrancyGuard
Both contracts use OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks during fund distribution.

### Ownable
RevenueRouter is Ownable, restricting sensitive functions:
- `registerSplitContract()` - Only owner can register new splits
- `setPlatformFee()` - Only owner can change fees (max 5%)
- `setPlatformTreasury()` - Only owner can update treasury

### Immutable Splits
Once a SplitDistributor is deployed, the split percentages are immutable. This ensures:
- Artists can't be rug-pulled
- Collaborators are guaranteed their share
- Provenance remains trustworthy

### Validation
- Split percentages must total 100% (minus parent %)
- All recipients must be valid addresses
- Platform fee capped at 5%
- Zero-amount payments rejected

---

## Gas Optimization

### Cost Breakdown (Polygon)

| Action | Gas Used | Cost @ 100 gwei | USD @ $0.50 MATIC |
|--------|----------|-----------------|-------------------|
| Deploy RevenueRouter | ~1.2M | 0.12 MATIC | $0.06 |
| Deploy SplitDistributor | ~500K | 0.05 MATIC | $0.025 |
| Send Revenue (2 recipients) | ~80K | 0.008 MATIC | $0.004 |
| Send Revenue (4 recipients) | ~120K | 0.012 MATIC | $0.006 |

**Total cost to send payment: ~$0.004** (400x cheaper than traditional banking)

### Optimization Strategies
- Batch payments where possible
- Use Layer 2 (Polygon, Base) for low gas
- Auto-distribute on receive (no extra tx needed)
- Efficient loops in split distribution

---

## Roadmap

### Phase 1: Foundation ✅
- [x] RevenueRouter contract
- [x] SplitDistributor contract
- [x] Comprehensive tests
- [x] Mumbai testnet deployment

### Phase 2: Integration (Current)
- [ ] Frontend integration (send payment UI)
- [ ] Revenue dashboard (track earnings)
- [ ] Declaration → SplitDistributor linking
- [ ] Wallet balance display

### Phase 3: Advanced Features
- [ ] Stablecoin support (USDC, USDT)
- [ ] Multi-chain deployment (Base, Arbitrum)
- [ ] Gasless payments (meta-transactions)
- [ ] Revenue streaming (continuous payments)

### Phase 4: Ecosystem
- [ ] Sample marketplace integration
- [ ] Streaming platform partnerships
- [ ] AI dataset licensing
- [ ] Cross-platform revenue aggregation

---

## API Reference

### RevenueRouter

#### `sendRevenue(declarationId, source)`
Send revenue to a declaration with instant distribution.

**Parameters:**
- `declarationId` (string) - The ∞8 declaration ID
- `source` (string) - Revenue source type

**Requires:** ETH payment via `msg.value`

**Emits:** `RevenueReceived(declarationId, payer, amount, source)`

#### `getRevenueStats(declarationId)`
Get cumulative revenue stats for a declaration.

**Returns:**
- `totalReceived` (uint256) - Total ETH received (including fees)
- `totalDistributed` (uint256) - Total ETH distributed to artists
- `transactionCount` (uint256) - Number of payments

#### `setPlatformFee(feeBps)`
Update the platform fee (only owner).

**Parameters:**
- `feeBps` (uint256) - Fee in basis points (100 = 1%, max 500 = 5%)

### SplitDistributor

#### `getSplits()`
Get the split configuration.

**Returns:**
Array of Split structs:
- `recipient` (address) - Recipient wallet
- `percentage` (uint256) - Share in basis points
- `role` (string) - Role description

#### `distribute()`
Manually trigger distribution (usually auto-called on receive).

**Note:** This is automatically called when the contract receives ETH.

---

## FAQ

**Q: Can I change splits after deployment?**
A: No, splits are immutable once deployed. This ensures trust and provenance integrity.

**Q: What happens if a recipient wallet is compromised?**
A: They would need to deploy a new SplitDistributor with updated addresses. Past revenue is permanent.

**Q: Can I use stablecoins instead of ETH?**
A: Phase 3 will add USDC/USDT support. Currently ETH only.

**Q: What's the minimum payment amount?**
A: No minimum, but payments below 0.0001 ETH may cost more in gas than the value sent.

**Q: How do I verify contracts on Polygonscan?**
A:
```bash
npx hardhat verify --network mumbai DEPLOYED_ADDRESS "CONSTRUCTOR_ARGS"
```

**Q: Can I test locally without deploying?**
A: Yes:
```bash
npx hardhat node  # Start local node
npm run test:contracts  # Run tests
```

---

## Support

- **Documentation:** [INSTANT_REVENUE_PLAN.md](../INSTANT_REVENUE_PLAN.md)
- **Architecture:** [IPFS_vs_ISRC.md](../IPFS_vs_ISRC.md)
- **Issues:** [GitHub Issues](https://github.com/your-org/infinity8/issues)

---

*Last updated: 2026-02-06*
*Part of ∞8 ARCH — Creative Provenance Protocol*
