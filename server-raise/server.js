const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const TunnelMiddleware = require('./src/middlewares/tunnel.middleware')
const TunnelRouter = require('./src/routes/tunnel.router')
const Catalog = require('./src/routes/catalog.router')
const Audit = require('./src/routes/audit.router')
const { parameters } = require('./src/config/config')

//User env file to enter with password
require('dotenv').config()
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

app.use('/', TunnelMiddleware, TunnelRouter)
app.use('/catalog', Catalog)
app.use('/audit', Audit)

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
