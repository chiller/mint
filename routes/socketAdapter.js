module.exports = function (app) {
    "use strict";
    // Hook Socket.io into Express
    var io = require('socket.io').listen(app);
    //io.sockets.on('connection', socket);
    io.sockets.on("connection", function(socket){
        socket.join("room");
        io.sockets["in"]("room").emit("chat", {msg: "client joined"});
    })
    this.io = io;
    this.broadcast = function(room, name, data) {
        io.sockets["in"](room).emit(name, data);
    }
}