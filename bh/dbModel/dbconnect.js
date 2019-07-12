const mongoose = require('mongoose');

let db = mongoose.connect('mongodb://localhost:27017/bihudb',{useNewUrlParser:true});

mongoose.connection.on("error", function (error) {
    console.log("Failure of database connection" + error);
});
mongoose.connection.on("open", function () {
    console.log("Successful database connection...");
});