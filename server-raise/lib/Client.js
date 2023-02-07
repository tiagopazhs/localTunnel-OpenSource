const http = require('http');
const pump = require('pump');
const EventEmitter = require('events');

class Client extends EventEmitter {
    constructor(options) {
        super();

        const agent = this.agent = options.agent;
        const id = this.id = options.id;

        this.graceTimeout = setTimeout(() => {
            this.close();
        }, 1000).unref();

        agent.on('online', () => {
            console.log('client online %s', id);
            clearTimeout(this.graceTimeout);
        });

        agent.on('offline', () => {
            console.log('client offline %s', id);

            clearTimeout(this.graceTimeout);

            this.graceTimeout = setTimeout(() => {
                this.close();
            }, 1000).unref();
        });

        agent.once('error', (err) => {
            this.close();
        });
    }

    stats() {
        return this.agent.stats();
    }

    close() {
        clearTimeout(this.graceTimeout);
        this.agent.destroy();
        this.emit('close');
    }

    handleRequest(req, res) {
        const opt = {
            path: req.url,
            agent: this.agent,
            method: req.method,
            headers: req.headers
        };

        const clientReq = http.request(opt, (clientRes) => {
            res.writeHead(clientRes.statusCode, clientRes.headers);

            pump(clientRes, res);
        });

        clientReq.once('error', (err) => {
        });

        pump(req, clientReq);
    }

    handleUpgrade(req, socket) {
        socket.once('error', (err) => {
            if (err.code == 'ECONNRESET' || err.code == 'ETIMEDOUT') {
                return;
            }
            console.error(err);
        });

        this.agent.createConnection({}, (err, conn) => {
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
            for (let i=0 ; i < (req.rawHeaders.length-1) ; i+=2) {
                arr.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i+1]}`);
            }

            arr.push('');
            arr.push('');

            pump(conn, socket);
            pump(socket, conn);
            conn.write(arr.join('\r\n'));
        });
    }
}

module.exports = Client;