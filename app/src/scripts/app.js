import { connectAccount } from './metamask.js';
import { getcontractInstance, getContractArtifact } from './contract.js';
import {  uploadPostToBlock, getPost, sendPostFee } from './block.js';






var responseData;
var contractInstance;
var currentAccount;






document.getElementById("myForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append(
            "description",
            document.getElementById("description").value
        );

        const fileInput = document.getElementById("file");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append("file", file);
        } else {
            console.error("No file selected");
            return;
        }
        formData.append("value", document.getElementById("value").value);

        const response = await fetch("/submit", {
            method: "POST",
            body: formData,
        });
        responseData = await response.json();
    } catch (error) {
        console.error(error);
    }

    console.log("Fetch Data from Server...", responseData);
    if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
            currentAccount = await connectAccount();
            const contractArtifact = await getContractArtifact();
            contractInstance = await getcontractInstance(
                web3,
                contractArtifact
            );
            console.log("contract instance = ", contractInstance.contractInstance);
            var success_post = await uploadPostToBlock(
                web3,
                contractInstance.contractInstance,
                currentAccount[0],
                responseData
            );

            await fetch('/success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(success_post)
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send data to the server');
                }
            }).catch(error => {
                console.error(error);
            });
            
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("MetaMask is not installed");
    }
});



document.getElementById("view_button").addEventListener("click", async(event) =>{
    event.preventDefault();
    console.log("hello");
    const postCount = await contractInstance.contractInstance.methods.PostCount().call();

    for (let index = 1; index <= 3; index++) {
        const postDetails = await getPost(contractInstance.contractInstance, index);
    
    }
    // await sendPostFee(contractInstance.contractInstance, currentAccount[1], postDetails);
});