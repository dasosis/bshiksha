import express from 'express';
import path from 'path';
import pkg from 'body-parser';
import multer from 'multer';
import { create } from 'kubo-rpc-client';

const { urlencoded } = pkg;
const app = express();
const port = 3000;
const upload = multer();
const directoryPath = process.cwd();

app.use(express.static(path.join(directoryPath, 'src')));
app.use(express.static(path.join(directoryPath, '../build/contracts')));

app.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { title, description, value } = req.body;
        const fileData = req.file.buffer;
        const { cid } = await uploadFileToIPFS(fileData);
        const responseData = {
            title,
            description,
            cid: cid.toString(),
            value,
        };
        res.json(responseData);
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
        console.error(error);
    }
}


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});