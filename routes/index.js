var DocumentApi = require('./api/docs.js');
var EntityApi = require('./api/entities.js');
module.exports = exports = function(app, db) {
// Routes
    // Socket.io Communication
    // Hook Socket.io into Express
    var io = require('socket.io').listen(app);
    //io.sockets.on('connection', socket);
    io.sockets.on("connection", function(socket){
        socket.join("room");
        io.sockets["in"]("room").emit("chat", {msg: "client joined"});
    })

    //document api
    api = new DocumentApi(db);
    app.get('/api/docs', api.docs);
    app.get('/api/docs/:id', api.doc);
    app.post('/api/docs', api.adddoc);
    app.put('/api/docs/:id', api.updatedoc);
    app.delete('/api/docs/:id', api.deletedoc);
    //entity api
    entities = new EntityApi(db, io);
    app.get('/api/entities', entities.getAll);
    app.get('/api/entities/:id', entities.getOne);
    app.post('/api/entities', entities.create);
    app.put('/api/entities/:id', entities.update);
    app.delete('/api/entities/:id', entities.delete);


    //pages
    app.get('/editor', function(req, res){
      res.render('editor', {
        title: 'About'
      });
    });
    app.get('/playground', function(req, res){res.render('playground');});
    app.get('/', function(req, res){
        res.render('index');
    });
    app.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    // redirect all others to the index (HTML5 history)
    //app.get('*', routes.index);


}