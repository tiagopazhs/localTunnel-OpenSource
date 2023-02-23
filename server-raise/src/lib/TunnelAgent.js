const { Agent } = require('http');
const net = require('net');
const { parameters } = require('../config/config')

class TunnelAgent extends Agent {
  availableSockets = [];
  waitingCreateConn = [];
  connectedSockets = 0;
  started = false;
  closed = false;

  stats = () => {
    return {
      connectedSockets: this.connectedSockets,
    };
  };

  listen = async () => {
    if (this.started) {
      throw new Error('already started');
    }
    this.started = true;

    this.server = net.createServer();

    this.server.on('close', this._onClose);
    this.server.on('connection', this._onConnection);
    this.server.on('error', (err) => {
      if (err.code == 'ECONNRESET' || err.code == 'ETIMEDOUT') {
        return;
      }
      console.error(err);
    });

    const port = await new Promise((resolve) => {
      this.server.listen(() => {
        const port = this.server.address().port;
        console.log('tcp server listening on port: ', port);

        resolve(port);
      });
    });

    return { port };
  };

  _onClose = () => {
    this.closed = true;
    console.log('closed tcp socket %s');
    for (const conn of this.waitingCreateConn) {
      conn(new Error('closed'), null);
    }
    this.waitingCreateConn = [];
    this.emit('end');
  };

  _onConnection = (socket) => {
    if (this.connectedSockets >= parameters.maxsockets) {
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
  };

  createConnection = (options, cb) => {
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
  };

  destroy = (next) => {
    console.log('emit destroy');
    this.server.close(next);
  };
}

module.exports = TunnelAgent