const tldjs = require('tldjs');

function GetClientIdFromHostname(hostname) {
    hostname = hostname.replace(':3006', '.com.br')
    return tldjs.getSubdomain(hostname);
}

module.exports = { GetClientIdFromHostname }