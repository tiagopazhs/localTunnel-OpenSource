const destroy = async (server, next) => {
  console.log('emit destroy');
  server.close(next);
};

module.exports = destroy;