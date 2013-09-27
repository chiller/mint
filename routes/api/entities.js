var mongo = require('mongodb');
var url = require('url');
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
      sa.broadcast(req.body.document,"entity:create",{msg: "created", obj: record[0]});
      res.json(record[0]);
    });
  }

  this.delete = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    var url_parts = url.parse(req.url, true);
    entities.remove({_id: oid}, function(err, removed){
        if (err) throw err;
        console.log(url_parts.query.document)
        sa.broadcast(url_parts.query.document,"entity:delete",{msg: "deleted", obj: oid});
        res.json(oid);
    })  
  }

  this.update = function(req, res) {
    var oid = mongo.BSONPure.ObjectID(req.params.id)
    delete req.body._id
    entities.update({_id: oid}, req.body, {upsert:true}, function(err, data){
      if (err) throw err;
      var updated = req.body;
      updated._id = req.params.id;
      console.log(req.body.document)
      sa.broadcast(req.body.document,"entity:update",{msg: "updated", obj: updated});
      res.json(data);
    })
  }
}