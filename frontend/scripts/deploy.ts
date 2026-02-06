import hre from "hardhat";
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy RevenueRouter
  console.log("\n📦 Deploying RevenueRouter...");
  const RevenueRouter = await ethers.getContractFactory("RevenueRouter");
  const revenueRouter = await RevenueRouter.deploy(deployer.address); // Use deployer as temporary treasury
  await revenueRouter.waitForDeployment();
  const revenueRouterAddress = await revenueRouter.getAddress();
  console.log("✅ RevenueRouter deployed to:", revenueRouterAddress);

  // Example: Deploy a test SplitDistributor
  console.log("\n📦 Deploying test SplitDistributor...");
  const SplitDistributor = await ethers.getContractFactory("SplitDistributor");

  // Example splits: 60% artist, 30% producer, 10% engineer
  const testSplits = [
    {
      recipient: deployer.address, // Artist
      percentage: 6000, // 60%
      role: "artist"
    },
    {
      recipient: deployer.address, // Producer (using same address for demo)
      percentage: 3000, // 30%
      role: "producer"
    },
    {
      recipient: deployer.address, // Engineer (using same address for demo)
      percentage: 1000, // 10%
      role: "engineer"
    }
  ];

  const splitDistributor = await SplitDistributor.deploy(
    "∞8-test-001", // declarationId
    testSplits,
    ethers.ZeroAddress, // No parent for this test
    0 // No parent percentage
  );
  await splitDistributor.waitForDeployment();
  const splitDistributorAddress = await splitDistributor.getAddress();
  console.log("✅ SplitDistributor deployed to:", splitDistributorAddress);

  // Register the split contract with the router
  console.log("\n🔗 Registering split contract with router...");
  const tx = await revenueRouter.registerSplitContract("∞8-test-001", splitDistributorAddress);
  await tx.wait();
  console.log("✅ Split contract registered");

  // Test payment
  console.log("\n💸 Sending test payment (0.01 ETH)...");
  const testPayment = await revenueRouter.sendRevenue("∞8-test-001", "streaming", {
    value: ethers.parseEther("0.01")
  });
  await testPayment.wait();
  console.log("✅ Test payment sent and distributed");

  // Get revenue stats
  const stats = await revenueRouter.getRevenueStats("∞8-test-001");
  console.log("\n📊 Revenue Stats:");
  console.log("  Total Received:", ethers.formatEther(stats.totalReceived), "ETH");
  console.log("  Total Distributed:", ethers.formatEther(stats.totalDistributed), "ETH");
  console.log("  Transaction Count:", stats.transactionCount.toString());

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Contract Addresses:");
  console.log("  RevenueRouter:", revenueRouterAddress);
  console.log("  SplitDistributor (test):", splitDistributorAddress);
  console.log("\n💡 Save these addresses to your .env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
