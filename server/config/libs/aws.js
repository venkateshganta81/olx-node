// import entire SDK
let  AWS = require('aws-sdk');
// import individual service
let  S3 = require('aws-sdk/clients/s3');

let config = require('./../../config/config');

var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId : config.aws.accessKey,
        secretAccessKey : config.aws.secretKey,
        region :config.aws.region
    });


let uploadFile = function (fileKey,filePath,callBack) {

    let fs = require('fs');
    fs.readFile(filePath,function (err,data) {
        if(err)callBack(err,null);
        else{
            let base64Data = new Buffer(data,'binary');
            var params = {Bucket:config.aws.bucketName, Key: fileKey, Body: base64Data};
            s3.upload(params,function (err,data) {
                if(err){
                    callBack(err,null);
                }else{
                    callBack(null,data);
                }
            })
        }
    });
}

let getPresignedUrlOfAfile = (fileKey)=>{
        
    const url = s3.getSignedUrl('getObject', {
        Bucket: config.aws.bucketName,
        Key: fileKey,
        Expires: config.aws.presignedUrlExpiration
    });

    return url;
};

module.exports = {
    uploadFile,
    getPresignedUrlOfAfile
}