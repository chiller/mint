conn = new Mongo();
db = conn.getDB("mint");

//var document_id =   "52a37e129deb89c9bd0678aa";
var document_id =   "NODOCUMENT";
var set_max = 2000000;

result = db.entities.find({document:document_id}).count()

delta = set_max - result

print("count: "+result)
print(delta)

while(delta > 0){
    print("Objects left to insert "+delta)
    db.entities.insert({document:document_id, "position" : { "top" : 189.53472900390625+Math.random(10)*500, "left" : 105.9896240234375+Math.random(10)*800 }, "title" : "*"})
    delta--;
}