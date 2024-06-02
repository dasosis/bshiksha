import Web3 from 'web3';

export const web3 = new Web3(window.ethereum);

export let currentAccount;

export async function connectAccount() {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    currentAccount = accounts[0]; // Get the first account
    console.log('Connected wallet address:', currentAccount);
    return currentAccount;
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
}

// Initialize the connection to the account on script load
connectAccount()
  .then((account) => {
    console.log('Initial account connection successful:', account);
  })
  .catch((error) => {
    console.error('Initial account connection failed:', error);
  });
