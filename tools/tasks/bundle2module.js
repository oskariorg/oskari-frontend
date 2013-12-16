/*
 * grunt-bundle2module
 */

module.exports = function(grunt) {

    grunt.registerTask('bundle2module', 'Convert bundle to module', function(origin, target) {
        var done = this.async();
        var starttime = (new Date()).getTime();

        grunt.log.writeln('Converting ' + origin + " to module.js ");

        var fs = require("fs"),
            path = require("path");

        if (origin.lastIndexOf('/') !== (origin.length - 1)) {
            console.log('Adding / to path');
            origin += "/";
        }

        if (origin.indexOf("bundle.js") === -1) {
            console.log('Adding bundle.js to path');
            origin += "bundle.js";
        }

        if (!target) {
            // change packages folder to src
            // change bundle.js to module.js
            // remove bundle folder as unnecessary
            target = origin.replace('/packages/', '/src/').replace('bundle.js', 'module.js').replace('/bundle/', '/');
        }

        function modifyPath4require(src) {
            var bundleBasePath = basePath;
            if(src.indexOf('/') === 0) {
                src = '.' + src;
                bundleBasePath = '.';
            }
            var normalizedPath = path.resolve(bundleBasePath, src);
            var relativePath = path.relative(basePath, normalizedPath);

            // modify path so that RequireJS can find it
            relativePath = relativePath.replace(/\\/g, '/'); // change \ to / to have all paths in the same format

            if (relativePath.indexOf('.') !== 0) {
                relativePath = './' + relativePath;
            } else {
                // detect relative files regarding resources, bundles and libraries
                // change path and mark with _ to ensure file extensions are removed so that Require is able to find the file
                relativePath = relativePath.replace(/[\.\/]*resources/, 'resources');
                relativePath = relativePath.replace(/[\.\/]*bundles/, 'bundles');
                relativePath = relativePath.replace(/[\.\/]*libraries/, 'libraries');
            }

            // dots mess around with RequireJS file extension detection.
            // In order to make it work, exclude .js from filenames without dots such as jquery.base64.min.js
            relativePath = relativePath.replace('.js', '');

            return relativePath;
        }

        var basePath = path.dirname(target);
        var template = 'define({DEPENDENCIES}, function(Oskari,jQuery) {\n    return Oskari.bundleCls("{BUNDLE_ID}").category({SIGNATURE})\n});';
        var moduleDependencies = ["oskari", "jquery"];
        var bundleId = null;
        var categorySignature = "{";

        Oskari = {
            clazz : {
                define: function (type, constructor, prototype, dependencies) {
                    var signature = "";
                    for(var func in prototype) {
                        if (signature !== "") {
                            // add previous signature with comma
                            categorySignature += signature + ',';
                        }
                        signature = func + ": " + prototype[func].toString();
                    }
                    // add last signature without comma and close brace
                    categorySignature += signature + '}';

                    if (dependencies && dependencies.source && dependencies.source.scripts) {
                        var scripts = dependencies.source.scripts,
                            type = null,
                            src = null;
                        console.log('scripts', scripts);
                        for (var i = 0, ilen = scripts.length; i < ilen; i++) {
                            type = scripts[i].type;
                            src = scripts[i].src;
                            console.log('scripts', type, src);

                            var relativePath = modifyPath4require(src);
                            if (type == "text/javascript") {
                                moduleDependencies.push(relativePath);
                            } else if (type == "text/css") {
                                moduleDependencies.push("css!" + relativePath);
                            } else {
                                grunt.warn("Unknown type:"+ type + ". Use --force to include as text/javascript. It's recommended to state type in the bundle.js file and the converter can handle the dependency accordingly.", 6);
                                moduleDependencies.push(relativePath);
                            }
                        }
                    }

                    if (dependencies && dependencies.source && dependencies.source.locales) {
                        var locales = dependencies.source.locales,
                            type = null,
                            src = null,
                            lang = null;
                        console.log('locales', locales);
                        for (var i = 0, ilen = locales.length; i < ilen; i++) {
                            lang = locales[i].lang;
                            type = locales[i].type;
                            src = locales[i].src;

                            var bundleBasePath = basePath;
                            if(src.indexOf('/') === 0) {
                                src = '.' + src;
                                bundleBasePath = '.';
                            }

                            var relativePath = modifyPath4require(src);
                            moduleDependencies.push(relativePath);
                        }
                    }
                }
            },
            bundle_manager : {
                installBundleClass: function (bid) {
                    bundleId = bid;
                }
            }
        }

        var originPath = "../" + origin; // relative to this file, not grunt as when reading files
        var loaded = require(originPath);

        var result = template.replace('{DEPENDENCIES}', JSON.stringify(moduleDependencies)).replace('{BUNDLE_ID}', bundleId).replace('{SIGNATURE}', categorySignature)
        console.log('Template:\n', result);
        grunt.file.write(target, result);

        var endtime = (new Date()).getTime();
        grunt.log.writeln('bundle2module completed in ' + ((endtime - starttime) / 1000) + ' seconds');
        done();
    });

};