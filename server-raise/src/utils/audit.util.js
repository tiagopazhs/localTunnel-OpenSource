const { parameters } = require('../config/config')
const axios = require('axios');

async function auditLog(id, type) {
    await axios.post(`http://${parameters.host}/audit`, {
        tunnelId: id,
        type: type
    });
    console.log(`${parameters.logMarker} Log: ${type} id: ${id} ${parameters.logMarker} `)
}

module.exports = auditLog