module.exports = new CompileAction();
function CompileAction() {

    var fs = require('fs');
    var parser = require('./parser');
    var minifier = require('./minifier');

    this.handle = function(processedAppSetup) {

        var compiledDir = './../dist/';
//        var compiledDir = './../applications/paikkatietoikkuna.fi/full-map/';
        if (!fs.existsSync(compiledDir)) {
            fs.mkdirSync(compiledDir);
        }
        var files = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            files = files.concat(array);
        }
        minifier.minifyJS(files, compiledDir + 'oskari.min.js');
//        minifier.minifyJS(files, compiledDir + 'pack.js');

        var langfiles = {};
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var deps = processedAppSetup[j].dependencies;
            for (var i = 0; i < deps.length; ++i) {
                for (var lang in deps[i].locales) {
                    if (!langfiles[lang]) {
                        langfiles[lang] = [];
                    }
                    langfiles[lang] = langfiles[lang].concat(deps[i].locales[lang]);
                }
            }
        }
        minifier.minifyLocalization(langfiles, compiledDir);

        var cssfiles = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            cssfiles = cssfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'css'));
        }
        minifier.minifyCSS(cssfiles, compiledDir + 'oskari.min.css');
//        minifier.minifyCSS(cssfiles, compiledDir + 'pack.css');
    }
}