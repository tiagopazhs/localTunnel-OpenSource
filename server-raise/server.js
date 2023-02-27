const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const TunnelMiddleware = require('./src/middlewares/tunnel.middleware')
const TunnelRouter = require('./src/routes/tunnel.router')
const Catalog = require('./src/routes/catalog.router')
const { parameters } = require('./src/config/config')

app.use('/', TunnelMiddleware, TunnelRouter)
app.use('/catalog', Catalog)

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
