const { landingPage } = require('../config/config')

exports.getHome = async (req, res) => {
    res.json({ msg: landingPage })
}