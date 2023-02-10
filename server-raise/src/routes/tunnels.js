const router = require('express').Router();
const { parameters, manager, landingPage } = require('../constants/config')
const { hri } = require('human-readable-ids');

router.get('/', async (req, res) => {
    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('making new client with id %s', reqId);
        const info = await manager.newClient(reqId);

        info.url = 'http://' + info.id + '.' + req.hostname+ ':'+ parameters.port;
        res.json(info);
    } else {
        res.json({ msg: parameters.landingPage })
    }
});

module.exports = router