import { getcontractInstance } from "./contract.js";
import { web3 } from "./metamask.js";

export async function uploadPost_block(
    currentAccount,
    postData,
    postId
) {
    try {
        const valueinWei = web3.utils.toWei(postData.value.toString(), "ether").toString();
        const {contractInstance} = await getcontractInstance();
        const transaction = contractInstance.methods.uploadPost(
            postId,
            postData.cid,
            postData.description,
            valueinWei
        );
        const gasLimit = await transaction.estimateGas({ from: currentAccount });
        const gasPrice = await web3.eth.getGasPrice();
        const data = transaction.encodeABI();
        // const nonce = await web3.eth.getTransactionCount(currentAccount);
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

export async function callPost_block(postId) {
    try {
        console.log("Post Id in callPost - ",postId);
        const {contractInstance} = await getcontractInstance();
        const postDetails = await contractInstance.methods.getPost(postId).call();
        // console.log("Post Call - ", postDetails);
        return postDetails;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function sendPostFee_block(currentAccount, postDetails){
    const viewCostWei = postDetails.viewCost;
    const postId = postDetails.id;
    const {contractInstance} = await getcontractInstance();
    const txReceipt = await contractInstance.methods.viewPost(postId).send({
        from: currentAccount,
        value: viewCostWei,
    });
}

export async function callPostCount_block() {
    const {contractInstance} = await getcontractInstance();
    const postCount = await contractInstance.methods.PostCount().call();
    console.log("post count = ",postCount);
    return postCount;
}
