var mongo = require('mongodb');

module.exports = function (db, sa) {
    "use strict";

    var docs = db.collection("docs");

    this.create = function(req,res){
        var oid = mongo.BSONPure.ObjectID(req.params.id)
        docs.update({_id:oid},{ $push: {connections: {from:req.body.from, to: req.body.to}}}  ,function(obj){
           sa.broadcast("room","connection:create",{"msg":"created", obj:{from:req.body.from, to: req.body.to}});
           res.json({"msg":"created", obj:{from:req.body.from, to: req.body.to}});
        })


    };
    this.remove = function(req,res){
        var oid = mongo.BSONPure.ObjectID(req.params.id)
        docs.update({_id:oid},{ $pull: {connections: {from:req.body.from, to: req.body.to}}}  ,function(obj){
            sa.broadcast("room","connection:delete",obj);
            res.json( {from:req.body.from, to: req.body.to}) ;
        })

    };
}