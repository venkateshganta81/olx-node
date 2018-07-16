let mongoose = require('mongoose');
let ObjectID = mongoose.Schema.ObjectId;

let AddDetails = new mongoose.Schema({
    title : String,
    description: String,
    category : String,
    price : Number,
    creatorId : ObjectID
})




let AddModel = mongoose.model('Adds',AddDetails);
module.exports = AddModel;