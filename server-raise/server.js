const express = require('express');
const app = express();
const http = require('http');
const { GetIdFromHost, getClient } = require('./src/utils/index')
const tunnels = require('./src/routes/tunnelsRouter')
const panel = require('./src/routes/panelRouter')
const { parameters } = require('./src/config/config')

app.use('/', tunnels)
app.use('/panel', panel)

const server = http.createServer((req, res) => {
    const clientId = GetIdFromHost(req.headers.host);
    if (!clientId) {
        app(req, res);
        return;
    }

    const client = getClient(clientId);
    if (!client) {
        res.statusCode = 404;
        res.end('Tunnel not found');
        return;
    }

    client.handleRequest(req, res);
});

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
