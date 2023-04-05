const { extractHostData } = require('../utils/handle-url.util')
const { hri } = require('human-readable-ids');
const { newClient } = require('../services/tunnel.service')

exports.getStartTunnel = async (req, res) => {

    let reqId = req.originalUrl.split("/")[2]
    if (reqId === "?new") reqId = await hri.random();

    const info = await newClient(reqId);

    info.url = 'http://' + info.id + '.' + req.hostname + ':' + (await extractHostData()).port;
    res.json(info);
}
