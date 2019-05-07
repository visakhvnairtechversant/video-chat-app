const config = require('../config.json');
const server = require('./controllers/server');

config.PORT = process.env.PORT || config.PORT;

server.run(config);