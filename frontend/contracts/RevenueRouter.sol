// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RevenueRouter
 * @notice Routes revenue to declarations with instant settlement
 * @dev Handles streaming payments, NFT sales, licensing fees
 */
contract RevenueRouter is ReentrancyGuard, Ownable {
    // Events
    event RevenueReceived(
        string indexed declarationId,
        address indexed payer,
        uint256 amount,
        string source // "streaming", "nft", "license", "tip"
    );

    event RevenueDistributed(
        string indexed declarationId,
        address indexed recipient,
        uint256 amount
    );

    // Revenue tracking
    struct RevenueRecord {
        uint256 totalReceived;
        uint256 totalDistributed;
        uint256 transactionCount;
        mapping(address => uint256) recipientTotals;
    }

    mapping(string => RevenueRecord) public declarationRevenue;
    mapping(string => address) public splitContracts; // declarationId => SplitDistributor address

    // Platform fee (in basis points, 100 = 1%)
    uint256 public platformFeeBps = 100; // 1% default
    address public platformTreasury;

    constructor(address _platformTreasury) Ownable(msg.sender) {
        platformTreasury = _platformTreasury;
    }

    /**
     * @notice Register a split contract for a declaration
     * @param declarationId The ∞8 declaration ID
     * @param splitContract Address of the SplitDistributor contract
     */
    function registerSplitContract(
        string memory declarationId,
        address splitContract
    ) external onlyOwner {
        splitContracts[declarationId] = splitContract;
    }

    /**
     * @notice Send revenue to a declaration (instant settlement)
     * @param declarationId The ∞8 declaration ID
     * @param source Revenue source type
     */
    function sendRevenue(
        string memory declarationId,
        string memory source
    ) external payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        require(splitContracts[declarationId] != address(0), "No split contract registered");

        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeeBps) / 10000;
        uint256 artistRevenue = msg.value - platformFee;

        // Transfer platform fee
        if (platformFee > 0) {
            (bool feeSuccess, ) = platformTreasury.call{value: platformFee}("");
            require(feeSuccess, "Platform fee transfer failed");
        }

        // Forward to split contract for distribution
        (bool splitSuccess, ) = splitContracts[declarationId].call{value: artistRevenue}("");
        require(splitSuccess, "Split distribution failed");

        // Update tracking
        RevenueRecord storage record = declarationRevenue[declarationId];
        record.totalReceived += msg.value;
        record.totalDistributed += artistRevenue;
        record.transactionCount += 1;

        emit RevenueReceived(declarationId, msg.sender, msg.value, source);
    }

    /**
     * @notice Get revenue stats for a declaration
     */
    function getRevenueStats(string memory declarationId)
        external
        view
        returns (
            uint256 totalReceived,
            uint256 totalDistributed,
            uint256 transactionCount
        )
    {
        RevenueRecord storage record = declarationRevenue[declarationId];
        return (
            record.totalReceived,
            record.totalDistributed,
            record.transactionCount
        );
    }

    /**
     * @notice Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 500, "Fee cannot exceed 5%");
        platformFeeBps = _feeBps;
    }

    /**
     * @notice Update platform treasury address (only owner)
     */
    function setPlatformTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        platformTreasury = _treasury;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
