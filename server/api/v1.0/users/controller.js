let mongoose = require('mongoose');
let UserService = require('./service');
let jwt = require('jsonwebtoken');
let config = require('../../../config/config');

let utils = require('./../../../common/utils');
let helpers = require('./../../../common/helpers');

let mailer = require('./../../../common/mailer');

let _ = require("underscore");

let register = (req, res) => {

    let body = req.body;

    return new Promise((resolve, reject) => {
        if (!body.name || !body.name.first || !body.name.last) reject("invalid name field");
        else if (!body.email || !helpers.isValidEmail(body.email)) reject("invalid email");
        else if (!body.password || !helpers.isValidPasword(body.password)) reject("invalid password");
        else if(!body.mobile || !helpers.isValidPhoneNumber(body.mobile.number))reject("invalid Phone number");
        else if (body.role === "admin") reject('User type admin cannot be allowed');
        else resolve(null);
    }).then(() => {
        if (body.emailVerification) body.emailVerification.status = false;
        UserService.findOneByValues({ email: body.email })
            .then(response => {
                if (response) {
                    res.status(409).json({ status: false, message: 'User already exists', data: null });
                    return;
                }
                UserService.create(body)
                    .then((response) => {
                        let expireDate = Date.now();
                        expireDate += config.emailVericationLinkExpireTime;
                        response.emailVerification.token = utils.generateUniqueId();
                        response.emailVerification.expiresAt = new Date(expireDate);
                        response.save(function (err, response) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ status: false, message: 'Internal server error', data: null });
                            } else {
                                mailer.sendEmailVerificationMailToUser(
                                    response.email,
                                    response.name.first + ' ' + response.name.last,
                                    utils.generateUserEmailVerificationLink(response.emailVerification.token, response.email)
                                );
                                let data = response.toJSON();
                                data = utils.formatUserData(response.toJSON());
                                data.token = utils.generateJWTForUser(data);
                                res.status(200).json({ status: true, message: 'User registered', data: data });
                            }
                        });
                    }).catch((err) => {
                        if (err.code == '11000') {
                            res.status(409).json({ status: false, message: 'User already exists', data: null });
                        } else {
                            console.log(err);
                            res.status(500).json({ status: false, message: 'Internal server error', data: null });
                        }
                    });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: false, message: 'Internal server error', data: null });
            });
    }).catch((err) => {
        res.status(400).json({ status: false, message: err, data: null });
    });
};



let login = (req, res) => {
    let body = req.body;
    if (!req.body.email) {
        res.status(400).json({ status: false, message: 'email not Found', data: null });
        return;
    } else if (!req.body.password) {
        res.status(400).json({ status: false, message: 'password field not Found', data: null });
        return;
    } else {
        UserService.findOneByValues({ email: body.email })
            .then((response) => {
                if (response.password !== utils.encryptPassword(body.password)) {
                    res.status(401).json({ status: false, message: 'Invalid password', data: null });
                    return;
                }
                let data = response.toJSON();
                data = utils.formatUserData(response.toJSON());
                data.token = utils.generateJWTForUser(data);
                res.status(200).json({ status: true, message: 'User Authenticaton successful', data: data });
            }).catch((err) => {
                res.status(500).json({ status: false, message: 'User Not Found', data: null });
            });
    }
}

let getLoggedUserDetails = (req, res) => {
    UserService.findOneByValues({ _id: req.jwt._id })
        .then((response) => {
            let data = response.toJSON();
            data = utils.formatUserData(response.toJSON());
            res.status(200).json({ status: true, message: 'User Details fetched', data: data });
        }).catch((err) => {
            res.status(500).json({ status: false, message: 'User Not Found', data: null });
        });
}

let updateLoggedUserData = (req, res) => {
    let _id = req.jwt._id;
    let password;

    return new Promise((resolve, reject) => {

        if (req.body.email) reject('email cannot be updated');
        if (req.body.password) {

            if (!(req.body.newPassword)) reject('Invalid New Password');
            if (!helpers.isValidPasword(req.body.newPassword)) reject('Invalid New Password');
            password = req.body.password;
            delete req.body.password;
        }

        resolve(null);

    }).then(() => {

        if (password) {
            UserService.findOneByValues({ _id })
                .then(response => {
                    console.log(response);
                    if (password === utils.decryptPassword(response.password)) {
                        response.password = utils.encryptPassword(req.body.newPassword);
                        response.updatedDate = Date.now();
                        response.save((err, data) => {
                            res.json({ status: true, message: 'Password Updated', data: null });
                        })
                    } else {
                        res.status(400).json({ status: false, message: "Invalid old password", data: null });
                    }
                }).catch(err => {
                    res.status(500).json({ status: false, message: 'Internal server error', data: null });
                });
        } else {
            req.body.updatedDate = Date.now();
            UserService.UpdateOneByValues({ _id }, req.body)
                .then((response) => {
                    res.json({ status: true, message: 'User Details updated', data: null });
                }).catch((err) => {
                    res.status(500).json({ status: false, message: 'Internal server error', data: null });
                });
        }
    }).catch(err => {
        res.status(400).json({ status: false, message: err, data: null });
    })
}

let updateOtherUserData = (req, res) => {
    let _id = req.params._id;
    res.body.updatedDate = Date.now();
    UserService.UpdateOneByValues({ _id }, req.body)
        .then((response) => {
            res.status(200).json({ status: true, message: 'User Details updated', data: null });
        }).catch((err) => {
            res.status(500).json({ status: false, message: 'Internal server error', data: null });
        });
}

