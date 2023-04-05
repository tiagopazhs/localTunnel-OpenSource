const { logMarker } = require('../config/config')
const { extractHostData } = require('./handle-url.util')
const axios = require('axios');

async function auditLog(id, type, originIp, tcpPort) {
    try {
        
        const reqBody = {
            tunnelId: id,
            type: type,
            originIp: originIp || null,
            tcpPort: tcpPort || null
        }

        await axios.post(`http://${(await extractHostData()).hostPort}/audit`, reqBody);
    } catch (err) {
        console.error(`${logMarker} Error: ${err.message} ${logMarker}`);
    }
}

module.exports = auditLog