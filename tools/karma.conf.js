// Testacular configuration
// Generated on Thu Jan 17 2013 13:53:34 GMT+0200 (Suomen normaaliaika)


// base path, that will be used to resolve files and exclude
basePath = '..\..\..\..\..\..\..\..';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  'node_modules/expect.js/expect.js',
  'lib/sinon-1.5.2.js',
  '../tests/mocha.opts',
  '../tests/*.opts.js',
  MOCHA_ADAPTER,
  '../libraries/jquery/jquery-1.7.1.min.js',
  '../packages/openlayers/startup.js',
  '../bundles/bundle.js',
  '../dist/oskari.min.js',
//  '../applications/paikkatietoikkuna.fi/full-map/pack.js',
  '../dist/oskari_lang_fi.js',
  '../dist/oskari_lang_sv.js',
  '../dist/oskari_lang_en.js',
  '../dist/oskari_lang_all.js',
  '../tests/**/*.js'
];


// list of files to exclude
exclude = [

];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
port = 4040;

proxies = {
    '/': 'http://localhost:8080/'
};

// cli runner port
runnerPort = 9100;

// custom root for karma
urlRoot = "/__karma__/";

// enable / disable colors in the output (reporters and logs)
colors = true;

// report which specs are slower than 10000ms
// CLI --report-slower-than 10000
reportSlowerThan: 10000;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
//logLevel = LOG_INFO;
logLevel = LOG_DEBUG;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['IE'];
//browsers = ['IE', 'Firefox', 'Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 120000;

// Note does not work in the master branch at the moment, maybe in canary?
// How many times browsers retry to launch
retryLimit = 1;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
