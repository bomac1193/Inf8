import { expect } from "chai";
import hre from "hardhat";
const ethers = hre.ethers;
import { RevenueRouter, SplitDistributor } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RevenueRouter", function () {
  let revenueRouter: RevenueRouter;
  let splitDistributor: SplitDistributor;
  let owner: SignerWithAddress;
  let artist: SignerWithAddress;
  let producer: SignerWithAddress;
  let fan: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [owner, artist, producer, fan, treasury] = await ethers.getSigners();

    // Deploy RevenueRouter
    const RevenueRouter = await ethers.getContractFactory("RevenueRouter");
    revenueRouter = await RevenueRouter.deploy(treasury.address);

    // Deploy SplitDistributor with 70/30 split
    const SplitDistributor = await ethers.getContractFactory("SplitDistributor");
    splitDistributor = await SplitDistributor.deploy(
      "∞8-test-001",
      [
        { recipient: artist.address, percentage: 7000, role: "artist" },
        { recipient: producer.address, percentage: 3000, role: "producer" }
      ],
      ethers.ZeroAddress,
      0
    );

    // Register split contract
    await revenueRouter.registerSplitContract("∞8-test-001", await splitDistributor.getAddress());
  });

  describe("Revenue Distribution", function () {
    it("Should distribute revenue with platform fee", async function () {
      const paymentAmount = ethers.parseEther("1.0");
      const platformFee = paymentAmount * BigInt(100) / BigInt(10000); // 1%
      const artistRevenue = (paymentAmount - platformFee) * BigInt(7000) / BigInt(10000);
      const producerRevenue = (paymentAmount - platformFee) * BigInt(3000) / BigInt(10000);

      const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
      const producerBalanceBefore = await ethers.provider.getBalance(producer.address);
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      await revenueRouter.connect(fan).sendRevenue("∞8-test-001", "streaming", {
        value: paymentAmount
      });

      const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
      const producerBalanceAfter = await ethers.provider.getBalance(producer.address);
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);

      expect(artistBalanceAfter - artistBalanceBefore).to.equal(artistRevenue);
      expect(producerBalanceAfter - producerBalanceBefore).to.equal(producerRevenue);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(platformFee);
    });

    it("Should track revenue stats correctly", async function () {
      const payment1 = ethers.parseEther("0.5");
      const payment2 = ethers.parseEther("0.3");

      await revenueRouter.connect(fan).sendRevenue("∞8-test-001", "streaming", { value: payment1 });
      await revenueRouter.connect(fan).sendRevenue("∞8-test-001", "nft", { value: payment2 });

      const stats = await revenueRouter.getRevenueStats("∞8-test-001");
      expect(stats.totalReceived).to.equal(payment1 + payment2);
      expect(stats.transactionCount).to.equal(2);
    });

    it("Should emit RevenueReceived event", async function () {
      const paymentAmount = ethers.parseEther("0.1");

      await expect(
        revenueRouter.connect(fan).sendRevenue("∞8-test-001", "tip", { value: paymentAmount })
      )
        .to.emit(revenueRouter, "RevenueReceived")
        .withArgs("∞8-test-001", fan.address, paymentAmount, "tip");
    });

    it("Should revert if no split contract registered", async function () {
      await expect(
        revenueRouter.connect(fan).sendRevenue("∞8-nonexistent", "streaming", {
          value: ethers.parseEther("1.0")
        })
      ).to.be.revertedWith("No split contract registered");
    });

    it("Should revert if amount is zero", async function () {
      await expect(
        revenueRouter.connect(fan).sendRevenue("∞8-test-001", "streaming", { value: 0 })
      ).to.be.revertedWith("Amount must be > 0");
    });
  });

  describe("Platform Fee Management", function () {
    it("Should update platform fee", async function () {
      await revenueRouter.setPlatformFee(200); // 2%
      expect(await revenueRouter.platformFeeBps()).to.equal(200);
    });

    it("Should revert if fee exceeds 5%", async function () {
      await expect(revenueRouter.setPlatformFee(600)).to.be.revertedWith("Fee cannot exceed 5%");
    });

    it("Should only allow owner to update fee", async function () {
      await expect(
        revenueRouter.connect(fan).setPlatformFee(200)
      ).to.be.revertedWithCustomError(revenueRouter, "OwnableUnauthorizedAccount");
    });
  });
});

