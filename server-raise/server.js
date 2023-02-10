const express = require('express');
const http = require('http');
const { hri } = require('human-readable-ids');
const ClientManager = require('./src/lib/ClientManager');
const { GetClientIdFromHostname } = require('./src/utils/index')
const { argv } = require('./src/constants/config')

const app = express();
const router = express.Router();
app.use(router);

const manager = new ClientManager({ max_tcp_sockets: argv.maxsockets });

router.get('/', async (req, res) => {
    if (req.path !== '/') {
        next();
        return;
    }

    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('making new client with id %s', reqId);
        const info = await manager.newClient(reqId);

        const url = 'http://' + info.id + '.' + req.hostname;
        info.url = url;
        res.json(info);
        return;
    }

    res.redirect(landingPage);
});

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
