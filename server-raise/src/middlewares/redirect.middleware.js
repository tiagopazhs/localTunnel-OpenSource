const { parameters } = require('../config/config')
const { urlLog, hasSubdomain, isRegistered } = require('../utils/handle-url.util')

async function redirect(req, res, next) {

    console.log(`Received request ${parameters.marker} ${await urlLog(req)}`)

    if (!await hasSubdomain(req.headers.host) && req.originalUrl === '/') {
        return res.redirect('/landing')
    }

    if (! await isRegistered(req.path) || req.path === '/') {
        let id = req.path
        return res.redirect(`/tunnel${id}`)
    }

    return next();

}

module.exports = redirect;



