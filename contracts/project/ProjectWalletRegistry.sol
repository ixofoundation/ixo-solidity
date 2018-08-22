pragma solidity ^0.4.24;

import "../utils/Ownable.sol";
import "./ProjectWalletFactory.sol";
import "../token/IxoERC20Token.sol";

contract ProjectWalletRegistry is Ownable {

    address private factory;
    mapping(bytes32 => address) private wallets;

    constructor(address _factory) public {
        factory = _factory;
    }

    function setFactory(address _factory) public onlyOwner {
        factory = _factory;
    }

    function ensureWallet(bytes32 _name) public returns (address) {
        if(wallets[_name] == address(0)) {
            _createWallet(_name);
        }
        address wallet = wallets[_name];
        return wallet;
    }

    function walletOf(bytes32 _name) public view returns (address) {
        return wallets[_name];
    }

    function _createWallet (bytes32 _name) public { //internal {
        address newWallet = ProjectWalletFactory(factory).createWallet(_name);
        wallets[_name] = newWallet;
    } 
}