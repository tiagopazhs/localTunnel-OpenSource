const router = require('express').Router();
const PanelController = require('../controllers/PanelController')

router.get('/', PanelController.getControlPanel);

router.get('/tunnels', PanelController.getAllTunnels);

router.get('/tunnel/:id', PanelController.getTunnelStatus);

module.exports = router
