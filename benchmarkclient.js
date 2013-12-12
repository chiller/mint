conn = new Mongo();
db = conn.getDB("mint");

var document_id =   "52a37e129deb89c9bd0678aa";
//var document_id =   "performance";
var set_max = 100;


doc = db.docs.findOne({_id: ObjectId(document_id)})

db.entities.remove({document:document_id})
db.docs.update({_id: doc._id}, {$set: {connections: []}})
db.docs.update({_id: doc._id}, {$set: {entities: []}})
var id = 1
idarray = [ ]
while(id < set_max){
    print(".")
    objid = new ObjectId()
    idarray.push(objid.str)
    db.entities.insert({_id: objid, document:document_id, "position" : { "left" : 100+100*(id%10), "top" : 10+100*Math.floor(id/10) }, "title" : "*"})
    id++;
}

connections = []

for(var i=0;i<idarray.length-1;i++){
    if (i%10!=8){
    connections.push({

        from: idarray[i],
        to: idarray[i+1],
        label: "alma"

    })
    }
    if (i>10){
        connections.push({

            from: idarray[i],
            to: idarray[i-10],
            label: "alma"

        })
    }
}
print(doc._id)
print(connections.length)
db.docs.update({_id: doc._id}, {$set: {connections: connections}})