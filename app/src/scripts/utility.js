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