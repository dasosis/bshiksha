document.getElementById("myForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    let responseData;
    try {
        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append(
            "description",
            document.getElementById("description").value
        );

        const fileInput = document.getElementById("file");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append("file", file);
        } else {
            console.error("No file selected");
            return;
        }

        const response = await fetch("/submit", {
            method: "POST",
            body: formData,
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }

    // console.log(responseData);

    //web3
    if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
            const currentAccount = await connectAccount();
            const { contractInstance } = await getContract(web3);
            const txnHash = await uploadPostToBlock(
                web3,
                contractInstance,
                currentAccount,
                responseData
            );
            await fetchPostDetails(web3, contractInstance.abi, txnHash);
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.log("MetaMask is not installed");
    }
});

async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const currentAccount = accounts[0];
        console.log("Connected wallet address:", currentAccount);
        return currentAccount;
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        throw error;
    }
}

async function getContract(web3) {
    try {
        const response = await fetch("/BShiksha.json");
        if (!response.ok) {
            throw new Error("Failed to fetch contract artifact");
        }
        const json = await response.text();
        const contractArtifact = JSON.parse(json);
        const abi = contractArtifact.abi;
        const deployment = Object.keys(contractArtifact.networks);
        console.log(contractArtifact.networks);
        const address =
            contractArtifact.networks[deployment[deployment.length - 1]];
        console.log(address.address);
        const contractInstance = new web3.eth.Contract(abi, address.address);
        const networkId = await web3.eth.net.getId();
        return { contractInstance };
    } catch (error) {
        console.error("Error fetching contract artifact:", error);
        throw error;
    }
}

async function uploadPostToBlock(
    web3,
    contractInstance,
    currentAccount,
    postData
) {
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
            data: data,
        };
        console.log(txObject);
        const txnHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [txObject],
        });
        console.log("txnHash = " + txnHash);
        // uploadToSQL(txnHash)
        return txnHash;
    } catch (error) {
        console.error("Error uploading post:", error);
        throw error;
    }
}

async function fetchPostDetails(web3, abi, transactionHash) {
    const transactionReceipt = await web3.eth.getTransactionReceipt(
        transactionHash
    );
    console.log(transactionReceipt);
    if (!transactionReceipt) {
        console.error('Transaction receipt not found');
        return;
    }
    const eventSignature = web3.utils.keccak256('PostCreated(uint256,string,string,uint256,address)');
    const event = transactionReceipt.logs.find(log => log.topics[0] === eventSignature);

    if (!event) {
        console.error('PostUploaded event not found in the transaction logs');
        return;
    }
    console.log("event = " + event)

    const decodedData = abi.decodeLog(
        [
            { type: 'uint256', name: 'id', indexed: false },
            { type: 'string', name: 'hash', indexed: false },
            { type: 'string', name: 'description', indexed: false },
            { type: 'uint256', name: 'tipAmount', indexed: false },
            { type: 'address payable', name: 'author', indexed: false }
        ],
        event.data,
        event.topics.slice(1) // Remove the first topic (signature)
    );

    const id = decodedData.id;
    const ipfsHash = decodedData.hash;
    const description = decodedData.description;
    const tipAmount = decodedData.tipAmount;
    const author = decodedData.author;

    console.log('Post ID:', id);
    console.log('IPFS Hash:', ipfsHash);
    console.log('Description:', description);
    console.log('Description:', tipAmount);
    console.log('Description:', author);
}

// Function to check if a user has paid to view a post
async function checkPayment(postId, userAddress) {
    const isPaid = await contractInstance.methods.isPaid(postId, userAddress).call();
    return isPaid;
}

// Example usage
const postId = 123; // ID of the post
const userAddress = "0x123456789..."; // User's Ethereum address
const userHasPaid = await checkPayment(postId, userAddress);

if (userHasPaid) {
    // User has paid, display post content
    console.log("User has paid to view the post");
} else {
    // User has not paid, prompt to make a payment
    console.log("User has not paid to view the post");
    // Display a message or UI element prompting the user to make a payment
}
