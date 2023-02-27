const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const TunnelsMiddleware = require('./src/middlewares/TunnelsMiddleware')
const TunnelsRouter = require('./src/routes/TunnelsRouter')
const Catalog = require('./src/routes/catalog.router')
const { parameters } = require('./src/config/config')

app.use('/', TunnelsMiddleware, TunnelsRouter)
app.use('/catalog', Catalog)

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
