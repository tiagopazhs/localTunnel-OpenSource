const router = require('express').Router();
const AuditController = require('../controllers/audit.controller')

router.get('/', AuditController.getAllAudits);

router.post('/', AuditController.postTunnelAudit);

router.get('/:id', AuditController.getTunnelAudit);

module.exports = router