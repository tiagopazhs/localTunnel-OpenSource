const { parameters } = require('../config/config')
const { hasSubdomain, isRegistered } = require('../utils/subdomain.util')

function redirect(req, res, next) {

    console.log(`Received request ${parameters.marker} http://...${req.url} `)
    if ( !isRegistered(req.path) || req.path === '/') {
        let id = req.path
        res.redirect(`/tunnel${id}`)
    } else if (req.originalUrl !== '/?new' && !hasSubdomain(req.headers.host) && req.originalUrl === '/') {
        res.redirect('/landing')
    } else {
        next();
    }
}

module.exports = redirect;