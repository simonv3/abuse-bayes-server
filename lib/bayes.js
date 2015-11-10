var classifier = require('classifier');
var config = require('../config');

module.exports = new classifier.Bayesian({
  backend: {
    type: 'Redis',
    options: {
      hostname: config.REDIS_HOST || 'localhost',
      port: config.REDIS_PORT || 6379,
      name: config.REDIS_NAME || 'abuseornot'
    }
  },
  threshold: {
    abuse: 3,
    not: 1
  }
});
