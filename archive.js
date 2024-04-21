if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    connectAccount().then(currentAccount => {
        getContract(web3).then(({ contractInstance, address, networkId }) => {
            uploadPostToBlock(web3, contractInstance, currentAccount, address, networkId);
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
        console.log(address.address);
        const contractInstance = new web3.eth.Contract(abi, address.address);
        const networkId = await web3.eth.net.getId();
        return { contractInstance, address: address.address, networkId };
    } catch (error) {
        console.error('Error fetching contract artifact:', error);
        throw error;
    }
}
/*
async function uploadPostToBlock(web3, contractInstance, currentAccount, address, networkId) {
    try {
        console.log('hello block');
        const transaction = contractInstance.methods.uploadPost(
            '1',
            '1'
        );
        const gas = await transaction.estimateGas({ from: currentAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const data = transaction.encodeABI();
        const nonce = await web3.eth.getTransactionCount(address, 'pending') ;
        const privateKey = 'd66c5bd20fcd0a36f215ef901ed9ff1707f6799e1539ada8a84fb98e0c16f5a7';
        const signedTx = await web3.eth.accounts.signTransaction({
            to: contractInstance.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 1337
        }, privateKey
        );
        
        console.log(gas, gasPrice, data, nonce, address, networkId ,signedTx);
        const reciept = await web3.eth.sendTransaction(signedTx.rawTransaction);
        console.log(reciept);
    } catch (error) {
        console.error('Error uploading post:', error);
        throw error;
    }
}*/

async function uploadPostToBlock(web3, contractInstance, currentAccount, address, networkId) {
    const privateKey = 'd66c5bd20fcd0a36f215ef901ed9ff1707f6799e1539ada8a84fb98e0c16f5a7';
    const address = address;
    const provider = new Web3.providers.HttpProvider('http://localhost:9545');
    // const web3 = new Web3(provider);
    console.log(await contractInstance.methods.data().call());
    console.log(`Old data value: ${await contractInstance.methods.data().call()}`);
    const receipt = await myContract.methods.setData(3).send({ from: address });
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`New data value: ${await contractInstance.methods.data().call()}`);
}
