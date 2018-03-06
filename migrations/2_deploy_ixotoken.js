var IxoToken = artifacts.require("./IxoToken.sol");

module.exports = function(deployer) {
  deployer.deploy(IxoToken);
};