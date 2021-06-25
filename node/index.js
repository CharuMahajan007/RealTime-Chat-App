// node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};

// io.on is socket.io instance which listens to several socket connections
// socket.on is respective for particular connection
io.on('connection', (socket) => {
    //if new user joins, let other users connected to the server know
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        // jisne join kiya hai usko chod k sbi ko event emit kr deta hai
        socket.broadcast.emit('user-joined', name);
    });
    //if someone sends a message broadcast it to all others
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    //if someone leaves the chat, let others know
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});

