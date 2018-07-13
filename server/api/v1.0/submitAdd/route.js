let express = require('express');

let router = express.Router();

// let authMiddleware = require('./../middlewares/auth');

let AddsController = require('./controller');

// let validationsMiddleware = require('../middlewares/validations');


router.post('/createAdd',AddsController.submitAdd);


module.exports = router;
