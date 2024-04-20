if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    connectAccount();
} else {
    console.log('MetaMask is not installed');
}

async function connectAccount() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];
        console.log('Connected wallet address:', currentAccount);
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
    }
}