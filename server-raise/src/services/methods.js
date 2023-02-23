const handleRequest = require('../utils/handleRequest');

const stats = (agent) => {
  return agent.stats();
};

const close = (client, agent) => {
  clearTimeout(client.graceTimeout);
  agent.destroy();
  client.emit('close');
};

const handleRequestWrapper = (client, req, res, agent) => {
  handleRequest(req, res, agent);
};

module.exports = { stats, close, handleRequestWrapper };
