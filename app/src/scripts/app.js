import { connectAccount } from './metamask.js';
import { submitPost, getFeed, getPost } from './post.js';

var responseData;
var currentAccount = await connectAccount();
var success_flag;
var postCount;

// document.getElementById('connect_wallet').addEventListener('click', async (event) => {
//     event.preventDefault;
//     try {
//         if (typeof window.ethereum !== "undefined") {
//             currentAccount = await connectAccount();
//             console.log(currentAccount);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// });

document.querySelector('.feed').addEventListener('load', async (event) => {
  event.preventDefault();
  postCount = await getFeed();
  postData = [];
  for (let i = 0; i < postCount; i++) {
    postData.append(getPost(i + 1));
  }
});

document.getElementById('myForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData();

    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);

    const fileInput = document.getElementById('file');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formData.append('file', file);
    } else {
      console.error('No file selected');
      return;
    }
    formData.append('value', document.getElementById('value').value);

    const response = await fetch('/submit', {
      method: 'POST',
      body: formData,
    });
    responseData = await response.json();
  } catch (error) {
    console.error('Error POST Form: ', error);
  }
  console.log('Fetch Data from Server...', responseData);
  success_flag = await submitPost(currentAccount, responseData);
});

document.getElementById('feed_button').addEventListener('click', async (event) => {
  event.preventDefault();
  console.log('Inside Feed');
  postCount = await getFeed();
});

var buttonContainer = document.getElementById('buttonContainer');
for (var i = 0; i < postCount; i++) {
  var button = document.createElement('button');
  button.textContent = i;
  button.id = i + 1;
  buttonContainer.appendChild(button);
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(button.id);
    const postDetails = await getPost(button.id);
  });
}

// await fetch('/success', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(success_post)
// }).then(response => {
//     if (!response.ok) {
//         throw new Error('Failed to send data to the server');
//     }
// }).catch(error => {
//     console.error(error);
// });

// document.getElementById("view_button").addEventListener("click", async (event) => {
//     event.preventDefault();
//     console.log("hello");
//     const postCount = await contractInstance.contractInstance.methods.PostCount().call();

//     for (let index = 1; index <= 3; index++) {
//         const postDetails = await getPost(contractInstance.contractInstance, index);

//     }
//     // await sendPostFee(contractInstance.contractInstance, currentAccount[1], postDetails);
// });
