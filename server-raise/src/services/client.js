const EventEmitter = require('events');
const { handleOnline, handleOffline } = require('../utils/eventHandlers');
const { stats, close, handleRequestWrapper } = require('./methods');

const Client = (opt) => {
  const client = new EventEmitter();
  const agent = opt.agent;

  client.graceTimeout = setTimeout(() => {
    client.close();
  }, 1000).unref();

  agent.on('online', () => {
    handleOnline(client, opt);
  });

  agent.on('offline', () => {
    handleOffline(client, opt);
  });

  client.stats = () => {
    return stats(agent);
  };

  client.close = () => {
    close(client, agent);
  };

  client.handleRequest = (req, res) => {
    handleRequestWrapper(client, req, res, agent);
  };

  return client;
};

module.exports = Client;
