const router = require('express').Router();
const CatalogController = require('../controllers/catalog.controller')

router.get('/', CatalogController.getAllTunnels);

router.post('/', CatalogController.postTunnelCatalog);

router.get('/:id', CatalogController.getTunnelStatus);

module.exports = router
