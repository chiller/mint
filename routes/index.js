var DocumentApi = require('./api/docs.js');
var EntityApi = require('./api/entities.js');
var CompileApi = require('./api/compile.js');
var ConnectionApi = require('./api/connections.js');
var SocketAdapter = require('./socketAdapter.js');
module.exports = exports = function(app, db) {
// Routes
    // Socket.io Communication
    sa = new SocketAdapter(app);
    //compile
    compile = new CompileApi(db, sa);
    app.get('/api/compile/modules/:id/', compile.getmodule);
    app.get('/api/compile/:id', compile.compile);

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
    app.delete('/api/docs/connections/delete', connections.remove);

    //pages
    app.get('/', function(req, res){
      res.render('editor', {
        title: 'About'
      });
    });
    app.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    // redirect all others to the index (HTML5 history)
    //app.get('*', routes.index);


}