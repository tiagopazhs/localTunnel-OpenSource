const request = require('./handle-http-req.util')

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