var SafeMath = artifacts.require("./utils/SafeMath");
var Ownable = artifacts.require("./utils/Ownable");
var IxoERC20Token = artifacts.require("./token/IxoERC20Token");
var AuthContract = artifacts.require("./auth/AuthContract");
var ProjectWalletFactory = artifacts.require("./project/ProjectWalletFactory");
var ProjectWalletAuthoriser = artifacts.require("./project/ProjectWalletAuthoriser");
var ProjectWalletRegistry = artifacts.require("./project/ProjectWalletRegistry");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Ownable);
  deployer.link(SafeMath, IxoERC20Token);
  deployer.link(Ownable, [IxoERC20Token, ProjectWalletRegistry, ProjectWalletAuthoriser]);
  // set the deployed instance of IxoERC20Token in constructor of the ProjectWalletRegistry
  deployer.deploy(IxoERC20Token).then(function() {
    return deployer.deploy(AuthContract, ['0x647CD1829Ad0FF896640FCd3a29cF6Af0dE10A83'], 1);
  }).then(function(ac) {
    return deployer.deploy(ProjectWalletAuthoriser)
  }).then(function() {
    return deployer.deploy(ProjectWalletFactory);
  }).then(function() {
    return deployer.deploy(ProjectWalletRegistry, IxoERC20Token.address, ProjectWalletAuthoriser.address, ProjectWalletFactory.address);
  });

};