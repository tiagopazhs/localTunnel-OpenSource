const socketIO = require('socket.io');
const { parameters } = require('../config/config')

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    const pingInterval = setInterval(() => {
      socket.emit('ping');
    }, parameters["pingInterval "]);

    socket.on('pong', (id) => {
      console.log(`Client ${id} responded to ping`);
    });

    socket.on('disconnect', () => {
      clearInterval(pingInterval);
    });

    socket.on('customDisconnect', (id) => {
      console.log(`Client ${id} disconnected`);
    });
  });
};
