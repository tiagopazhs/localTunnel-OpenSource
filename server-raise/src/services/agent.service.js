const { Agent } = require('http');
const TunnelAgentStats = require('../utils/agent-stats.util');
const net = require('net');
const destroy = require('../utils/destroy.util');
const createConnection = require('../utils/create-connection.util');
const TunnelAgentServer = require('../middlewares/TunnelAgentServer');

class TunnelAgent extends Agent {
  availableSockets = [];
  waitingCreateConn = [];
  connectedSockets = 0;
  started = false;
  closed = false;

  stats = TunnelAgentStats(Agent);

  listen = async () => {
    if (this.started) {
      throw new Error('already started');
    }
    this.started = true;

    this.server = net.createServer();

    this.server.on('close', TunnelAgentServer._onClose.bind(this));
    this.server.on('connection', TunnelAgentServer._onConnection.bind(this));
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
    createConnection(this, options)
      .then(sock => cb(null, sock))
      .catch(err => cb(err));
  }

  destroy = (next) => {
    destroy(this.server, next);
  };
}

module.exports = TunnelAgent;
