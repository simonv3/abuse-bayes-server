var LineByLineReader = require('line-by-line'),
    // Own lib things
    bayes = require('../lib/bayes.js'),
    download = require('../lib/download.js');

var argv = require('minimist')(process.argv.slice(2));

var abuseUrl = argv.a;
var normalUrl = argv.n;

var filesEnded = 0;

var downloadFiles = function(url1, dest1, url2, dest2, cb) {
  download(url1, dest1, download(url2, dest2, cb));
};

var abuseDest = 'abuse_downloaded.txt';
var normalDest = 'normal_downloaded.txt';

var rest = function() {
  var abuseLR = new LineByLineReader(abuseDest);
  var normalLR = new LineByLineReader(normalDest);


  abuseLR.on('line', function(line) {
    console.log('new abuse line', line);
    bayes.train(line, 'abuse');
  });

  normalLR.on('line', function(line) {
    bayes.train(line, 'normal');
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

if (argv.h) {
  console.log('-h     Brings up help (this list).');
  console.log('-r     Indicate that the files are remote and should be downloaded.');
  console.log('-a     The abuse training file.');
  console.log('-n     The normal training file.');
  console.log('-c     Get a dump of the classifier data.');
}

if (argv.c) {
  bayes.toJSON(function(obj) { console.log(obj) });
} else if (argv.r) {
  downloadFiles(abuseUrl, abuseDest, normalUrl, normalDest, rest);
} else {
  rest();
}

