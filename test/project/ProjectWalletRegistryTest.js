import assertRevert from '../helpers/assertRevert';
const IxoERC20Token = artifacts.require('../../contracts/token/IxoERC20Token.sol');
const ProjectWalletRegistry = artifacts.require('../../contracts/project/ProjectWalletRegistry.sol');

contract('ProjectWalletRegistryTest', function ([_, owner, minter]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const PROJECT_DID = web3.fromAscii('did:ixo:Q1gfXNEfbZMAswoPzqMha5');

    beforeEach(async function () {
        this.token = await IxoERC20Token.new();
        await this.token.setMinter(minter);
        this.factory = await ProjectWalletRegistry.new(this.token.address);

        const minted = await this.token.mint(owner, 200, {from: minter});
    });


    describe('ensure wallet', function () {
        it('for new wallet', async function () {
  
          await this.factory.ensureWallet(PROJECT_DID);
          const wallet = await this.factory.walletOf(PROJECT_DID);
          assert.notEqual(wallet, ZERO_ADDRESS);
  
        });

        it('for existng wallet', async function () {
  
            await this.factory.ensureWallet(PROJECT_DID);
            const wallet1 = await this.factory.walletOf(PROJECT_DID);
            await this.factory.ensureWallet(PROJECT_DID);
            const wallet2 = await this.factory.walletOf(PROJECT_DID);
             assert.notEqual(wallet1, wallet2);
    
          });
      });

    describe('fund project', function () {
      it('ensure wallet for new wallet', async function () {

        await this.factory.ensureWallet(PROJECT_DID);
        const wallet = await this.factory.walletOf(PROJECT_DID);

        this.token.transfer(wallet, 100, {from: owner});
        const walletBalance = await this.token.balanceOf(wallet);

        assert.equal(walletBalance, 100);
      });
  });

});
