let mongoose = require('mongoose');
let ObjectID = mongoose.Schema.ObjectId;

let Add = new mongoose.Schema({
    title : String,
    category : String,
    price : Number,
    description : String,
    photos : [],
    name : String,
    mobile : Number,
    city : String
})

let AddModel = mongoose.model('Adds',Add);
module.exports = AddModel;