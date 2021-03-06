module.exports = function (app) {
    "use strict";
    // Hook Socket.io into Express
    var io = require('socket.io').listen(app);
    //io.sockets.on('connection', socket);
    io.sockets.on("connection", function(socket){
        io.sockets["in"]("room").emit("chat", {msg: "client joined"});

        //TODO: update rest api to send document id
        //TODO: implement notification in new room system

        socket.on("room:change", function(msg){
            //First leave all other rooms
            var rooms = io.sockets.manager.roomClients[socket.id];
            for (var key in rooms) {
                if (rooms.hasOwnProperty(key) && key) {
                    socket.leave(key.substring(1))
                    io.sockets["in"](key.substring(1)).emit("chat", {msg: {"text": "client left", id:socket.id}});
                }
            }
            var clients = io.sockets.clients(msg.id);
            socket.join(msg.id);
            io.sockets["in"](msg.id).emit("chat", {msg: {"text": "client joined", id:socket.id}});
            for (var i=0;i<clients.length;i++) {

                socket.emit("chat", {msg: {"text": "client joined", id:clients[i].id}})
            }

        })
        socket.on("mark", function(msg){
            socket.broadcast.emit("mark",msg);
        })
        socket.on("chat", function(msg){
            socket.broadcast.emit("chat",msg);
        })
        socket.on("sync", function(msg){
            socket.broadcast.emit("sync",msg);
        })
        socket.on("disconnect", function(){
            var rooms = io.sockets.manager.roomClients[socket.id];
            for (var key in rooms) {
                if (rooms.hasOwnProperty(key) && key) {
                    io.sockets["in"](key.substring(1)).emit("chat",{msg: {"text": "client left", id:socket.id}});
                }
            }


        })
    })
    this.io = io;
    this.broadcast = function(room, name, data) {
        io.sockets["in"](room).emit(name, data);
    }
}