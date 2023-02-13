const router = require('express').Router();
const tunnels = require('../controllers/tunnelsController')

router.get('/', tunnels.getStartTunnel);

module.exports = router