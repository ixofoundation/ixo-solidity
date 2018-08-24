import assertRevert from '../helpers/assertRevert';
import ethers from 'ethereumjs-util';
const MockProjectWallet = artifacts.require('../../contracts/mocks/MockProjectWallet.sol')
const AuthContract = artifacts.require('../../contracts/auth/AuthContract.sol')

contract('AuthTest', function ([_, owner, recipient, minter, account1, account2, account3]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const TEST_ADDRESS = '0x0AeBDD786607179a3D5B11e6aEc22E203a388122';
    const DATA = 32;
    const padding = '0000000000000000000000000000000000000000000000000000000000000000';

    const txData = '0x40c10f190000000000000000000000000AeBDD786607179a3D5B11e6aEc22E203a38812200000000000000000000000000000000000000000000000000000000000000c8';

    beforeEach(async function () {
        this.auth = await AuthContract.new();
        this.mock = await MockProjectWallet.new(TEST_ADDRESS, ZERO_ADDRESS, DATA);
    });

    describe('call', function () {
        it('call', async function () {
            // let method = ethers.bufferToHex(ethers.keccak256("testMethod(address, uint256)")) + '00000000';
            // method = method.substring(0,10);
            // const addrHex = pad(TEST_ADDRESS.substring(2));
            // let valHex = pad(ethers.bufferToHex(ethers.toBuffer(DATA)).substring(2));
            // const data = method + addrHex + valHex;
            // console.log(await this.mock.testMethod(TEST_ADDRESS, DATA));
            // console.log( data );
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, ZERO_ADDRESS, DATA);
//            await this.mock.testMethod(TEST_ADDRESS, DATA);
            const called = await this.mock.called();
            assert.equal(called, 1);
        });
    });

    const pad = function(data){
        let valHex = padding + data;
        valHex = valHex.substring(valHex.length - 64);
        return valHex;
    }
});