var redisClient = require('./redisConfig.js').client;
var bayes = require('./bayes.js');

module.exports.incomingRoute = function(req, res) {

  redisClient.lrange('register.queue', 0, -1, function(err, list) {
    console.log(list);
    if (err) console.log(err);
    var queue = [];
    var remaining = list.length;

    if (list.length > 0){
      list.forEach(function(item) {
        redisClient.hgetall(item, function (err, reply) {
          if (err) console.log(err);
          queue.push(reply);

          --remaining;
          if (remaining === 0) {
            res.render('incoming', {
              queue: queue,
              user: req.user
            });
          }
        });
      });
    } else {
      res.render('incoming', {
        queue: queue,
        user: req.user
      });
    }

  });
};


module.exports.socketConnection = function(socket){
  console.log('a user connected');

  socket.on('mark', function(item){
    var keyName = 'tweet:' + item.tweetId;
    console.log(keyName);
    redisClient.hgetall(keyName, function(err, hash) {
      if (err) console.log(err);
      console.log('got the tweet', item.action);
      if (item.action === 'normal' ||
          item.action === 'abuse') {
        bayes.train(hash.text, item.action, function(){
          redisClient.del(keyName, function(err, del){
            if (err) console.log(err);
            redisClient.lrem('register.queue', 0, keyName, function(err, del) {
              if (err) console.log(err);
              socket.emit('deleted', item);
            });
          });
        });
      } else if (item.action === 'delete') {
        redisClient.del(keyName, function(err, del){
          if (err) console.log(err);
          redisClient.lrem('register.queue', 0, keyName, function(err, del) {
            if (err) console.log(err);
            socket.emit('deleted', item);
          });

        });
      }
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
};
