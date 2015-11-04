var classifier = require('classifier');

module.exports = new classifier.Bayesian({
  backend: {
    type: 'Redis',
    options: {
      hostname: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      name: process.env.REDIS_NAME || 'abuseornot'
    }
  },
  threshold: {
    abuse: 3,
    not: 1
  }
});
