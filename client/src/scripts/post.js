import { uploadPost_block, callPostCount_block, callPost_block, sendPostFee_block } from './block.js';

export async function submitPost(currentAccount, responseData) {
  const postId = await callPostCount_block();
  const success_post = await uploadPost_block(currentAccount, responseData, postId);
  return success_post;
}

export async function getPost(postId) {
  //   console.log('PostId in getPost = ', postId);
  const postDetails = await callPost_block(postId);
}

export async function getFeed() {
  const postCount = await callPostCount_block();
  return postCount;
}

// export async function signup(currentAccount, userData) {
//     const signup_flag = await signUpUser_block(currentAccount, userData);
//     return signup_flag;
// }

export async function getPostForFeed(postId) {
  const postDetails = await callPost_block(postId);
  return postDetails;
}

export async function viewPostInFeedTab(currentAccount) {
  const postCount = await callPostCount_block();
  var payment_flag;
  for (let i = 0; i < postCount; i++) {
    const post = await getPostForFeed(i);
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.style.border = '1px solid black';
    postDiv.style.marginBottom = '10px';

    const title = document.createElement('h3');
    title.textContent = post.title;
    postDiv.appendChild(title);

    const description = document.createElement('p');
    description.textContent = post.description;
    postDiv.appendChild(description);

    const button = document.createElement('button');
    button.innerText = `View Cost: ${post.viewCost}`;
    button.id = `button${post.id}`;
    button.addEventListener('click', async () => {
      console.log(post.id);
      payment_flag = await sendPostFee_block(currentAccount, post);
      if (payment_flag) window.open(`http://localhost:8080/ipfs/${post.hash}`);
    });
    postDiv.appendChild(button);
    document.getElementById('feed-container').appendChild(postDiv);
  }
}