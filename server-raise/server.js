const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
const TunnelMiddleware = require('./src/middlewares/tunnel.middleware')
const RedirectMiddleware = require('./src/middlewares/redirect.middleware')
const Landing = require('./src/routes/landing.router')
const TunnelRouter = require('./src/routes/tunnel.router')
const Catalog = require('./src/routes/catalog.router')
const Audit = require('./src/routes/audit.router')
const socketIO = require('./src/services/socket-io.service');
const { serverPort } = require('./src/config/config')

//User env file to enter with password
require('dotenv').config()
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

//Use to read json from mongoDB
app.use(express.json());

app.use(RedirectMiddleware);

app.use('/tunnel', TunnelMiddleware, TunnelRouter)
app.use('/catalog', Catalog)
app.use('/audit', Audit)
app.use('/landing', Landing)

// Start socket.io server
socketIO(server);

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@lt.73ncy2i.mongodb.net/?retryWrites=true&w=majority`
).then(() => {
    server.listen(serverPort, () => {
        console.log(`Server listening on port ${serverPort}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = server;