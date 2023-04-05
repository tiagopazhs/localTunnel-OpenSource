const { extractHostData } = require('./handle-url.util')

const request = async (options) => {
  return new Promise( async (resolve, reject) => {
    const handler = require((await extractHostData()).method)
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