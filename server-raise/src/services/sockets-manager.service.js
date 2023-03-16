const { parameters } = require('../config/config');
const auditLog = require('../utils/audit.util')

module.exports = {
  async _onClose() {
    this.closed = true;
    console.log('closed tcp socket %s');
    for (const conn of this.waitingCreateConn) {
      conn(new Error('closed'), null);
    }
    this.waitingCreateConn = [];
    this.emit('end');
  },

  async _onConnection(socket) {
    if (this.connectedSockets >= parameters.maxsockets) {
      console.log('no more sockets allowed');
      socket.destroy();
      return false;
    }

    socket.once('close', (hadError) => {
      console.log('closed socket (error: %s)', hadError);
      this.connectedSockets -= 1;
      const idx = this.availableSockets.indexOf(socket);
      if (idx >= 0) {
        this.availableSockets.splice(idx, 1);
      }

      console.log('connected sockets: %s', this.connectedSockets);
      if (this.connectedSockets <= 0) {
        console.log('all sockets disconnected');
        this.emit('offline');
      }
    });

    socket.once('error', (err) => {
      socket.destroy();
    });

    if (this.connectedSockets === 0) {
      this.emit('online');
    }

    this.connectedSockets += 1;
    
    auditLog(this.options.clientId, "new connection", socket.address().address, socket.address().port)    
    
    const fn = this.waitingCreateConn.shift();
    if (fn) {
      console.log('giving socket to queued conn request');
      setTimeout(() => {
        fn(null, socket);
      }, 0);
      return;
    }

    this.availableSockets.push(socket);
  },
};



