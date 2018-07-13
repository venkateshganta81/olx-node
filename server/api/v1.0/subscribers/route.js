let express = require('express');

let router = express.Router();

let authMiddleware = require('./../middlewares/auth');

let SubscribersController = require('./controller');

let validationsMiddleware = require('../middlewares/validations');


router.post('/add',validationsMiddleware.reqiuresBody,SubscribersController.addNew);

module.exports = router;
