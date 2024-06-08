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

async function convertRupeesToEth(rupees) {
    try {
        // Fetch INR to USD exchange rate
        const inrToUsdResponse = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const inrToUsdData = await inrToUsdResponse.json();
        const inrToUsdRate = inrToUsdData.rates.USD;

        // Fetch ETH to USD exchange rate from CoinGecko
        const ethToUsdResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethToUsdData = await ethToUsdResponse.json();
        const ethToUsdRate = ethToUsdData.ethereum.usd;

        // Convert INR to USD
        const usdAmount = rupees * inrToUsdRate;

        // Convert USD to ETH
        const ethAmount = usdAmount / ethToUsdRate;

        return ethAmount;
    } catch (error) {
        console.error('Error converting Rupees to ETH:', error);
        return null;
    }
}
