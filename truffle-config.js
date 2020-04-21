var HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "";
const walletChildNum = 0;
const networkAddress = "https://mainnet.infura.io/v3/<your-api-key>";
const ropstenNetworkAddress = "https://ropsten.infura.io/v3/<your-api-key>";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545, // ganache-cli
      network_id: '*', // Match any network id
      gas: 6700000,
      gasPrice: 0x01
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8321,
      gas: 10000000000000,
      gasPrice: 0x01
    },
    ropsten: {
      network_id: 3,
      provider: function() {
        return new HDWalletProvider(mnemonic, ropstenNetworkAddress, walletChildNum)
      },
      // ropsten block limit
      gas: 4700000,
      gasPrice: 0x01
    },
    mainnet: {
      network_id: 1,
      provider: function () {
        return new HDWalletProvider(mnemonic, networkAddress, walletChildNum)
      },
    },
  },
  compilers: {
    solc: {
      version: "v0.4.24+commit.e67f0147"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
