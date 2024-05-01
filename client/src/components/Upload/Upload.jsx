import React from 'react';
// import { connectAccount } from '../../../../app/src/scripts/metamask.js';
// import { submitPost } from '../../../../app/src/scripts/post.js';

import { useStore } from '../../dataStore.js';
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

import './Upload.scss';

async function uploadPost_block(
  currentAccount,
  postData,
  postId
) {
  try {
      const valueinWei = web3.utils.toWei(postData.value.toString(), "ether").toString();
      const {contractInstance} = await getcontractInstance();
      const transaction = contractInstance.methods.uploadPost(
          postId,
          postData.cid,
          postData.description,
          valueinWei
      );
      const gasLimit = await transaction.estimateGas({ from: currentAccount });
      const gasPrice = await web3.eth.getGasPrice();
      const data = transaction.encodeABI();
      // const nonce = await web3.eth.getTransactionCount(currentAccount);
      const gasLimitHex = web3.utils.toHex(gasLimit);
      const txObject = {
          from: currentAccount,
          to: contractInstance.options.address,
          gas: gasLimitHex,
          gasPrice: gasPrice,
          data: data,
      };
      console.log("Sending...", txObject);
      const TxHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txObject],
      });
      console.log("test")
      const TxReciept = await web3.eth.getTransactionReceipt(TxHash);
      console.log("Successful Upload!! ", TxReciept);
      if(TxReciept){
          return 1;
      } else return 0;
  } catch (error) {
      console.error("Error uploading post:", error);
      throw error;
  }
}

async function callPost_block(postId) {
  try {
      console.log("Post Id in callPost - ",postId);
      const {contractInstance} = await getcontractInstance();
      const postDetails = await contractInstance.methods.getPost(postId).call();
      // console.log("Post Call - ", postDetails);
      return postDetails;
  } catch (error) {
      console.error("Error:", error);
  }
}

async function sendPostFee_block(currentAccount, postDetails){
  const viewCostWei = postDetails.viewCost;
  const postId = postDetails.id;
  const {contractInstance} = await getcontractInstance();
  const txReceipt = await contractInstance.methods.viewPost(postId).send({
      from: currentAccount,
      value: viewCostWei,
  });
}

async function callPostCount_block() {
  const {contractInstance} = await getcontractInstance();
  const postCount = await contractInstance.methods.PostCount().call();
  console.log("post count = ",postCount);
  return postCount;
}


async function getContractArtifact() {
  try {
      const response = await fetch("http://localhost:3000/BShiksha.json");
      if (!response.ok) {
          throw new Error("Failed to fetch contract artifact");
      }
      // const json = await response.text();
      const contractArtifact = await response.json();
      // const contractArtifact = JSON.parse(json);
      return contractArtifact;
  } catch (error) {
      console.log(error);
  }
}

async function getcontractInstance() {
  try {
      const contractArtifact = await getContractArtifact();
      const abi = contractArtifact.abi;
      const deployment = Object.keys(contractArtifact.networks);
      const address = contractArtifact.networks[deployment[deployment.length - 1]];
      console.log("Contract Address", address);
      const contractInstance = new web3.eth.Contract(abi, address.address);
      // const networkId = await web3.eth.net.getId();
      return { contractInstance };
  } catch (error) {
      console.error("Error fetching contract artifact:", error);
      throw error;
  }
}

async function submitPost(currentAccount,responseData){
  const postId = await callPostCount_block();
  const success_post = await uploadPost_block(
      currentAccount,
      responseData,
      postId
  );
  return success_post;
}

async function getPost(postId){
  console.log("PostId in getPost = ",postId);
  const postDetails = await callPost_block(postId);
  console.log(postDetails);
}

async function getFeed(){
  const postCount = await callPostCount_block();
  console.log(postCount);
  return postCount;
}

const Upload = () => {
  const currentAccount = useStore((state) => state.currentAccount);
  console.log("current account frm usestate", currentAccount);
  const title = React.useRef();
  const desc = React.useRef();
  const value = React.useRef();
  const file = React.useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    let responseData;
    let success_flag = false;
    try {
      const formData = new FormData();

      formData.append('title', title.current.value);
      formData.append('description', desc.current.value);

      const fileInput = document.getElementById('file');
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('file', file);
      } else {
        console.error('No file selected');
        return;
      }
      formData.append('value', value.current.value);

      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        body: formData,
      });
      responseData = await response.json();
    } catch (error) {
      console.error(error);
    }
    console.log('Fetch Data from Server...', responseData);
    success_flag = await submitPost(currentAccount, responseData);
  };

  return (
    <div className='Upload'>
      <form id='myForm' encType='multipart/form-data' onSubmit={handleUpload}>
        <div className='form-group'>
          <label htmlFor='title'>Title:</label>
          <input type='text' id='title' name='title' ref={title} />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description:</label>
          <textarea id='description' name='description' ref={desc} rows={4}></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='value'>Enter Value in ETH:</label>
          <input type='number' id='value' step='any' name='value' ref={value} />
        </div>
        <div className='form-group'>
          <label htmlFor='file'>Upload File:</label>
          <input type='file' id='file' name='file' ref={file} />
        </div>
        <div className='form-group'>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
