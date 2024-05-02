import { login_clear,b_login,b_signup } from "./utility.js";

document.getElementById("login-button").addEventListener('click', (event) => {
    event.preventDefault();
    console.log("hello login button");
    login_clear();
    document.getElementById('login-container').style.display = "block";
    b_login.classList.add("pressed");
});
document.getElementById("signup-button").addEventListener('click', (event) => {
    event.preventDefault();
    console.log("hello signup button");
    login_clear();
    document.getElementById('signup-container').style.display = "block";
    b_signup.classList.add("pressed");
});