import express from 'express';
import path from 'path';
import pkg from 'body-parser';
import multer from 'multer';
import { create } from 'kubo-rpc-client';
import { log } from 'console';


const { urlencoded } = pkg;
const app = express();
const port = 3000;
const upload = multer();
const directoryPath = process.cwd();

app.use(urlencoded({ extended: false }));
app.use(express.static(path.join(directoryPath, 'src')));

app.get('/', (req, res) => {
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


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});