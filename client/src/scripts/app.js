import { currentAccount } from './metamask.js';
import { submitPost, getFeed, getPost, viewPostInFeedTab } from './post.js';
import { clear, b_post, b_feed, b_profile, hidePostDiv } from './utility.js';

var responseData;
var success_flag;
var postCount;

window.onload = function () {
  clear();
  var isProfessorFlag;
  fetch('/isProfessor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      isProfessorFlag = data;
      console.log(isProfessorFlag);
      if (!isProfessorFlag) {
        hidePostDiv();
      }
    })
    .catch(function (error) {
      console.error('There was a problem with the fetch operation:', error);
    });
};

// document.getElementById('post-button').addEventListener('click', async (event) => {
//   event.preventDefault();
//   clear();
//   document.getElementById('post-container').style.display = 'block';
//   b_post.classList.add('pressed');
//   console.log('hello post button');

// });
// document.getElementById('feed-button').addEventListener('click', async (event) => {
//   event.preventDefault();
//   console.log('hello feed button');
//   clear();
//   document.getElementById('feed-container').style.display = 'block';
//   b_feed.classList.add('pressed');
//   await viewPostInFeedTab(currentAccount);
// });
// document.getElementById('profile-button').addEventListener('click', async (event) => {
//   event.preventDefault();
//   console.log('hello profile button');
//   clear();
//   document.getElementById('profile-container').style.display = 'block';
//   b_profile.classList.add('pressed');
// });

document.getElementById('post-button').addEventListener('click', async (event) => {
  document.getElementById('post-button').classList.add('selected');
  document.getElementById('feed-button').classList.remove('selected');
  document.getElementById('profile-button').classList.remove('selected');

  document.getElementById('post-container').classList.remove('hidden');
  document.getElementById('feed-container').classList.add('hidden');
  document.getElementById('profile-container').classList.add('hidden');
});

document.getElementById('feed-button').addEventListener('click', async (event) => {
  document.getElementById('post-button').classList.remove('selected');
  document.getElementById('feed-button').classList.add('selected');
  document.getElementById('profile-button').classList.remove('selected');

  document.getElementById('post-container').classList.add('hidden');
  document.getElementById('feed-container').classList.remove('hidden');
  document.getElementById('profile-container').classList.add('hidden');
  document.getElementById('feed-container').innerHTML = '';
  await viewPostInFeedTab(currentAccount);
});

document.getElementById('profile-button').addEventListener('click', (event) => {
  document.getElementById('post-button').classList.remove('selected');
  document.getElementById('feed-button').classList.remove('selected');
  document.getElementById('profile-button').classList.add('selected');

  document.getElementById('post-container').classList.add('hidden');
  document.getElementById('feed-container').classList.add('hidden');
  document.getElementById('profile-container').classList.remove('hidden');
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

// document.getElementById("feed_button").addEventListener("click", async (event) => {
//     event.preventDefault();
//     console.log("Inside Feed");
//     postCount = await getFeed();
// });

// var buttonContainer = document.getElementById("buttonContainer");
// for (var i = 0; i < postCount; i++) {
//     var button = document.createElement("button");
//     button.textContent = i;
//     button.id = (i + 1);
//     buttonContainer.appendChild(button);
//     button.addEventListener("click", async(event) => {
//         event.preventDefault();
//         console.log(button.id);
//         const postDetails = await getPost(button.id);
//     });
// }

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

// document.getElementById("signup").addEventListener("submit", async (event) => {
//     event.preventDefault();
//     try{
//         const userData = {
//             userName: document.getElementById("userName").value,
//             userEmail: document.getElementById("userEmail").value,
//             isProfessor: document.getElementById("isProfessor").value,
//             universityName: document.getElementById("universityName").value
//         };
//         console.log("User Data:", userData);
//     } catch (error) {
//         console.error("Error POST Form: ", error);
//     }
//     // success_flag = await signup(currentAccount,userData);
// });
