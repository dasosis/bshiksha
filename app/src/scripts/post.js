import { getContractArtifact, getcontractInstance } from "./contract.js";
import { uploadPostToBlock, getPostId } from "./block.js";

export async function submitPost(currentAccount,responseData){
    const contractArtifact = await getContractArtifact();
    const {contractInstance} = await getcontractInstance(contractArtifact);
    console.log("contract instance = ", contractInstance);
    const postId = await getPostId();
    const success_post = await uploadPostToBlock(
        currentAccount[0],
        responseData,
        postId
    );
    return success_post;
}