const CreateServer = require('../server.js');

const argv = {
    port: 3006,
    address: '0.0.0.0',
    secure: false,
    domain: undefined,
    'max-sockets': 10,
};

const server = CreateServer({
    max_tcp_sockets: argv['max-sockets'],
    secure: argv.secure,
    domain: argv.domain,
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
