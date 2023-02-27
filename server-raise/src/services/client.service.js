const Http = require('http');
const Pump = require('pump');
const EventEmitter = require('events');

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
      console.log('client offline %s', id);

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

  handleRequest(req, res) {
    const opt = {
      path: req.url,
      agent: this.agent,
      method: req.method,
      headers: req.headers
    };

    const clientReq = Http.request(opt, (clientRes) => {
      res.writeHead(clientRes.statusCode, clientRes.headers);

      Pump(clientRes, res);
    });

    clientReq.once('error', (err) => {
    });

    Pump(req, clientReq);
  }
}

module.exports = client;