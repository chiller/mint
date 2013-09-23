var mongo = require('mongodb');

module.exports = function (db, sa) {
  "use strict";

  var entities = db.collection("entities");

  this.getAll = function (req, res) {
    
    entities.find(req.query).toArray(function(err, items){
      res.json(items);
    })
  }
  this.getOne = function (req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    entities.findOne({"_id": oid }, function(err, doc) {
       res.json(doc);
    });
  }

  this.create = function(req, res) {
    entities.insert(req.body, {safe:true}, function(err, record){
      sa.broadcast("room","entity:create",{msg: "created", obj: record[0]});
      res.json(record[0]);
    });
  }

  this.delete = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    entities.remove({_id: oid}, function(err, removed){
      res.json(removed);
    })  
  }

  this.update = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    delete req.body._id
    entities.update({_id: oid}, req.body, {upsert:true}, function(err, data){
      if (err) throw err;
      res.json(data);
    })
  }
}