# INF Marketplace Hardhat Project

The Project contains 3 contracts which is INFToken(ERC721), TestToken(ERC20) and Market contract for trading the INF NFT tokens.
The smart contracts are deployed on Goerli test network with the addresses listed below:
- Market Contract: **0xB06DF57cDE95148dD28cB73B08cd571D32909c84**
- INFToken (ERC721): **0x3e76D49b94ffaD2Ac95Fa3afC8B562ED12Cfa130**
- TestToken (ERC20): **0xdaCCe3CDde940C03F285141d56cE14de9Fc3E8D0**
\

\
Now to run the project on your local machine, follow the steps given below:

1. Clone the repository
```shell
git clone https://github.com/ankitpareek0141/INF-Marketplace.git
```
2. Add .env file in the project root folder and add your account private key.
```shell
GOERLI_PRIVATE_KEY = "PASTE_YOUR_ACCOUNT_PRIVATE_KEY_HERE"
```
2. Install dependencies
```shell
npm i
```

3. Run the test cases
```shell
npx hardhat test
```

4. For deploying smart contracts on Goerli testnet,
```shell
npx hardhat run scripts/deploy.js --netowork goerli
```
Ignore the ```--network goerli``` flag if you don't want to deploy on Goerli network,
This will just deploy contracts on local hardhat node.
\

\
There is also a file called deployedContracts.txt in which all the contract addresses are stored.