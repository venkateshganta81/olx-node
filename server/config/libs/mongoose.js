let mongoose = require('mongoose');
let config = require('../config');
let chalk = require('chalk');

mongoose.connect(config.db.mongo.uri,function (err) {
    if(err){
        console.log(chalk.red("Error while connecting to mongo : " +err));
    }else {
        console.log("connected to mongodb : " + config.db.mongo.uri);
    }
});

module.exports = mongoose;