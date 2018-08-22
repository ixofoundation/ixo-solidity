pragma solidity ^0.4.24;

import "../token/IxoERC20Token.sol";

contract ProjectWallet {

    address private token;
    address private authoriser;
    bytes32 public name;

    constructor(address _token, address _authoriser, bytes32 _name) public {
        token = _token;
        authoriser = _authoriser;
        name = _name;
    }

    /**
    * @dev Throws if called by any account other than the authoriser.
    */
    modifier onlyAuthoriser() {
        require(msg.sender == authoriser, "Permission denied");
        _;
    }

    function increasePayoutApproval(
        address _spender,
        uint256 _addedValue
    )
    public onlyAuthoriser
    returns (bool)
    {
        IxoERC20Token(token).increaseApproval(_spender, _addedValue);
    }

    function decreasePayoutApproval(
        address _spender,
        uint256 _addedValue
    )
    public onlyAuthoriser
    returns (bool)
    {
        IxoERC20Token(token).decreaseApproval(_spender, _addedValue);
    }

}
