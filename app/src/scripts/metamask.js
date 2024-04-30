export var web3;

document.getElementById('connect_wallet').addEventListener('click', async(event) => {
    event.preventDefault;
    try {
        if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
        }
} catch (error) {
    console.error(error);
}
})

export async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const currentAccount = accounts;
        console.log("Connected wallet address:", currentAccount);
        return currentAccount;
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        throw error;
    }
}