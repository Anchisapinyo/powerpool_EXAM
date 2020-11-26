require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const address = '0x9809Edc8d923B01CF35B3AB5bcfd4bd3C083D650';
module.exports = {
	networks: {
		kovan: {
			provider: function() {
				return new HDWalletProvider(
					process.env.MENMONIC,
					process.env.INFURA_API_KEY
				);
			},
			network_id: '42',
			from: address,
		},
		development: {
			host: '127.0.0.1',
			port: 8547,
			network_id: '*', // Match any network id
			from: "0xc08c50f55c952dd08050c280076fba613b3e4db9",
        	gasPrice:0,
        	gas:2100000
		},

		development1: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*', // Match any network id
			from: "0x1cEba9E2081E888a7381F46eff5aCd43128bC689",
        	gasPrice: 350000000000,
        	gas:2100000
		},
	},
	solc: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	},
};
