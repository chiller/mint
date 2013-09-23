
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  MongoClient = require('mongodb').MongoClient;

var app = module.exports = express.createServer();

// Configuration
var conn_string_prod = "mongodb://nodejitsu:54994e0b6fa6817af58f0160756facf7@paulo.mongohq.com:10060/nodejitsudb6288570733";
var conn_string_local = "mongodb://localhost:27017/mint"
MongoClient.connect(conn_string_local, function(err, db) {
    "use strict";
    if(err) throw err;


    app.configure(function(){
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.set('view options', {
        layout: false
      });
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.static(__dirname + '/public'));
      app.use(express.logger());
      app.use(app.router);
    });

    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
      app.use(express.errorHandler());
    });

    routes(app, db);
    


    // Start server

    app.listen(3000, function(){
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
});