/**
 * Created with JetBrains WebStorm.
 * User: chiller
 * Date: 10/1/13
 * Time: 11:52 AM
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');
var url = require('url');
var _ = require('underscore');
module.exports = function (db, sa) {
    "use strict";

    var docs = db.collection("docs");

    this.getmodule = function(req, res){

        docs.findOne({"_id": mongo.BSONPure.ObjectID(req.params.id) }, function(err, data){
            if (err) throw err;
            res.write(data.compiled);
            res.end();

        })

    }

    this.compile = function(req, res){
        denormalize(req.params.id, function(doc){
            res.setHeader('Content-Type', 'text/plain');
            var data = _.template(doc.template.toString(),{doc: doc}).toString()

            //res.write(" lajos[Object object],[Object object]")

            docs.update({"_id": mongo.BSONPure.ObjectID(req.params.id) }, {$set: {compiled: data}}, function(err, res){
                if(err) throw err;
            })

            res.write(data)
            res.end()


        });


    }

    var denormalize = function(_id, callback){

        var oid = mongo.BSONPure.ObjectID(_id)


        db.collection("docs").findOne({"_id": oid }, function(err, doc) {
            doc['entities'] = []
                db.collection("entities").find({"document":_id}).toArray(function(err, items){
                     items.forEach(function(entity){
                          doc.connections.forEach(function(con){
                             if (!entity.hasOwnProperty("connections_from")) { entity.connections_from = []}
                             if (!entity.hasOwnProperty("connections_to")) { entity.connections_to = []}

                             if(con.from == entity._id){
                                var entity_to = _(items).filter(function(x){return x._id==con.to;})[0]
                                entity.connections_from.push({to: entity_to.title, label:con.label})
                             } else if (con.to == entity._id){
                                 var entity_to = _(items).filter(function(x){return x._id==con.from;})[0]
                                 entity.connections_to.push({from: entity_to.title, label:con.label})
                             }
                         })
                     })

                    doc.entities = items;
                    db.collection("temp").update({"_id": oid }, doc ,{safe:true, upsert:true}, function(err,result){
                        if(err) throw err;
                        callback(doc)
                    })
                })

        });
    }
}