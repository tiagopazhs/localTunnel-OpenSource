const Client = require('./client.service')
const TunnelAgent = require('./agent.service');
const auditLog = require('../utils/audit.util')
const catalogLog = require('../utils/catalog.util')
const Clients = new Map()
const Net = require('net');

async function isOpenPort(id, port) {
    const server = new Net.Server();
    let testPortResult = true
    try {
        testPortResult = await new Promise((resolve) => {
            server.on('error', async (err) => {
                if (err.code === 'EADDRINUSE') resolve(false)
                else await auditLog(id, err)
            });
            server.listen(port, () => {
                server.close()
                resolve(true)
            });
        });
    } catch (err) {
        await auditLog(id, err)
    }
    return testPortResult;
}

async function checkPort(id) {
    const ports = [40051, 40052, 40053];
    for (let i = 0; i < ports.length; i++) {
        await auditLog(id, `Checking port ${ports[i]}`)
        if (await isOpenPort(id, ports[i])) {
            await auditLog(id, `Port ${ports[i]} is available`)
            return ports[i];
        }
    }
    await auditLog(id, `All ports are in use`)
    return null;
}

async function newClient(id) {
    const openPort = await checkPort(id)
    const agent = new TunnelAgent({ clientId: id, tcpPort: openPort });
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
    await client.close();
    return;
}

async function getClient(id) {
    return Clients[id];
}

module.exports = { newClient, removeClient, getClient }