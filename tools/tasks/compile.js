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

        //the lang that has all the right keys. 
        //Should probably be configurable.
        //TODO: make configurable
        this.templateLanguage = "en";

        var _ = require('lodash');

        // Hackhack, easy way to read/load the localization files
        var Oskari = {
            localizations: {
            },
            registerLocalization: function (localization, boolParam) {
                var localizationObj = {
                    localization: localization,
                    prefix: 'Oskari.registerLocalization('    
                };

                var suffix = '),'
                if (boolParam !== undefined && boolParam !== null) {
                    suffix = ', '+boolParam.toString()+'),';
                }
                localizationObj.suffix = suffix;

                if (!this.localizations[localization.lang]) {
                    this.localizations[localization.lang] = {};
                }

               if(boolParam !== undefined && boolParam !== null && boolParam === true) {
                    this.localizations[localization.lang][localization.key] = _.defaultsDeep({}, localizationObj, this.localizations[localization.lang][localization.key]);
                } else {
                    this.localizations[localization.lang][localization.key] = _.defaultsDeep({}, this.localizations[localization.lang][localization.key], localizationObj);
                }
            }
        };
        // internal minify i18n files function
        this.minifyLocalization = function(langfiles, path) {

            var template = this.readAndUglifyLocalization(langfiles[this.templateLanguage], this.templateLanguage);
            if (!template) {
                return;
            }
            //evaluate the template -> Oskari-object filled with template values.
            eval(template.code);

            for (var id in langfiles) {
                //lang all -> handled a wee bit different than the regular ones
                if (id === 'all') {
                    this.minifyLanguageAllJS(langfiles[id], id, path);
                    continue;
                } else {
                    //reset Oskari's localization info per each language.
                    Oskari.localizations[id] = {};
                    this.minifyLanguageJS(langfiles[id], id);
                }
            }
            // TODO: 'all' languages content should be added to all the language specific data
            //  this way the file doesn't need additional link in jsp since it rarely exists
            //after looping all languages write all to disk.
            for (var id in Oskari.localizations) {
                var outputFile = path + 'oskari_lang_' + id + '.js'
                var localizationsToProcess = Oskari.localizations[id]; 
                this.writeLocalizationFile(localizationsToProcess, outputFile, id);
            }
        };
        /*minify the "normal" lang files*/
        this.minifyLanguageJS = function(files, languageId) {
            var result = this.readAndUglifyLocalization(files, languageId);
            if (!result) {
                return;
            }
            eval(result.code);

            /*don't compare the template to itself*/
            if (languageId === this.templateLanguage) {
                return;
            }


            var templateJSON = Oskari.localizations[this.templateLanguage];
            var JSONToCompare = Oskari.localizations[languageId];
            console.log("Processing localization "+languageId+" using "+this.templateLanguage+" as template.");
            this.replaceMissingAndEmptyKeys(templateJSON, JSONToCompare, null, 0);
        };

        /*"special" handling for the language_all.js (might contain keys in several languages)*/
        this.minifyLanguageAllJS = function(files, languageId, path) {
            //"save" the registerLocalizationhack used by the other stuff...
            var preservedOskariRegisterLocalization = Oskari.registerLocalization;
            var languageAllTempHash = {};
            Oskari.registerLocalization = function (localization, boolParam) {
                if (!languageAllTempHash[localization.lang]) {
                    languageAllTempHash[localization.lang] = {};
                }
                languageAllTempHash[localization.lang][localization.key] = {
                    localization: localization,
                    prefix: 'Oskari.registerLocalization('
                };
                var suffix = '),'
                if (boolParam !== undefined && boolParam !== null) {
                    suffix = ', '+boolParam.toString()+'),';
                }
                languageAllTempHash[localization.lang][localization.key].suffix = suffix;
            }
            var result = this.readAndUglifyLocalization(files, languageId);
            if (!result) {
                return;
            }
            eval(result.code);

            var templateJSON = languageAllTempHash[this.templateLanguage];

            for (var id in languageAllTempHash) {
                //all -> no need to compare to template
                if (id === 'all') {
                    continue;
                }
                var JSONToCompare = languageAllTempHash[id];
                console.log("Processing localization all, language "+id+" using "+this.templateLanguage+" as template.");
                this.replaceMissingAndEmptyKeys(templateJSON, JSONToCompare, null, 0);
            }

            var outputFile = path + 'oskari_lang_all.js'
            var data = '';

            for (var id in languageAllTempHash) {
                for (var key in languageAllTempHash[id]) {
                    data += languageAllTempHash[id][key].prefix+
                            JSON.stringify(languageAllTempHash[id][key].localization)+
                            languageAllTempHash[id][key].suffix;
                }
            }
            //remove the last comma and replace with semicolon
            data = data.substring(0, data.length - 1);
            data += ";";

            this.writeToDisc(outputFile, data);

            //restore the "normal" registerlocalization in the end.
            Oskari.registerLocalization = preservedOskariRegisterLocalization;
        };

        /*write a localization to disk*/
        this.writeLocalizationFile = function(localization, outputFile, languageId) {
            var data = '';
            for (var key in localization) {
                //Make sure the lang-property is correct. If an entire localization object was copied from the template (=i.e. an entire localisation key was missing), it's not.
                //skip this part for the language_all - special case
                if (languageId !== "all") {
                    localization[key].localization.lang = languageId;
                }

                data += localization[key].prefix+
                        JSON.stringify(localization[key].localization)+
                        localization[key].suffix;
            }
            if (!data || data.length === 0) {
                return;
            }

            //remove the last comma and replace with semicolon
            data = data.substring(0, data.length - 1);
            data += ";";

            this.writeToDisc(outputFile, data);
        };

        /*when the raw data has been parsed, do the actual writing.*/
        this.writeToDisc = function(outputFile, data) {
            console.log("Target: "+outputFile);
            try {
                fs.writeFileSync(outputFile, data, 'utf8');
            } catch(e) {
                console.log("Error saving "+outputFile);
                var err = new Error('Saving failed.');
                if (e.message) {
                    err.message += '\n' + e.message + '. \n';
                    if (e.line) {
                        err.message += 'Line ' + e.line + ' in ' + src + '\n';
                    }
                }
                err.origError = e;
                grunt.log.warn('Error writing ' + outputFile + ' to disk.');
                grunt.fail.warn(err);
            }
        };
        /*read and uglify a bunch of files. return result.*/
        this.readAndUglifyLocalization = function(files, languageId) {
            var okFiles = [],
                fileMap = {},
                result = null;

            for (var i = 0; i < files.length; ++i) {
                if (!fs.existsSync(files[i])) {
                    var msg = 'Couldnt locate ' + files[i]; 
                    grunt.log.warn(msg);

                    /*only fail if the templatelanguage has missing files. Otherwise the keys will be substituted*/
                    if (languageId === this.templateLanguage) {
                        grunt.fail.fatal(msg);
                        throw msg;
                    } else {
                        continue;
                    }
                }
                // do not put duplicates on compiled code
                if(!fileMap[files[i]]) {
                    fileMap[files[i]] = true;
                    okFiles.push(files[i]);
                } else {
                    grunt.log.writeln('File already added:' + files[i]);
                }
            }

            try {
                result = UglifyJS.minify(okFiles, {
                    //outSourceMap : "out.js.map",
                    warnings : true,
                    compress : true
                });
            } catch (e) {
                console.log(e);
                var err = new Error('Uglification failed.');
                if (e.message) {
                    err.message += '\n' + e.message + '. \n';
                    if (e.line) {
                        err.message += 'Line ' + e.line + ' in ' + src + '\n';
                    }
                }
                err.origError = e;
                grunt.log.warn('Uglifying sources ' + okFiles.join() + ' failed.');
                grunt.fail.warn(err);
            }

            return result;
        };


        /*dig in to the right level in json */
        this.replaceMissingAndEmptyKeys = function(templateJSON, JSONToCompare, path, level) {
            if (level === 0) {
                for (var key in templateJSON) {
                    if (!JSONToCompare[key]) {
                        grunt.log.warn("Localization for bundle "+key+" missing.");
                        JSONToCompare[key] = this.clone(templateJSON[key])
                    } else {
                        this.replaceMissingAndEmptyKeysRecursive(templateJSON[key].localization.value, JSONToCompare[key].localization.value, path, key, level);
                    }
                }
            }
        };

        /*compares a locale to the corresponding template language locale, and fills in the missing/empty properties*/
        this.replaceMissingAndEmptyKeysRecursive = function(templateJSON, JSONToCompare, path, bundle, level) {
            var logkey = "";
            if (level === 0) {
                path = "";
            }
            for (var key in templateJSON) {
                logkey = path && path.length ? path+"."+key : key;
                if (typeof templateJSON[key] === 'string' || templateJSON[key] instanceof String) {
                    if (!JSONToCompare[key] || JSONToCompare[key].length === 0) {
                        grunt.log.warn("Key/Value missing "+bundle+": "+logkey);
                        JSONToCompare[key] = templateJSON[key];
                    }
                } else if (templateJSON[key].constructor === Object) {
                    if (!JSONToCompare[key]) {
                        grunt.log.warn("Key/Value missing "+bundle+": "+logkey);
                        JSONToCompare[key] = this.clone(templateJSON[key]);
                    } else {
                        this.replaceMissingAndEmptyKeysRecursive(templateJSON[key], JSONToCompare[key], logkey, bundle, level + 1);
                    }
                }
            }
            return;
        };

        this.clone = function(objectToClone) {
            return JSON.parse(JSON.stringify(objectToClone));
        };

        // internal minify JS function
        this.minifyJS = function(files, outputFile, concat, htmlImports) {
            var okFiles = [],
                fileMap = {},
                result = null;

            files.forEach(function(filePath) {
                if (!fs.existsSync(filePath)) {
                    var msg = "Couldn't locate " + filePath;
                    grunt.log.warn(msg);
                    grunt.fail.fatal(msg);
                    throw new Error(msg);
                }
                // do not put duplicates on compiled code
                if(!fileMap[filePath]) {
                    fileMap[filePath] = true;
                    okFiles.push(filePath);
                } else {
                    grunt.log.writeln('File already added:' + filePath);
                }
            });

            // minify or concatenate the files
            if (concat) {
                var fileContents = '';
                okFiles.forEach(function(filePath) {
                    fileContents += fs.readFileSync(filePath, 'utf8');
                });
                // emulate the result uglify creates, but only concatenating
                result = {"code" : fileContents};
            } else {
                try {
                    result = UglifyJS.minify(okFiles, {
                        outSourceMap : "oskari.min.js.map",
                        sourceMapUrl : "oskari.min.js.map",
                        sourceMapIncludeSources : true,
                        warnings : true,
                        compress : true
                    });
                } catch (e) {
                    console.log(e);
                    var err = new Error('Uglification failed.');
                    if (e.message) {
                        err.message += '\n' + e.message + '. \n';
                        if (e.line) {
                            err.message += 'Line ' + e.line + ' in ' + src + '\n';
                        }
                    }
                    err.origError = e;
                    grunt.log.warn('Uglifying sources ' + okFiles.join() + ' failed.');
                    grunt.fail.warn(err);
                }
            }
            var code = result.code;
            htmlImports = htmlImports || [];
            var links = htmlImports.map(function(href) {
                // FIXME: all over the build we have references to statsgrid.polymer
                // those should be generalized so that any polymer bundle can benefit from this
                var file = '../dist/bundles/statistics/statsgrid.polymer/vulcanized.html';
                var stats = fs.readFileSync(file).toString();
                var index = stats.split('typeof define');
                var cleanedCode = index.join('"s"');
                fs.writeFileSync(file, cleanedCode, 'utf8');
                // update the one under bundles (not dist/bundles) to make developer life easier
                fs.writeFileSync('../bundles/statistics/statsgrid.polymer/vulcanized.html', cleanedCode, 'utf8');
                // /Oskari/bundles/statistics/statsgrid.polymer/vulcanized.html
                return "Oskari.loader.linkFile('" + href + "','import','text/html');";
            });
            code = code + links.join('');
        //
            // -----------------------------------------------------------------------------------------------
            // "custom requirejs optimizer"
            // replaces all instances of [typeof define] to ["s"]
            // This way all amd-modules will work ok in minified output since the check
            //  they use [typeof define === 'function'] will become ["s" === 'function'] and always return false
            //  This results in define never being called from minified code which results in no "Mismatched anonymous define() module" errors
            var index = code.split('typeof define');
            var cleanedCode = index.join('"s"');
            // -----------------------------------------------------------------------------------------------

            // write result to disk
            fs.writeFileSync(outputFile, cleanedCode, 'utf8');
            try {
                // source map
                // replace "C:\\Omat\\alusta\\oskari -> oskari
                var srcMap = JSON.parse(result.map);
                var srcMapPath = srcMap.sources[0].toLowerCase();
                var prefixToRemove = srcMap.sources[0].substring(0, srcMapPath.indexOf("oskari")).split('\\').join('\\\\');

                var cleanedMap = result.map.split(prefixToRemove);
                cleanedMap = cleanedMap.join('');
                fs.writeFileSync(outputFile + ".map", cleanedMap, 'utf8');
            } catch (ignored) {}

        }

        // validate parsed appsetup
        var compiledDir = options.dest;
        if (!fs.existsSync(compiledDir)) {
            fs.mkdirSync(compiledDir);
        }
        var files = [];
        var vulcanizedImports = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            files = files.concat(array);
            var importArray = parser.getFilesForComponent(processedAppSetup[j], 'vulcanizedHtml');
            vulcanizedImports = vulcanizedImports.concat(importArray);
        }
        this.minifyJS(files, compiledDir + 'oskari.min.js', options.concat, vulcanizedImports);

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
