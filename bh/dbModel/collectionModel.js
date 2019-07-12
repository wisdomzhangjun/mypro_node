
const mongoose = require('mongoose');

let collectionSchema = mongoose.Schema({
    uid:{type:String},
    aid:{type:String}
})

let CollectionModel = mongoose.model("collections", collectionSchema);

module.exports = CollectionModel; 