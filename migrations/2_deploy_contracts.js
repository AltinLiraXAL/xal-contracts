const XAL = artifacts.require('AltinLiraXAL');
const Proxy = artifacts.require('AdminUpgradeabilityProxyXAL');

module.exports = async function(deployer) {
  await deployer;

  await deployer.deploy(XAL);
  const proxy = await deployer.deploy(Proxy, XAL.address);
  const proxiedXAL = await XAL.at(proxy.address);
  await proxy.changeAdmin("0x75E2d5B3Ed2A8854B416edf16C4b9Aa901dD4ea5");
  await proxiedXAL.initialize();
};
