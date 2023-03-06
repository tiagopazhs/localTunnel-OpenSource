const { parameters } = require('../config/config')
const axios = require('axios');

async function auditLog(id, type, originIp, tcpPort) {
    try {
        
        const reqBody = {
            tunnelId: id,
            type: type,
            originIp: originIp || null,
            tcpPort: tcpPort || null
        }

        await axios.post(`http://${parameters.host}/audit`, reqBody);
    } catch (err) {
        console.error(`${parameters.logMarker} Error: ${err.message} ${parameters.logMarker}`);
    }
}

module.exports = auditLog