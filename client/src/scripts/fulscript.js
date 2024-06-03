/* eslint-disable no-unused-vars */
import Web3 from 'web3';

export const web3 = new Web3(window.ethereum);
export var currentAccount;

async function initializeAccount() {
  currentAccount = await connectAccount();
}
initializeAccount();

export async function connectAccount() {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('Connected wallet address:', accounts);
    return accounts[0];
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
}

export async function submitPost(currentAccount, responseData) {
  const postId = await callPostCount_block();
  const success_post = await uploadPost_block(currentAccount, responseData, postId);
  return success_post;
}

export async function getPost(postId) {
  console.log('PostId in getPost = ', postId);
  const postDetails = await callPost_block(postId);
  return postDetails;
}

export async function getFeed() {
  const postCount = await callPostCount_block();
  return postCount;
}

// export async function signup(currentAccount, userData) {
//     const signup_flag = await signUpUser_block(currentAccount, userData);
//     return signup_flag;
// }

async function getPostForFeed(postId) {
  const postDetails = await callPost_block(postId);
  return postDetails;
}

export async function viewPostInFeedTab(currentAccount) {
  const postCount = await callPostCount_block();
  for (let i = 0; i < postCount; i++) {
    const post = await getPostForFeed(i);
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.style.border = '1px solid black';
    postDiv.style.marginBottom = '10px';

    const title = document.createElement('h3');
    title.textContent = post.title;
    postDiv.appendChild(title);

    const description = document.createElement('p');
    description.textContent = post.description;
    postDiv.appendChild(description);

    const button = document.createElement('button');
    button.innerText = `View Cost: ${post.viewCost}`;
    button.id = `button${post.id}`;
    button.addEventListener('click', async () => {
      console.log(post.id);
      const payment_flag = await sendPostFee_block(currentAccount, post);
      if (payment_flag) window.open(`http://localhost:8080/ipfs/${post.hash}`);
    });
    postDiv.appendChild(button);
    document.getElementById('feed-container').appendChild(postDiv);
  }
}

export async function getContractArtifact() {
  try {
    const response = await fetch('http://localhost:3000/BShiksha.json');
    if (!response.ok) {
      throw new Error('Failed to fetch contract artifact');
    }
    const json = await response.text();
    const contractArtifact = JSON.parse(json);
    return contractArtifact;
  } catch (error) {
    console.log(error);
  }
}

export async function getcontractInstance() {
  try {
    const contractArtifact = await getContractArtifact();
    const abi = contractArtifact.abi;
    const deployment = Object.keys(contractArtifact.networks);
    const address = contractArtifact.networks[deployment[deployment.length - 1]].address;
    console.log('Contract Address', address);
    const contractInstance = new web3.eth.Contract(abi, address);
    return { contractInstance };
  } catch (error) {
    console.error('Error fetching contract artifact:', error);
    throw error;
  }
}

export async function uploadPost_block(currentAccount, postData, postId) {
  try {
    const valueinWei = web3.utils.toWei(postData.value.toString(), 'ether').toString();
    const { contractInstance } = await getcontractInstance();
    const transaction = contractInstance.methods.uploadPost(
      postId,
      postData.title,
      postData.cid,
      postData.description,
      valueinWei
    );
    const gasLimit = await transaction.estimateGas({ from: currentAccount });
    const gasPrice = await web3.eth.getGasPrice();
    const data = transaction.encodeABI();
    const gasLimitHex = web3.utils.toHex(gasLimit);
    const txObject = {
      from: currentAccount,
      to: contractInstance.options.address,
      gas: gasLimitHex,
      gasPrice: gasPrice,
      data: data,
    };
    console.log('Sending...', txObject);
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txObject],
    });
    const txReceipt = await web3.eth.getTransactionReceipt(txHash);
    console.log('Successful Upload!! ', txReceipt);
    if (txReceipt) return 1;
    else return 0;
  } catch (error) {
    console.error('Error uploading post:', error);
    throw error;
  }
}

export async function callPost_block(postId) {
  try {
    console.log('Post Id in callPost - ', postId);
    const { contractInstance } = await getcontractInstance();
    const postDetails = await contractInstance.methods.getPost(postId).call();
    return postDetails;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function sendPostFee_block(currentAccount, postDetails) {
  const viewCostWei = postDetails.viewCost;
  const postId = postDetails.id;
  const { contractInstance } = await getcontractInstance();
  const txReceipt = await contractInstance.methods.viewPost(postId).send({
    from: currentAccount,
    value: viewCostWei,
  });
  if (txReceipt) return 1;
  else return 0;
}

export async function callPostCount_block() {
  const { contractInstance } = await getcontractInstance();
  const postCount = await contractInstance.methods.PostCount().call();
  return postCount;
}

export async function signUpUser_block(currentAccount, userData) {
  try {
    const { contractInstance } = await getcontractInstance();
    const transaction = contractInstance.methods.signUpUser(
      userData.userName,
      userData.userEmail,
      userData.isProfessor,
      userData.universityName
    );
    const gasLimit = await transaction.estimateGas({ from: currentAccount });
    const gasPrice = await web3.eth.getGasPrice();
    const data = transaction.encodeABI();
    const gasLimitHex = web3.utils.toHex(gasLimit);
    const txObject = {
      from: currentAccount,
      to: contractInstance.options.address,
      gas: gasLimitHex,
      gasPrice: gasPrice,
      data: data,
    };
    console.log('Sending...', txObject);
    const TxHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txObject],
    });
    const TxReceipt = await web3.eth.getTransactionReceipt(TxHash);
    console.log('Successfully Signed Up!! ', TxReceipt);
    if (TxReceipt) {
      return 1;
    } else return 0;
  } catch (error) {
    console.error('Error signing up: ', error);
    throw error;
  }
}

export async function getUserDetails(walletId) {
  const { contractInstance } = await getcontractInstance();
  try {
    const userDetails = await contractInstance.methods.getUser(walletId).call();
    console.log('User details: ', userDetails);
    return userDetails;
  } catch (error) {
    console.error('Error getting user details:', error);
  }
}
