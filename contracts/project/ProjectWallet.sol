pragma solidity ^0.4.24;

import "../utils/Ownable.sol";

contract ProjectWallet is Ownable {
    bytes32 public name;

    constructor(bytes32 _name) public {
        name = _name;
    }
}