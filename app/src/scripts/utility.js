export var b_post;
export var b_feed;
export var b_profile;
export var b_login;
export var b_signup;

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

export function login_clear() {
    document.getElementById('login-container').style.display = "none";
    document.getElementById('signup-container').style.display = "none";
    b_login = document.getElementById("login-button");
    b_signup = document.getElementById("signup-button");
    b_login.classList.remove("pressed");
    b_signup.classList.remove("pressed");
}

export function hidePostDiv() {
    document.getElementById('post-button').style.display = "none";
    document.getElementById('post-container').style.display = "none";
}