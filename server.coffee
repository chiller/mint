handler = (req, res) ->
  fs.readFile __dirname + "/index.html", (err, data) ->
    if err
      res.writeHead 500
      return res.end("Error loading index.html")
    res.writeHead 200
    res.end data

app = require("http").createServer(handler)
io = require("socket.io").listen(app)
fs = require("fs")

app.listen 8080
io.sockets.on "connection", (socket) ->
  socket.join "room"
  io.sockets.in("room").emit "chat",
    sender: "system"
    hello: "Client connected"

  socket.emit "news",
    sender: "system"
    hello: "Hello world"

  socket.on "chat", (data) ->
    io.sockets.in("room").emit "chat",
      sender: "chat"
      hello: data.hello

  socket.on "disconnect", ->
    io.sockets.in("room").emit "chat",
      sender: "system"
      hello: "Client disconnect"
