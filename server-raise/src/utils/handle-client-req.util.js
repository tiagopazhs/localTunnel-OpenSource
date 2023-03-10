const Http = require('http');

const handleClientReq = (req, res, agent) => {
  const opt = {
    path: req.url,
    agent: agent,
    method: req.method,
    headers: req.headers
  };
  const clientReq = Http.request(opt, (clientRes) => {
    res.writeHead(clientRes.statusCode, clientRes.headers);
    clientRes.pipe(res);
  });

  clientReq.once('error', (err) => { });

  req.pipe(clientReq);
};

module.exports = handleClientReq;
