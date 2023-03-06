const { parameters } = require('../config/config')

function splitUrl(url) {
    return url.split(parameters.host)
}

function getId(hostname, dot) {
    let id = splitUrl(hostname)[0]
    if (id.endsWith('.') && !dot) id = id.slice(0, -1) //Verify is the id ends with a dot and remove it 

    return id;
}

function getRouter(hostname) {
    return splitUrl(hostname)[1]
}

function hasSubdomain(hostname) {
    if (getId(hostname) !== '') return true
    else return false
}

function hasRouter(hostname) {
    if (getRouter(hostname) !== '') return true
    else return false
}

function isRegistered (url) {

    const routes = parameters.registeredRoutes

    let registered = false

    for (let i = 0; i < routes.length; i++) {
        if (url.startsWith(routes[i])) registered = true 
    }

    return registered
}

function urlLog(req) {
    let subdomain = getId(req.headers.host, true)
    let bodyLog = ''
    let aux = ''
    let id = req.body.tunnelId

    let url = `http://${subdomain}host${req.url} `

    if (req.url.startsWith('/audit')) {
        bodyLog = ` [ ${req.body.type} -> ID ${id} ]`
        return url + bodyLog
    }

    if (req.url.startsWith('/catalog')) {
        if(req.method === 'GET') bodyLog = ` [ existence check -> ID ${req.url.split('/')[2]} ]`
        else bodyLog = ` [ ${req.body.status} -> ID ${id} ]`
        return url + bodyLog
    }

    if (req.url.startsWith('/landing')) {
        bodyLog = ` [ redirect to landing page ]`
        return url + bodyLog
    }

    return url
}

module.exports = {getId, getRouter, hasSubdomain, hasRouter, isRegistered, urlLog}