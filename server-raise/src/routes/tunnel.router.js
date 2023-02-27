const router = require('express').Router();
const TunnelController = require('../controllers/tunnel.controller')

router.get('/', TunnelController.getStartTunnel);

module.exports = router