# ixo-solidity
Solidity contracts for ixo protocol 

## Contracts

The Ixo smart contracts facilitate the creation of ProjectWalles and the authorisation of payments from the project wallet after they have been validated by the ixo blockchain nodes. 

![SmartContracts](./SmartContracts.png)

### IXOERC20Token
This is the ERC20 token that represents the IXO token.  It has minting functionality up to the Cap amount.

Symbol: IXO

Decimals: 8

Cap: 10 bil Tokens

### ProjectWallet
This is an interface for the project wallet.  It has one methor to transfer IXO tokens from this wallet to another wallet.
### BasicProjectWallet
This is a basic implementation of the ProjectWallet.  Over time ProjectWallets would be able to contain other token types.
### ProjectWalletFactory
This smart contract is responsilble for creating ProjectWallet implementations  The current one created BasicProjectWallets
### ProjectWalletRegistry
The ProjectWalletRegistry contains a mapping of projectDID to their ProjectWallet.  At any time the ProjectWallet associated to a project can be found here buy looking up the projectDID.  The projectDID is a 32 byte hex representation of the project DID without the 'did:ixo:' portion.
### ProjectWalletAuthoriser
This contract is authorised to transfer funds out of the ProjectWallet.
### AuthContract
This contract takes signed requests from its configured members to transfer tokens from a project wallet to another wallet and when a quorum is reached a call is made to the ProjectWalletAuthoriser to authorise the transfer.  This wallet is separate from the ProjectWalletAuthoriser to ensure that if the AuthContract is changed that every ProjectWallet does not need to be updated.

## Setup
- Install Ganache from Truffle
- Set Gas to 20 and Gas Limit to 200000000

## Compile
`truffle compile`

## Test
`truffle test --network development`

## Ropsten Contracts
Running migration: 2_deploy_ixotoken.js
  Deploying SafeMath...
  ... 0x2a33b611e028fbf6b8f3f1e092e9c16b46458301ff5c12c8dceb72188e0a7193
  SafeMath: 0x994096ee32f82f813f37a8dea5af7922785f26cd
  Deploying Ownable...
  ... 0xed1ea4bbdf0c4a3bae4ba1eb232f5a8086b6bec66a287bb91584ee0dcf421030
  Ownable: 0x3d522ee87fe7db24534a757efd967dda4a51bfb0
  Deploying IxoERC20Token...
  ... 0x896e7bcaa0276e73c4317baa88082c6c37df9f3138790f3361bee67d70141511
  IxoERC20Token: 0x7eef79aa5bbe0aba4f5d11017ecb604cd81f1f97
  Deploying AuthContract...
  ... 0x4b58995e7281e464f98c08b106591fc98367f6747dc8756e3ca575c6c97b4050
  AuthContract: 0x89e6268c5897b037d54eeace2fc33f0280b145a1
  Deploying ProjectWalletFactory...
  ... 0x28a4ed5468fc940c96082dea6e2880624f106a78037ea2a330f225dbc002c8c7
  ProjectWalletFactory: 0xe7372b7f28facd66855f950a87d04cc7d005cf00
  Deploying ProjectWalletRegistry...
  ... 0x6503e038d04bf24e8af8e048c145f0121b709d24d48ac3abb0b86a53a374616d
  ProjectWalletRegistry: 0xa8bfa5b0b8d16cad654d84ce5cf09fa5e8ecc6f2
Saving successful migration to network...
  ... 0x2060e8008b9f51122a0a6f9b4f0f4f28dd7e5d0ec446d107c24d9dc76c31c31c
Saving artifacts...

