import express from 'express';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import { create } from 'kubo-rpc-client';

const app = express();
const port = 3000;
const upload = multer();
const directoryPath = process.cwd();

let isLoggedIn = false;
let isProfessor;

// Enable CORS for all routes
// app.use(cors());
// app.options('*', cors());

app.use(express.json());
app.use(express.static(path.join(directoryPath, '../build/contracts')));

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(directoryPath, '/src', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(directoryPath, '/src', 'login.html'));
});

app.post('/userVerified', (req, res) => {
    isLoggedIn = true;
    isProfessor = req.body.isProfessor;
    console.log(req.body);
    console.log('isProfessor /userVerified = ', isProfessor);
    res.redirect('/');
});

app.post('/isProfessor', (req, res) => {
    console.log('in IsProf post prof value = ');
    const isProfessorValue = isProfessor ? 1 : 0;
    console.log(isProfessorValue);
    res.status(200).json(isProfessorValue);
});

app.use(express.static(path.join(directoryPath, 'src')));

app.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { title, description, value } = req.body;
        const fileData = req.file.buffer;
        const { cid: fileCid } = await uploadFileToIPFS(fileData);

        const postObject = {
            title,
            description,
            fileCid: fileCid.toString()
        };
        const postObjectBuffer = Buffer.from(JSON.stringify(postObject));
        const { cid: postCid } = await uploadFileToIPFS(postObjectBuffer);

        const responseData = {
            postCid: postCid.toString(),
            value,
        };

        res.json(responseData);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error uploading file to IPFS');
    }
});

async function uploadFileToIPFS(fileData) {
    try {
        const client = create('/ip4/127.0.0.1/tcp/5001');
        const { cid } = await client.add(fileData);
        return { cid };
    } catch (error) {
        console.error(error);
        throw new Error('IPFS upload failed');
    }
}

function isAuthenticated(req, res, next) {
    if (isLoggedIn) {
        return next();
    } else {
        res.redirect('/login');
    }
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
