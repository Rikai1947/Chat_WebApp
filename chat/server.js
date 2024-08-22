const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', ({ name, avatar }) => {
    socket.broadcast.emit('message', {
      name,
      avatar,
      text: `${name} has joined the chat!`,
      system: true,
    });
  });

  socket.on('chatMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('fileMessage', (message) => {
    io.emit('fileMessage', message);
  });

  socket.on('voiceMessage', (message) => {
    io.emit('voiceMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
