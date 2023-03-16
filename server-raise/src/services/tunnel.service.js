const Client = require('./client.service')
const TunnelAgent = require('./agent.service');
const auditLog = require('../utils/audit.util')
const catalogLog = require('../utils/catalog.util')
const Clients = new Map()

async function newClient(id) {
    const agent = new TunnelAgent({ clientId: id });
    const client = new Client({ id, agent });
    Clients[id] = client;
    const { port } = await agent.listen();
    auditLog(id, "create connection")
    catalogLog(id, "open")
    return { id, port };
}

async function removeClient(id) {
    const client = Clients[id];
    if (!client) return;
    auditLog(id, "close connection")
    catalogLog(id, "close")
    delete Clients[id];
    client.close();
}

async function getClient(id) {
    return Clients[id];
}

module.exports = { newClient, removeClient, getClient }