/**
 * This script can be used to generate a new version of "Oskari core".
 * Gathers requirejs and files under src, minifies file contents to bundles/bundle.js
 */
var fs = require('fs');
var os = require('os');
var UglifyJS = require('uglify-js');


var files = [
	'../libraries/requirejs/require-2.2.0.min.js',
	'../libraries/requirejs/text-plugin-2.0.14.js',
    '../libraries/mobile-detect/mobile-detect-1.3.2.js',
	'../src/polyfills.js',
	'../src/oskari.js',
    '../src/i18n.js',
	'../src/util.js',
	'../src/logger.js',
	'../src/loader.js'
];

try {
    var result = UglifyJS.minify(files, {
        //outSourceMap : "out.js.map",
        warnings : true,
        compress : true
    });
	fs.writeFileSync('../bundles/bundle.js', result.code);
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