let express = require('express');

let router = express.Router();


let AddController = require('./controller')


router.post('/createAdd', AddController.createAdd  );







module.exports = router;
