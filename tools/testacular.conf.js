// Testacular configuration
// Generated on Thu Jan 17 2013 13:53:34 GMT+0200 (Suomen normaaliaika)


// base path, that will be used to resolve files and exclude
basePath = '..\..\..\..\..\..\..\..';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../../bundles/bundle.js',
  '../../libraries/jquery/jquery-1.7.1.min.js',
  '../../dist/oskari.min.js',
  '../../dist/oskari_lang_fi.js',
  '../../tests/**/*.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 4040;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


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
browsers = ['IE', 'Firefox'];
//browsers = ['IE', 'Firefox', 'Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 120000;

// How many times browsers retry to launch
retryLimit = 1;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
