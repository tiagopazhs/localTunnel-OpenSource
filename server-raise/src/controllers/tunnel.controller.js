const { parameters } = require('../config/config')
const { hri } = require('human-readable-ids');
const { newClient } = require('../services/tunnel.service')
const auditLog = require('../utils/audit.util')

exports.getStartTunnel = async (req, res) => {
    console.log('Received request' + parameters.marker)
    if (req.originalUrl !== "/") {
        let reqId = req.originalUrl.slice(1);
        if(reqId === "?new") reqId = await hri.random();
        auditLog(reqId, "create connection")

        const info = await newClient(reqId);

        info.url = 'http://' + info.id + '.' + req.hostname + ':' + parameters.port;
        res.json(info);
    } else {
        res.json({ msg: parameters.landingPage })
    }
}
