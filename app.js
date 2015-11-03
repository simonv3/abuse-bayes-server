// Get the packages we need
var express = require('express');
var exphbs  = require('express-handlebars');
var classifier = require('classifier');
var bodyParser = require('body-parser');

var bayes = new classifier.Bayesian({
  backend: {
    type: 'Redis',
    options: {
      hostname: 'localhost',
      port: 6379,
      name: 'abuseornot'
    }
  }
});

// Create our Express application
var app = express();

// Settings for the Express app
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/static', express.static('public'));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

router.get('/classify/', function(req, res) {
  res.json({ error: 'POST a `string` to see if it\'s abuse.' });
});

router.post('/classify/', function(req, res) {
  bayes.classify(req.body.text, function(category) {

    res.json({
      success: true,
      abuse: category === 'abuse'
    });
  });
});

// Register all our routes with /api
app.use('/api/v1', router);

// Let's give ourselves a home page
app.get('/', function(req, res) {
  res.render('home');
});

// Start the server
app.listen(port);
console.log('Running on port ' + port);
