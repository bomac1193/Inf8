const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "MATIC"
  );

  const network = hre.network.name;
  console.log("Network:", network);
  console.log("");

  // ──────────────────────────────────────────────────────────────
  // 1. Deploy O8Token (ERC-20 rewards token)
  //    Constructor: no arguments (mints 1M tokens to deployer)
  // ──────────────────────────────────────────────────────────────
  console.log("1. Deploying O8Token...");
  const O8Token = await hre.ethers.getContractFactory("O8Token");
  const token = await O8Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   O8Token deployed to:", tokenAddress);

  // ──────────────────────────────────────────────────────────────
  // 2. Deploy O8Registry (ERC-721 track registry)
  //    Constructor: no arguments
  // ──────────────────────────────────────────────────────────────
  console.log("\n2. Deploying O8Registry...");
  const O8Registry = await hre.ethers.getContractFactory("O8Registry");
  const registry = await O8Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   O8Registry deployed to:", registryAddress);

  // ──────────────────────────────────────────────────────────────
  // 3. Deploy O8Score (badge/scoring contract)
  //    Constructor: address _registry (O8Registry address)
  // ──────────────────────────────────────────────────────────────
  console.log("\n3. Deploying O8Score...");
  const O8Score = await hre.ethers.getContractFactory("O8Score");
  const score = await O8Score.deploy(registryAddress);
  await score.waitForDeployment();
  const scoreAddress = await score.getAddress();
  console.log("   O8Score deployed to:", scoreAddress);

  // ──────────────────────────────────────────────────────────────
  // 4. Post-deploy: Set rewards distributor on token
  //    This allows O8Registry to distribute O8Token rewards
  // ──────────────────────────────────────────────────────────────
  console.log("\n4. Setting rewards distributor...");
  const tx = await token.setRewardsDistributor(registryAddress);
  await tx.wait();
  console.log("   Rewards distributor set to O8Registry:", registryAddress);

  // ──────────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════════════════════");
  console.log("  O8 PROTOCOL DEPLOYMENT COMPLETE");
  console.log("════════════════════════════════════════════════════════");
  console.log("  Network:      ", network);
  console.log("  Deployer:     ", deployer.address);
  console.log("  O8Token:      ", tokenAddress);
  console.log("  O8Registry:   ", registryAddress);
  console.log("  O8Score:      ", scoreAddress);
  console.log("════════════════════════════════════════════════════════\n");

  // ──────────────────────────────────────────────────────────────
  // Save addresses to file for frontend .env
  // ──────────────────────────────────────────────────────────────
  const envContent = [
    `# O8 Contract Addresses — deployed to ${network} at ${new Date().toISOString()}`,
    `# Deployer: ${deployer.address}`,
    ``,
    `NEXT_PUBLIC_O8_REGISTRY_ADDRESS=${registryAddress}`,
    `NEXT_PUBLIC_O8_TOKEN_ADDRESS=${tokenAddress}`,
    `NEXT_PUBLIC_O8_SCORE_ADDRESS=${scoreAddress}`,
    ``,
  ].join("\n");

  const outputPath = path.join(__dirname, "..", `deployed-addresses-${network}.env`);
  fs.writeFileSync(outputPath, envContent);
  console.log("Addresses saved to:", outputPath);
  console.log("Copy these into your frontend .env file.\n");

  // ──────────────────────────────────────────────────────────────
  // Verification commands (for Polygonscan)
  // ──────────────────────────────────────────────────────────────
  if (network !== "hardhat" && network !== "localhost") {
    console.log("To verify contracts on Polygonscan, run:\n");
    console.log(`  npx hardhat verify --network ${network} ${tokenAddress}`);
    console.log(`  npx hardhat verify --network ${network} ${registryAddress}`);
    console.log(`  npx hardhat verify --network ${network} ${scoreAddress} ${registryAddress}`);
    console.log("");
  }

  return {
    token: tokenAddress,
    registry: registryAddress,
    score: scoreAddress,
  };
}

main()
  .then((addresses) => {
    console.log("Deployed addresses:", JSON.stringify(addresses, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
