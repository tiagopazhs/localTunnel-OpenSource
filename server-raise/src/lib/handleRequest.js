const http = require('http');
const pump = require('pump');

const handleRequest = (req, res, agent) => {
  const opt = {
    path: req.url,
    agent: agent,
    method: req.method,
    headers: req.headers
  };
  const clientReq = http.request(opt, (clientRes) => {
    res.writeHead(clientRes.statusCode, clientRes.headers);

    pump(clientRes, res);
  });

  clientReq.once('error', (err) => { });

  pump(req, clientReq);
};

module.exports = handleRequest;
