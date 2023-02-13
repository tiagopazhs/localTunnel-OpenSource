const { parameters, manager } = require('../config/config')
const { hri } = require('human-readable-ids');

exports.getStartTunnel = async (req, res) => {
    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('making new client with id ', reqId);
        const info = await manager.newClient(reqId);

        info.url = 'http://' + info.id + '.' + req.hostname+ ':' + parameters.port;
        res.json(info);
    } else {
        res.json({ msg: parameters.landingPage })
    }
}