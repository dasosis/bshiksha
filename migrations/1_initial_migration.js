const BShikshaModified = artifacts.require("BShikshaModified");

module.exports = async function(deployer) {
    await deployer.deploy(BShikshaModified);
};