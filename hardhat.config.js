require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: 'G5XHFHGZT89VF52D42DRRCGYGZC71R58R4'
  },
  networks: {
    goerli: {
      url: 'https://rpc.ankr.com/eth_goerli',
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  }
};
