const { parameters } = require('../config/config')

exports.getHome = async (req, res) => {
    res.json({ msg: parameters.landingPage })
}