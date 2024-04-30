export async function getContractArtifact() {
    try {
        const response = await fetch("/BShiksha.json");
        if (!response.ok) {
            throw new Error("Failed to fetch contract artifact");
        }
        const json = await response.text();
        const contractArtifact = JSON.parse(json);
        return contractArtifact;
    } catch (error) {
        console.log(error);
    }
}

export async function getcontractInstance(web3, contractArtifact) {
    try {
        const abi = contractArtifact.abi;
        const deployment = Object.keys(contractArtifact.networks);
        const address =
            contractArtifact.networks[deployment[deployment.length - 1]];
        console.log("Contract Address", address.address);
        const contractInstance = new web3.eth.Contract(abi, address.address);
        const networkId = await web3.eth.net.getId();
        return { contractInstance };
    } catch (error) {
        console.error("Error fetching contract artifact:", error);
        throw error;
    }
}