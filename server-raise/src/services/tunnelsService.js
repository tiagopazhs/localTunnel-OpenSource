const Client = require('../lib/Client');
const TunnelAgent = require('../lib/TunnelAgent.js');
let currentTunnels = {tunnels: 0, ids: {}}
const clients = new Map()

function tunnelAction (param, id) {
    if (param === 'add') { currentTunnels.tunnels ++; currentTunnels.ids = {id}; console.log(`creating client: ${id}`) }
    else { currentTunnels.tunnels --; currentTunnels.ids = {}; console.log(`removing client: ${id}`) }
};

async function newClient(id) {
    const agent = TunnelAgent({ clientId: id});
    const client = Client({ id, agent });
    clients[id] = client;
    const { port } = await agent.listen();
    tunnelAction('add', id)
    return { id, port};
}

function removeClient(id) {
    const client = clients[id];
    if (!client) return;
    tunnelAction('remove', id)
    delete clients[id];
    client.close();
}

function getClient(id) {
    return clients[id];
}

module.exports = { newClient, removeClient, getClient, currentTunnels }