const Client = require('./client.service')
const TunnelAgent = require('./agent.service');
const Clients = new Map()
let currentTunnels = {tunnels: 0, ids: {}}

function tunnelAction (param, id) {
    if (param === 'add') { currentTunnels.tunnels ++; currentTunnels.ids = {id}; console.log(`creating client: ${id}`) }
    else { currentTunnels.tunnels --; currentTunnels.ids = {}; console.log(`removing client: ${id}`) }
};

async function newClient(id) {
    const agent = new TunnelAgent({ clientId: id});
    const client = new Client({ id, agent });
    Clients[id] = client;
    const { port } = await agent.listen();
    tunnelAction('add', id)
    return { id, port};
}

function removeClient(id) {
    const client = Clients[id];
    if (!client) return;
    tunnelAction('remove', id)
    delete Clients[id];
    client.close();
}

function getClient(id) {
    return Clients[id];
}

module.exports = { newClient, removeClient, getClient, currentTunnels }