import { connectAccount } from './metamask.js';
import { getFeed, getPost } from './post.js';

document.querySelector('#feed').addEventListener('load', async (event) => {
  event.preventDefault();
  postCount = await getFeed();
  postData = [];
  for (let i = 0; i < postCount; i++) {
    postData.append(getPost(i + 1));
  }
});

document.getElementById('download').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    const response = await fetch('/download', {
      method: 'GET',
    });
    responseData = await response.json();
  } catch (error) {
    console.error('Error GET Download: ', error);
  }
  console.log('Fetch Data from Server...', responseData);
});
