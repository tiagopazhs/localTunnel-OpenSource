const express = require('express');
const tldjs = require('tldjs');
const http = require('http');
const { hri } = require('human-readable-ids');
const ClientManager = require('./src/lib/ClientManager.js');

const argv = {
    port: 3006,
    address: '0.0.0.0',
    secure: false,
    domain: undefined,
    'max-sockets': 10,
};

const app = express();
const router = express.Router();
app.use(router);

const opt = {};
const landingPage = opt.landing || 'https://localtunnel.github.io/www/';
const schema = argv.secure ? 'https' : 'http';
const manager = new ClientManager({ max_tcp_sockets: argv['max-sockets'] });

function GetClientIdFromHostname(hostname) {
    hostname = hostname.replace(':3006', '.com.br')
    return tldjs.getSubdomain(hostname);
}

router.get('/', async (req, res) => {
    if (req.path !== '/') {
        next();
        return;
    }

    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('making new client with id %s', reqId);
        const info = await manager.newClient(reqId);

        const url = schema + '://' + info.id + '.' + req.hostname;
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
