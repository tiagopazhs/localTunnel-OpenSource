const router = require('express').Router();
const { manager, landingPage } = require('../constants/config')

router.get('/', async (req, res) => {
    res.json("Choose your router: /tunnels => General tunnels status. /tunnel/:tunnelId => Status of your specific tunnel.");
});

router.get('/tunnels', async (req, res) => {
    let status = manager.status
    if(status.tunnels === 0) status = "There aren't open tunnels." 
    res.json(status)
});

router.get('/tunnel/:id', async (req, res) => {
    let id = req.params.id
    let status = `The tunnel ${id} is NOT open!`
    if(id in manager.status.ids) status = `The tunnel ${id} is OPEN!`
    res.json(status)
});

module.exports = router
