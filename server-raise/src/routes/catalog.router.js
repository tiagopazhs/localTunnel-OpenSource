const router = require('express').Router();
const Catalog = require('../controllers/catalog.controller')

router.get('/', Catalog.getControlPanel);

router.get('/tunnels-list', Catalog.getAllTunnels);

router.get('/tunnel-status/:id', Catalog.getTunnelStatus);

module.exports = router
