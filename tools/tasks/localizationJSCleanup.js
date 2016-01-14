/*
 * Clean up dirty localisation files (empty values, "NOT TRANSLATED", value same as in template.)
 * Also removes keys that do not exist in the template locale
 */
module.exports = function(grunt) {


    grunt.registerMultiTask('localizationJSCleanup', 'Clean up dirty localisation files', function() {
		//default expressions to clean up. Maybe should be configurable.
		this.genericTranslations = {
			"NOT TRANSLATED": true
		};
		this.templateLanguage = "en";
		this.jsonFormatterIndent = "    ";
		this.localeHash = {};
		var me = this;		

        var fs = require('fs'),
            UglifyJS = require('uglify-js');

        // Hackhack, easy way to read/load the localization files
        var Oskari = {
            localizations: {
            },
            registerLocalization: function (localization, boolParam) {
                if (!this.localizations[localization.lang]) {
                    this.localizations[localization.lang] = {};
                }
                this.localizations[localization.lang][localization.key] = {
                    localization: localization,
                    prefix: 'Oskari.registerLocalization(\r\n'    
                }
                var suffix = ');'
                if (boolParam !== undefined && boolParam !== null) {
                    suffix = ', '+boolParam.toString()+');';
                }
                suffix += "\r\n";
                this.localizations[localization.lang][localization.key].suffix = suffix;


                return me.clone(this.localizations[localization.lang][localization.key]);
            }
        };

        /*a poor man's deep clone method*/
        this.clone = function(objectToClone) {
            return JSON.parse(JSON.stringify(objectToClone));
        };

        this.cleanGenericTranslations = function(json) {
        	for (var filename in json) {
        		grunt.log.writeln("\r\nProcessing file "+filename);
        		for (var bundleId in json[filename]) {
	        		this.cleanGenericTranslationsRecursive(json[filename][bundleId].localization.value, bundleId, null, 0);

        		}
        	}
        };

        this.cleanGenericTranslationsRecursive = function(json, bundleId, path, level) {
            var logkey = "";
            if (level === 0) {
                path = "";
            }
            for (var key in json) {
                logkey = path && path.length ? path+"."+key : key;
                if (typeof json[key] === 'string' || json[key] instanceof String) {
                    
                    if (json[key].length === 0) {
                        //just warn about these for now
                        grunt.log.warn("Empty value "+bundleId+" - "+logkey);
                    } else if (json[key].length > 0 && json[key].trim().length === 0) {
                        //just warn about these for now
                        grunt.log.warn("Whitespace only "+bundleId+" - "+logkey);
                        //json[key] = "";
                	} else {
                		if (this.genericTranslations[json[key]]) {
//	                        grunt.log.warn("Generic translation "+json[key]+". "+bundleId+" "+logkey);
	                        json[key] = "";
                		}
                	}
                } else if (json[key].constructor === Object) {
                    this.cleanGenericTranslationsRecursive(json[key], bundleId, logkey, level + 1);
                }
            }
            return;
        };

        /*when the raw data has been parsed, do the actual writing.*/
        this.writeToDisc = function(outputFile, data) {
//            grunt.log.writeln("Writing to disc "+outputFile);
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

        this.removeTemplateLanguageValues = function(templateJSON, JSONToCompare, path, level) {
            if (level === 0) {
                for (var key in templateJSON) {
                    if (!JSONToCompare[key]) {
                        grunt.log.warn("Localization for bundle "+key+" missing.");
                        continue;
                    } else {
                        this.removeTemplateLanguageValuesRecursive(templateJSON[key].localization.value, JSONToCompare[key].localization.value, path, key, level);
                    }
                }
            }
        };

        /*compares a locale to the corresponding template language locale, and fills in the missing/empty properties*/
        this.removeTemplateLanguageValuesRecursive = function(templateJSON, JSONToCompare, path, bundle, level) {
            var logkey = "";
            if (level === 0) {
                path = "";
            }
            for (var key in templateJSON) {
                logkey = path && path.length ? path+"."+key : key;

                if (JSONToCompare[key] === undefined || JSONToCompare[key] === null) {
                    continue;
                }

                if (typeof templateJSON[key] === 'string' || templateJSON[key] instanceof String) {
                    if (JSONToCompare[key] === templateJSON[key] ) {
                        //Only warn about these for now...labels such as "ok","x",urls etc. might get screwed...
                        grunt.log.warn("No translation: "+bundle+" - "+logkey);
                    }
                } else if (templateJSON[key].constructor === Object) {
                    this.removeTemplateLanguageValuesRecursive(templateJSON[key], JSONToCompare[key], logkey, bundle, level + 1);
                }
            }
            return;
        };


        /**
         * Removes keys that don't exist templateJSON from JSONToCompare -> clean up deprecated keys
         */

        this.removeUnusedKeys = function(templateJSON, JSONToCompare, path, level) {
            if (level === 0) {
                for (var key in JSONToCompare) {
                    if (!templateJSON[key]) {
                        grunt.log.warn("Localization for bundle "+key+" missing from template.");
                        continue;
                    } else {
                        this.removeUnusedKeysRecursive(templateJSON[key].localization.value, JSONToCompare[key].localization.value, path, key, level);
                    }
                }
            }
        };

        this.removeUnusedKeysRecursive = function(templateJSON, JSONToCompare, path, bundle, level) {
            var logkey = "";
            if (level === 0) {
                path = "";
            }
            for (var key in JSONToCompare) {
                logkey = path && path.length ? path+"."+key : key;

                if (!templateJSON.hasOwnProperty(key) || templateJSON[key] === undefined || templateJSON[key] === null) {
                    //key doesn't exist in template -> remove from the localization
                    grunt.log.warn("Key does not exist in template: "+bundle+" - "+logkey);
                    delete JSONToCompare[key];
                } else if (JSONToCompare[key].constructor === Object) {
                    this.removeUnusedKeysRecursive(templateJSON[key], JSONToCompare[key], logkey, bundle, level + 1);
                }
            }
            return;
        };

        //stores the info of which keys to write into which file 
        var hash = {};
        this.files.forEach(function(file) {
        	for (var i = 0; i < file.src.length; i++) {
        		Oskari.localizations = {};
				if (!fs.existsSync(file.src[i])) {
		        	var msg = "Got no results. Exiting.";
		        	grunt.log.warn(msg);
		        	grunt.fail.fatal(msg);
				}

        		var result = fs.readFileSync(file.src[i], 'utf8');
        		var localeJSON = null;
        		if (result) {
        			localeJSON = eval(result);
        		}
        		

        		if (!hash[localeJSON.localization.lang]) {
        			hash[localeJSON.localization.lang] = {};
        		}

        		//initialise array of localisations in this file for this language.
        		if (!hash[localeJSON.localization.lang][file.src[i]]) {
        			hash[localeJSON.localization.lang][file.src[i]] = {};
        		}

    			hash[localeJSON.localization.lang][file.src[i]][localeJSON.localization.key] = localeJSON;
        	}
        });

        grunt.log.writeln("\r\nCleaning generic translations and checking whitespace-only values...");
        for (var key in hash) {
        	//first clean out stoopid stuff. That's the "not translated" stuff and white space trimming etc.
        	this.cleanGenericTranslations(hash[key]);
        }


        //run a check against template -> replace stuff with the same translation as in english.
        grunt.log.writeln("\r\nRunning a check against template language ("+this.templateLanguage+") values...");
        var template = hash[this.templateLanguage];
        for (var lang in hash) {
        	if (lang === this.templateLanguage) {
        		continue;
        	}
      		grunt.log.writeln("\r\nProcessing locale "+lang);

        	for (var sourceFilename in template) {
        		//../bundles/framework/admin-layerrights/resources/locale/en.js
        		var targetFilename = sourceFilename.substring(0, sourceFilename.lastIndexOf('/') + 1);
        		targetFilename = targetFilename+lang+".js";

        		if (!hash[lang][targetFilename]) {
        			grunt.log.warn("Skipping. File does not exist "+targetFilename);
        			continue;
        		}

        		var target = hash[lang];
	      		grunt.log.writeln("\r\nProcessing file "+targetFilename);
                grunt.log.writeln("\r\nRemoving keys with no translation... ");

        		this.removeTemplateLanguageValues(template[sourceFilename], target[targetFilename], null, 0);

                //remove the keys that don't exist in the template
                grunt.log.writeln("\r\nRemoving keys that do not exist in the template... ");
                this.removeUnusedKeys(template[sourceFilename], target[targetFilename], null, 0);
        	}
        }

        //write
        for (var lang in hash) {
        	for (var filename in hash[lang]) {
        		var data = '';
	            for (var localizationKey in hash[lang][filename]) {
                        //console.log("Writing to disc: "+filename+" "+lang+"\r\n\r\n"+JSON.stringify(hash[lang][filename][localizationKey].localization, null, this.jsonFormatterIndent));
	                    data += hash[lang][filename][localizationKey].prefix+
	                            JSON.stringify(hash[lang][filename][localizationKey].localization, null, this.jsonFormatterIndent)+
	                            hash[lang][filename][localizationKey].suffix;
	            }
	            this.writeToDisc(filename, data);
        	}
        }
        return;
	});
}