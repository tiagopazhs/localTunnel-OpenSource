const EventEmitter = require('events');
const HandleClientReq = require('../utils/handle-client-req.util');
const auditLog = require('../utils/audit.util')
const catalogLog = require('../utils/catalog.util')

class client extends EventEmitter {
  constructor(options) {
    super();

    const agent = this.agent = options.agent;
    const id = this.id = options.id;

    this.graceTimeout = setTimeout(() => {
      this.close();
    }, 1000).unref();

    agent.on('online', () => {
      console.log('client online %s', id);
      clearTimeout(this.graceTimeout);
    });

    agent.on('offline', () => {
      auditLog(id, "close connection")
      catalogLog(id, "close")
      clearTimeout(this.graceTimeout);

      this.graceTimeout = setTimeout(() => {
        this.close();
      }, 1000).unref();
    });

    agent.once('error', (err) => {
      this.close();
    });
  }

  status() {
    return this.agent.status();
  }

  close() {
    clearTimeout(this.graceTimeout);
    this.agent.destroy();
    this.emit('close');
  }

  async handleRequest (req, res) {
    try {
      await HandleClientReq(req, res, this.agent);
    } catch (error) {
      console.error('An error occurred while handling the client request:', error);
      res.statusCode = 500;
      res.end();
    }
  };

}

module.exports = client;