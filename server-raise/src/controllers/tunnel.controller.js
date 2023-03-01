const { parameters } = require('../config/config')
const { hri } = require('human-readable-ids');
const { newClient } = require('../services/tunnel.service')

exports.getStartTunnel = async (req, res) => {
    console.log('Received request' + parameters.marker)
    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('creating new client with id ', reqId);
        const info = await newClient(reqId);

        info.url = 'http://' + info.id + '.' + req.hostname+ ':' + parameters.port;
        res.json(info);
    } else {
        res.json({ msg: parameters.landingPage })
    }
}