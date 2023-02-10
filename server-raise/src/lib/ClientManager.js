const hri = require('human-readable-ids').hri;
const Client = require('./Client.js');
const TunnelAgent = require('./TunnelAgent.js');

function ClientManager() {
  const clients = new Map();
  const status = {
    tunnels: 0,
    ids: {}
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
      status.tunnels += 1;
      status.ids[id] = status.tunnels;
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
    status.tunnels -= 1;
    delete clients[id];
    client.close();
  }

  function getClient(id) {
    return clients[id];
  }

  return { newClient, removeClient, getClient , status};
}

module.exports = ClientManager;
