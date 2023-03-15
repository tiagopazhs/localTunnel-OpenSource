const handler = require('http');

const request = (options) => {
  return new Promise((resolve, reject) => {
    const req = handler.request(options, res => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
        console.log('CHUNCK', chunk.toString());
      });
      res.on('end', () => {
        resolve(body)
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })
}

const handleClientReq = async (req, res, agent) => {
  const options = {
    path: req.url,
    agent,
    method: req.method,
    headers: req.headers
  };


  return res.end(await request(options))
};

module.exports = handleClientReq;