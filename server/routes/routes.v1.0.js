let express = require('express');
let multiparty = require('connect-multiparty');
let multipartymiddleware = multiparty();

let router = express.Router();



let SubmitAddRouter = require('../api/v1.0/submitAdd/route');


router.use('/create',SubmitAddRouter);

/* router.use('/user',UserRouter) */


module.exports = router;