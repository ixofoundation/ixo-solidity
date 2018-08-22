import assertRevert from '../helpers/assertRevert';
const IxoERC20Token = artifacts.require('../../contracts/token/IxoERC20Token.sol')

contract('IxoERC20Test', function ([_, owner, recipient, minter, account1, account2, account3]) {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    beforeEach(async function () {
        this.token = await IxoERC20Token.new();
        await this.token.setMinter(minter);
        const minted = await this.token.mint(owner, 200, {from: minter});
    });

    describe('cap', function () {
        it('check cap amount', async function () {
            const cap = await this.token.CAP();

            assert.equal(cap, 10000000000 * (10 ** 8));
        });
    });

    describe('mint tokens', function () {
        it('mints tokens to an address', async function () {
            const minted = await this.token.mint(account2, 200, {from: minter});
            const totalSupply = await this.token.totalSupply();
            const balance = await this.token.balanceOf(account2);

            assert.equal(totalSupply, 400);
            assert.equal(balance, 200);
        });

        it('mints tokens to an address from non-minter', async function () {
            assertRevert( this.token.mint(account2, 200));
        });

        it('mints tokens up to cap', async function () {
            const cap = await this.token.CAP();
            const startTotalSupply = await this.token.totalSupply();
            const remaining = cap.minus(startTotalSupply);

            const minted = await this.token.mint(account3, remaining, {from: minter});

            const totalSupply = await this.token.totalSupply();
            assert.equal(cap.equals(totalSupply), true);
        });

        it('mints tokens over to cap', async function () {
            const cap = await this.token.CAP();
            const startTotalSupply = await this.token.totalSupply();
            const remaining = cap.minus(startTotalSupply);

            assertRevert( this.token.mint(account3, remaining.plus(1), {from: minter}));
        });
        
    });

    describe('transfer ownership', function () {

        it('transfer ownership', async function () {

            await this.token.transferOwnership(account1);
            const newOwner = await this.token.owner();

            assert.equal(newOwner, account1);
        });

    });

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {

            const totalSupply = await this.token.totalSupply();

            assert.equal(totalSupply, 200);
        });

    });

    describe('balanceOf', function () {
        describe('when the requested account has no tokens', function () {
            it('returns zero', async function () {
                const balance = await this.token.balanceOf(account1);

                assert.equal(balance, 0);
            });
        });

        describe('when the requested account has some tokens', function () {
            it('returns the total amount of tokens', async function () {
                const balance = await this.token.balanceOf(owner);

                assert.equal(balance, 200);
            });
        });
    });

    describe('transfer', function () {
        describe('when the recipient is not the zero address', function () {
            const to = recipient;

            describe('when the sender does not have enough balance', function () {
                const amount = 201;

                it('reverts', async function () {
                    await assertRevert(this.token.transfer(to, amount, { from: owner }));
                });
            });

            describe('when the sender has enough balance', function () {
                const amount = 100;

                it('transfers the requested amount', async function () {
                    await this.token.transfer(to, amount, { from: owner });

                    const senderBalance = await this.token.balanceOf(owner);
                    assert.equal(senderBalance, 100);

                    const recipientBalance = await this.token.balanceOf(to);
                    assert.equal(recipientBalance, amount);
                });

                it('emits a transfer event', async function () {
                    const { logs } = await this.token.transfer(to, amount, { from: owner });

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Transfer');
                    assert.equal(logs[0].args.from, owner);
                    assert.equal(logs[0].args.to, to);
                    assert(logs[0].args.value.eq(amount));
                });
            });
        });
    });
})