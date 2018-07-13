let mongoose = require('mongoose');
let UserService = require('./service');
let jwt = require('jsonwebtoken');
let config = require('../../../config/config');
let _ = require("underscore");
let AddCollection = require('./model');


let submitAdd = (req,res)=>{
    let AddDetails = req.body;
    AddCollection.create(AddDetails)
        .then((response)=>{
            res.status(200).json({status:true , message : "Successfully Created Add" , add : response});
        }).catch(
            (error)=>{
                res.status(500).json({status:false , message : "Internal Server Error, Please try again"})
            }
        )

}


module.exports = {
    submitAdd
}
