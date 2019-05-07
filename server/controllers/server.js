const express = require('express');
const { createServer } = require('http');
const io = require('socket.io');

const app = express();
const server = createServer(app);
const userIds = {};
const noop = () => {};

app.use('/', express.static(`${process.cwd()}/../front-end`));
const contactNumber = function() {
  return "user"+Math.floor(Math.random() * (+1 + +100).toString())
}

// app.get("/",function(req,res){
//   const id = contactNumber();

//      res.send(id.toString());
// });
/**
 * Random ID until the ID is not in use
 */
function randomID(callback) {
  const id = contactNumber();

  if (id in userIds) setTimeout(() => contactNumber(callback), 5);
  else callback(id);
}

/**
 * Send data to friend
 */
function sendTo(to, done, fail) {
  const receiver = userIds[to];
  if (receiver) {
    const next = typeof done === 'function' ? done : noop;
    next(receiver);
  } else {
    const next = typeof fail === 'function' ? fail : noop;
    next();
  }
}

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
  let id;
  socket
    .on('init', () => {
      randomID((_id) => {
        id = _id;
        userIds[id] = socket;
        socket.emit('init', { id });
      });
    })
    .on('request', (data) => {
      sendTo(data.to, to => to.emit('request', { from: id }));
    })
    .on('call', (data) => {
      sendTo(
        data.to,
        to => to.emit('call', { ...data, from: id }),
        () => socket.emit('failed')
      );
    })
    .on('end', (data) => {
      sendTo(data.to, to => to.emit('end'));
    })
    .on('disconnect', () => {
      delete userIds[id];
      console.log(id, 'disconnected');
    });

  return socket;
}

module.exports.run = (config) => {
  server.listen(config.PORT);
  console.log(`Server is listening at :${config.PORT}`);
  io.listen(server, { log: true })
    .on('connection', initSocket);
};