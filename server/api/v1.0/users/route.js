let express = require('express');

let router = express.Router();

let authMiddleware = require('./../middlewares/auth');

let UsersController = require('./controller');

let validationsMiddleware = require('../middlewares/validations');


// router.post('/register',validationsMiddleware.reqiuresBody,UsersController.register);

// router.post('/login', validationsMiddleware.reqiuresBody, UsersController.login, authMiddleware.isUserEmailVerified);

// router.get('/',authMiddleware.isUserLogin,UsersController.getLoggedUserDetails);

// router.post('/all/:limit?/:timestamp?',authMiddleware.isUserLogin,authMiddleware.isAdmin,UsersController.getAllUsers);

// router.get('/verify/email/:token',UsersController.verifyUserEmail);

// router.get('/resendVerificationLink',authMiddleware.isUserLogin,UsersController.resendVerificationLink); // there is an issue if the user was created by admin

// router.get('/:_id',authMiddleware.isUserLogin,authMiddleware.isAdmin,UsersController.getOtherUserDetails);

// router.put('/:_id',authMiddleware.isUserLogin,authMiddleware.isAdmin,UsersController.updateOtherUserData);

// router.put('/',authMiddleware.isUserLogin,validationsMiddleware.reqiuresBody,UsersController.updateLoggedUserData);

// router.post('/passwordresetlink',validationsMiddleware.reqiuresBody,UsersController.sendPasswordResetLInk);

// router.post('/resetpasswordwithtoken',validationsMiddleware.reqiuresBody,UsersController.resetPasswordWithToken);


module.exports = router;
