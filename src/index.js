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

const { addUser,
        removeUser,
        getUser,
        getUsersInRoom } = require('./utils/users.js');

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

  //join for every Room
  socket.on('join',({username , room}, ack) => {
      const {error , user} = addUser({id : socket.id , username, room});
      // Error reporting
      if(error) {
        return ack(error);
      }
      socket.join(user.room);
      socket.broadcast.to(user.room).emit('message' , generateMsg(`${user.username} has joined.`));
      ack();
  });

  socket.on('sendMessage',(msg,ack) => {
    console.log(msg);
    socket.emit('message',generateMsg(msg));
    ack();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
        io.to(user.room).emit('message' ,generateMsg(`${user.username} has left!`));
    }
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT,() => console.log(`Server running on port : http://localhost:${PORT}`));
