import {
    uploadPost_block,
    callPostCount_block,
    callPost_block,
    signUpUser_block,
} from "./block.js";

import{
    createPostBlockForFeed
} from './utility.js';

export async function submitPost(currentAccount, responseData) {
    const postId = await callPostCount_block();
    const success_post = await uploadPost_block(
        currentAccount[0],
        responseData,
        postId
    );
    return success_post;
}

export async function getPost(postId) {
    console.log("PostId in getPost = ", postId);
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

async function getPostForFeed(postId) {
    const postDetails = await callPost_block(postId);
    return postDetails;
}

export async function viewPostInFeedTab() {
    const postCount = await callPostCount_block();
    for (let i = 0; i < postCount; i++) {
        const post = await getPostForFeed(i);
        const post_id = createPostBlockForFeed(post);
    }
}
