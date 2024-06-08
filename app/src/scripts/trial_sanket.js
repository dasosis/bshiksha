import { getcontractInstance } from "./contract.js";
// import { web3 } from "./metamask.js";
import { currentAccount } from './metamask.js';
import { create } from "kubo-rpc-client";

async function fetchPostFromIPFS(postCid) {
    try {
        const client = create("/ip4/127.0.0.1/tcp/5001");
        const data = [];
        for await (const chunk of client.cat(postCid)) {
            data.push(chunk);
        }
        const postObjectBuffer = Buffer.concat(data);
        const postObject = JSON.parse(postObjectBuffer.toString());

        console.log("Title:", postObject._title);
        console.log("Description:", postObject._description);
        console.log("File CID:", postObject.fileCid);
    } catch (error) {
        console.error("Error fetching data from IPFS:", error);
    }
}

async function uploadPostToIPFS(_title, _description, _postHash) {
    try {
        const postObject = {
            _title,
            _description,
            fileCid: _postHash.toString(),
        };
        const postObjectBuffer = Buffer.from(JSON.stringify(postObject));
        const { cid: postCid } = await uploadFileToIPFS(postObjectBuffer);
        console.log("post Cid: ", postCid);
        console.log("Fetching Post: ");
        fetchPostFromIPFS(postCid);
    } catch (error) {
        console.error("Error uploading to IPFS. ", error);
    }
}

async function uploadFileToIPFS(fileData) {
    try {
        const client = create("/ip4/127.0.0.1/tcp/5001");
        const { cid } = await client.add(fileData);
        return { cid };
    } catch (error) {
        console.error(error);
        throw new Error("IPFS upload failed");
    }
}

uploadPostToIPFS(
    "test 1",
    "test description 1",
    "QmPB1SrAGzTmW7daJKFr5DzzoMj1vzcm87iWypWaPTMUQJ"
);


async function addComment(postId, commentText) {
    try {
        const { contractInstance } = await getcontractInstance();
        const commentBuffer = Buffer.from(commentText);
        const { cid } = await client.add(commentBuffer);
        const commentCid = cid.toString();
        const transaction = contractInstance.methods.uploadPostComment(postId, commentCid);
        const data = transaction.encodeABI();
        const txObject = {
            from: currentAccount,
            to: contractInstance.options.address,
            data: data,
        };
        console.log("Uploading Comment...", txObject);
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [txObject],
        });
        const txReceipt = await web3.eth.getTransactionReceipt(txHash);
        console.log("Successfully Uploaded Comment!! ", txReceipt);

        console.log(`Comment added with CID: ${commentCid}`);
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

async function fetchCommentBodyFromIPFS(cid) {
    try {
        const data = [];
        for await (const chunk of client.cat(cid)) {
            data.push(chunk);
        }
        const commentBuffer = Buffer.concat(data);
        return commentBuffer.toString();
    } catch (error) {
        console.error('Error fetching data from IPFS:', error);
        return null;
    }
}

async function fetchCommentsFromBlockchainAndDecode(postId) {
    try {
        const { contractInstance } = await getcontractInstance();
        const events = await contractInstance.getPastEvents('CommentAdded', {
            filter: { postId },
            fromBlock: 0,
            toBlock: 'latest',
        });

        for (const event of events) {
            const { commentCid } = event.returnValues;
            const comment = await fetchCommentBodyFromIPFS(commentCid);
            console.log(`Comment CID: ${commentCid}`);
            console.log(`Comment: ${comment}`);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

async function fetchPostDetailsUsingEvents(postId) {
    try {

        const { contractInstance } = await getcontractInstance();
        const events = await contractInstance.getPastEvents('PostCreated', {
            filter: { id: postId },
            fromBlock: 0,
            toBlock: 'latest',
        });

        for (const event of events) {
            const { postCid } = event.returnValues;
            const postDetails = await fetchCommentBodyFromIPFS(postCid);
            console.log(`Post CID: ${postCid}`);
            console.log(`Post: ${postDetails}`);
        }
    } catch (error) {
        console.error('Error fetching Post details from fetchPostDetailsUsingEvents() ', error);
    }
}
