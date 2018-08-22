pragma solidity ^0.4.24;

import "../utils/Ownable.sol";
import "./ProjectWallet.sol";
import "../token/IxoERC20Token.sol";

contract ProjectWalletRegistry is Ownable {

    mapping(bytes32 => address) public wallets;

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
        ProjectWallet newWallet = new ProjectWallet(_name);
        wallets[_name] = newWallet;
    } 
}