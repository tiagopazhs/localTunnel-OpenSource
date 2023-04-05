const auditLog = require('../utils/audit.util')
const Net = require('net');
const { rangePort } = require('../config/config')

async function isOpenPort(id, port) {
  const server = new Net.Server();
  let testPortResult = true
  try {
    testPortResult = await new Promise((resolve) => {
      server.on('error', async (err) => {
        if (err.code === 'EADDRINUSE') resolve(false)
        else await auditLog(id, err)
      });
      server.listen(port, () => {
        server.close()
        resolve(true)
      });
    });
  } catch (err) {
    await auditLog(id, err)
  }
  return testPortResult;
}

async function checkPort(id) {
  const { startPort, endPort } = rangePort;
  for (let port = startPort; port <= endPort; port++) {
    try {
      await auditLog(id, `Checking port ${port}`)
      if (await isOpenPort(id, port)) {
        await auditLog(id, `Port ${port} is available`)
        return port;
      } else {
        await auditLog(id, `Port ${port} is unavailable`)
      }
    } catch (err) {
      await auditLog(id, err)
    }
  }
  await auditLog(id, `All ports in the range ${startPort} - ${endPort} are in use`)
  return null;
}

module.exports = { checkPort }