module.exports = function createConnection(agent, options) {
  return new Promise((resolve, reject) => {
    if (agent.closed) {
      reject(new Error('closed'));
      return;
    }

    console.log('create connection');

    const sock = agent.availableSockets.shift();

    if (!sock) {
      agent.waitingCreateConn.push((err, sock) => {
        if (err) {
          reject(err);
        } else {
          resolve(sock);
        }
      });
      console.log('waiting connected: %s', agent.connectedSockets);
      console.log('waiting available: %s', agent.availableSockets.length);
      return;
    }

    console.log('socket given');
    resolve(sock);
  });
};
