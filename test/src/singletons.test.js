const { expect } = require('chai');
const singletons = require('../../src/singletons');
const { ERC1820_REGISTRY_BYTECODE, RELAYHUB_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('ERC1820Registry', function () {
    before(async function () {
      this.registry = await singletons.ERC1820Registry(funder);
    });

    it('returns a truffle-contract instance', function () {
      expect(this.registry.constructor.name).to.equal('TruffleContract');
    });

    it('the registry is stored at the correct address', function () {
      expect(this.registry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });

    it('stores the correct code at the registry address', async function () {
      expect((await web3.eth.getCode(this.registry.address))).to.equal(ERC1820_REGISTRY_BYTECODE);
    });

    it('returns the same truffle-contract when attempting to deploy a second registry', async function () {
      const newRegistry = await singletons.ERC1820Registry(funder);
      expect(newRegistry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });
  });

  describe('RelayHub', function () {
    before(async function () {
      this.relayHub = await singletons.RelayHub(funder);
    });

    it('returns a truffle-contract instance', function () {
      expect(this.relayHub.constructor.name).to.equal('TruffleContract');
    });

    it('the RelayHub contract is stored at the correct address', function () {
      expect(this.relayHub.address).to.equal('0x537F27a04470242ff6b2c3ad247A05248d0d27CE');
    });

    it('stores the correct code at the contract address', async function () {
      expect((await web3.eth.getCode(this.relayHub.address))).to.equal(RELAYHUB_BYTECODE);
    });

    it('returns the same truffle-contract when attempting to deploy a second instance', async function () {
      const newRelayHub = await singletons.RelayHub(funder);
      expect(newRelayHub.address).to.equal('0x537F27a04470242ff6b2c3ad247A05248d0d27CE');
    });
  });
});
