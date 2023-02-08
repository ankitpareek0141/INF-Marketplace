const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
describe("INF Marketplace", function () {

    var owner;
    var user1;
    var user2;
    var accounts;
    var market;
    var infToken;
    var testToken;
    var testTokenSupply = '100000';

    describe('Initial Deployment', async () => { 
        it("Should initialize all the users account addresses", async () => {
            [owner, user1, user2, ...accounts] = await ethers.getSigners(); 
            expect(owner.address).not.equal(undefined);
        })

        it("Should deploy the TestToken ERC20 contract", async () => {
            const TestToken = await ethers.getContractFactory('TestToken');
            testToken = await TestToken.deploy(
                testTokenSupply
            );
            await testToken.deployed();
            
            let initialSupplyInWei = ethers.utils.parseUnits(testTokenSupply, "ether");

            expect(await testToken.name()).to.equal('TestToken')
            expect(await testToken.symbol()).to.equal('TTK')
            expect(await testToken.totalSupply()).to.equal(initialSupplyInWei);
        });

        it("Owner transfer some TTK to users", async () => {

            let amountInWei = ethers.utils.parseUnits('100', 'ether');
            await testToken.transfer(user1.address, amountInWei);
            await testToken.transfer(user2.address, amountInWei);

            expect(await testToken.balanceOf(user1.address)).to.equal(amountInWei);
            expect(await testToken.balanceOf(user2.address)).to.equal(amountInWei);
        })

        it("Should deploy the INFToken ERC721 contract", async () => {
            const InfToken = await ethers.getContractFactory('INFToken');
            infToken = await InfToken.deploy();
            await infToken.deployed();
        });

        it("Should deploy the Market contract", async () => {
            const Market = await ethers.getContractFactory('Market');
            market = await Market.deploy(
                testToken.address,
                infToken.address
            );
            await market.deployed();
        });
    });

    describe('Minting', async () => { 
        it("Should revert if minter is an owner!", async () => {
            await expect(
                infToken.connect(user1).mintTokens('2')
            ).to.be.rejectedWith("Only owner can mint!");
        });

        it('Should revert if owner mint 0 token!', async () => {
            await expect(
                infToken.mintTokens('0')
            ).to.be.revertedWith("Should mint alreast 1 INF Token!");
        });

        it("Owner should able to mint 2 INF Tokens", async () => {
            let txn = await infToken.mintTokens('2');
            await txn.wait();

            expect(await infToken.ownerOf(1)).to.equal(owner.address);
            expect(await infToken.ownerOf(2)).to.equal(owner.address);
            expect(await infToken.balanceOf(owner.address)).to.equal(2);
        });

        it("Owner should able to mint 3 more INF Tokens", async () => {
            let txn = await infToken.mintTokens('3');
            await txn.wait();

            expect(await infToken.ownerOf(1)).to.equal(owner.address);
            expect(await infToken.ownerOf(5)).to.equal(owner.address);
            expect(await infToken.balanceOf(owner.address)).to.equal(5);
        });
    });

    describe('Listing', async () => {
        it("Owner should list NFT for sale", async () => {
            let tokenPrice = ethers.utils.parseUnits('2', "ether");
            /**
             * Owner give approval to market address so that
             * market contract later transfer the tokens from
             * seller to buyer account after buyer purchase the NFT
             *  */
            await infToken.approve(market.address, '1');
            await market.listToken(
                '1',
                tokenPrice
            );
            
            var saleDetail = await market.idToSale(1);

            expect(saleDetail.price).to.equal(tokenPrice);
            expect(saleDetail.seller).to.equal(owner.address);
        });

        it("Owner should list another NFT token for sale!", async () => {
            let tokenPrice = ethers.utils.parseUnits('10', "ether");

            await infToken.approve(market.address, '5');
            await market.listToken(
                '5',
                tokenPrice
            );
            
            var saleDetail = await market.idToSale(5);

            expect(saleDetail.price).to.equal(tokenPrice);
            expect(saleDetail.seller).to.equal(owner.address);
        })

        it("Should revert when owner list the same NFT", async () => {
            await expect(market.listToken(
                '1',
                '100000'
            )).to.be.revertedWith("Already on sale!");
        });

        it("Owner should revert with error while pass invalid price", async () => {
            await expect(market.listToken(
                '1',
                '0'
            )).to.be.revertedWith("Price should non-zero!");
        });

        it("Should revert when invalid token owner list token!", async () => {
            await expect(market.connect(user1).listToken(
                '1',
                '100000'
            )).to.be.revertedWith("Only token owner can list for sale");
        });
    });

    describe('Buying', async () => {
        it("User1 should buy NFT of ID 1 from Market", async () => {
            let amountToPay = ethers.utils.parseUnits('2', "ether");

            await testToken.connect(user1).approve(market.address, amountToPay);
            await market.connect(user1).buyToken('1');

            expect(await infToken.balanceOf(user1.address)).to.equal(1);
            expect(await infToken.balanceOf(owner.address)).to.equal(4);
            expect(await infToken.ownerOf(1)).to.equal(user1.address);
        });

        it("User2 should revert with error in case insufficient allowance", async () => {

            await expect(
                market.connect(user2).buyToken('5')
            ).to.be.revertedWith("ERC20: insufficient allowance");            
        });

        it("User2 should buy NFT of ID 5 from Market", async () => {
            let amountToPay = ethers.utils.parseUnits('10', "ether");

            await testToken.connect(user2).approve(market.address, amountToPay);
            await market.connect(user2).buyToken('5');

            expect(await infToken.balanceOf(user2.address)).to.equal(1);
            expect(await infToken.balanceOf(owner.address)).to.equal(3);
            expect(await infToken.ownerOf(1)).to.equal(user1.address);
        });

        it("User2 reverted with error if try to buy invalid ID", async () => {
            await expect(
                market.connect(user2).buyToken('10')
            ).to.be.revertedWith("Token Id not on sale!");
        });
    });
});