describe("SplitDistributor", function () {
  let splitDistributor: SplitDistributor;
  let parentDistributor: SplitDistributor;
  let artist: SignerWithAddress;
  let producer: SignerWithAddress;
  let originalArtist: SignerWithAddress;

  beforeEach(async function () {
    [, artist, producer, originalArtist] = await ethers.getSigners();
  });

  describe("Basic Splits", function () {
    beforeEach(async function () {
      const SplitDistributor = await ethers.getContractFactory("SplitDistributor");
      splitDistributor = await SplitDistributor.deploy(
        "∞8-test-002",
        [
          { recipient: artist.address, percentage: 6000, role: "artist" },
          { recipient: producer.address, percentage: 4000, role: "producer" }
        ],
        ethers.ZeroAddress,
        0
      );
    });

    it("Should distribute funds correctly", async function () {
      const amount = ethers.parseEther("1.0");
      const artistShare = (amount * BigInt(6000)) / BigInt(10000);
      const producerShare = (amount * BigInt(4000)) / BigInt(10000);

      const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
      const producerBalanceBefore = await ethers.provider.getBalance(producer.address);

      // Send funds directly to contract (triggers auto-distribute)
      const [sender] = await ethers.getSigners();
      await sender.sendTransaction({
        to: await splitDistributor.getAddress(),
        value: amount
      });

      const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
      const producerBalanceAfter = await ethers.provider.getBalance(producer.address);

      expect(artistBalanceAfter - artistBalanceBefore).to.equal(artistShare);
      expect(producerBalanceAfter - producerBalanceBefore).to.equal(producerShare);
    });

    it("Should return correct split configuration", async function () {
      const splits = await splitDistributor.getSplits();
      expect(splits.length).to.equal(2);
      expect(splits[0].recipient).to.equal(artist.address);
      expect(splits[0].percentage).to.equal(6000);
      expect(splits[1].recipient).to.equal(producer.address);
      expect(splits[1].percentage).to.equal(4000);
    });
  });

  describe("Derivative Works with Parent Royalties", function () {
    beforeEach(async function () {
      const SplitDistributor = await ethers.getContractFactory("SplitDistributor");

      // Create parent (original work)
      parentDistributor = await SplitDistributor.deploy(
        "∞8-original",
        [
          { recipient: originalArtist.address, percentage: 10000, role: "artist" }
        ],
        ethers.ZeroAddress,
        0
      );

      // Create derivative (sends 10% to parent)
      splitDistributor = await SplitDistributor.deploy(
        "∞8-derivative",
        [
          { recipient: artist.address, percentage: 5400, role: "artist" }, // 60% of 90%
          { recipient: producer.address, percentage: 3600, role: "producer" } // 40% of 90%
        ],
        await parentDistributor.getAddress(),
        1000 // 10% to parent
      );
    });

    it("Should propagate royalties to parent", async function () {
      const amount = ethers.parseEther("1.0");
      const parentShare = (amount * BigInt(1000)) / BigInt(10000); // 10%
      const remaining = amount - parentShare;
      // Artist gets 5400 basis points = 54% of remaining 90%
      const artistShare = (remaining * BigInt(5400)) / BigInt(9000);
      // Producer gets 3600 basis points = 36% of remaining 90%
      const producerShare = (remaining * BigInt(3600)) / BigInt(9000);

      const originalArtistBalanceBefore = await ethers.provider.getBalance(originalArtist.address);
      const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
      const producerBalanceBefore = await ethers.provider.getBalance(producer.address);

      const [sender] = await ethers.getSigners();
      await sender.sendTransaction({
        to: await splitDistributor.getAddress(),
        value: amount
      });

      const originalArtistBalanceAfter = await ethers.provider.getBalance(originalArtist.address);
      const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
      const producerBalanceAfter = await ethers.provider.getBalance(producer.address);

      expect(originalArtistBalanceAfter - originalArtistBalanceBefore).to.equal(parentShare);
      expect(artistBalanceAfter - artistBalanceBefore).to.be.closeTo(artistShare, ethers.parseEther("0.001"));
      expect(producerBalanceAfter - producerBalanceBefore).to.be.closeTo(producerShare, ethers.parseEther("0.001"));
    });
  });

  describe("Validation", function () {
    it("Should revert if splits don't total 100%", async function () {
      const SplitDistributor = await ethers.getContractFactory("SplitDistributor");
      await expect(
        SplitDistributor.deploy(
          "∞8-invalid",
          [
            { recipient: artist.address, percentage: 6000, role: "artist" },
            { recipient: producer.address, percentage: 3000, role: "producer" } // Only 90%
          ],
          ethers.ZeroAddress,
          0
        )
      ).to.be.revertedWith("Splits must equal 100% (minus parent)");
    });

    it("Should revert if no splits provided", async function () {
      const SplitDistributor = await ethers.getContractFactory("SplitDistributor");
      await expect(
        SplitDistributor.deploy("∞8-invalid", [], ethers.ZeroAddress, 0)
      ).to.be.revertedWith("Must have at least one split");
    });
  });
});