let getOtherUserDetails = (req, res) => {
    let id = req.params._id;
    UserService.findOneByValues({ _id: id })
        .then((response) => {
            let data = response.toJSON();
            data = formatUserData(response.toJSON());
            res.status(200).json({ status: true, message: 'User Details fetched', data: data });
        }).catch((err) => {
            res.status(500).json({ status: false, message: 'User Not Found', data: null });
        });
}

let verifyUserEmail = (req, res) => {
    let emailToken = req.params.token;
    let data = {
        'emailVerification.token': emailToken
    }
    UserService.findOneByValues(data)
        .then((response) => {
            let toDay = Date.now();
            let expireDay = response.emailVerification.expiresAt;
            if (toDay <= expireDay) {
                if (emailToken === response.emailVerification.token) {
                    if (response.emailVerification.status) {
                        res.status(200).json({ status: false, message: 'Already verified successfully', data: null });
                        return;
                    }
                    response.emailVerification.status = true;
                    response.emailVerification.verifiedAt = Date.now();
                    response.emailVerification.token = undefined;
                    response.emailVerification.expiresAt = undefined;
                    response.updatedDate = Date.now();
                    response.save(function (err, data) {
                        if (err) {
                            res.status(500).json({ status: false, message: 'Internal server error', data: null });
                        } else {
                            res.status(200).json({ status: true, message: 'Verified successfully', data: null });
                        }
                    });
                }
            } else {
                res.status(400).json({ status: false, message: 'Token expired', data: null });
            }
        }).catch((err) => {
            res.status(400).json({ status: false, message: 'Invalid Token, could not verify email', data: null });
        });
}




let resendVerificationLink = (req, res) => {
    let _id = req.jwt._id;
    UserService.findOneByValues({ _id: _id })
        .then((response) => {
            if (response.emailVerification.status) {
                res.status(200).json({ status: false, message: 'User Email Verified', data: null });
                return;
            }
            let expireDate = Date.now();
            expireDate += config.emailVericationLinkExpireTime;
            response.emailVerification.token = utils.generateUniqueId();
            response.emailVerification.expiresAt = new Date(expireDate);
            response.save(function (err, response) {
                if (err) {
                    res.status(500).json({ status: false, message: 'Internal server error', data: null });
                } else {
                    mailer.sendEmailVerificationMailToUser(
                        response.email,
                        response.name.first + ' ' + response.name.last,
                        utils.generateUserEmailVerificationLink(response.emailVerification.token, response.email)
                    );
                    let data = response.toJSON();
                    data = formatUserData(response.toJSON());
                    data.token = utils.generateJWTForUser(data);
                    res.status(200).json({ status: true, message: 'Resend verification link sent', data: null });
                }
            });
        }).catch((err) => {
            res.status(500).json({ status: false, message: 'Internal server error', data: null });
        });
}


let getAllUsers = (req, res) => {

    let limit = req.params.limit;
    let timestamp = req.params.timestamp;

    let role = req.body.role;

    let options = {
        sort: { updatedDate: -1 }
    };

    if (limit) options.limit = Number(limit);
    let matchQuery = {};
    if (timestamp) matchQuery.updatedDate = { $lt: new Date(timestamp) };
    if (role && !(role === 'all')) matchQuery.role = role;


    UserService.findAllByValues(matchQuery, options)
        .then((response) => {
            let usersData = [];
            response.forEach((user) => {
                let userData = formatUserDataForAdmin(user.toJSON());
                usersData.push(userData);
            });
            res.json({ status: true, message: 'Users data fetched', data: usersData });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ status: false, message: 'User Not Found', data: null });
        });
}


function formatUserDataForAdmin(userData) {
    if (userData) {
        if (userData.password)
            userData.password = utils.decryptPassword(userData.password);
        if (userData.emailVerification)
            delete userData.emailVerification;
        if (userData.profileImageUrl) {
            userData.profileImageKey = userData.profileImageUrl;
        }
        delete userData.isApproved;
    }
    return userData;
}

let sendPasswordResetLInk = (req, res) => {
    let email = req.body.email;
    UserService.findOneByValues({ email })
        .then(response => {
            if (!response) res.status(500).json({ status: false, message: 'User not found', data: null });
            else {
                let passwordResetLink = utils.generatePasswordResetLinkForUser(email);
                mailer.sendPasswordResetLinkToUser(email, response.name.first + " " + response.name.last, passwordResetLink);
                res.status(200).send({ status: true, message: "reset password link sent", data: null });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: false, message: 'Internal server error', data: null });
        });
}

let resetPasswordWithToken = (req, res) => {
    let resetToken = req.body.token;
    utils.decodePasswordResetToken(resetToken)
        .then(data => {
            let email = data.email;
            console.log(email);
            Promise.all([UserService.UpdateOneByValues({ email }, { password: req.body.password, updatedDate: Date.now() }),
            UserService.findOneByValues({ email })])
                .then(([response, user]) => {
                    console.log(response);
                    mailer.sendPasswordResetSuccessIntimationToUser(email, user.name.first + " " + user.name.last);
                    res.status(200).send({ status: false, message: "Password changed successfully", data: null });
                }).catch(err => {
                    res.status(500).send({ status: false, message: "Intenal server error", data: null });
                });
        }).catch(err => {
            res.status(200).send({ status: false, message: err, data: null });
        });
}


module.exports = {
    register,
    login,
    getLoggedUserDetails,
    updateLoggedUserData,
    updateOtherUserData,
    getOtherUserDetails,
    verifyUserEmail,
    resendVerificationLink,
    getAllUsers,
    sendPasswordResetLInk,
    resetPasswordWithToken
}
