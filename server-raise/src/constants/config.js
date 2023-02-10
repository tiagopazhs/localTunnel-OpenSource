const ClientManager = require('../lib/ClientManager');
const manager = ClientManager();

const parameters = {
    port: 3006,
    address: '0.0.0.0',
    secure: false,
    domain: undefined,
    landingPage: 'Localtunnel server is running!!! Use a Client Application to send a requisition with query[new] and create a new tunnel.',
    maxsockets: 10,
};

module.exports = { parameters, manager};