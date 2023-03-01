const redirect = (req, res, next) => {
    if (req.path !== '/catalog' && req.path !== '/audit' && req.path !== '/' ) {
        req.url = '/'
    }
    next();
}

module.exports = redirect