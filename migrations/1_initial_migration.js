const BShiksha = artifacts.require("BShiksha");

module.exports = async function(deployer) {
    await deployer.deploy(BShiksha);
    const deployedInstance = await BShiksha.deployed();
    console.log("Contract deployed at address:", deployedInstance.address);
};