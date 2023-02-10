const router = require('express').Router();
const { manager } = require('../constants/config')
const { hri } = require('human-readable-ids');

router.get('/', async (req, res) => {
    if (req.query['new'] !== undefined) {
        const reqId = hri.random();
        console.log('making new client with id %s', reqId);
        const info = await manager.newClient(reqId);

        info.url = 'http://' + info.id + '.' + req.hostname + ':3006';
        res.json(info);
    } else {
        res.json({ msg: 'Localtunnel server is running!!! Use a Client Application to send a requisition with query[new] and create a new tunnel.' })
    }
});

module.exports = router