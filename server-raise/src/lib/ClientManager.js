const { hri } = require('human-readable-ids');

const Client = require('./Client.js');
const TunnelAgent = require('./TunnelAgent.js');

class ClientManager {
    constructor(opt) {
        this.opt = opt || {};

        this.clients = new Map();

        this.stats = {
            tunnels: 0
        };

        this.graceTimeout = null;
    }

    async newClient(id) {
        const clients = this.clients;
        const stats = this.stats;

        if (clients[id]) {
            id = hri.random();
        }

        const maxSockets = this.opt.max_tcp_sockets;
        const agent = new TunnelAgent({
            clientId: id,
            maxSockets: 10,
        });

        const client = Client({
            id,
            agent,
        });

        clients[id] = client;

        client.once('close', () => {
            this.removeClient(id);
        });

        try {
            const info = await agent.listen();
            ++stats.tunnels;
            return {
                id: id,
                port: info.port,
                max_conn_count: maxSockets,
            };
        }
        catch (err) {
            this.removeClient(id);
            throw err;
        }
    }

    removeClient(id) {
        console.log('removing client: %o', id);
        const client = this.clients[id];
        if (!client) {
            return;
        }
        --this.stats.tunnels;
        delete this.clients[id];
        client.close();
    }

    hasClient(id) {
        return !!this.clients[id];
    }

    getClient(id) {
        return this.clients[id];
    }
}

module.exports = ClientManager;
