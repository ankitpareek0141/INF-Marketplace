// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract INFToken is ERC721, Ownable {
    
    uint256 public tokenId;
    
    constructor() ERC721("INF Token", "INF") {}

    function mintTokens(uint256 _tokensToMint) external onlyOwner {
        require(
            _tokensToMint > 0,
            "Should mint alreast 1 INF Token!"
        );

        uint256 _tokenId = tokenId;

        while (_tokensToMint > 0) {
            _safeMint(msg.sender, ++_tokenId);
            _tokensToMint--;
        }
        tokenId = _tokenId;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://www.exampleurl.com/";
    }
}