/**
 * This script can be used to generate a new version of "Oskari core".
 * Gathers requirejs and files under src, concatenates filecontents to bundles/bundle.js
 */
var fs = require('fs');
var os = require('os');

var files = [];
files.push(fs.readFileSync('../libraries/requirejs/require-2.2.0.min.js'));
files.push(fs.readFileSync('../libraries/requirejs/text-plugin-2.0.14.js'));

files.push(fs.readFileSync('../src/polyfills.js'));
files.push(fs.readFileSync('../src/oskari.js'));
files.push(fs.readFileSync('../src/util.js'));
files.push(fs.readFileSync('../src/loader.js'));

fs.writeFileSync('../bundles/bundle.js', files.join(os.EOL));
// remove require.js from minified core
//files.shift();
//files.shift();
//fs.writeFileSync('../bundles/bundle.min.js', files.join(os.EOL));