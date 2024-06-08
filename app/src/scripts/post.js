import {
    uploadPost_block,
    callPostCount_block,
    callPost_block,
    sendPostFee_block,
    addCommentToBlock,
    fetchCommentEventsFromBlock
} from "./block.js";

export async function submitPost(currentAccount, responseData) {
    // const postId = await callPostCount_block();
    const success_post = await uploadPost_block(
        currentAccount[0],
        responseData
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

export async function viewPostInFeedTab(currentAccount) {
    const postCount = await callPostCount_block();
    var payment_flag;
    for (let i = 1; i <= postCount; i++) {
        const post = await getPostForFeed(i);
        const postJson = JSON.stringify(post);
        
        const response = await fetch("/feed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Set content type to JSON
            },
            body: postJson
        });
        const responseData = await response.json();

        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.style.border = "1px solid black";
        postDiv.style.marginBottom = "10px";
    
        const title = document.createElement("h3");
        title.textContent = responseData.title;
        postDiv.appendChild(title);
    
        const description = document.createElement("p");
        description.textContent = responseData.description;
        postDiv.appendChild(description);
    
        const button = document.createElement("button");
        button.innerText = `View Cost: ${post.viewCost}`;
        button.id = `button${post.id}`;
        button.addEventListener('click',async () => {
            console.log(post.id);
            payment_flag = await sendPostFee_block(currentAccount[0],post);
            if(payment_flag)
            window.open(`http://localhost:8080/ipfs/${post.hash}`);
        });
        postDiv.appendChild(button);

        const events = await fetchCommentEventsFromBlock(i);
        console.log("Logging Events from post.js",events,i);

        const commentsDiv = document.createElement("div");
        commentsDiv.classList.add("comments");
        postDiv.appendChild(commentsDiv);

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Add a comment...";
        commentsDiv.appendChild(commentInput);

        const submitCommentButton = document.createElement("button");
        submitCommentButton.innerText = "Submit";
        commentsDiv.appendChild(submitCommentButton);

        const commentsDisplay = document.createElement("div");
        commentsDisplay.classList.add("comments-display");
        commentsDiv.appendChild(commentsDisplay);

        const existingComments = await fetchCommentsForPost(post.id);
        // existingComments.forEach(comment => {
        //     const commentParagraph = document.createElement("p");
        //     commentParagraph.textContent = comment;
        //     commentsDisplay.appendChild(commentParagraph);
        // });

        submitCommentButton.addEventListener('click', async () => {
            try {
                const comment = commentInput.value.trim();
                if (comment) {
                    const response = await fetch("/comment",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json" // Set content type to JSON
                        },
                        body: JSON.stringify({comment})
                    })
                    const responseData = await response.json();
                    console.log(responseData,i);
                    addCommentToBlock(i, responseData, currentAccount[0]);
                    // const newCommentParagraph = document.createElement("p");
                    // newCommentParagraph.textContent = comment;
                    // commentsDisplay.appendChild(newCommentParagraph);
                    // commentInput.value = ""; // Clear the input
                }
            } catch (error) {
                console.error(error);
            }
        });

        document.getElementById("feed-container").appendChild(postDiv);
    }
}

async function fetchCommentsForPost(postid){
    return(postid);
}

async function submitCommentForPost(postid, comment){
 return 0;
}