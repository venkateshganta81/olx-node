let express = require('express');

let router = express.Router();

let authMiddleware = require('./../middlewares/auth');

let validationsMiddleware = require('../middlewares/validations');

let constants = require('./../../../common/constants');

module.exports = router;
