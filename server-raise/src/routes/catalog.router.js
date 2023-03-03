const router = require('express').Router();
const CatalogController = require('../controllers/catalog.controller')

router.get('/', CatalogController.getControlPanel);

router.get('/list', CatalogController.getAllTunnels);

router.get('/tunnel-status/:id', CatalogController.getTunnelStatus);

module.exports = router
