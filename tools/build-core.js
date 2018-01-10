/**
 * This script can be used to generate a new version of "Oskari core".
 * Gathers requirejs and files under src, minifies file contents to bundles/bundle.js
 */
var fs = require('fs');
var os = require('os');
var UglifyJS = require('uglify-js');

var files = [
    // libraries
	'../libraries/requirejs/require-2.2.0.min.js',
	'../libraries/requirejs/text-plugin-2.0.14.js',
    '../libraries/mobile-detect/mobile-detect-1.3.2.js',
    '../libraries/dompurify/purify_0.8.0.min.js',
    '../libraries/intl-messageformat/intl-messageformat-with-locales-2.1.0.js',
	'../src/polyfills.js',
    // Oskari global
	'../src/oskari.js',
    '../src/counter.js',
    '../src/logger.js',
    '../src/store.js',
    '../src/events.js',
    '../src/util.js',
    '../src/i18n.js',
    '../src/message_types.js',
    // class system
    '../src/O2ClassSystem.js',
    '../src/bundle_manager.js',

    // user and sandbox
    '../src/user.js',
    '../src/sandbox_factory.js',
    '../src/sandbox/sandbox.js',
    '../src/sandbox/sandbox-state-methods.js',
    '../src/sandbox/sandbox-map-layer-methods.js',
    '../src/sandbox/sandbox-map-methods.js',
    '../src/sandbox/sandbox-abstraction-methods.js',

    // Oskari application helpers
	'../src/loader.js',
    '../src/oskari.app.js',
    '../src/BasicBundle.js',
    // deprecated functions
    '../src/deprecated/module_spec.js',
    '../src/deprecated/builder_api.js',
    '../src/deprecated/deprecated.core.js',
    '../src/deprecated/deprecated.sandbox.js'
];

try {
    var FILENAME = '../bundles/bundle.js';
    var concatOnly = false;
    var opts = {
        outSourceMap : "bundle.js.map",
        sourceMapIncludeSources : true,
        warnings : true,
        compress : true
    };
    if(concatOnly) {
        opts.mangle = false;
        opts.output = {
          beautify: true
        };
    }
    var result = UglifyJS.minify(files, opts);
	fs.writeFileSync(FILENAME, result.code);
    fs.writeFileSync(FILENAME + ".map", result.map);
} catch (e) {
    console.log(e);
    var err = new Error('Uglification failed.');
    if (e.message) {
        err.message += '\n' + e.message + '. \n';
        if (e.line) {
            err.message += 'Line ' + e.line + ' in ' + src + '\n';
        }
    }
}