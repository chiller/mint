var mongo = require('mongodb');
var url = require('url');
module.exports = function (db) {
    "use strict";

    var docs = db.collection("docs");
    var entities = db.collection("entities");

    var updateconnections = function(res, newents, doc, newdoc) {

        //update connections based on new ids

        res.json(newdoc);
    }

    this.fork = function (req, res) {
            var oid = mongo.BSONPure.ObjectID(req.params.id)
            docs.findOne({"_id": oid }, function(err, doc) {
                delete doc._id;
                doc.text = doc.text+"_fork"
                docs.insert(doc, function(err, newdoc){

                    entities.find({document : req.params.id}).toArray(function(err, ents){
                        if (err) throw err;
                        var newents = ents.map(function(x) {
                            x.old_id = x._id
                            delete x._id;
                            x.document = newdoc[0]._id.toString();
                            return x;})



                        console.log(newents)
                        entities.insert(newents, function(err, out){
                            if (err) throw err;
                            console.log(out)
                            updateconnections(res, newents, doc, newdoc);
                        });




                    })


                })

            });
        }
}
