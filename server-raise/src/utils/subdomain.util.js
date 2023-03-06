const { parameters } = require('../config/config')

function splitUrl(url) {
    return url.split(parameters.host)
}

function getId(hostname) {
    let id = splitUrl(hostname)[0]
    if (id.endsWith('.')) id = id.slice(0, -1) //Verify is the id ends with a dot and remove it 

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

module.exports = {getId, getRouter, hasSubdomain, hasRouter, isRegistered}