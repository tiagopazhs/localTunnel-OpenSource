const { Agent } = require('http');
const net = require('net');
const { parameters } = require('../config/config')

const TunnelAgent = () => {

    const AgentTun = new Agent({
        keepAlive: true,
        maxFreeSockets: 1,
    });

    AgentTun.availableSockets = [];
    AgentTun.waitingCreateConn = [];
    AgentTun.connectedSockets = 0;

    AgentTun.server = net.createServer();
    AgentTun.started = false;
    AgentTun.closed = false;

    AgentTun.stats = () => {
        return {
            connectedSockets: AgentTun.connectedSockets,
        };
    }

    AgentTun.listen = () => {
        const server = AgentTun.server;
        if (AgentTun.started) {
            throw new Error('already started');
        }
        AgentTun.started = true;

        server.on('close', AgentTun._onClose.bind(this));
        server.on('connection', AgentTun._onConnection.bind(this));
        server.on('error', (err) => {
            if (err.code == 'ECONNRESET' || err.code == 'ETIMEDOUT') {
                return;
            }
            console.error(err);
        });


        return new Promise((resolve) => {
            server.listen(() => {
                const port = server.address().port;
                console.log('tcp server listening on port: ', port);

                resolve({
                    port: port,
                });
            });
        });
    }

    AgentTun._onClose = () => {
        AgentTun.closed = true;
        console.log('closed tcp socket %s');
        for (const conn of AgentTun.waitingCreateConn) {
            conn(new Error('closed'), null);
        }
        AgentTun.waitingCreateConn = [];
        AgentTun.emit('end');
    }

    AgentTun._onConnection = (socket) => {
        if (AgentTun.connectedSockets >= parameters.maxsockets) {
            console.log('no more sockets allowed');
            socket.destroy();
            return false;
        }

        socket.once('close', (hadError) => {
            console.log('closed socket (error: %s)', hadError);
            AgentTun.connectedSockets -= 1;
            const idx = AgentTun.availableSockets.indexOf(socket);
            if (idx >= 0) {
                AgentTun.availableSockets.splice(idx, 1);
            }

            console.log('connected sockets: %s', AgentTun.connectedSockets);
            if (AgentTun.connectedSockets <= 0) {
                console.log('all sockets disconnected');
                AgentTun.emit('offline');
            }
        });

        socket.once('error', (err) => {
            socket.destroy();
        });

        if (AgentTun.connectedSockets === 0) {
            AgentTun.emit('online');
        }

        AgentTun.connectedSockets += 1;
        console.log('new connection from: %s:%s', socket.address().address, socket.address().port);

        const fn = AgentTun.waitingCreateConn.shift();
        if (fn) {
            console.log('giving socket to queued conn request');
            setTimeout(() => {
                fn(null, socket);
            }, 0);
            return;
        }

        AgentTun.availableSockets.push(socket);
    }

    AgentTun.createConnection = (options, cb) => {
        if (AgentTun.closed) {
            cb(new Error('closed'));
            return;
        }

        console.log('create connection');

        const sock = AgentTun.availableSockets.shift();

        if (!sock) {
            AgentTun.waitingCreateConn.push(cb);
            console.log('waiting connected: %s', AgentTun.connectedSockets);
            console.log('waiting available: %s', AgentTun.availableSockets.length);
            return;
        }

        console.log('socket given');
        cb(null, sock);
    }

    AgentTun.destroy = () => {
        console.log('emit destroy')
        AgentTun.server.close();
        AgentTun.destroy();
    }

    return AgentTun;

}

module.exports = TunnelAgent;
