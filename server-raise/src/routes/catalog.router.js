const router = require('express').Router();
const CatalogController = require('../controllers/catalog.controller')

router.get('/', CatalogController.getAllTunnels);

router.post('/', CatalogController.postTunnelCatalog);

router.get('/:id', CatalogController.getTunnelStatus);

router.put('/:id', CatalogController.putTunnelStatus);

router.put('/:id', CatalogController.deleteTunnel);

module.exports = router
