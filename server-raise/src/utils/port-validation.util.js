const auditLog = require('../utils/audit.util')
const Net = require('net');

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
  const ports = [40051, 40052, 40053];
  for (let i = 0; i < ports.length; i++) {
    await auditLog(id, `Checking port ${ports[i]}`)
    if (await isOpenPort(id, ports[i])) {
      await auditLog(id, `Port ${ports[i]} is available`)
      return ports[i];
    }
    await auditLog(id, `Port ${ports[i]} is unavailable`)
  }
  await auditLog(id, `All ports are in use`)
  return null;
}

module.exports = { checkPort }