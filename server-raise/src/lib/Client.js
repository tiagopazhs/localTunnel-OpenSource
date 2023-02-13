const http = require('http');
const pump = require('pump');
const EventEmitter = require('events');
// let agent = require('../utils/index')

const Client = (opt) => {
    const client = new EventEmitter();

    const agent = opt.agent;

    client.graceTimeout = setTimeout(() => {
        client.close();
    }, 1000).unref();

    agent.on('online', () => {
        console.log('client online %s', opt.id);
        clearTimeout(client.graceTimeout);
    });

    agent.on('offline', () => {
        console.log('client offline %s', opt.id);

        clearTimeout(client.graceTimeout);

        client.graceTimeout = setTimeout(() => {
            client.close();
        }, 1000).unref();
    });

    client.stats = () => {
        return agent.stats();
    };

    client.close = () => {
        clearTimeout(client.graceTimeout);
        agent.destroy();
        client.emit('close');
    };

    client.handleRequest = (req, res) => {
        const opt = {
            path: req.url,
            agent: agent,
            method: req.method,
            headers: req.headers
        };
        const clientReq = http.request(opt, (clientRes) => {
            res.writeHead(clientRes.statusCode, clientRes.headers);

            pump(clientRes, res);
        });

        clientReq.once('error', (err) => { });

        pump(req, clientReq);
    };

    return client;
};

module.exports = Client;