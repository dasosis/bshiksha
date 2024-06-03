export const web3 = new Web3(window.ethereum);
export var currentAccount = await connectAccount();

export async function connectAccount() {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const currentAccount = accounts;
    console.log('Connected wallet address:', currentAccount);
    return currentAccount;
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
}
