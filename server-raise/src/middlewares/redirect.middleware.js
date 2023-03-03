const { parameters } = require('../config/config')
const { hasSubdomain } = require('../utils/subdomain.util')

const redirect = (req, res, next) => {
    console.log('Received request' + parameters.marker)
    if (req.path !== '/catalog' && req.path !== '/audit' && req.path !== '/landing' && req.path !== '/' ) {
        req.url = '/'
    }
    if (req.originalUrl !== '/?new' && !hasSubdomain(req.headers.host) && req.originalUrl === '/') {
        res.redirect('/landing')
    }
    next();
}

module.exports = redirect