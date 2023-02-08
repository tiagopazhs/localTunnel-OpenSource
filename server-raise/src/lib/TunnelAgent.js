const { Agent } = require('http');
const net = require('net');

const DEFAULT_MAX_SOCKETS = 10;

class TunnelAgent extends Agent {
    constructor(options = {}) {
        super({
            keepAlive: true,
            maxFreeSockets: 1,
        });

        this.availableSockets = [];

        this.waitingCreateConn = [];

        this.connectedSockets = 0;
        this.maxTcpSockets = options.maxTcpSockets || DEFAULT_MAX_SOCKETS;

        this.server = net.createServer();

        this.started = false;
        this.closed = false;
    }

    stats() {
        return {
            connectedSockets: this.connectedSockets,
        };
    }

    listen() {
        const server = this.server;
        if (this.started) {
            throw new Error('already started');
        }
        this.started = true;

        server.on('close', this._onClose.bind(this));
        server.on('connection', this._onConnection.bind(this));
        server.on('error', (err) => {
            if (err.code == 'ECONNRESET' || err.code == 'ETIMEDOUT') {
                return;
            }
            console.error(err);
        });


        return new Promise((resolve) => {
            server.listen(() => {
                const port = server.address().port;
                console.log('tcp server listening on port: %d', port);

                resolve({
                    port: port,
                });
            });
        });
    }

    _onClose() {
        this.closed = true;
        console.log('closed tcp socket %s');
        for (const conn of this.waitingCreateConn) {
            conn(new Error('closed'), null);
        }
        this.waitingCreateConn = [];
        this.emit('end');
    }

    _onConnection(socket) {
        if (this.connectedSockets >= this.maxTcpSockets) {
            console.log('no more sockets allowed');
            socket.destroy();
            return false;
        }

        socket.once('close', (hadError) => {
            console.log('closed socket (error: %s)', hadError);
            this.connectedSockets -= 1;
            const idx = this.availableSockets.indexOf(socket);
            if (idx >= 0) {
                this.availableSockets.splice(idx, 1);
            }

            console.log('connected sockets: %s', this.connectedSockets);
            if (this.connectedSockets <= 0) {
                console.log('all sockets disconnected');
                this.emit('offline');
            }
        });

        socket.once('error', (err) => {
            socket.destroy();
        });

        if (this.connectedSockets === 0) {
            this.emit('online');
        }

        this.connectedSockets += 1;
        console.log('new connection from: %s:%s', socket.address().address, socket.address().port);

        const fn = this.waitingCreateConn.shift();
        if (fn) {
            console.log('giving socket to queued conn request');
            setTimeout(() => {
                fn(null, socket);
            }, 0);
            return;
        }

        this.availableSockets.push(socket);
    }

    createConnection(options, cb) {
        if (this.closed) {
            cb(new Error('closed'));
            return;
        }

        console.log('create connection');

        const sock = this.availableSockets.shift();

        if (!sock) {
            this.waitingCreateConn.push(cb);
            console.log('waiting connected: %s', this.connectedSockets);
            console.log('waiting available: %s', this.availableSockets.length);
            return;
        }

        console.log('socket given');
        cb(null, sock);
    }

    destroy() {
        this.server.close();
        super.destroy();
    }
}

module.exports =  TunnelAgent;
