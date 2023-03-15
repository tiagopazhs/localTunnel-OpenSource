const { getClient } = require('../services/tunnel.service')
const { getId } = require('../utils/handle-url.util')

const tunnelMiddleware = async (req, res, next) => {
    const clientId = getId(req.headers.host);
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
