//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
	// State Variables
	address public immutable owner;
	mapping(address => uint256) public pointsBalance;
	uint256 public topUpCost = 0.00005 ether;

	event PointsToppedUp(address indexed user, uint256 amount);
	event PointsWithdrawn(address indexed user);
	event EtherWithdrawn(address indexed to, uint256 amount);

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner) {
		owner = _owner;
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	function topUpPoints() external payable {
		require(msg.value >= topUpCost, "Insufficient value sent");

		uint256 pointsToAdd = msg.value / topUpCost;
		pointsBalance[msg.sender] += pointsToAdd;

		emit PointsToppedUp(msg.sender, pointsToAdd);
	}

	function withdrawPoint() external {
		require(
			pointsBalance[msg.sender] > 0,
			"Insufficient points balance"
		);

		pointsBalance[msg.sender] -= 1;

		emit PointsWithdrawn(msg.sender);
	}

	function setTopUpCost(uint256 _newCost) external isOwner {
		topUpCost = _newCost;
	}

	function withdrawEther(address _to, uint256 _amount) external isOwner {
		require(
			address(this).balance >= _amount,
			"Insufficient contract balance"
		);

		payable(_to).transfer(_amount);

		emit EtherWithdrawn(_to, _amount);
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
