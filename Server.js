const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store online users
let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // User join
    socket.on('setUsername', (username) => {
        socket.username = username;

        // Only 2 users allowed
        if (Object.keys(onlineUsers).length >= 2) {
            socket.emit('roomFull');
            return;
        }

        onlineUsers[socket.id] = username;
        io.emit('onlineUsers', Object.values(onlineUsers));
    });

    // Chat message: send only to other user
    socket.on('chatMessage', (msg) => {
        // Send to other user only
        socket.broadcast.emit('chatMessage', {
            username: socket.username,
            message: msg
        });
    });

    // Disconnect
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        io.emit('onlineUsers', Object.values(onlineUsers));
    });
});
server.listen(3002, () => console.log('Server running at http://localhost:3002'));



