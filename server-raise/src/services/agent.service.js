const { Agent } = require('http');
const Net = require('net');
const AgentStats = require('../utils/agent-stats.util');
const Destroy = require('../utils/destroy.util');
const CreateConnection = require('../utils/create-connection.util');
const SocketsManager = require('../services/sockets-manager.service');

class tunnelAgent extends Agent {
  availableSockets = [];
  waitingCreateConn = [];
  connectedSockets = 0;
  started = false;
  closed = false;

  stats = AgentStats(Agent);

  listen = async () => {
    if (this.started) {
      throw new Error('already started');
    }
    this.started = true;

    this.server = Net.createServer();

    this.server.on('close', SocketsManager._onClose.bind(this));
    this.server.on('connection', SocketsManager._onConnection.bind(this));
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

    return { port, destroy: (next) => destroy(this.server, next) };
  };

  createConnection(options, cb) {
    CreateConnection(this, options)
      .then(sock => cb(null, sock))
      .catch(err => cb(err));
  }

  destroy = (next) => {
    Destroy(this.server, next);
  };
}

module.exports = tunnelAgent;
