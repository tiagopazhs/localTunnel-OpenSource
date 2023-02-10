const express = require('express');
const app = express();
const http = require('http');
const { GetClientIdFromHostname } = require('./src/utils/index')
const tunnels = require('./src/routes/tunnels')
const { parameters, manager } = require('./src/constants/config')

app.use('/', tunnels)

const server = http.createServer((req, res) => {
    
    const hostname = req.headers.host;

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

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
