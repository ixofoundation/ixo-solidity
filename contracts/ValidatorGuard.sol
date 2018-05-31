pragma solidity ^0.4.21;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";

/**
 * @title ValidatorGuard
 * @dev The ValidatorGuard contract has an whitelist of validators, and provides basic control
 * of functions that require a percentage of whitelist to authroise calls
 */
contract ValidatorGuard is Ownable {
  address[]  public  members;
  uint       public  quorum;
  
  mapping (bytes32 => WithdrawalAction)        public  withdrawalActions;
  mapping (uint => mapping (address => bool))  public  confirmedBy;
  mapping (address => bool)                    public  isMember;

  struct WithdrawalAction {
      bytes32 projectDid; 
      uint256 value;
      address to;

      uint     confirmations;
      bool     triggered;
  }

  function initialize(
    address _sender
  )
    isInitializer("ValidatorGuard", "1.0.0")
    public
  {
    Ownable.initialize(_sender);
  }

  function setQuorum(uint _quorum) public onlyOwner {
    require(_quorum > 0);
    require(_quorum <= members.length);
    quorum = _quorum;
  }

  function addMember(address _newMember) public onlyOwner {
    require(_newMember != address(0));
    require(!isMember[_newMember]);
    members.push(_newMember);
    isMember[_newMember] = true;
  }

  function authWithdrawal(address _sender, bytes32 txId, bytes32 _projectDid, uint256 _value, address _to) public onlyMembers(_sender) returns (bool) {
    require(_value >= 0);
    if(withdrawalActions[txId].triggered) {
      return false;
    }
    if (withdrawalActions[txId].value == 0){
      withdrawalActions[txId].projectDid = _projectDid;
      withdrawalActions[txId].value = _value;
      withdrawalActions[txId].to = _to;
    }else{
      require(withdrawalActions[txId].projectDid == _projectDid);
      require(withdrawalActions[txId].value == _value);
      require(withdrawalActions[txId].to == _to);
    }
    withdrawalActions[txId].confirmations++;
    if(withdrawalActions[txId].confirmations >= quorum){
      withdrawalActions[txId].triggered = true;
      return true;
    }
    return false;
  }

  modifier onlyMembers(address _sender) {
      assert(isMember[_sender]);
      _;
  }

}
