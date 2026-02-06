// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SplitDistributor
 * @notice Distributes revenue according to contributor splits
 * @dev Each declaration gets its own instance of this contract
 */
contract SplitDistributor is ReentrancyGuard {
    // Split configuration
    struct Split {
        address recipient;
        uint256 percentage; // in basis points (10000 = 100%)
        string role; // "artist", "producer", "engineer", etc.
    }

    Split[] public splits;
    string public declarationId;
    uint256 public totalDistributed;

    // Parent declaration (for derivative works)
    address public parentContract;
    uint256 public parentPercentage; // Percentage to send to parent (in basis points)

    event SplitDistribution(
        address indexed recipient,
        uint256 amount,
        string role
    );

    event ParentRoyalty(
        address indexed parentContract,
        uint256 amount
    );

    constructor(
        string memory _declarationId,
        Split[] memory _splits,
        address _parentContract,
        uint256 _parentPercentage
    ) {
        require(_splits.length > 0, "Must have at least one split");

        declarationId = _declarationId;
        parentContract = _parentContract;
        parentPercentage = _parentPercentage;

        // Validate and store splits
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _splits.length; i++) {
            require(_splits[i].recipient != address(0), "Invalid recipient");
            require(_splits[i].percentage > 0, "Percentage must be > 0");
            splits.push(_splits[i]);
            totalPercentage += _splits[i].percentage;
        }

        // Total should be 100% minus parent percentage
        uint256 expectedTotal = 10000 - parentPercentage;
        require(totalPercentage == expectedTotal, "Splits must equal 100% (minus parent)");
    }

    /**
     * @notice Distribute received funds to all recipients
     */
    function distribute() external nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to distribute");

        // Send parent royalty first (if applicable)
        if (parentContract != address(0) && parentPercentage > 0) {
            uint256 parentAmount = (balance * parentPercentage) / 10000;
            (bool parentSuccess, ) = parentContract.call{value: parentAmount}("");
            require(parentSuccess, "Parent royalty failed");
            emit ParentRoyalty(parentContract, parentAmount);
            balance -= parentAmount;
        }

        // Distribute to all recipients
        for (uint256 i = 0; i < splits.length; i++) {
            Split memory split = splits[i];
            uint256 amount = (balance * split.percentage) / (10000 - parentPercentage);

            (bool success, ) = split.recipient.call{value: amount}("");
            require(success, "Transfer failed");

            totalDistributed += amount;
            emit SplitDistribution(split.recipient, amount, split.role);
        }
    }

    /**
     * @notice Get split configuration
     */
    function getSplits() external view returns (Split[] memory) {
        return splits;
    }

    /**
     * @notice Get number of recipients
     */
    function getRecipientCount() external view returns (uint256) {
        return splits.length;
    }

    // Auto-distribute when receiving funds
    receive() external payable {
        if (msg.value > 0) {
            this.distribute();
        }
    }
}
