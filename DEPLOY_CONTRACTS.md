# O8 Smart Contract Deployment Guide

Deployment instructions for the O8 protocol smart contracts to Polygon Amoy testnet.

---

## Architecture

Three contracts, deployed in order:

| # | Contract | Type | Constructor Args | Purpose |
|---|----------|------|-----------------|---------|
| 1 | **O8Token** | ERC-20 | None | Rewards token (1M supply, minted to deployer) |
| 2 | **O8Registry** | ERC-721 | None | Track registry with AI transparency + consent |
| 3 | **O8Score** | Read-only | `address _registry` | Badge/scoring engine (reads from O8Registry) |

**Post-deploy step:** Call `O8Token.setRewardsDistributor(O8Registry address)` so the registry can distribute rewards.

All of this is automated in `contracts/scripts/deploy.js`.

---

## Prerequisites

### 1. Get a Polygon Amoy testnet wallet

You need a wallet with testnet MATIC for gas fees.

- Use MetaMask or any EVM wallet
- Export the private key (Settings > Security > Export Private Key)
- Get testnet MATIC from the Polygon faucet: https://faucet.polygon.technology/
  - Select "Amoy" network
  - Paste your wallet address
  - You need approximately 0.5 MATIC for all three contract deployments

### 2. Get an Alchemy API key

- Sign up at https://dashboard.alchemy.com/
- Create a new app: Network = "Polygon Amoy"
- Copy the HTTPS URL (looks like `https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY`)

### 3. Get a Polygonscan API key (for contract verification)

- Sign up at https://polygonscan.com/ (or https://amoy.polygonscan.com/)
- Go to API Keys section
- Create a new API key
- This is optional but recommended -- verified contracts show source code on Polygonscan

---

## Setup

### 1. Create the `.env` file

```bash
cd /home/sphinxy/o8/contracts
cp .env.example .env
```

Edit `.env` with your actual values:

```bash
# Alchemy RPC URL for Polygon Amoy testnet
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_ACTUAL_KEY

# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_actual_private_key_here

# Polygonscan API key for contract verification
POLYGONSCAN_API_KEY=your_actual_polygonscan_key
```

**SECURITY:** Never commit the `.env` file. It is already in `.gitignore`.

### 2. Verify you have testnet MATIC

```bash
cd /home/sphinxy/o8/contracts
npx hardhat console --network amoy
```

Then in the console:
```javascript
const [deployer] = await ethers.getSigners();
const balance = await deployer.provider.getBalance(deployer.address);
console.log("Balance:", ethers.formatEther(balance), "MATIC");
// Should show > 0.1 MATIC
.exit
```

---

## Deploy

### Single command deployment

```bash
cd /home/sphinxy/o8/contracts
npm run deploy:amoy
```

This will:
1. Deploy O8Token (ERC-20, no constructor args)
2. Deploy O8Registry (ERC-721, no constructor args)
3. Deploy O8Score (constructor takes O8Registry address)
4. Call `O8Token.setRewardsDistributor(registryAddress)`
5. Save all addresses to `deployed-addresses-amoy.env`
6. Print Polygonscan verification commands

### Expected output

```
Deploying contracts with account: 0xYourAddress
Account balance: 0.5 MATIC
Network: amoy

1. Deploying O8Token...
   O8Token deployed to: 0x...

2. Deploying O8Registry...
   O8Registry deployed to: 0x...

3. Deploying O8Score...
   O8Score deployed to: 0x...

4. Setting rewards distributor...
   Rewards distributor set to O8Registry: 0x...

════════════════════════════════════════════════════════
  O8 PROTOCOL DEPLOYMENT COMPLETE
════════════════════════════════════════════════════════

Addresses saved to: .../deployed-addresses-amoy.env
```

---

## After Deployment

### 1. Verify contracts on Polygonscan

The deploy script prints the exact commands. Run them one at a time:

```bash
cd /home/sphinxy/o8/contracts

# O8Token (no constructor args)
npx hardhat verify --network amoy 0xTOKEN_ADDRESS

# O8Registry (no constructor args)
npx hardhat verify --network amoy 0xREGISTRY_ADDRESS

# O8Score (constructor arg: registry address)
npx hardhat verify --network amoy 0xSCORE_ADDRESS 0xREGISTRY_ADDRESS
```

### 2. Update the frontend environment

Copy the values from `deployed-addresses-amoy.env` into the frontend:

```bash
# The deploy script creates this file:
cat /home/sphinxy/o8/contracts/deployed-addresses-amoy.env
```

Then add these to `/home/sphinxy/o8/frontend/.env`:

