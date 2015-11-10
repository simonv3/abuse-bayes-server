// Get the packages we need
var express = require('express'),
    app = express(),
    path = require('path'),
    exphbs  = require('express-handlebars'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    redisConfig = require('./lib/redisConfig.js'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    lessMiddleware = require('less-middleware');

// Session and cookies middlewares to keep user logged in
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var permissions = require('./lib/permissions.js');
var hat = require('./lib/sortingHat.js');
// This will configure Passport to use Auth0
var strategy = require('./lib/passportConfig');

// Personal libraries
var redisClient = redisConfig.client;

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// This goes first, otherwise passport authenticates on every static.
app.use(lessMiddleware(__dirname + '/public', {debug: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Create our Express application
app.use(cookieParser());
app.use(session({
  secret: 'a-secret-word',
  store: new RedisStore({
    client: redisClient
  }),
  cookie: {
    maxAge : 604800 // one week
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Settings for the Express app
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Register all our API routes with /api
app.use('/api/v1', require('./lib/api.js'));

// Let's give ourselves a home page
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/login-error', function(req, res) {
  res.render('error');
});

app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login-error' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect('/incoming');
  }
);

// This is the only page that really does anything
app.get('/incoming', hat.incomingRoute);
io.on('connection', hat.socketConnection);

// Start the server
http.listen(port, function() {
  console.log('Running on port ' + port);
});
