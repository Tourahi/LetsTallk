const express = require('express');
const http    = require('http');
const path    = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, '../public');
const {
  generateMsg
} = require('./utils/messages.js');


//Serving the static dir
app.use(express.static(publicDirPath));


//Routes

app.get('',(req , res) => {
  res.send('index');
});



//io
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('message',generateMsg("Welcome!"));
  socket.broadcast.emit('message' , generateMsg('A new user has joined.'));

  socket.on('fromMe',(msg) => {
    console.log(msg);
    socket.emit('message',generateMsg(msg));
  });

  socket.on('disconnect', () => {
    io.emit('message' ,generateMsg('A user has left!'));
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT,() => console.log(`Server running on port : http://localhost:${PORT}`));
