const AuditModel = require('../models/audit.model');

exports.getAllAudits = async (req, res) => {
  try {
    const auditData = await AuditModel.find()
    res.status(200).json(auditData)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

exports.postTunnelAudit = async (req, res) => {
  try {
    let newBody = {
      tunnelId: req.body.tunnelId,
      creationDate: req.body.creationDate,
      type: req.body.type
    }
    if (req.body.originIp) newBody.originIp = req.body.originIp
    if (req.body.tcpPort) newBody.tcpPort = req.body.tcpPort
    const auditCreate = new AuditModel(newBody)
    await auditCreate.save()
    return res.json({ msg: "Audit created." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create tunnel audit.' })
  }
}

exports.getTunnelAudit = async (req, res) => {
  const tunnelId = req.params.id
  try {
    const auditData = await AuditModel.findOne({ tunnelId: tunnelId })
    if (!auditData) return res.status(422).json({ message: 'Tunnel not found' })
    res.status(200).json(auditData)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}