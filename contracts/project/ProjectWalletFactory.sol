pragma solidity ^0.4.24;

import "./ProjectWalletFactory.sol";
import "../token/IxoERC20Token.sol";
import "./ProjectWallet.sol";

contract ProjectWalletFactory {

    address private token;
    address private authoriser;

    constructor(address _token, address _authoriser) public {
        token = _token;
        authoriser = _authoriser;
    }

    function createWallet(bytes32 _name) public returns (address) {
        address wallet = new ProjectWallet(token, authoriser, _name);
        return wallet;
    }
}


