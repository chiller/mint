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
crypto = require("crypto")
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
    md5sum = crypto.createHash("md5")
    md5sum.update socket.id
    io.sockets.in("room").emit "chat",
      sender: md5sum.digest("hex")
      hello: data.hello

  socket.on "disconnect", ->
    io.sockets.in("room").emit "chat",
      sender: "system"
      hello: "Client disconnect"
