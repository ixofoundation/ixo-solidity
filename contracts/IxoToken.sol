pragma solidity ^0.4.23;

import "openzeppelin-zos/contracts/token/ERC20/DetailedMintableToken.sol";

/**
 * @title Ixo token
 * @dev Capped, mintable IXO Token
 */
contract IxoToken is DetailedMintableToken {
  uint256 public cap;
  address private contractRegistry;

  function initialize(
    address _sender
  )
    isInitializer("IxoToken", "1.0.0")
    public
  {
    DetailedMintableToken.initialize(_sender, "IXO Token", "IXO", 18);
  }

  function setCap(uint256 _cap) onlyOwner public {
    require(_cap.sub(totalSupply_) >= 0);
    cap = _cap;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) onlyOwner canMint public returns (bool) {
    require(totalSupply_.add(_amount) <= cap);

    return super.mint(_to, _amount);
  }

  function setContractRegistry(address _contractRegistry) public onlyOwner {
    require(_contractRegistry != address(0));
    contractRegistry = _contractRegistry;
  }

  function fund(bytes32 _projectDid, uint256 _value) public {
    require(_projectDid.length != 0);
    require(_value > 0);
    if(transfer(contractRegistry, _value)){
      address(contractRegistry).call(bytes4(keccak256("fund(bytes32,uint256)")), _projectDid, _value);
    }
  }

}