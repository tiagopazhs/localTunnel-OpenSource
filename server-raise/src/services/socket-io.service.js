const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    const pingInterval = setInterval(() => {
      socket.emit('ping');
    }, 2000);

    socket.on('pong', () => {
      console.log(`Client responded to ping`);
    });

    socket.on('disconnect', () => {
      clearInterval(pingInterval);
    });

  });
};
