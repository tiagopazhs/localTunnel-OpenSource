const router = require('express').Router();
const AuditController = require('../controllers/audit.controller')

router.get('/', AuditController.getAuditPanel);

router.get('/audits-list', AuditController.getAllAudits);

router.get('/tunnel-audit/:id', AuditController.getTunnelAudit);

router.post('/tunnel-audit/:id', AuditController.postTunnelAudit);

router.put('/tunnel-audit/:id', AuditController.putTunnelAudit);

module.exports = router