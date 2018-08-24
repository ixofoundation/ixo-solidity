pragma solidity ^0.4.24;

import "../utils/Ownable.sol";
import "../mocks/MockProjectWallet.sol";

contract AuthContract is Ownable {

    mapping (bytes32 => Action) public actions;

    uint quorum = 0;

    struct Action {
        address  target;
        address  sender;
        address  receiver;
        uint256  amt;

        uint     confirmations;
        uint     deadline;
        bool     triggered;
    }

    /**
    * @dev Throws if called by a non-member.
    */
    modifier onlyMembers() {
        _;
    }

    modifier onlyActive(bytes32 _tx) {
        assert(!actions[_tx].triggered);
        _;
    }

    function validate(
        bytes32  _tx,
        address  _target,
        address  _sender,
        address  _receiver,
        uint256  _amt
    ) public onlyMembers returns (bool) {
        actions[_tx].target = _target;
        actions[_tx].sender = _sender;
        actions[_tx].receiver = _receiver;
        actions[_tx].amt = _amt;
        actions[_tx].triggered = false;

//        if(actions[_tx].confirmations >= quorum){
        _trigger(_tx);
//        }

        return true;
    }

    function _trigger(bytes32 _tx) internal onlyMembers onlyActive(_tx) {
        actions[_tx].triggered = true;
        MockProjectWallet(actions[_tx].target).transfer(actions[_tx].sender, actions[_tx].receiver, actions[_tx].amt);
    }



}
