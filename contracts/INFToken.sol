// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract INFToken is ERC721 {
    
    uint256 public tokenId;
    address private owner;

    constructor() ERC721("INF Token", "INF") {
        owner = msg.sender;
    }

    function mintTokens(uint256 _tokensToMint) external {
        require(
            msg.sender == owner,
            "Only owner can mint!"
        );
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

    // function configureMarket(address _marketContract) external {
    //     require(
    //         marketContract == address(0),
    //         "Market already configured!"
    //     );
    //     require(
    //         _marketContract.code.length > 0,
    //         "Not a valid contract!"
    //     );

    //     marketContract = _marketContract;
    // }
}