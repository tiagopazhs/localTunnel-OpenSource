const tldjs = require('tldjs');

function GetIdFromHost(hostname) {
    hostname = hostname.replace(':3006', '.com.br')
    return tldjs.getSubdomain(hostname);
}

module.exports = { GetIdFromHost }