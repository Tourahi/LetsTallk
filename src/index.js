const express = require('express');
const http    = require('http');
const path    = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, '../public');


//Serving the static dir
app.use(express.static(publicDirPath));


//Routes

app.get('',(req , res) => {
  res.send('index');
});



//io
io.on('connection', (socket) => {
  console.log('a user connected');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT,() => console.log(`Server running on port : http://localhost:${PORT}`));
