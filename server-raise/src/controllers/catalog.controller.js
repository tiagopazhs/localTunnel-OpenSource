const CatalogModel = require('../models/catalog.model')

exports.getAllTunnels = async (req, res) => {
    try {
        const catalogData = await CatalogModel.find()
        res.status(200).json(catalogData)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

exports.postTunnelCatalog = async (req, res) => {
    let tunnelId = req.body.tunnelId
    let status = req.body.status
    const catalogCreate = new CatalogModel({ tunnelId, status })
    try {
        await catalogCreate.save()
        return res.json({ msg: "registered tunnel." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to registered tunnel.' })
    }
}

exports.getTunnelStatus = async (req, res) => {
    const tunnelId = req.params.id
    try {
        const catalogData = await CatalogModel.findOne({ tunnelId: tunnelId })
        if (!catalogData) return res.status(422).json({ message: 'Tunnel is not registered' })
        res.status(200).json(catalogData)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

exports.putTunnelStatus = async (req, res) => {
    const tunnelId = req.params.id
    try {
        const catalogData = await CatalogModel.findOne({ tunnelId: tunnelId })
        if (!catalogData) return res.status(422).json({ message: 'Tunnel is not registered' })
        catalogData.status = req.body.status
        await catalogData.save()
        res.status(200).json(catalogData)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

exports.deleteTunnel = async (req, res) => {
    const tunnelId = req.params.id
    try {
        const catalogData = await CatalogModel.findOne({ tunnelId: tunnelId })
        if (!catalogData) return res.status(422).json({ message: 'Tunnel is not registered' })
        catalogData.status = req.body.status
        await catalogData.remove()
        res.status(200).json({ message: 'Tunnel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
