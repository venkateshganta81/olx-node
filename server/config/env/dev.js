module.exports = {
    port : 3001,
    jwt: {
        secret: "hello@123><>",
        options: {expiresIn: 365 * 60 * 60 * 24} // 365 days
    },
    db : {
        mongo : {
            uri:"mongodb://localhost:27017/learningNode",
            options: {
                user: '',
                pass: ''
            }
        }
    },

    baseUrl:'http://localhost:'+3001,
}


