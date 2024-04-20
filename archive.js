import express from 'express';
import path from 'path';
import pkg from 'body-parser';
import multer from 'multer';
import { create } from 'kubo-rpc-client';
import Web3 from 'web3';
import artifact from '../../build/contracts/BShiksha.json' assert { type: 'json' };
import detectProvider from '@metamask/detect-provider';

const { abi } = artifact;
const contractAddress = '0x942F0f759B31D4928B0A04684000868ab64d6BcB'; // Replace with your contract address
const { urlencoded } = pkg;
const app = express();
const port = 3000;
const upload = multer();
const contract = new web3.eth.Contract(abi, contractAddress);
let web3;
app.use(urlencoded({ extended: false }));

(async () => {
    try {
        const provider = await detectProvider();
        if (provider) {
            web3 = new Web3(provider);
        } else {
            console.error('MetaMask not detected');
        }
    } catch (error) {
        console.error('Error detecting MetaMask provider:', error);
    }
})();

app.get('/', (req, res) => {
    const directoryPath = process.cwd();
    res.sendFile(path.join(directoryPath, 'src', 'index.html'));
});

app.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const fileData = req.file.buffer;
        const { cid } = await uploadFileToIPFS(fileData);
        console.log(`Title: ${title}`);
        console.log(`Description: ${description}`);
        console.log(`File uploaded successfully! CID: ${cid}`);
        res.send('Form submitted successfully.');
        await uploadPostToBlock('${cid}', description);
        // console.log('Post uploaded:', uploadPostTx);
        // res.send('Post uploaded successfully!');
    } catch (err) {
        console.log(err);
    }
});

async function uploadFileToIPFS(fileData) {
    try {
        const client = create();
        // console.log(`File content: ${fileData.toString()}`)
        // const fileData = await fs.(readFileSyncfilePath)
        const { cid } = await client.add(fileData);
        return { cid };
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function uploadPostToBlock(description, cid) {
    // try {
    //     const accounts = await eb3.eth.getAccounts();
    //     console.log('Current account:', accounts[0]);
    //     const options = {
    //         from: accounts[0],
    //         gas: 8000000
    //     };
    //     await contract.methods.uploadPost(cid, description).send(options);
    //     console.log('Post uploaded');      
    // }
    // catch (error) {
    //     console.log(error);
    // }
}


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});