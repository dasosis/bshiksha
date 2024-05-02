import {
    uploadPost_block,
    callPostCount_block,
    callPost_block,
    signUpUser_block,
} from "./block.js";

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
    console.log(postDetails);
}

export async function getFeed() {
    const postCount = await callPostCount_block();
    console.log(postCount);
    return postCount;
}

export async function signup(currentAccount, userData) {
    const signup_flag = await signUpUser_block(currentAccount, userData);
    console.log(signup_flag);
    return signup_flag;
}

async function getPostForFeed(postId) {
    console.log("PostId in getPost = ", postId);
    const postDetails = await callPost_block(postId);
    return postDetails;
}

export async function viewPostInFeedTab() {
    const postCount = await callPostCount_block();

    for (let i = 0; i < postCount; i++) {
        const post = await getPostForFeed(i);
        console.log(post);
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.style.border = "1px solid black"; 
        postDiv.style.marginBottom = "10px"; 

        const title = document.createElement("h3");
        title.textContent = post.title;
        postDiv.appendChild(title);

        const description = document.createElement("p");
        description.textContent = post.description;
        postDiv.appendChild(description);

        const viewCost = document.createElement("p");
        viewCost.textContent = `View Cost: ${post.viewCost}`;
        postDiv.appendChild(viewCost);

        const button = document.createElement("button");
        button.innerText = `View Cost: ${post.viewCost}`;
        postDiv.appendChild(button);

        document.getElementById("feed-container").appendChild(postDiv);
    }
}
