var mongo = require('mongodb');

module.exports = Api = function (db) {
  "use strict";

  var quotes = [
    { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
    { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
    { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
    { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
  ];


  var docs = db.collection("docs");

  this.docs = function (req, res) {
    docs.find().toArray(function(err, items){
      res.json(items);
    })
  }
  this.doc = function (req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    docs.findOne({"_id": oid }, function(err, doc) {
       res.json(doc);
    });
  }

  this.adddoc = function(req, res) {
    if(!req.body.hasOwnProperty('author') || 
       !req.body.hasOwnProperty('text')) {
      res.statusCode = 400;
      return res.send('Error 400: Post syntax incorrect.');
    }

    var newQuote = {
      author : req.body.author,
      text : req.body.text
    };

    quotes.push(newQuote);
    res.json(true);
  }

  this.deletedoc = function(req, res) {
      if(quotes.length <= req.params.id) {
      res.statusCode = 404;
      return res.send('Error 404: No quote found');
    }

    quotes.splice(req.params.id, 1);
    res.json(true);
      
  }
}