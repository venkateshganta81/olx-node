let mongoose = require('mongoose');
let ObjectID = mongoose.Schema.ObjectId;

let Schema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    profileImageUrl:String,
    role:{type:String,default:"normal",enum:['normal','admin','seller'],required:true},
    signUpType:{type:String,enum:['manual','gmail','facebook'],default:'manual',required:true},    
    email: { type:String, unique:true },
    facebookId:{ type:String,unique:true },
    password: String,
    gender: {type:String,enum:["m", "f", "o"]},
    dob: Date,
    mobile:{
        countryCode:String,
        number:String
    },
    emailVerification: {
        status: {type: Boolean, default: false},
        token:String,
        expiresAt:Date,
        verifiedAt:Date
    },
    createdDate:{type:Date, default:Date.now()},
    updatedDate:{type:Date,default:Date.now()},
});

let UserModel = mongoose.model('users',Schema);
module.exports = UserModel;