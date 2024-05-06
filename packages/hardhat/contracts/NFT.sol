// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
 
contract NFT is ERC721URIStorage {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;
	mapping(address => uint256[]) private _userTokens;

	constructor() ERC721("AINFTs", "AIN") {}

	function awardItem(string memory tokenURI) public returns (uint256) {
		uint256 newItemId = _tokenIds.current();
		_mint(msg.sender, newItemId);
		_setTokenURI(newItemId, tokenURI);
		_userTokens[msg.sender].push(newItemId);

		_tokenIds.increment();
		return newItemId;
	}

	function getUserTokens(
		address user
	) external view returns (uint256[] memory) {
		return _userTokens[user];
	}
}
