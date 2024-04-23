document.getElementById('myForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    let responseData;
    try {
        const formData = new FormData();

        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);

        const fileInput = document.getElementById('file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append('file', file);
        } else {
            console.error('No file selected');
            return;
        }

        const response = await fetch('/submit', {
            method: 'POST',
            body: formData
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }

    // console.log(responseData);

    //web3
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        connectAccount().then(currentAccount => {
            getContract(web3).then(({contractInstance}) => {
                uploadPostToBlock(web3, contractInstance, currentAccount, responseData);
            }).catch(error => {
                console.error('Error getting contract:', error);
            });
        }).catch(error => {
            console.error('Error connecting to MetaMask:', error);
        });
    } else {
        console.log('MetaMask is not installed');
    }
});

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
        console.log(contractArtifact.networks);
        const address = contractArtifact.networks[deployment[deployment.length - 1]];
        console.log(address.address);
        const contractInstance = new web3.eth.Contract(abi, address.address);
        const networkId = await web3.eth.net.getId();
        return { contractInstance };
    } catch (error) {
        console.error('Error fetching contract artifact:', error);
        throw error;
    }
}

async function uploadPostToBlock(web3, contractInstance, currentAccount, postData) {
    try {
        const transaction = contractInstance.methods.uploadPost(
            postData.title,
            postData.cid
        );
        const gasLimit = await transaction.estimateGas({ from: currentAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const data = transaction.encodeABI();
        const nonce = await web3.eth.getTransactionCount(currentAccount);
        const gasLimitHex = web3.utils.toHex(gasLimit);
        const txObject = {
            from: currentAccount,
            to: contractInstance.options.address,
            gas: gasLimitHex,
            gasPrice: gasPrice,
            data: data
        };
        console.log(txObject);
        const reciept = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txObject]
        });
        console.log(reciept);
    } catch (error) {
        console.error('Error uploading post:', error);
        throw error;
    }
}
