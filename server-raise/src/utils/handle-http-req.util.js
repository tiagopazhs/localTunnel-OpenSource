const { parameters } = require('../config/config')

const request = async (options) => {
  return new Promise((resolve, reject) => {
    const handler = require(parameters.method)
    const req = handler.request(options, res => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body)
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })
}

module.exports = request