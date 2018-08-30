var path = require('path');
var fs = require('fs');
var glob = require('glob');

var locale = process.argv[2];

if (!locale) {
    throw new Error('Must give locale as parameter, for example "fi"');
}

var jsonFilePaths = glob.sync('/locale/*' + locale + '.json', {root: path.join(__dirname, '..')});

if (jsonFilePaths.length === 0) {
    console.log('No locale JSON files found for locale "' + locale + '". Make sure you have something to inject under "locale" directory in repo root.')
    process.exit(1);
}

jsonFilePaths.forEach(function(filePath) {
    var parts = path.basename(filePath, '.json').split('__').slice(0, -1);
    var targetChain = [__dirname, '..', 'bundles'].concat(parts).concat(['resources', 'locale']);
    var targetDirectory = path.join.apply(path, targetChain);
    var enContent = fs.readFileSync(path.join(targetDirectory, 'en.js'), 'utf8');
    var Oskari = {
        registerLocalization: function(loc, isOverride) {
            loc.lang = locale;
            loc.value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var override = isOverride ? ', true' : '';
            fs.writeFileSync(path.join(targetDirectory, locale + '.js'), 'Oskari.registerLocalization(\n' + JSON.stringify(loc, null, 4) + override + ');\n', 'utf8');
        }
    };
    eval(enContent);
});

console.log('Injected localization strings to locale files. Use git to inspect changes.');