/*
 * oskari-compile
 */

module.exports = function(grunt) {

    grunt.registerMultiTask('compile', 'Compile appsetup js', function() {
        var starttime = (new Date()).getTime();

        var options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Compiling...');

        // Catch if required fields are not provided.
        if ( !options.appSetupFile ) {
            grunt.fail.warn('No path provided for Compile to scan.');
        }
        if ( !options.dest ) {
            grunt.fail.warn('No destination path provided for Compile to use.');
        }

        var fs = require('fs'),
            UglifyJS = require('uglify-js'),
            parser = require('../parser.js'),
            processedAppSetup = parser.getComponents(options.appSetupFile);

        grunt.log.writeln('Parsed appSetup:' + options.appSetupFile);

        // internal minify i18n files function
        this.minifyLocalization = function(langfiles, path) {
            for (var id in langfiles) {
                //console.log('Minifying loc:' + id + '/' + langfiles[id]);
                this.minifyJS(langfiles[id], path + 'oskari_lang_' + id + '.js', options.concat);
            }
        }

        // internal minify JS function
        this.minifyJS = function(files, outputFile, concat) {
            var okFiles = [],
                fileMap = {},
                result = null;

            for (var i = 0; i < files.length; ++i) {
                if (!fs.existsSync(files[i])) {
                    var msg = 'Couldnt locate ' + files[i]; 
                    throw msg;
                }
                // do not put duplicates on compiled code
                if(!fileMap[files[i]]) {
                    fileMap[files[i]] = true;
                    okFiles.push(files[i]);
                } else {
                    grunt.log.writeln('File already added:' + files[i]);
                }
            }

            // minify or concatenate the files
            if (!concat) {
                result = UglifyJS.minify(okFiles, {
                    //outSourceMap : "out.js.map",
                    warnings : true,
                    compress : true
                });
            } else {
                // emulate the result uglify creates, but only concatenating
                result = {"code" : ""};
                for (var j = 0, jlen = okFiles.length; j < jlen; j +=1) {
                    result.code += fs.readFileSync(okFiles[j], 'utf8');
                }
            }

            // write result to disk
            fs.writeFileSync(outputFile, result.code, 'utf8');
        }

        // validate parsed appsetup
        var compiledDir = options.dest;
        if (!fs.existsSync(compiledDir)) {
            fs.mkdirSync(compiledDir);
        }
        var files = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            files = files.concat(array);
        }
        this.minifyJS(files, compiledDir + 'oskari.min.js', options.concat);

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
        this.minifyLocalization(langfiles, compiledDir);

        var unknownfiles = [];
        for(var j = 0; j < processedAppSetup.length; ++j) {
            unknownfiles = unknownfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'unknown'));
        }
        if(unknownfiles.length != 0) {
            console.log('Appsetup referenced types of files that couldn\'t be handled: ' + unknownfiles);
        }

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Compile completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
