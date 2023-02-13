const router = require('express').Router();
const panelController = require('../controllers/panelController')

router.get('/', panelController.getControlPanel);

router.get('/tunnels', panelController.getAllTunnels);

router.get('/tunnel/:id', panelController.getTunnelStatus);

module.exports = router
