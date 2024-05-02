export var b_post;
export var b_feed;
export var b_profile;

export function clear() {
    document.getElementById('post-container').style.display = "none";
    document.getElementById('feed-container').style.display = "none";
    document.getElementById('profile-container').style.display = "none";
    b_post = document.getElementById("post-button");
    b_feed = document.getElementById("feed-button");
    b_profile = document.getElementById("profile-button");
    b_post.classList.remove("pressed");
    b_feed.classList.remove("pressed");
    b_profile.classList.remove("pressed");
}

export function createPostBlockForFeed(post) {
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

    const button = document.createElement("button");
    button.innerText = `View Cost: ${post.viewCost}`;
    postDiv.appendChild(button);

    document.getElementById("feed-container").appendChild(postDiv);
    // return button
}