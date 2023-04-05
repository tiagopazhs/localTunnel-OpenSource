const socketIO = require('socket.io');
const configPingInterval = require('../config/config')["pingInterval "]

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    const pingInterval = setInterval(() => {
      socket.emit('ping');
    }, configPingInterval);

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
