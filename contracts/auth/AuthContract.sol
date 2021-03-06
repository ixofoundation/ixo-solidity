pragma solidity ^0.4.24;

import "../utils/Ownable.sol";
import "../project/ProjectWalletAuthoriser.sol";

contract AuthContract is Ownable {

    uint       public  quorum;
    uint       public  memberCount;

    mapping (bytes32 => mapping (address => bool)) public  confirmedBy;
    mapping (address => bool) public  isMember;
    mapping (bytes32 => Action) public actions;
  
    struct Action {
        address  target;
        address  sender;
        address  receiver;
        uint256  amt;
        uint     confirmations;
        bool     triggered;
    }

    event Confirmed  (bytes32 id, address member);
    event Triggered  (bytes32 id);
    event MemberExists (address member);
    event MemberDoesNotExist (address member);

    constructor(address[] _members, uint _quorum) public {
        memberCount = _members.length;
        quorum = _quorum;

        for (uint i = 0; i < memberCount; i++) {
            _setMemberStatus(_members[i], true);
        }
    }

    /**
    * @dev Throws if called by a non-member.
    */
    modifier onlyMembers() {
        require(isMember[msg.sender], "Not a member");
        _;
    }

    modifier onlyActive(bytes32 _tx) {
        require(!actions[_tx].triggered, "Transaction already triggered");
        _;
    }

    function setQuorum(uint _quorum) public onlyOwner {
        quorum = _quorum;
    }
    
    function addMember(address _member) public onlyOwner {
        if(!isMember[_member]) {
            _setMemberStatus(_member, true);
            memberCount++;
        } else {
            emit MemberExists(_member);
        }
    }
    
    function removeMember(address _member) public onlyOwner {
        if(isMember[_member]) {
            _setMemberStatus(_member, false);
            memberCount--;
        } else {
             emit MemberDoesNotExist(_member);
        }
    }
    
    function _setMemberStatus(address _member, bool _status) internal {
        isMember[_member] = _status;
    }
    
    function validate(
        bytes32  _tx,
        address  _target,
        address  _sender,
        address  _receiver,
        uint256  _amt
    ) public onlyMembers returns (bool) {
        require(_tx != 0, "Invalid transaction id");
        if(actions[_tx].triggered == true) {
            return true;
        }
        require(_target != address(0), "Invalid target");
        require(_sender != address(0), "Invalid sender");
        require(_receiver != address(0), "Invalid receiver");
        require(_amt >= 0, "Invalid amount");
        require(confirmedBy[_tx][msg.sender] == false, "Cannot confirm same transaction twice");
        if(actions[_tx].confirmations == 0) {
            actions[_tx].target = _target;
            actions[_tx].sender = _sender;
            actions[_tx].receiver = _receiver;
            actions[_tx].amt = _amt;
            actions[_tx].triggered = false;
        } else {
            require(actions[_tx].target == _target, "Invalid transaction id");
            require(actions[_tx].sender == _sender, "Invalid transaction id");
            require(actions[_tx].receiver == _receiver, "Invalid transaction id");
            require(actions[_tx].amt == _amt, "Invalid transaction id");
        }
        actions[_tx].confirmations = actions[_tx].confirmations + 1;
        confirmedBy[_tx][msg.sender] = true;

        emit Confirmed(_tx, msg.sender);

        if(actions[_tx].confirmations >= quorum){
            _trigger(_tx);
            emit Triggered(_tx);
        }

        return true;
    }

    function _trigger(bytes32 _tx) internal onlyMembers onlyActive(_tx) {
        actions[_tx].triggered = true;
        ProjectWalletAuthoriser(actions[_tx].target).transfer(actions[_tx].sender, actions[_tx].receiver, actions[_tx].amt);
    }
}