```bash
NEXT_PUBLIC_O8_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_O8_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_O8_SCORE_ADDRESS=0x...
```

And add the Alchemy RPC URL if not already set:

```bash
NEXT_PUBLIC_ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
```

### 3. Update Vercel environment variables (if deployed)

If the frontend is deployed on Vercel, add the same three address variables in:
Vercel Dashboard > Settings > Environment Variables

---

## Contract Details

### O8Token

- **Standard:** ERC-20 (OpenZeppelin v5)
- **Name:** "O8 Token"
- **Symbol:** O8
- **Total Supply:** 1,000,000 O8 (all minted to deployer)
- **Tokenomics:**
  - Artist Rewards Pool: 600,000 O8 (60%)
  - Protocol Treasury: 300,000 O8 (30%)
  - Early Adopter Bonus: 100,000 O8 (10%)
- **Reward amounts:**
  - Human-Crafted badge: 100 O8
  - Transparent disclosure: 50 O8
  - Consent locked: 25 O8
  - Early adopter bonus: 50 O8
- **Key admin function:** `setRewardsDistributor(address)` -- called post-deploy to authorize O8Registry

### O8Registry

- **Standard:** ERC-721 with URI Storage (OpenZeppelin v5)
- **Name:** "O8 Verified Track"
- **Symbol:** O8
- **Features:**
  - `mintTrack()` -- mint a verified track NFT with full CTAD metadata + SOVN consent
  - `setContributorSplits()` -- set revenue splits (must total 10000 basis points = 100%)
  - `lockSplits()` / `lockConsent()` -- permanently lock splits or consent
  - `updateConsent()` -- update AI training/derivative/remix rights
  - `hasPermission()` -- check specific permission by string ("training", "derivative", "remix")
  - `calculateTransparencyScore()` -- pure function, 0-100 score based on AI contribution %
  - `isHumanCrafted()` -- badge check (< 20% AI, transparency >= 80)
- **Reentrancy protected** on `mintTrack()`

### O8Score

- **Type:** Read-only scoring/badge contract
- **Constructor:** Takes O8Registry address (immutable reference)
- **Badge types:** HUMAN_CRAFTED, AI_DISCLOSED, FULL_CONSENT, SOVEREIGN, TRANSPARENT
- **Functions:**
  - `getTrackScore()` -- comprehensive score with all badges
  - `batchGetScores()` -- scores for multiple tracks
  - `filterByBadge()` -- filter token IDs by badge type
  - `getHighTransparencyTracks()` -- filter by transparency threshold

---

## Environment Variables Summary

### For contracts deployment (`/home/sphinxy/o8/contracts/.env`)

| Variable | Required | Where to get |
|----------|----------|-------------|
| `ALCHEMY_AMOY_URL` | Yes | https://dashboard.alchemy.com/ |
| `PRIVATE_KEY` | Yes | Your wallet (MetaMask export) |
| `POLYGONSCAN_API_KEY` | Optional | https://polygonscan.com/apis |

### For frontend (`/home/sphinxy/o8/frontend/.env`)

| Variable | Required | Where to get |
|----------|----------|-------------|
| `NEXT_PUBLIC_O8_REGISTRY_ADDRESS` | Yes | Deploy script output |
| `NEXT_PUBLIC_O8_TOKEN_ADDRESS` | Yes | Deploy script output |
| `NEXT_PUBLIC_O8_SCORE_ADDRESS` | Yes | Deploy script output |
| `NEXT_PUBLIC_ALCHEMY_AMOY_URL` | Yes | https://dashboard.alchemy.com/ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | https://cloud.walletconnect.com/ |

---

## Testing Locally (no testnet MATIC needed)

To test the full deploy flow without real testnet tokens:

```bash
cd /home/sphinxy/o8/contracts
npm run deploy:local
```

This deploys to an in-memory Hardhat node. Useful for verifying the deploy script works before spending testnet gas.

---

## Troubleshooting

### "insufficient funds for gas"
Get more testnet MATIC from https://faucet.polygon.technology/

### "could not detect network"
Check your `ALCHEMY_AMOY_URL` is correct and the Alchemy app is set to Polygon Amoy.

### "missing revert data"
Usually means the RPC endpoint is rate-limited. Wait a minute and retry, or upgrade your Alchemy plan.

### Verification fails with "Already Verified"
The contract was already verified. Check it on https://amoy.polygonscan.com/

### Verification fails with "invalid api key"
Make sure `POLYGONSCAN_API_KEY` in `.env` is from https://polygonscan.com/ (not Etherscan).

---

Last updated: 2026-02-24
