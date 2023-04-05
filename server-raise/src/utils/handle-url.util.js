const { parameters } = require('../config/config')

async function extractHostData() {
    const url = completeHost
    const protocol = url.split(':')[0];
    const parts = url.split('/');

    const [host, port] = parts[2].split(':');

    return {
        hostPortRouter: parts.slice(2).join('/'),
        hostPort: `${host}:${port}`,
        host,
        port: parseInt(port),
        method: protocol
    };
}

async function getId(hostname, dot) {
    let id = hostname.split(parameters.host)[0]
    if (id.endsWith('.') && !dot) id = id.slice(0, -1) //Verify is the id ends with a dot and remove it 

    return id;
}

async function getRouter(hostname) {
    return hostname.split(parameters.host)[1]
}

async function hasSubdomain(hostname) {
    if (await getId(hostname) !== '') return true
    else return false
}

async function hasRouter(hostname) {
    if (await getRouter(hostname) !== '') return true
    else return false
}

async function isRegistered (url) {

    const routes = parameters.registeredRoutes

    let registered = false

    for (let i = 0; i < routes.length; i++) {
        if (url.startsWith(routes[i])) registered = true 
    }

    return registered
}

async function urlLog(req) {
    let subdomain = await getId(req.headers.host, true)
    let bodyLog = ''
    let id = req.body.tunnelId

    let url = `http://${subdomain}host${req.url} `

    if (req.url.startsWith('/audit')) {
        bodyLog = ` [ ID ${id} -> ${req.body.type} ]`
        return url + bodyLog
    }

    if (req.url.startsWith('/catalog')) {
        if(req.method === 'GET') bodyLog = ` [ existence check -> ID ${req.url.split('/')[2]} ]`
        else bodyLog = ` [ ID ${id} -> ${req.body.status} ]`
        return url + bodyLog
    }

    if (req.url.startsWith('/landing')) {
        bodyLog = ` [ redirect to landing page ]`
        return url + bodyLog
    }

    return url
}

module.exports = {getId, getRouter, hasSubdomain, hasRouter, isRegistered, urlLog}