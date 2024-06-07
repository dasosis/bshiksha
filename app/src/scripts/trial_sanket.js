// import { getcontractInstance } from "./contract.js";
// import { web3 } from "./metamask.js";
// import { web3 } from "./metamask";
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
