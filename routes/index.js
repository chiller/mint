var Api = require('./api');
module.exports = exports = function(app, db) {
// Routes
    api = new Api(db);
    app.get('/api/docs', api.docs);
    app.get('/api/docs/:id', api.doc);
    app.post('/api/docs', api.adddoc);
    app.put('/api/docs/:id', api.updatedoc);
    app.delete('/api/docs/:id', api.deletedoc);


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