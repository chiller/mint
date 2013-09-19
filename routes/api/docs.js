var mongo = require('mongodb');

module.exports = function (db) {
  "use strict";

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

    var newDoc = {
      author : req.body.author,
      text : req.body.text
    };

    docs.insert(newDoc, {safe:true}, function(err, record){
      res.json(record[0]);
    });
    
  }

  this.deletedoc = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    docs.remove({_id: oid}, function(err, removed){
      res.json(removed);
    })  

  }
  this.updatedoc = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    delete req.body._id
    docs.update({_id: oid}, req.body, {upsert:true}, function(err, data){
      if (err) throw err;
      res.json(data);
    })
  }
}