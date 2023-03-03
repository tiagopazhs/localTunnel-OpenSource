const { getClient } = require('../services/tunnel.service')
const { getId } = require('../utils/subdomain.util')

const tunnelMiddleware = (req, res, next) => {
    const clientId = getId(req.headers.host);
    if (!clientId) {
        req.url = '/'
        return next();
    }

    const client = getClient(clientId);
    if (!client) {
        res.statusCode = 404;
        res.end('Tunnel not found');
        return;
    }

    client.handleRequest(req, res);

    // next()
}

module.exports = tunnelMiddleware