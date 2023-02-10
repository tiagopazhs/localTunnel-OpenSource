const express = require('express');
const app = express();
const http = require('http');
const { hri } = require('human-readable-ids');
const { GetClientIdFromHostname } = require('./src/utils/index')
const tuneis = require('./src/routes/tuneis')
const { argv, manager } = require('./src/constants/config')


app.use('/', tuneis)


const server = http.createServer((req, res) => {
    const hostname = req.headers.host;
    if (!hostname) {
        res.statusCode = 400;
        res.end('Host header is required');
        return;
    }

    const clientId = GetClientIdFromHostname(hostname);
    if (!clientId) {
        app(req, res);
        return;
    }

    const client = manager.getClient(clientId);
    if (!client) {
        res.statusCode = 404;
        res.end('404');
        return;
    }

    client.handleRequest(req, res);
});

server.listen(argv.port, argv.address, () => {
    console.log('server listening on port: %d', server.address().port);
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('SIGTERM', () => {
    process.exit();
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(reason);
});

module.exports = server;
