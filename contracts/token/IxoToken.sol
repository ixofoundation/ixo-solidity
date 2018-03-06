pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract IxoToken is StandardToken {
  string public name = "IxoToken"; 
  string public symbol = "IXO";
  uint public decimals = 8;
  uint public INITIAL_SUPPLY = 10000000 * (10 ** decimals);

  function IxoToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}