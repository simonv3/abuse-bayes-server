// Get the packages we need
var express = require('express');
var classifier = require('classifier');
var bodyParser = require('body-parser');

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
// Create our Express application
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

router.get('/classify/', function(req, res) {
  res.json({ error: 'POST a `string` to see if it\'s abuse.' });
});

router.post('/classify/', function(req, res) {
  bayes.classify(req.body.text, function(category) {
    console.log(category === 'abuse');
    res.json({
      success: true,
      abuse: category === 'abuse'
    });
  });
});

// Register all our routes with /api
app.use('/api/v1', router);

// Start the server
app.listen(port);
console.log('Running on port ' + port);
