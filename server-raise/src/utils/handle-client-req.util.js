const http = require('http');

const handleClientReq = (req, res, agent) => {
  const options = {
    path: req.url,
    agent,
    method: req.method,
    headers: req.headers
  };

  const clientReq = http.request(options, (clientRes) => {
    clientRes.pipe(res);
  });

  clientReq.on('error', (err) => {});

  req.pipe(clientReq);
};

module.exports = handleClientReq;
