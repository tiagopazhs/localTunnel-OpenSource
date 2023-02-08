const http = require('http');
const pump = require('pump');
const EventEmitter = require('events');

const Client = (options) => {
    const client = new EventEmitter();

    const agent = options.agent;
    const id = options.id;

    client.graceTimeout = setTimeout(() => {
        client.close();
    }, 1000).unref();

    agent.on('online', () => {
        console.log('client online %s', id);
        clearTimeout(client.graceTimeout);
    });

    agent.on('offline', () => {
        console.log('client offline %s', id);

        clearTimeout(client.graceTimeout);

        client.graceTimeout = setTimeout(() => {
            client.close();
        }, 1000).unref();
    });

    agent.once('error', (err) => {
        client.close();
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

    client.handleUpgrade = (req, socket) => {
        socket.once('error', (err) => {
            if (err.code == 'ECONNRESET' || err.code == 'ETIMEDOUT') {
                return;
            }
            console.error(err);
        });

        agent.createConnection({}, (err, conn) => {
            if (err) {
                socket.end();
                return;
            }

            if (!socket.readable || !socket.writable) {
                conn.destroy();
                socket.end();
                return;
            }

            const arr = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
            for (let i = 0; i < req.rawHeaders.length - 1; i += 2) {
                arr.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
            }

            arr.push('');
            arr.push('');

            pump(conn, socket);
            pump(socket, conn);
            conn.write(arr.join('\r\n'));
        });
    };

    return client;
};

module.exports = Client;