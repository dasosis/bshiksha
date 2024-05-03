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
        formData.append('value', document.getElementById('value').value);

        const response = await fetch('/submit', {
            method: 'POST',
            body: formData
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }

    console.log('Fetch Data from Server...', responseData);

    if (typeof window.ethereum !== 'undefined') {

        const web3 = new Web3(window.ethereum);
        try {
            const currentAccount = await connectAccount();
            const contractArtifact = await getContractArtifact();
            const { contractInstance } = await getcontractInstance(web3, contractArtifact);
            // const TxReciept = await uploadPostToBlock(web3, contractInstance, currentAccount[0], responseData);
            await getPostFromBlock(web3, contractInstance, currentAccount[1], responseData);
            // const decodedLogs = await decodeReciept(web3, TxReciept, contractArtifact.abi);
            

        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('MetaMask is not installed');
    }
});

// async function decodeReciept(web3, TxReciept, abi) {
//     const decodedLogs = web3.eth.abi.decodeLog(abi.inputs, TxReciept.logs[0].data, TxReciept.logs[0].topics);
//     console.log(decodedLogs);
//     return decodedLogs;
// }

async function getPostFromBlock(web3, contractInstance, currentAccount,postData) {
    try {
        console.log(web3,contractInstance,currentAccount,postData)
        const valueinWei = web3.utils.toWei(postData.value.toString(), 'ether').toString();
        const transaction = contractInstance.methods.viewPost(
            '1'
        );
        const gasLimit = await transaction.estimateGas({ from: currentAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const data = transaction.encodeABI();
        const nonce = await web3.eth.getTransactionCount(currentAccount);
        const gasLimitHex = web3.utils.toHex(gasLimit);
        const value = web3.utils.toHex(valueinWei)
        const txObject = {
            from: currentAccount,
            to: contractInstance.options.address,
            gas: gasLimitHex,
            gasPrice: gasPrice,
            value: value,
            data: data
        };
        console.log('Sending...', txObject);
        const TxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txObject]
        });
        const TxReciept = await web3.eth.getTransactionReceipt(TxHash);
        console.log('Successful Upload!! ', TxReciept);
        return (TxReciept);
    } catch (error) {
        console.error('Error uploading post:', error);
        throw error;
    }
}

async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts;
        console.log('Connected wallet address:', currentAccount);
        return currentAccount;
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        throw error;
    }
}

async function getContractArtifact() {
    try {
        const response = await fetch('/BShiksha.json');
        if (!response.ok) {
            throw new Error('Failed to fetch contract artifact');
        }
        const json = await response.text();
        const contractArtifact = JSON.parse(json);
        return contractArtifact;
    } catch (error) {
        console.log(error);
    }
}
async function getcontractInstance(web3, contractArtifact) {
    try {
        const abi = contractArtifact.abi;
        const deployment = Object.keys(contractArtifact.networks);
        const address = contractArtifact.networks[deployment[deployment.length - 1]];
        console.log('Contract Address', address.address);
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
        const valueinWei = web3.utils.toWei(postData.value.toString(), 'ether').toString();
        console.log(valueinWei);
        const transaction = contractInstance.methods.uploadPost(
            postData.cid,
            postData.description,
            valueinWei
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
        console.log('Sending...', txObject);
        const TxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txObject]
        });
        const TxReciept = await web3.eth.getTransactionReceipt(TxHash);
        console.log('Successful Upload!! ', TxReciept);
        return (TxReciept);
    } catch (error) {
        console.error('Error uploading post:', error);
        throw error;
    }
}

async function signUpUser(userName, userEmail, isProfessor, universityName) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        await contract.methods.signUpUser(userName, userEmail, isProfessor, universityName).send({ from: userAddress });
        console.log("User signed up successfully");
    } catch (error) {
        console.error("Error signing up user:", error);
    }
}
