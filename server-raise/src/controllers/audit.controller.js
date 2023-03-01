const TunnelAudit = require('../models/tunnel-audit.model');

exports.getAuditPanel = async (req, res) => {
  res.json("Choose your router: /tunnels-list => General tunnels status. /tunnel-status/:tunnelId => Status of your specific tunnel.");
}

exports.getAllAudits = async (req, res) => {
  let allAudits = ""
  if (allAudits.length === 0) allAudits = "There aren't audits."
  res.json(allAudits)
}

exports.getTunnelAudit = async (req, res) => {
  let id = req.params.id
  try {
    const currentId = await TunnelAudit.findOne({ tunnelId: id })
    if (!id) {
      res.status(422).json({ message: 'Tunnel not found.' })
      return
    }
    res.status(200).json(currentId)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

exports.putTunnelAudit = async (req, res) => {
  let {idField, creationField, openField} = req.body
  const auditTunnelUpdate = {idField, creationField, openField}

  let id = req.params.id
  try {
    const currentProccesId = await TunnelAudit.updateOne({tunnelId:idField}, auditTunnelUpdate)
    if (currentProccesId.matchedCount === 0) {
      res.status(422).json({ message: 'Tunnel was not updated.' })
      return
    }
    res.status(200).json(auditTunnelUpdate)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}