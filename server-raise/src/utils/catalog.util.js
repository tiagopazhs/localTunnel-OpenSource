const { extractHostData } = require('./handle-url.util')
const axios = require('axios');

async function catalogLog(id, status) {
    try {
        const data = { tunnelId: id, status: status };
        let response = false

        try {
            await axios.get(`http://${(await extractHostData()).hostPort}/catalog/${id}`);
            response = true
        } catch (error) {}

        if (response) {
            await axios.put(`http://${(await extractHostData()).hostPort}/catalog/${id}`, data)
        }
        else {
            await axios.post(`http://${(await extractHostData()).hostPort}/catalog`, data)
        }

    } catch (error) { }
}

module.exports = catalogLog