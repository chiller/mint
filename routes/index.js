var DocumentApi = require('./api/docs.js');
var EntityApi = require('./api/entities.js');
var ConnectionApi = require('./api/connections.js');
var SocketAdapter = require('./socketAdapter.js');
module.exports = exports = function(app, db) {
// Routes
    // Socket.io Communication
    sa = new SocketAdapter(app);

    //document api
    api = new DocumentApi(db, sa);
    app.get('/api/docs', api.docs);
    app.get('/api/docs/:id', api.doc);
    app.post('/api/docs', api.adddoc);
    app.put('/api/docs/:id', api.updatedoc);
    app.delete('/api/docs/:id', api.deletedoc);
    //entity api
    entities = new EntityApi(db, sa);
    app.get('/api/entities', entities.getAll);
    app.get('/api/entities/:id', entities.getOne);
    app.post('/api/entities', entities.create);
    app.put('/api/entities/:id', entities.update);
    app.delete('/api/entities/:id', entities.delete);
    connections = new ConnectionApi(db,sa);
    app.post('/api/docs/:id/connections', connections.create);
    app.delete('/api/docs/:id/connections/:from/:to', connections.remove);

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