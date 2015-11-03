var fs = require('fs');
var LineByLineReader = require('line-by-line');
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

if (process.argv.length < 4) {
  console.log('Usage: node ' + process.argv[1] + ' ABUSE_FILE NORMAL_FILE');
  process.exit(1);
}

var filesEnded = 0;

var abuseFile = process.argv[2];
var normalFile = process.argv[3];

var normalLR = new LineByLineReader(normalFile);
var abuseLR = new LineByLineReader(abuseFile);

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

var fileEndIncrement = function() {
  filesEnded ++;
  if (filesEnded === 2) {
    thingsAreDone();
  }
};

var thingsAreDone = function() {
  console.log('Trained!');
};


