import { uploadPost_block, callPostCount_block, callPost_block } from './block.js';

export async function submitPost(currentAccount,responseData){
    const postId = await callPostCount_block();
    const success_post = await uploadPost_block(
        currentAccount,
        responseData,
        postId
    );
    return success_post;
}

export async function getPost(postId) {
  console.log('PostId in getPost = ', postId);
  const postDetails = await callPost_block(postId);
  console.log(postDetails);
  return postDetails;
}

export async function getFeed() {
  const postCount = await callPostCount_block();
  console.log(postCount);
  return postCount;
}
