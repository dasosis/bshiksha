Pre-requisites: Ganache, Metamask, IPFS, Truffle, NodeJS
How to Execute:
1. Start IPFS Daemon
2. Connect Ganache Workspace to local truffle-config.js
3. Import Ganache accounts to MetaMask wallet. (PS. Ensure Ganache Network has been added to MetaMask)
4. run 
``` 
cd app
npm install -g truffle 
npm i
truffle migrate
npm start
```