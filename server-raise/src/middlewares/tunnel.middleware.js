const { getClient } = require('../services/tunnel.service')
const { getId } = require('../utils/handle-url.util')
const morgan = require('morgan');

// Tokens to pick ip, resBytes and reqBytes
morgan.token('reqBytes', function (req) {
  return req.headers['content-length'] || '-';
});

morgan.token('resBytes', function (req, res) {
  return res.getHeader('content-length') || '-';
});

morgan.token('ip', function (req, res) {
  return req.ip;
});

//format morgan
const logFormat = 'LOG__:method :url Status :status :res[content-length] bytes :resBytes bytes sent :req[content-length] bytes received - IP: :ip';

const tunnelMiddleware = async (req, res, next) => {

  morgan(logFormat)(req, res, () => {});
  morgan(':method :url :status :reqBytes - :resBytes :response-time ms - IP: :ip')(req, res, () => {});
  res.send('Hello World!')

  const clientId = await getId(req.headers.host);
  if (!clientId) {
    req.url = '/'
    return next();
  }

  const client = await getClient(clientId);
  if (!client) {
    res.statusCode = 404;
    res.end('Tunnel not found');
    return;
  }

  await client.handleRequest(req, res)
    .then(r => {
      return r
    })
    .catch((error) => {
      console.error('An error occurred while resolving the promise:', error);
      res.statusCode = 500;
      res.end();
    });

}

module.exports = tunnelMiddleware
