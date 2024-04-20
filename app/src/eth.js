fetch('http://localhost:3000/BShiksha.json')
    .then(res => {
        return res.text();
    })
    .then(json => {
        var contractArtifact = JSON.parse(json);
        var abi = contractArtifact.abi;
        // contractArtifact.networks['5777'].address;
        var deployment = Object.keys(contractArtifact.networks);
        var address = contractArtifact.networks[deployment[deployment.length - 1]];
        var web3 = new web3.eth.Contract(abi, address);
    });