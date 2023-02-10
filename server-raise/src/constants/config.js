const ClientManager = require('../lib/ClientManager');

const argv = {
    port: 3006,
    address: '0.0.0.0',
    secure: false,
    domain: undefined,
    maxsockets: 10,
};

const manager = ClientManager();

module.exports = { argv, manager };