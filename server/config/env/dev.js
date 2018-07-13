module.exports = {
    port : 3001,
    jwt: {
        secret: "MTW2.0@2018###$$YOUCANTHACKME",
        options: {expiresIn: 365 * 60 * 60 * 24} // 365 days
    },
    db : {
        mongo : {
            uri:"mongodb://localhost:27017/mtwdev",
            options: {
                user: '',
                pass: ''
            }
        }
    },
    emailVericationLinkExpireTime : 365 * 60 * 60 * 24,//365 days
    mail:{
        defaultFromAddress:'rajesh.d@mtwlabs.com',
        sendGrid : {
            apiKey : "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",
        }
    },
    paymentGateway:{
        paytm:{
            MID: '-',
            WEBSITE: '-',
            CHANNEL_ID: '-',
            INDUSTRY_TYPE_ID: '-',
            MERCHANT_KEY : '-'
        },
        razorPay:{
            keyId:'-',
            keySecret:'-'
        },
        payPal: {
            clientId: '-',
            clientSecret: '-'
        }
    },
    aws:{
        bucketName:'-',
        accessKey:'-',
        secretKey:'-',
        region:'-',
        presignedUrlExpiration : 24*60*60 //seconds
    },
    facebook: {
        clientId: 2345678978,
        clientSecret:"-"
    },

    baseUrl:'http://localhost:'+3001,
}


