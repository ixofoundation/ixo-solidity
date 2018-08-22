import assertRevert from '../helpers/assertRevert';
const IxoERC20Token = artifacts.require('../../contracts/token/IxoERC20Token.sol');
const ProjectWallet = artifacts.require('../../contracts/project/ProjectWallet.sol');
const ProjectWalletFactory = artifacts.require('../../contracts/project/ProjectWalletFactory.sol');
const ProjectWalletRegistry = artifacts.require('../../contracts/project/ProjectWalletRegistry.sol');

contract('ProjectWalletRegistryTest', function ([_, owner, minter, authoriser, recipient]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const PROJECT_DID = web3.fromAscii('did:ixo:Q1gfXNEfbZMAswoPzqMha5');

    beforeEach(async function () {
        this.token = await IxoERC20Token.new();
        await this.token.setMinter(minter);
        const minted = await this.token.mint(owner, 200, {from: minter});

        this.factory = await ProjectWalletFactory.new(this.token.address, authoriser);
        this.registry = await ProjectWalletRegistry.new(this.factory.address);

    });


    describe('ensure wallet', function () {
        it('for new wallet', async function () {
  
          await this.registry.ensureWallet(PROJECT_DID);
          const wallet = await this.registry.walletOf(PROJECT_DID);
          assert.notEqual(wallet, ZERO_ADDRESS);
  
        });

        it('for existing wallet', async function () {
  
            await this.registry.ensureWallet(PROJECT_DID);
            const wallet1 = await this.registry.walletOf(PROJECT_DID);
            await this.registry.ensureWallet(PROJECT_DID);
            const wallet2 = await this.registry.walletOf(PROJECT_DID);
             assert.equal(wallet1, wallet2);
    
          });
      });

    describe('fund project', function () {
      it('fund a wallet', async function () {

        await this.registry.ensureWallet(PROJECT_DID);
        const wallet = await this.registry.walletOf(PROJECT_DID);

        this.token.transfer(wallet, 100, {from: owner});
        const walletBalance = await this.token.balanceOf(wallet);

        assert.equal(walletBalance, 100);
      });
    });

    describe('approve payout', function () {
        it('approve payout', async function () {
  
          await this.registry.ensureWallet(PROJECT_DID);
          const walletAddress = await this.registry.walletOf(PROJECT_DID);
 
          const wallet = new ProjectWallet(walletAddress);

          await this.token.transfer(walletAddress, 100, {from: owner});
          await wallet.increasePayoutApproval(recipient, 100, {from: authoriser});
          await this.token.transferFrom(walletAddress, recipient, 60, {from: recipient});
          const walletBalance = await this.token.balanceOf(walletAddress);
          assert.equal(walletBalance, 40);
          const recipientBalance = await this.token.balanceOf(recipient);
          assert.equal(recipientBalance, 60);
        });

        it('approve payout multiple payouts', async function () {
  
            await this.registry.ensureWallet(PROJECT_DID);
            const walletAddress = await this.registry.walletOf(PROJECT_DID);
   
            const wallet = new ProjectWallet(walletAddress);
  
            await this.token.transfer(walletAddress, 100, {from: owner});
            await wallet.increasePayoutApproval(recipient, 100, {from: authoriser});
            await this.token.transferFrom(walletAddress, recipient, 60, {from: recipient});
            await this.token.transferFrom(walletAddress, recipient, 40, {from: recipient});
            const walletBalance = await this.token.balanceOf(walletAddress);
            assert.equal(walletBalance, 0);
            const recipientBalance = await this.token.balanceOf(recipient);
            assert.equal(recipientBalance, 100);
          });

          it('approve payout not authoriser', async function () {
  
            await this.registry.ensureWallet(PROJECT_DID);
            const walletAddress = await this.registry.walletOf(PROJECT_DID);
    
            const wallet = new ProjectWallet(walletAddress);
    
            await this.token.transfer(walletAddress, 100, {from: owner});
            assertRevert(await wallet.increasePayoutApproval(recipient, 100, {from: owner}));
           });
        });



});
