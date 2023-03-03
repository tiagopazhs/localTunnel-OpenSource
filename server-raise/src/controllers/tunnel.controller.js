const { parameters } = require('../config/config')
const { hri } = require('human-readable-ids');
const { newClient } = require('../services/tunnel.service')

exports.getStartTunnel = async (req, res) => {

    let reqId = req.originalUrl.split("/")[2]
    if (reqId === "?new") reqId = await hri.random();

    const info = await newClient(reqId);

    info.url = 'http://' + info.id + '.' + req.hostname + ':' + parameters.port;
    res.json(info);
}
