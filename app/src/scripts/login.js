import { getUserDetails, signUpUser_block } from "./block.js";
import { currentAccount } from "./metamask.js";
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
    login_clear();
    document.getElementById('signup-container').style.display = "block";
    b_signup.classList.add("pressed");

    
});

document.getElementById("signup-form").addEventListener('submit', async(event) => {
    var formData;
    event.preventDefault();
    try {
        const userName = document.getElementById("userName").value;
        const userEmail = document.getElementById("userEmail").value;
        const universityName = document.getElementById("universityName").value;
        const checkbox = document.getElementById("isProfessor");
        const isProfessor = checkbox.checked ? true : false;

        formData = {
            userName,
            userEmail,
            universityName,
            isProfessor
        }
        console.log("SignUp Form Data - ", formData);
        console.log(currentAccount[0]);
    } catch (error) {
        console.error("Error POST Form: ", error);
    }
    const flag = await signUpUser_block(currentAccount[0], formData);
});

document.getElementById("connect-wallet").addEventListener('click', async (event) => {
    event.preventDefault();
    const userDetails = await getUserDetails(currentAccount[0]); 
    if(userDetails)
        console.log(userDetails);
        fetch('/userVerified', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.ok){
                window.location.href = '/';
            } else throw new error('Bad Response Login Fetch');
        }).catch(error => {
            console.error(error);
        });
});