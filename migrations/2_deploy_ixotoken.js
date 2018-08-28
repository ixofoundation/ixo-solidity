var SafeMath = artifacts.require("./utils/SafeMath");
var Ownable = artifacts.require("./utils/Ownable");
var IxoERC20Token = artifacts.require("./token/IxoERC20Token");
var AuthContract = artifacts.require("./auth/AuthContract");
var ProjectWalletFactory = artifacts.require("./project/ProjectWalletFactory");
var ProjectWalletRegistry = artifacts.require("./project/ProjectWalletRegistry");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Ownable);
  deployer.link(SafeMath, IxoERC20Token);
  deployer.link(Ownable, [IxoERC20Token, ProjectWalletRegistry]);
  // set the deployed instance of IxoERC20Token in constructor of the ProjectWalletRegistry
  deployer.deploy(IxoERC20Token).then(function() {
    return deployer.deploy(AuthContract, [], 0);
  }).then(function() {
    return deployer.deploy(ProjectWalletFactory);
  }).then(function() {
    return deployer.deploy(ProjectWalletRegistry, IxoERC20Token.address, AuthContract.address, ProjectWalletFactory.address);
  });

};