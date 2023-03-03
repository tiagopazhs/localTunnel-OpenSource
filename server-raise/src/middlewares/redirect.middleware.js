const { parameters } = require('../config/config')
const { hasSubdomain } = require('../utils/subdomain.util')

const redirect = (req, res, next) => {
    console.log(`Received request ${parameters.marker} http://...${req.url} `)
    if (!req.path.startsWith('/catalog') && !req.path.startsWith('/audit') &&!req.path.startsWith('/landing') &&!req.path.startsWith('/tunnel') || req.path === '/' ) {
        let id = req.path
        res.redirect(`/tunnel${id}`)
    }
    if (req.originalUrl !== '/?new' && !hasSubdomain(req.headers.host) && req.originalUrl === '/') {
        res.redirect('/landing')
    }
    next();
}

module.exports = redirect