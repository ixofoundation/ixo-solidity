import assertRevert from '../helpers/assertRevert';
import ethers from 'ethereumjs-util';
const MockProjectWallet = artifacts.require('../../contracts/mocks/MockProjectWallet.sol')
const AuthContract = artifacts.require('../../contracts/auth/AuthContract.sol')

contract('AuthTest', function ([_, owner, recipient, minter, account1, account2, account3, account4]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const TEST_ADDRESS = '0x0AeBDD786607179a3D5B11e6aEc22E203a388122';
    const TEST_ADDRESS2 = '0x0AeBDD786607179a3D5B11e6aEc22E203a388133';
    const DATA = 32;
    const DATA2 = 40;
    const padding = '0000000000000000000000000000000000000000000000000000000000000000';

    beforeEach(async function () {
        this.auth = await AuthContract.new([account1, account2, account3], 2);
        this.mock = await MockProjectWallet.new(TEST_ADDRESS, account1, DATA);
    });

    describe('call', function () {
        it('call quorum not reached', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called = await this.mock.called();
            assert.equal(called, 0);
        });

        it('call quorum not reached - same validator confirmed twice', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called = await this.mock.called();
            assert.equal(called, 0);
            await assertRevert(this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1}));
        });

        it('call quorum reached', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called1 = await this.mock.called();
            assert.equal(called1, 0);
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account2});
            const called = await this.mock.called();
            assert.equal(called, 1);
        });

        it('call quorum not reached - diff transaction id', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('123', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called1 = await this.mock.called();
            assert.equal(called1, 0);
            await this.auth.validate('124', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account2});
            const called = await this.mock.called();
            assert.equal(called, 0);
        });

        it('call quorum not reached - id, receiver mismatch', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('125', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called1 = await this.mock.called();
            assert.equal(called1, 0);
            await assertRevert(this.auth.validate('125', this.mock.address, TEST_ADDRESS2, account1, DATA, {from: account2}));
        });

        it('call quorum not reached - id, sender mismatch', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('125', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called1 = await this.mock.called();
            assert.equal(called1, 0);
            await assertRevert(this.auth.validate('125', this.mock.address, TEST_ADDRESS, account2, DATA, {from: account2}));
        });

        it('call quorum not reached - id, amount mismatch', async function () {
            const calledPre = await this.mock.called();
            assert.equal(calledPre, 0);
            await this.auth.validate('125', this.mock.address, TEST_ADDRESS, account1, DATA, {from: account1});
            const called1 = await this.mock.called();
            assert.equal(called1, 0);
            await assertRevert(this.auth.validate('125', this.mock.address, TEST_ADDRESS, account1, DATA2, {from: account2}));
        });

        it('call non member', async function () {
            await assertRevert(this.auth.validate('123', this.mock.address, account1, ZERO_ADDRESS, DATA, {from: account4}));
        });
    });

    const pad = function(data){
        let valHex = padding + data;
        valHex = valHex.substring(valHex.length - 64);
        return valHex;
    }
});