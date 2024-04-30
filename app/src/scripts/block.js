export async function uploadPostToBlock(
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
        if(TxReciept){
            return 1;
        } else return 0;
    } catch (error) {
        console.error("Error uploading post:", error);
        throw error;
    }
}

export async function getPost(contractInstance, postId) {
    try {
        console.log("Post Id in GetPost - ",postId);
        const postDetails = await contractInstance.methods.getPost(postId).call();
        console.log("Post Call - ", postDetails);
        return postDetails;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function sendPostFee(contractInstance, currentAccount, postDetails){
    const viewCostWei = postDetails.viewCost;
    const postId = postDetails.id;
    const txReceipt = await contractInstance.methods.viewPost(postId).send({
        from: currentAccount,
        value: viewCostWei,
    });
}

