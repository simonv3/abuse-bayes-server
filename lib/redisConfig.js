var redis = require('redis');
var config = require('../config.js');

var redisClient = redis.createClient({
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

module.exports.client = redisClient;

module.exports.store = function(session) {
  var RedisStore = connectRedis(session);
  return new RedisStore(redisClient);
};
