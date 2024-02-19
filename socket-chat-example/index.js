const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let onlineUsers = {};
let rooms = { 'General': true };
let roomMessages = { 'General': [] };

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.emit('roomList', Object.keys(rooms));

    socket.on('setNickname', (nickname, avatarUrl) => {
        onlineUsers[socket.id] = { nickname, avatarUrl, room: 'General' };
        socket.join('General');
        io.to('General').emit('chatMessage', {
            text: `${nickname} has connected`,
            avatarUrl: avatarUrl
        });
        updateOnlineUsers('General');
    });

    /*socket.on('joinRoom', (roomName) => {
        if (onlineUsers[socket.id]) {
            const user = onlineUsers[socket.id];
            const oldRoom = user.room;
            if (oldRoom !== roomName) {
                socket.leave(oldRoom);
                updateOnlineUsers(oldRoom);

                socket.join(roomName);
                user.room = roomName;
                io.to(roomName).emit('chatMessage', {
                    text: `${user.nickname} has joined the room ${roomName}`,
                    avatarUrl: user.avatarUrl
                });
                updateOnlineUsers(roomName);
            }
        } else {
            console.log("User not found in onlineUsers, unable to join room:", roomName);
        }
    });*/

    socket.on('joinRoom', (roomName) => {
        if (onlineUsers[socket.id]) {
            const user = onlineUsers[socket.id];
            const oldRoom = user.room;

            
            if (oldRoom !== roomName) {
                socket.leave(oldRoom);
                updateOnlineUsers(oldRoom); 

                
                socket.join(roomName);
                user.room = roomName;

                
                io.to(roomName).emit('chatMessage', {
                    text: `${user.nickname} has joined the room ${roomName}`,
                    avatarUrl: user.avatarUrl
                });

                updateOnlineUsers(roomName); 

                
                if (roomMessages[roomName]) {
                    roomMessages[roomName].forEach(message => {
                        socket.emit('chatMessage', message);
                    });
                }
            }
        } else {
            console.log("User not found in onlineUsers, unable to join room:", roomName);
        }
    });


    socket.on('createRoom', (roomName) => {
        if (!rooms[roomName]) {
            rooms[roomName] = true;
            io.emit('roomList', Object.keys(rooms));
        }
    });

    /*socket.on('chatMessage', (msg) => {
        const user = onlineUsers[socket.id];
        if (user) {
            socket.to(user.room).emit('chatMessage', {
                text: `${user.nickname}: ${msg}`,
                avatarUrl: user.avatarUrl
            });
        }
    });*/

    socket.on('chatMessage', (msg) => {
        const user = onlineUsers[socket.id];
        if (user) {
            const messageData = {
                text: `${user.nickname}: ${msg}`,
                avatarUrl: user.avatarUrl
            };
            if (!roomMessages[user.room]) {
                roomMessages[user.room] = [];
            }
            roomMessages[user.room].push(messageData);

            socket.to(user.room).emit('chatMessage', messageData);
        }
    });


    socket.on('privateMessage', (msg, toNickname) => {
        const recipientSocketId = Object.keys(onlineUsers).find(key => onlineUsers[key].nickname === toNickname);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('privateMessage', {
                from: onlineUsers[socket.id].nickname,
                message: msg,
                avatarUrl: onlineUsers[socket.id].avatarUrl
            });
        }
    });

    socket.on('typing', () => {
        const roomName = onlineUsers[socket.id].room;
        socket.to(roomName).emit('typing', onlineUsers[socket.id].nickname);
    });

    socket.on('stopTyping', () => {
        const roomName = onlineUsers[socket.id].room;
        socket.to(roomName).emit('stopTyping');
    });

    socket.on('disconnect', () => {
        if (onlineUsers[socket.id]) {
            const user = onlineUsers[socket.id];
            console.log(`${user.nickname} has disconnected`);

            io.to(user.room).emit('chatMessage', {
                text: `${user.nickname} has left the chat`,
                avatarUrl: user.avatarUrl
            });

            delete onlineUsers[socket.id];
            updateOnlineUsers(user.room);
        }
    });

    function updateOnlineUsers(room) {
        const usersInRoom = Object.values(onlineUsers)
            .filter(user => user.room === room)
            .map(user => ({ nickname: user.nickname, avatarUrl: user.avatarUrl }));
        io.to(room).emit('onlineUsers', usersInRoom);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/login.html`);
});
