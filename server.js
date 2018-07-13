var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

let chalk = require('chalk');

var app = express();

app.use(logger('dev'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

let routesV1_0 = require('./server/routes/routes.v1.0');

require('./server/config/libs/mongoose');//initializing mongoose

let config = require('./server/config/config');

app.use('/api/v1.0', routesV1_0);

app.post('/callback', function (req, res) {
    console.log(req);
});

app.use('/apidocs', express.static('apidocs'));

app.listen(config.port);

console.log(chalk.green('Server started on port : ' + config.port + " with " + process.env.NODE_ENV + ' mode'));

module.exports = app;