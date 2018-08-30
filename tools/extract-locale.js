var path = require('path');
var fs = require('fs');
var glob = require('glob');
var merge = require('merge');

function deconstructPath(filePath, chain) {
    chain = chain || [];
    if (chain[0] === 'bundles') {
        return chain.slice(1, -3);
    }
    chain.unshift(path.basename(filePath));
    return deconstructPath(path.dirname(filePath), chain);
}

function ensureDirectoryExists(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
  }

var locale = process.argv[2];

if (!locale) {
    throw new Error('Must give locale as parameter, for example "fi"');
}

var localeFilePaths = glob.sync('/bundles/**/resources/locale/@(en|' + locale + ').js', {root: path.join(__dirname, '..')});

var collection = {};

localeFilePaths.forEach(function(filePath){
    var dir = deconstructPath(filePath).join('__');

    var Oskari = {
        registerLocalization: function(loc, isOverride) {
            var lang = loc.lang;
            if (!lang) {
                throw new Error('Localization file has no "lang"!');
            }

            if (!collection[dir]) {
                collection[dir] = {content: {}};
            }
            if (collection[dir].content[lang]) {
                collection[dir].isMulti = true; // multiple calls to registerLocalization for language. Lang-overrides bundle does this.
            }
            collection[dir].content[lang] = loc.value;
        }
    };

    var source = fs.readFileSync(filePath, 'utf8');
    eval(source);
});


Object.keys(collection)
    .filter(function(dir){
        return !collection[dir].isMulti;
    })
    .forEach(function(dir){
        var enContent = collection[dir].content.en || {};
        var localeContent = collection[dir].content[locale] || {};
        var output = merge.recursive(true, enContent, localeContent);

        var outputPath = path.join(__dirname, '..', 'locale', dir + '__' + locale + '.json');
        ensureDirectoryExists(outputPath);
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    });

console.log('Extracted files succesfully to "locale" directory in repo root');