// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  // Deploying Tokens
  const TestToken = await ethers.getContractFactory('TestToken');
  const testToken = await TestToken.deploy(
    '100000'
  );
  await testToken.deployed();

  const InfToken = await ethers.getContractFactory('INFToken');
  const infToken = await InfToken.deploy();
  await infToken.deployed();

  const Market = await ethers.getContractFactory('Market');
  const market = await Market.deploy(
      testToken.address,
      infToken.address
  );
  await market.deployed();

  console.log("TestToken deployed at: ", testToken.address);
  console.log("INFToken deployed at: ", infToken.address);
  console.log("Market deployed at: ", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
