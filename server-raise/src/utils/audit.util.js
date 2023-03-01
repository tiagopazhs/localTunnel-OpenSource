const { parameters } = require('../config/config')
const axios = require('axios');

async function auditLog(id, type) {
    await axios.post(`http://${parameters.host}/audit`, {
        tunnelId: id,
        type: type
    });
    console.log(`Log: ${type} id: ${id}`)
}

module.exports = auditLog