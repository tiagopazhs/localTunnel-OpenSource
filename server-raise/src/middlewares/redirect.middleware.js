const { parameters } = require('../config/config')
const { hasSubdomain, isRegistered } = require('../utils/subdomain.util')

function redirect(req, res, next) {

    console.log(`Received request ${parameters.marker} http://...${req.url} `)

    if (!hasSubdomain(req.headers.host) && req.originalUrl === '/') {
        return res.redirect('/landing')
    }

    if (!isRegistered(req.path) || req.path === '/') {
        let id = req.path
        return res.redirect(`/tunnel${id}`)
    }

    return next();

}

module.exports = redirect;



