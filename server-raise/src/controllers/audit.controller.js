const TunnelAudit = require('../models/tunnel-audit.model');

exports.getAllAudits = async (req, res) => {
  try {
    const auditData = await TunnelAudit.find()
    res.status(200).json(auditData)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

exports.postTunnelAudit = async (req, res) => {
  let tunnelId = req.body.tunnelId
  let creationDate = req.body.creationDate
  let open = req.body.open
  const auditCreate = new TunnelAudit({ tunnelId, creationDate, open })
  try {
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
    const auditData = await TunnelAudit.findOne({tunnelId: tunnelId})
    if(!auditData) return res.status(422).json({message: 'Tunnel not found'})
    res.status(200).json(auditData)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}