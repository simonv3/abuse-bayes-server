var express = require('express');
var redisClient = require('./redisConfig.js').client;
var bayes = require('./bayes.js');
var permissions = require('./permissions.js');

// Create our Express router
var router = express.Router();

router.get('/classify/', function(req, res) {
  res.json({ error: 'POST a `string` to see if it\'s abuse.' });
});

router.post('/classify/', function(req, res) {
  var json = req.body;

  bayes.classify(json.text, function(category) {
    var a = [
      'text', json.text,
      'classifiedAs', category,
      'userId', json.userId,
      'tweetId', json.tweetId
    ];

    var hashName = 'tweet:' + json.tweetId;

    redisClient.hmset(hashName, a, function(err, key){
      if (err) console.log(err);
      redisClient.lpush('register.queue', hashName, function(err, key) {
        if (err) console.log(err);
      });
    });
    res.json({
      success: true,
      abuse: category === 'abuse'
    });
  });
});

router.post('/register-abuse/', function(req, res) {
  var json = req.body;
  bayes.classify(json.text, function(category) {
    var a = [
      'text', json.text,
      'classifiedAs', category,
      'userId', json.userId,
      'tweetId', json.tweetId
    ];
    var hashName = 'tweet:' + json.tweetId;
    redisClient.hmset(hashName, a, function(err, key){
      if (err) console.log(err);
      redisClient.lpush('register.queue', hashName, function(err, key) {
        if (err) console.log(err);
        res.json({ success: 'Submitted for evaluation'});
      });
    });
  });
});

module.exports = router;
