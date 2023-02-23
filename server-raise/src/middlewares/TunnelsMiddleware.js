const { getClient } = require('../services/TunnelsService')
const { getId } = require('../utils/index')

const TunnelsMiddleware = (req, res, next) => {
    const clientId = getId(req.headers.host);
    if (!clientId) {
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

module.exports = TunnelsMiddleware