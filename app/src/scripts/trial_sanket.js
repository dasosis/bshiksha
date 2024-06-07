import { getcontractInstance } from "./contract.js";
import { web3 } from "./metamask.js";
import { create } from 'kubo-rpc-client';

async function fetchPostFromIPFS(postCid) {
    try {
        const client = create('/ip4/127.0.0.1/tcp/5001');
        const data = [];
        for await (const chunk of client.cat(postCid)) {
            data.push(chunk);
        }
        const postObjectBuffer = Buffer.concat(data);
        const postObject = JSON.parse(postObjectBuffer.toString());

        console.log('Title:', postObject.title);
        console.log('Description:', postObject.description);
        console.log('File CID:', postObject.fileCid);
        console.log('Value:', postObject.value);
    } catch (error) {
        console.error('Error fetching data from IPFS:', error);
    }
}

