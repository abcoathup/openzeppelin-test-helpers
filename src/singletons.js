const { web3 } = require('./setup');
const ether = require('./ether');
const send = require('./send');

const {
  ERC1820_REGISTRY_ABI,
  ERC1820_REGISTRY_ADDRESS,
  ERC1820_REGISTRY_BYTECODE,
  ERC1820_REGISTRY_DEPLOY_TX,

  RELAYHUB_ABI,
  RELAYHUB_ADDRESS,
  RELAYHUB_BYTECODE,
  RELAYHUB_DEPLOY_TX,
} = require('./data');

const contract = require('truffle-contract');

const ERC1820RegistryArtifact = contract({
  abi: ERC1820_REGISTRY_ABI,
  unlinked_binary: ERC1820_REGISTRY_BYTECODE, /* eslint-disable-line camelcase */
});
ERC1820RegistryArtifact.setProvider(web3.currentProvider);

const RelayHubArtifact = contract({
  abi: RELAYHUB_ABI,
  unlinked_binary: RELAYHUB_BYTECODE, /* eslint-disable-line camelcase */
});
RelayHubArtifact.setProvider(web3.currentProvider);

async function ERC1820Registry (funder) {
  // Read https://eips.ethereum.org/EIPS/eip-1820 for more information as to how the ERC1820 registry is deployed to
  // ensure its address is the same on all chains.

  if ((await web3.eth.getCode(ERC1820_REGISTRY_ADDRESS)).length > '0x0'.length) {
    return ERC1820RegistryArtifact.at(ERC1820_REGISTRY_ADDRESS);
  }

  // 0.08 ether is needed to deploy the registry, and those funds need to be transferred to the account that will deploy
  // the contract.
  await send.ether(funder, '0xa990077c3205cbDf861e17Fa532eeB069cE9fF96', ether('0.08'));

  await web3.eth.sendSignedTransaction(ERC1820_REGISTRY_DEPLOY_TX);

  return ERC1820RegistryArtifact.at(ERC1820_REGISTRY_ADDRESS);
}

async function RelayHub (funder) {
  if ((await web3.eth.getCode(RELAYHUB_ADDRESS)).length > '0x0'.length) {
    return RelayHubArtifact.at(RELAYHUB_ADDRESS);
  }

  // 0.6 ether is needed to deploy the RelayHub contract, and those funds need to be transferred to the account that
  // will deploy the contract.
  await send.ether(funder, '0xadc4041bc3022b31745e3a0a339e7e41e5bfef09', ether('0.6'));

  await web3.eth.sendSignedTransaction(RELAYHUB_DEPLOY_TX);

  return RelayHubArtifact.at(RELAYHUB_ADDRESS);
}

module.exports = {
  ERC1820Registry,
  RelayHub,
};
