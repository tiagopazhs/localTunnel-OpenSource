const Koa = require('koa');
const tldjs = require('tldjs');
const http = require('http');
const { hri } = require('human-readable-ids');
const Router = require('koa-router');

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

    const app = new Koa();
    const router = new Router();

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.use(async (ctx, next) => {
        const path = ctx.request.path;

        if (path !== '/') {
            await next();
            return;
        }

        const isNewClientRequest = ctx.query['new'] !== undefined;
        if (isNewClientRequest) {
            const reqId = hri.random();
            console.log('making new client with id %s', reqId);
            const info = await manager.newClient(reqId);

            const url = schema + '://' + info.id + '.' + ctx.request.host;
            info.url = url;
            ctx.body = info;
            return;
        }

        ctx.redirect(landingPage);
    });

    const server = http.createServer();

    const appCallback = app.callback();

    server.on('request', (req, res) => {
        const hostname = req.headers.host;
        if (!hostname) {
            res.statusCode = 400;
            res.end('Host header is required');
            return;
        }

        const clientId = GetClientIdFromHostname(hostname);

        if (!clientId) {
            appCallback(req, res);
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
