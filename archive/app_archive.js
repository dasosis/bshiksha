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
        formData.append("value", document.getElementById("value").value);

        const response = await fetch("/submit", {
            method: "POST",
            body: formData,
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }

    console.log("Fetch Data from Server...", responseData);
    if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
            const currentAccount = await connectAccount();
            const contractArtifact = await getContractArtifact();
            const { contractInstance } = await getcontractInstance(
                web3,
                contractArtifact
            );
            await uploadPostToBlock(
                web3,
                contractInstance,
                currentAccount[0],
                responseData
            );
            const postDetails = await getPost(contractInstance, responseData.postId);
            await sendPostFee(contractInstance, currentAccount[1], postDetails);
            
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("MetaMask is not installed");
    }
});

async function sendPostFee(contractInstance, currentAccount, postDetails){
    const viewCostWei = postDetails.viewCost;
    const postId = postDetails.id;
    const txReceipt = await contractInstance.methods.viewPost(postId).send({
        from: currentAccount,
        value: viewCostWei,
    });
}

async function getPost(contractInstance, postId) {
    try {
        console.log("Post Id in GetPost - ",postId);
        const postDetails = await contractInstance.methods.getPost(postId).call();
        console.log("Post Call - ", postDetails);
        return postDetails;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const currentAccount = accounts;
        console.log("Connected wallet address:", currentAccount);
        return currentAccount;
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        throw error;
    }
}

async function getContractArtifact() {
    try {
        const response = await fetch("/BShiksha.json");
        if (!response.ok) {
            throw new Error("Failed to fetch contract artifact");
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
        const address =
            contractArtifact.networks[deployment[deployment.length - 1]];
        console.log("Contract Address", address.address);
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
        const valueinWei = web3.utils
            .toWei(postData.value.toString(), "ether")
            .toString();
        console.log(valueinWei);
        const transaction = contractInstance.methods.uploadPost(
            postData.postId,
            postData.cid,
            postData.description,
            valueinWei
        );
        console.log("PostData Id = " + postData.postId);
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
        console.log("Sending...", txObject);
        const TxHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [txObject],
        });
        const TxReciept = await web3.eth.getTransactionReceipt(TxHash);
        console.log("Successful Upload!! ", TxReciept);
    } catch (error) {
        console.error("Error uploading post:", error);
        throw error;
    }
}