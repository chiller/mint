ObjectID = require('mongodb').ObjectID
class shapesDAO
    constructor: (@db) ->

    getShapes: (cb) ->
        @db.shapes.find().toArray (err, items) ->
            cb items


    updateShape: (id, x, y, cb) ->
        console.log id, x, y
        @db.shapes.update
            _id: new ObjectID(id)
        ,
            '$set':
                x : x
                y : y
        , (err, num) ->
            console.log num
            cb num

    deleteShape: (id, cb) ->
        db = @db
        @db.shapes.findOne
            name: id
        , (err, doc) -> 
            console.log doc
            db.shapes.remove
               name: doc.name
            , (err, num) ->
                console.log num
                cb doc._id

    addShape: (x, y, name, cb) ->
        @db.shapes.insert
            name: name
            x : x
            y : y
        ,
            (err, num) ->
              cb num
module.exports.shapesDAO = shapesDAO

