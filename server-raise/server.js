const express = require('express');
const tldjs = require('tldjs');
const http = require('http');
const { hri } = require('human-readable-ids');
const router = express.Router();

const ClientManager = require('./lib/ClientManager.js');

module.exports = function(opt) {
    opt = opt || {};

    const validHosts = (opt.domain) ? [opt.domain] : undefined;
    const myTldjs = tldjs.fromUserSettings({ validHosts });
    const landingPage = opt.landing || 'https://localtunnel.github.io/www/';

    function GetClientIdFromHostname(hostname) {
        hostname = hostname.replace(':3006', '.com.br')

        return myTldjs.getSubdomain(hostname);
    }

    const manager = new ClientManager(opt);

    const schema = opt.secure ? 'https' : 'http';

    const app = express();

    app.use(router);

    router.get('/', async (req, res) => {
        const path = req.path;

        if (path !== '/') {
            next();
            return;
        }

        const isNewClientRequest = req.query['new'] !== undefined;
        if (isNewClientRequest) {
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

    return server;
};
