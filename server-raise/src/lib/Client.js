const EventEmitter = require('events');
const handleRequest = require('./handleRequest');

const Client = (opt) => {
  const client = new EventEmitter();

  const agent = opt.agent;

  client.graceTimeout = setTimeout(() => {
    client.close();
  }, 1000).unref();

  agent.on('online', () => {
    console.log('client online %s', opt.id);
    clearTimeout(client.graceTimeout);
  });

  agent.on('offline', () => {
    console.log('client offline %s', opt.id);

    clearTimeout(client.graceTimeout);

    client.graceTimeout = setTimeout(() => {
      client.close();
    }, 1000).unref();
  });

  client.stats = () => {
    return agent.stats();
  };

  client.close = () => {
    clearTimeout(client.graceTimeout);
    agent.destroy();
    client.emit('close');
  };

  client.handleRequest = (req, res) => {
    handleRequest(req, res, agent);
  };

  return client;
};

module.exports = Client;
