var fs = require('fs');
var UglifyJS = require('uglify-js');
var cssPacker = require('uglifycss') ;

module.exports = new OskariMinifier();
function OskariMinifier() {

    this.minifyCSS = function(files, outputFile) {

        var value = '';
        for (var i = 0; i < files.length; ++i) {
            if (!fs.existsSync(files[i])) {
                var msg = 'Couldnt locate ' + files[i]; 
                throw msg;
            }
            var content = fs.readFileSync(files[i], 'utf8');
            value = value + '\n' + content;
        }
        var packed = cssPacker.processString(value);

        fs.writeFile(outputFile, packed, function(err) {
            if (err) {
                log('Error writing packed CSS: ' + err);
            }
        });

    }

    this.minifyLocalization = function(langfiles, path) {
        for (var id in langfiles) {
            //console.log('Minifying loc:' + id + '/' + langfiles[id]);
            this.minifyJS(langfiles[id], path + 'oskari_lang_' + id + '.js');
        }
    }

    this.minifyJS = function(files, outputFile) {
        var okFiles = [];

        for (var i = 0; i < files.length; ++i) {
            if (!fs.existsSync(files[i])) {
                var msg = 'Couldnt locate ' + files[i]; 
                throw msg;
            }
            okFiles.push(files[i]);
        }

        var result = UglifyJS.minify(okFiles, {
            //outSourceMap : "out.js.map",
            warnings : true,
            compress : true
        });
        fs.writeFileSync(outputFile, result.code, 'utf8');
    }

}