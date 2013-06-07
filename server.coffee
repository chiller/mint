mongo = require 'mongojs'
collections = ['shapes',]
db = mongo.connect 'mongodb://nodejitsu:e515ef4c53426703b4788e96c448986c@linus.mongohq.com:10046/nodejitsudb1933730153', collections

shape = null

db.shapes.find
  name: "alma"
, (err, dbshape) ->
  if err 
    console.log "Mongo Error"
  else
    shape = new Shape dbshape[0].x, dbshape[0].y
    console.log shape

LATENCY = 0

class Shape
  constructor: (@x, @y) ->

  set: (x,y) =>
    @x = x
    @y = y
    db.shapes.update({"name":"alma"},{$set:{x: 150} })
    db.shapes.update
      name: "alma"
    ,
      $set:
        x: x
        y: y
    , (err, updated) ->
      if err or not updated
        console.log "Shape not updated"
      else
        console.log "Shape updated"



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

  socket.emit "collab",
    sender: "system"
    shape: shape

  socket.on "collab", (data) ->
    shape.set  data.shape.x, data.shape.y
    console.log "try update"
    xshape = shape

    #to run setTimout in local context
    do (xshape)-> 
      setTimeout( =>
        io.sockets.in("room").emit "collab",
          sender: "system"
          shape: xshape 
      ,LATENCY)

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
