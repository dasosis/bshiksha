const BShiksha = artifacts.require("BShiksha");

module.exports = async function(deployer) {
    await deployer.deploy(BShiksha);
};