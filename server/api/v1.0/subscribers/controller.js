let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

let config = require('../../../config/config');

let utils = require('./../../../common/utils');
let helpers = require('./../../../common/helpers');

let mailer = require('./../../../common/mailer');

let _ = require("underscore");

const Axios = require('axios');

var AxiosSendGrid = Axios.create({
    baseURL: 'https://api.sendgrid.com/',
    timeout: 10000,
    headers: {'Authorization':"Bearer "+config.mail.sendGrid.apiKey}
  });

let AuthorizationHeaderForSendGrid = "Bearer "+config.mail.sendGrid.apiKey ;

let addNew = (req, res) => {

    let {
        firstName,
        lastName,
        email
    } = req.body;

    return new Promise((resolve, reject) => {
        if (!firstName) reject("invalid firstName field");
        if (!lastName) reject("invalid lastName field");
        if (!email && !helpers.isValidEmail(email)) reject("invalid email field");
        else resolve(null);
    }).then(() => {

        let subscriberData = {
            first_name:firstName,
            last_name:lastName,
            email
        }

        AxiosSendGrid.post('https://api.sendgrid.com/v3/contactdb/recipients',[subscriberData] )
        .then(data=>{
            // {
            //     "new_count": 1,
            //     "updated_count": 0,
            //     "error_count": 0,
            //     "error_indices": [],
            //     "unmodified_indices": [],
            //     "persisted_recipients": [
            //         "cmFqZXNoLmRAbXR3bGFicy5jb20="
            //     ],
            //     "errors": []
            // }

            data = data.data;

            if(data.errors.length == 0){
                let subscriberId = data.persisted_recipients[0];
                AxiosSendGrid.post('https://api.sendgrid.com/v3/contactdb/lists/3437274/recipients/'+subscriberId)
                .then(data=>{
                    res.status(200).json({status:true,message:"New Subscriber Added",data:null});
                }).catch(err=>{
                    res.status(500).json({status:true,message:"Internal server error",data:err});
                    console.log('data',err);
                });
            }
        }).catch(err=>{
            res.status(500).json({status:true,message:"Internal server error",data:err});
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).json({ status: false, message: err, data: null });
    });
};

module.exports = {
    addNew
}
