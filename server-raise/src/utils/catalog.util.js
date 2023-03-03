const { parameters } = require('../config/config')
const axios = require('axios');

async function catalogLog(id, status) {
    try {
        const data = { tunnelId: id, status: status };
        let response = false

        try {
            await axios.get(`http://${parameters.host}/catalog/${id}`);
            response = true
        } catch (error) {}

        if (response) {
            await axios.put(`http://${parameters.host}/catalog/${id}`, data)
        }
        else {
            await axios.post(`http://${parameters.host}/catalog`, data)
            status = status + '(new)'
        }

        console.log(`${parameters.logMarker} Catalog: ${status} id: ${id} ${parameters.logMarker}`);
    } catch (error) { }
}

module.exports = catalogLog