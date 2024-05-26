import express from 'express';
import path from 'path';
import multer from 'multer';
import { create } from 'kubo-rpc-client';

const app = express();
const port = 3000;
const upload = multer();
const directoryPath = process.cwd();

var isLoggedIn = false;
var isProfessor;

app.use(express.json());
app.use(express.static(path.join(directoryPath, '../build/contracts')));

app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(directoryPath, '/src', '/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(directoryPath, '/src', '/login.html'));
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

isLoggedIn = false;

async function uploadFileToIPFS(fileData) {
  try {
    const client = create('/ip4/127.0.0.1/tcp/5001');
    // console.log(`File content: ${fileData.toString()}`)
    // const fileData = await fs.(readFileSyncfilePath)
    const { cid } = await client.add(fileData);
    return { cid };
  } catch (error) {
    console.error(error);
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
