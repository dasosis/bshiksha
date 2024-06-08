import express from 'express';
import path from 'path';
import multer from 'multer';
import { create } from 'kubo-rpc-client';
import cors from 'cors';

const app = express();
const port = 3000;
const upload = multer();
const directoryPath = process.cwd();

var isLoggedIn = false;
var isProfessor;

// Enable CORS for all routes
app.use(cors());
app.options('*', cors());

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

app.post('/feed', async (req, res) => {
  try {
    const postData = req.body;
    // console.log("Received post data:", postData);
    const client = create('/ip4/127.0.0.1/tcp/5001');
    const data = [];
    for await (const chunk of client.cat(postData.postCid)) {
      data.push(chunk);
    }
    const postObjectBuffer = Buffer.concat(data);
    const postObject = JSON.parse(postObjectBuffer.toString());
    // console.log("Title:", postObject.title);
    // console.log("Description:", postObject.description);
    // console.log("File CID:", postObject.fileCid);
    res.json(postObject);
  } catch (error) {
    console.error('Error handling /feed request:', error);
    res.status(500).send('An error occurred');
  }
});

app.post('/comment', async (req, res) => {
  const { comment } = req.body;

  const client = create('/ip4/127.0.0.1/tcp/5001');
  const commentBuffer = Buffer.from(JSON.stringify(comment));
  const { cid: commentCid } = await uploadFileToIPFS(commentBuffer);

  console.log(comment, commentCid.toString());

  res.json(commentCid.toString());
});

app.post('/commentDecode', async (req, res) => {
  const { commentCids } = req.body;
  if (!commentCids || !Array.isArray(commentCids)) {
    return res.status(400).json({ error: 'commentCids must be an array' });
  }
  // console.log(commentCids);
  // const response = await fetchCommentBodyFromIPFS(commentCid)
  const decodedComments = await Promise.all(
    commentCids.map(async (cid) => {
      const commentBody = await fetchCommentBodyFromIPFS(cid);
      return {
        decodedComment: commentBody ? commentBody : 'Failed to fetch comment',
      };
    })
  );
  console.log(decodedComments);
  // Send the array of decoded comments as the response
  res.json(decodedComments);
});

async function fetchCommentBodyFromIPFS(cid) {
  try {
    const client = create('/ip4/127.0.0.1/tcp/5001');
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

app.post('/submit', upload.single('file'), async (req, res) => {
  try {
    const { title, description, value } = req.body;
    const fileData = req.file.buffer;
    const { cid: fileCid } = await uploadFileToIPFS(fileData);

    const postObject = {
      title,
      description,
      fileCid: fileCid.toString(),
    };
    const postObjectBuffer = Buffer.from(JSON.stringify(postObject));
    const { cid: postCid } = await uploadFileToIPFS(postObjectBuffer);

    const responseData = {
      postCid: postCid.toString(),
      value,
    };

    console.log(postObject, responseData);

    res.json(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error uploading file to IPFS');
  }
});

isLoggedIn = false;

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
