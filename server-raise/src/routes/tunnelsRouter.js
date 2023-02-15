const router = require('express').Router();
const TunnelsController = require('../controllers/TunnelsController')

router.get('/', TunnelsController.getStartTunnel);

module.exports = router