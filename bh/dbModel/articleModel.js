
const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title:{type:String},
    content:{type:String},
    thumb:{type:String},
    uid:{type:String,ref:'users'},
    ctime:{type:Date}
})

let ArticleModel = mongoose.model("articles", articleSchema);

module.exports = ArticleModel; 