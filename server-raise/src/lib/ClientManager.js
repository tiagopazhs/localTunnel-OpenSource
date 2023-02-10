const hri = require('human-readable-ids').hri;
const Client = require('./Client.js');
const TunnelAgent = require('./TunnelAgent.js');

function ClientManager() {
  const clients = new Map();
  const stats = {
    tunnels: 0,
  };

  async function newClient(id) {
    if (clients[id]) {
      id = hri.random();
    }

    const maxSockets = 10;
    const agent = new TunnelAgent({ clientId: id, maxSockets });
    const client = Client({ id, agent });
    clients[id] = client;

    client.once('close', () => {
      removeClient(id);
    });

    try {
      const { port } = await agent.listen();
      stats.tunnels += 1;
      return { id, port, max_conn_count: maxSockets };
    } catch (err) {
      removeClient(id);
      throw err;
    }
  }

  function removeClient(id) {
    console.log(`removing client: ${id}`);
    const client = clients[id];
    if (!client) return;
    stats.tunnels -= 1;
    delete clients[id];
    client.close();
  }

  function hasClient(id) {
    return !!clients[id];
  }

  function getClient(id) {
    return clients[id];
  }

  return { newClient, removeClient, hasClient, getClient };
}

module.exports = ClientManager;
