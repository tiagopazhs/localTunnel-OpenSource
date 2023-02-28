const Http = require('http');
const Pump = require('pump');

const handleClientReq = (req, res, agent) => {
  const opt = {
    path: req.url,
    agent: agent,
    method: req.method,
    headers: req.headers
  };
  const clientReq = Http.request(opt, (clientRes) => {
    res.writeHead(clientRes.statusCode, clientRes.headers);

    Pump(clientRes, res);
  });

  clientReq.once('error', (err) => { });

  Pump(req, clientReq);
};

module.exports = handleClientReq;