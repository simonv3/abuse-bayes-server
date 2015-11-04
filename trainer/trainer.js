var fs = require('fs');
var https = require('https');
var LineByLineReader = require('line-by-line');
var classifier = require('classifier');

var bayes = new classifier.Bayesian({
  backend: {
    type: 'Redis',
    options: {
      hostname: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      name: process.env.REDIS_NAME || 'abuseornot'
    }
  }
});

if (process.argv.length < 4) {
  console.log('Usage: node ' + process.argv[1] + ' ABUSE_FILE NORMAL_FILE');
  process.exit(1);
}

var filesEnded = 0;

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {

    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  }).on('error', function(err) {
    fs.unlink(dest);
    if (cb) cb(err.message);
  });
};

var downloadFiles = function(url1, dest1, url2, dest2, cb) {
  download(url1, dest1, download(url2, dest2, cb));
};

var abuseUrl = process.argv[2];
var normalUrl = process.argv[3];

var abuseDest = 'abuse_downloaded.txt';
var normalDest = 'normal_downloaded.txt';

var rest = function() {
  var normalLR = new LineByLineReader(abuseDest);
  var abuseLR = new LineByLineReader(normalDest);

  abuseLR.on('line', function(line) {
    bayes.train(line, 'abuse');
  });

  normalLR.on('line', function(line) {
    bayes.train(line, "normal");
  });

  abuseLR.on('end', function() {
    fileEndIncrement();
  });

  normalLR.on('end', function() {
    fileEndIncrement();
  });
};

var fileEndIncrement = function() {
  filesEnded ++;
  if (filesEnded === 2) {
    thingsAreDone();
  }
};

var thingsAreDone = function() {
  console.log('Trained!');
};

downloadFiles(abuseUrl, abuseDest, normalUrl, normalDest, rest);
