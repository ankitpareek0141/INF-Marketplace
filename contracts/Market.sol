// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Market {

    struct Sale {
        uint256 price;
        address seller;
        bool isForSale;
    }

    IERC20 private erc20Token;
    IERC721 private erc721Token;
    mapping(uint256 => Sale) public idToSale;

    event List(address seller, uint256 tokenId, uint256 price);
    event Buy(address buyer, uint256 tokenId);

    constructor(
        address _erc20Token,
        address _erc721Token
    ) {
        require(
            _erc721Token.code.length > 0,
            "Invalid token contract!"
        );
        erc20Token = IERC20(_erc20Token);
        erc721Token = IERC721(_erc721Token);
    }

    /// @notice Users can put their tokens for sale 
    function listToken(
        uint256 _tokenId,
        uint256 _price
    ) external {
        address _seller = msg.sender;
        require(
            _price > 0,
            "Price should non-zero!"
        );
        require(
            erc721Token.ownerOf(_tokenId) == _seller,
            "Only token owner can list for sale"
        );
        require(
            !idToSale[_tokenId].isForSale,
            "Already on sale!"
        );

        idToSale[_tokenId] = Sale(_price, _seller, true);

        emit List(_seller, _tokenId, _price);
    }

    /// @notice Users can able to buy tokens from sale
    function buyToken(
        uint256 _tokenId
    ) external payable {
        address _buyer = msg.sender;
        Sale memory _sale = idToSale[_tokenId];
        require(
            _sale.isForSale,
            "Token not for sale!"
        );
        require(
            _sale.seller != _buyer,
            "Token already owned!"
        );

        erc20Token.transferFrom(_buyer, _sale.seller, _sale.price);
        erc721Token.safeTransferFrom(_sale.seller, _buyer, _tokenId);

        emit Buy(_buyer, _tokenId);
    }
}