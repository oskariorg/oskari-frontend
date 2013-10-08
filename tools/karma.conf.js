module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['mocha', 'expect'],

    // list of files / patterns to load in the browser
    files: [
      'lib/sinon-1.5.2.js',
      '../tests/mocha.opts',
      '../tests/*.opts.js',
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
    ],

    // list of files to exclude
    exclude: [
    ],

    preprocessors: {
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['progress'],

    // web server port
    // CLI --port 9876
    port: 4040,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    proxies: {
        '/': 'http://localhost:8080/'
    },

    // cli runner port
    runnerPort: 9100,

    transports: ['websocket', 'xhr-polling', 'jsonp-polling'],

    // custom root for karma
    urlRoot: "/__karma__/",

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: ['IE'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 120000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    plugins: [
      'karma-expect',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter',
      'karma-mocha'
    ]
  });
};