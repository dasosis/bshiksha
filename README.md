# BShiksha

## Pre-requisites

Before executing the project, make sure you have the following installed:

- Ganache
- Metamask
- IPFS
- Truffle
- NodeJS

## How to Execute

Follow these steps to execute the project:

1. **Start IPFS Daemon**: Start the IPFS daemon to enable interaction with the IPFS network.

2. **Connect Ganache Workspace to Truffle**: Connect your Ganache workspace to the local `truffle-config.js` file. This allows Truffle to deploy contracts to your local blockchain.

3. **Import Ganache Accounts to MetaMask**: Import the accounts from your Ganache workspace to your MetaMask wallet. Ensure that the Ganache Network has been added to MetaMask.

4. **Run the following commands**:
    ```bash
    cd app
    npm install -g truffle
    npm install
    truffle migrate
    npm start
    ```

    These commands will:
    - Install Truffle globally.
    - Install project dependencies.
    - Deploy contracts to the local blockchain.
    - Start the application.

5. **Interact with the Application**: Once the application is running, you can interact with it through your web browser. 

## Additional Notes

- Make sure Ganache and IPFS are running before executing the project.
- Verify that MetaMask is connected to the correct network and accounts are imported.
- Ensure that all dependencies are installed properly before starting the application.

---