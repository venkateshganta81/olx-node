let config = require('../../../config/config');
let UserService = require('../users/service');
let utils = require('./../../../common/utils');
var jwt = require('jsonwebtoken');


let isUserLogin = (req,res,next)=>{
    let token = req.headers['x-access-token'] || req.cookies['token'];
    //   let token = ;
    if(token){
        let decodedData;
        try{
            decodedData =  utils.decodeJWTForUser(token);
        }catch (err){
            res.status(401).json({status:false,message:"Invalid token",data:null});
            return;
        }
        UserService.findOneByValues({_id:decodedData._id,role:decodedData.role})
            .then(function (user) {

                req.jwt = decodedData;
                req.jwt.email = user.email; 
                req.jwt.name = user.name; 
                req.jwt.role = user.role; 
                req.jwt.isEmailVerified = user.emailVerification.status;

                next();
            }).catch(function (err) {
                console.log(err);
            res.status(401).json({status:false,message:"User not found",data:null});
        });
    }else{
        res.status(401).json({status:false,message:"User token not found",data:null});
    }
}

let isAdmin = (req,res,next)=>{
    if(req.jwt.role === 'admin'){
        next();
    }else{
        res.status(401).json({status:false,message:"Access Denied for this operation",data:null});
    }
}


let decodeTokenIfAvailable = (req,res,next)=>{
    let token = req.headers['x-access-token'] || req.cookies['token'];
    //   let token = ;
    if(token){
        let decodedData;
        try{
            decodedData =  utils.decodeJWTForUser(token);
        }catch (err){
            next();
        }
        UserService.findOneByValues({_id:decodedData._id,role:decodedData.role})
            .then(function (user) {

                req.jwt = decodedData;
                req.jwt.email = user.email; 
                req.jwt.name = user.name; 
                req.jwt.role = user.role; 
                req.jwt.isEmailVerified = user.emailVerification.status;

                next();
            }).catch(function (err) {
                next();
        });
    }else{
        next();
    }
}

let isUserEmailVerified = (req, res, next) => {
    if (req.jwt.isEmailVerified) {
        next();
    } else {
        res.status(401).json({ status: false, message: "User email not verified", data: null });
    }
}

module.exports = {
    isUserLogin,
    isAdmin,
    decodeTokenIfAvailable,
    isUserEmailVerified
}
