const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const TunnelsMiddleware = require('./src/middlewares/TunnelsMiddleware')
const tunnels = require('./src/routes/tunnelsRouter')
const panel = require('./src/routes/panelRouter')
const { parameters } = require('./src/config/config')

app.use('/', TunnelsMiddleware, tunnels)
app.use('/panel', panel)

server.listen(parameters.port, parameters.address, () => {
    console.log('server listening on port:', server.address().port);
});

module.exports = server;
