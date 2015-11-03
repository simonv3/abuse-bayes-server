var classifier = require('classifier');

var bayes = new classifier.Bayesian({
  backend: {
    type: 'Redis',
    options: {
      hostname: 'localhost', // default
      port: 6379,            // default
      name: 'abuseornot'      // namespace for persisting
    }
  }
});

module.export = bayes;
