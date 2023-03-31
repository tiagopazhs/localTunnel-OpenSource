const Client = require('./client.service')
const TunnelAgent = require('./agent.service');
const auditLog = require('../utils/audit.util')
const catalogLog = require('../utils/catalog.util')
const { checkPort } = require('../utils/port-validation.util')
const Clients = new Map()

async function newClient(id) {
  const openPort = await checkPort(id)
  const agent = new TunnelAgent({ clientId: id, tcpPort: openPort });
  const client = new Client({ id, agent });
  Clients[id] = client;
  const { port } = await agent.listen();
  await auditLog(id, "create connection")
  await catalogLog(id, "open")
  return { id, port };
}

async function removeClient(id) {
  const client = Clients[id];
  if (!client) return;
  await auditLog(id, "close connection")
  catalogLog(id, "close")
  delete Clients[id];
  await client.close();
  return;
}

async function getClient(id) {
  return Clients[id];
}

module.exports = { newClient, removeClient, getClient }