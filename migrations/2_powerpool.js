const Powerpool = artifacts.require("Powerpool");

module.exports = function(deployer) {
    deployer.deploy(Powerpool);
};