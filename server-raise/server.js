const express = require('express');
const app = express();
const http = require('http');
const { GetClientIdFromHostname } = require('./src/utils/index')
const tunnels = require('./src/routes/tunnels')
const controlPanel = require('./src/routes/controlPanel')
const { parameters, manager } = require('./src/constants/config')

app.use('/', tunnels)
app.use('/control-panel', controlPanel)

const server = http.createServer((req, res) => {
    const clientId = GetClientIdFromHostname(req.headers.host);
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
