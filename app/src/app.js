if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    connectAccount().then(currentAccount => {
        getContract(web3).then(({ contractInstance, address, networkId }) => {
            uploadPost(web3, contractInstance, currentAccount, address, networkId);
        }).catch(error => {
            console.error('Error getting contract:', error);
        });
    }).catch(error => {
        console.error('Error connecting to MetaMask:', error);
    });
} else {
    console.log('MetaMask is not installed');
}

async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];
        console.log('Connected wallet address:', currentAccount);
        return currentAccount;
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        throw error;
    }
}

async function getContract(web3) {
    try {
        const response = await fetch('http://localhost:3000/BShiksha.json');
        if (!response.ok) {
            throw new Error('Failed to fetch contract artifact');
        }
        const json = await response.text();
        const contractArtifact = JSON.parse(json);
        const abi = contractArtifact.abi;
        const deployment = Object.keys(contractArtifact.networks);
        const address = contractArtifact.networks[deployment[deployment.length - 1]];
        const contractInstance = new web3.eth.Contract(abi, address.address);
        const networkId = await web3.eth.net.getId();
        return { contractInstance, address: address.address, networkId };
    } catch (error) {
        console.error('Error fetching contract artifact:', error);
        throw error;
    }
}

async function uploadPost(web3, contractInstance, currentAccount, address, networkId) {
    try {
        console.log('hello block');
        const transaction = contractInstance.methods.uploadPost(
            '1',
            '1'
        );
        const gas = await transaction.estimateGas({ from: currentAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const data = transaction.encodeABI();
        const nonce = await web3.eth.getTransactionCount(address);
        const privateKey = 'd66c5bd20fcd0a36f215ef901ed9ff1707f6799e1539ada8a84fb98e0c16f5a7';
        const signedTx = await web3.eth.accounts.signTransaction({
            to: contractInstance.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
        }, privateKey
        );
        
        console.log(gas, gasPrice, data, nonce, address, networkId ,signedTx);
        const reciept = await web3.eth.sendTransaction(signedTx.rawTransaction);
    } catch (error) {
        console.error('Error uploading post:', error);
        throw error;
    }
}
