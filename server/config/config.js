let _ = require('lodash');

process.env.NODE_ENV = 'dev'; // dev, qa, production

let config = _.merge(require('./env/' + process.env.NODE_ENV + '.js') || {});

module.exports = config;