const { parameters } = require('../config/config')

function getId(hostname) {

    const handleUrl = hostname.split(parameters.host)
    let id = handleUrl[0]
    if (id.endsWith('.')) id = id.slice(0, -1) //Verify is the id ends with a dot and remove it
    const route = handleUrl[1]

    return id;
}

function hasId () {
    return 
}

module.exports = { getId }