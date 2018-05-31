pragma solidity ^0.4.21;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";
import "openzeppelin-zos/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ValidatorGuard.sol";

/**
 * @title ContractRegistry
 */
contract ContractRegistry is Ownable {
  using SafeMath for uint256;

  // contracts
  mapping (bytes32 => uint256) private contracts;
  ERC20 public token;

  ValidatorGuard private validatorGuard;
  

  event NewFunding(bytes32 projectDid, address indexed wallet, uint256 value);
  event Withdraw(bytes32 projectDid, address indexed wallet, uint256 value);

  function setValidatorGuard(ValidatorGuard _validatorGuard) onlyOwner public {
    require(_validatorGuard != address(0));
    validatorGuard = _validatorGuard;
  }


/**
 * Sets the ERC20 token to be used for this registry
 * NOTE: You must to call setContractRegistry() on the token to 
 * complete the other side of this link
 */
  function setToken(ERC20 _token) onlyOwner public {
     require(_token != address(0));
     token = _token;
  }

  function getStake(bytes32 _projectDid) public constant returns (uint256) {
    return contracts[_projectDid];
  }

  function fund(bytes32 _projectDid, uint256 _value) public onlyToken {  
 
    if(contracts[_projectDid] == 0) {
      contracts[_projectDid] = _value;
    }else{
      contracts[_projectDid] = contracts[_projectDid].add(_value);
    }
    emit NewFunding(_projectDid, msg.sender, _value); 
  }

  function withdraw(bytes32 txId, bytes32 _projectDid, uint256 _value, address _to) public returns (bool) {
    require(_to != address(0));
    if(validatorGuard.authWithdrawal(msg.sender, txId, _projectDid, _value, _to)){
      contracts[_projectDid] = contracts[_projectDid].sub(_value);

      token.transfer(_to, _value);
      emit Withdraw(_projectDid, _to, _value);
      return true;
    }else{
      return false;
    }
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyToken() {
    require(msg.sender == address(token));
    _;
  }
}
