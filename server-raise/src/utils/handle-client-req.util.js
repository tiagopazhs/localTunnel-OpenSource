const http = require('http');

const handleClientReq = (req, res, agent) => {
  const options = {
    ...req,
    agent,
  };

  const clientReq = http.request(options, (clientRes) => {
    clientRes.pipe(res);
  });

  clientReq.on('error', (err) => {});

  req.pipe(clientReq);
};

module.exports = handleClientReq;
