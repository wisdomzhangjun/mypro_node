
const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    uname:{type:String},
    pwd:{type:String}
})

let UserModel = mongoose.model("users", userSchema);

module.exports = UserModel; 