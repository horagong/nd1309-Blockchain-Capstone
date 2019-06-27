const truffleAssert = require('truffle-assertions');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');
var proof = require('../../zokrates/code/square/proof');

contract('SolnSquareVerifier', accounts => {
    const account = accounts[0];
    const account2 = accounts[1];

    const A = proof["proof"]["a"];
    const B = proof["proof"]["b"];
    const C = proof["proof"]["c"];
    const correctProofInput = proof["inputs"];

    describe('Testing SolnSquareVerifier', function () {
        beforeEach(async function () {
        	const verifier = await Verifier.new({from: account});
            this.contract = await SolnSquareVerifier.new(verifier.address, {from: account});
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract', async function() {
            
            let asyncF = this.contract.addSolution(A, B, C, correctProofInput);
            let check = await asyncF;
            await truffleAssert.passes(asyncF);
            truffleAssert.eventEmitted(check, 'SolutionAdded');
            
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {

            await this.contract.addSolution(A, B, C, correctProofInput); //correctProofInput);
            let canBeMinted = await this.contract.mintNewNFT(correctProofInput[0], correctProofInput[1], account2, {from: account});
            let owner = await this.contract.ownerOf(0);
            assert.equal(account2, owner, "Token was not minted.");

        });
    });
})