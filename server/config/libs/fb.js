var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

let config = require("./../config");

let utils = require('./../../common/utils');


let UserService = require('./../../api/v1.0/users/service');
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.baseUrl + "/login/facebook/return",
    profileFields: ['id', 'email', 'name']
},

    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    })
);


let initialize = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login/facebook',
        passport.authenticate('facebook', { scope: ['email'] }));

    app.get('/login/facebook/return',

        passport.authenticate('facebook', { failureRedirect: '/' }),

        function (req, res) {
            loginSocialMeida(req, res);
        });
}





function loginSocialMeida(req, res) {

    var name = '';
    if (req['user']['name']['givenName']) name += req['user']['name']['givenName'];
    if (req['user']['name']['middleName']) name += req['user']['name']['middleName'];
    if (req['user']['name']['familyName']) name += req['user']['name']['familyName'];
    var email;

    try {
        if (req['user']['emails']) email = req['user']['emails'][0]['value'];
    } catch (err) {

    }

    var id = req['user']['id'];

    let body = {
        facebookId: id
    };

    if (email) body.email = email;

    if (name) body.name = { first: name, last: "" };

    let findQuery;

    if (email) findQuery = { $or: [{ facebookId: id }, { email: body.email }] }
    else findQuery = { facebookId: id };

    UserService.findOneByValues(findQuery)
        .then((response) => {
            if (response) {
                let data = response.toJSON();
                data = utils.formatUserData(response.toJSON());
                data.token = utils.generateJWTForUser(data);

                res.cookie('token', data.token);
                res.cookie('username', data.name.first);
                res.cookie('userId', data._id+"");
                res.redirect('/');

            } else {
        
                body.signUpType = 'facebook';
                UserService.create(body)
                    .then((response) => {
                        response.save(function (err, response) {
                            if (err) {
                                res.status(500).json({ status: false, message: 'Internal server error', data: null });
                            } else {
                                let data = response.toJSON();
                                data = utils.formatUserData(response.toJSON());
                                data.token = utils.generateJWTForUser(data);
                                

                                res.cookie('token', data.token);
                                res.cookie('username', data.name.first);
                                res.cookie('userId', data._id+"");
                                res.redirect('/');
                            }
                        });
                    })
            }
        }).catch((err) => {
            res.status(500).json({ status: false, message: 'Internal server error', data: null });
        });
}

module.exports = {
    initialize
}