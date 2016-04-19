var fs = require('fs');
var path = require('path');

module.exports = new OskariParser();
function OskariParser() {

    this.getComponents = function(appSetupFile) {
        
        var appSetupData = fs.readFileSync(appSetupFile,'utf8');
        var data = JSON.parse(appSetupData);
        data = data.startupSequence;
        var basePath = path.dirname(appSetupFile);
        
        var bundleSequence = [];
        for (var i = 0; i < data.length; ++i) {
            var bundle = data[i];
            var component = {
                name : bundle.bundlename,
                dependencies : []
            };
            bundleSequence.push(component);
            var bundleDeps = bundle.metadata['Import-Bundle'];
            for (var id in bundleDeps) {
                var bundleBasePath = basePath;
                // "openlayers-default-theme" : { "bundlePath" : "../../../packages/openlayers/bundle/" },
                var bundlePath = bundleDeps[id].bundlePath;
                if(bundlePath.indexOf('/') === 0) {
                    bundlePath = '.' + bundlePath;
                    bundleBasePath = '.';
                }
                var normalizedPath = path.resolve(bundleBasePath, bundlePath);
                component.dependencies.push(this.handleBundle(id, normalizedPath));
            }
        }
        bundleSequence[0].originalData = data;
        return bundleSequence;
    }
    this.handleBundle = function(id, basepath) {
        var bundleDef = {
            id : id,
            javascript : [],
            vulcanizedHtml : [],
            css : [],
            locales : {},
            path : undefined,
            unknown : []
        };

        var bundlePath = basepath + "/" + id + "/bundle.js";
        var relativePath = path.dirname(bundlePath);
        bundleDef.javascript.push(bundlePath);

        var content = fs.readFileSync(bundlePath, 'utf8');
        var scripts = this.findArray(content, 'scripts', bundlePath);
        for (var j = 0; j < scripts.length; ++j) {
            var implFile = scripts[j];
            var fileRelativePath = relativePath;
            if(implFile.src.indexOf('/') === 0) {
                implFile.src = '.' + implFile.src;
                fileRelativePath = '.';
            }
            var normalizedImplPath = path.resolve(fileRelativePath, implFile.src);
            if (implFile.type === "text/javascript") {
                bundleDef.javascript.push(normalizedImplPath);
                // only get path for bundles inside bundles (not src) and try to determine bundle path
                // TODO: this will be refactored for Oskari 2
                var bundlesIndex = normalizedImplPath.indexOf('bundles');
                if(bundlesIndex !== -1 && !bundleDef.path) {
                    var begin = normalizedImplPath.substring(0, bundlesIndex + 'bundles'.length);
                    var tmpPath = normalizedImplPath.substring(bundlesIndex + 'bundles'.length + 1);
                    var pathParts = tmpPath.split(path.sep);
                    var namespace = pathParts[0];
                    var bundleId = pathParts[1];
                    // rest can be ignored
                    bundleDef.path = path.join(begin, namespace, bundleId);
                }
            } else if (implFile.type === "text/css") {
                // only get path for bundles inside bundles (not src) and try to determine bundle path
                // TODO: this will be refactored for Oskari 2
                var bundlesIndex = normalizedImplPath.indexOf('bundles');
                if(bundlesIndex !== -1 && !bundleDef.resourcesPath) {
                    var begin = normalizedImplPath.substring(0, bundlesIndex + 'bundles'.length);
                    var tmpPath = normalizedImplPath.substring(bundlesIndex + 'bundles'.length + 1);
                    var pathParts = tmpPath.split(path.sep);
                    var namespace = pathParts[0];
                    var bundleId = pathParts[1];
                    // rest can be ignored
                    bundleDef.resourcesPath = path.join(begin, namespace, bundleId);
                }
                bundleDef.css.push(normalizedImplPath);
            } else {
                bundleDef.unknown.push({
                    type : implFile.type,
                    file : normalizedImplPath
                });
            }
        }
        var locales = this.findArray(content, 'locales', bundlePath);
        for (var j = 0; j < locales.length; ++j) {
            var locFile = locales[j];
            var lang = locFile.lang;
            var fileRelativePath = relativePath;
            if(locFile.src.indexOf('/') === 0) {
                locFile.src = '.' + locFile.src;
                fileRelativePath = '.';
            }
            var normalizedImplPath = path.resolve(fileRelativePath, locFile.src);
            if (!lang) {
                if (!bundleDef.locales.all) {
                    bundleDef.locales.all = [];
                }
                bundleDef.locales.all.push(normalizedImplPath);
            } else {
                if (!bundleDef.locales[lang]) {
                    bundleDef.locales[lang] = [];
                }
                bundleDef.locales[lang].push(normalizedImplPath);
            }
        }
        var vulcanizedHtml = this.findArray(content, 'vulcanizedHtml', bundlePath);
        for (var j = 0; j < vulcanizedHtml.length; ++j) {
            bundleDef.vulcanizedHtml.push(vulcanizedHtml[j].href);
        }

        return bundleDef;
    }


    this.getBundles = function(appSetupFile,grunt) {
        
        var appSetupData = fs.readFileSync(appSetupFile,'utf8');
        var data = JSON.parse(appSetupData);
        data = data.startupSequence;
        var basePath = path.dirname(appSetupFile);

        var bundles = [];

        var bundleSequence = [];
        for (var i = 0; i < data.length; ++i) {
            var bundle = data[i];
            var component = {
                name : bundle.bundlename,
                dependencies : []
            };
            bundleSequence.push(component);
            var bundleDeps = bundle.metadata['Import-Bundle'];
            for(var key in bundleDeps){
                bundles.push(key);
            }

            for (var id in bundleDeps) {
                var bundleBasePath = basePath;
                // "openlayers-default-theme" : { "bundlePath" : "../../../packages/openlayers/bundle/" },
                var bundlePath = bundleDeps[id].bundlePath;

                //console.log('bundleBasePath: ', bundleBasePath);
                if(bundlePath.indexOf('/') === 0) {
                    bundlePath = '.' + bundlePath;
                    bundleBasePath = '.';
                }
                var normalizedPath = path.resolve(bundleBasePath, bundlePath);
                component.dependencies.push(this.handleBundle(id, normalizedPath));
            }
        }
        bundleSequence[0].originalData = data;
        return bundles;
    }

    this.findArray = function(content, arrayName, pathForLogging) {

        var stripped = this.removeBlockComments(content);
        var validJSON = this.removeSingleLineComments(stripped);

        var indexOf = validJSON.indexOf(arrayName);
        if (indexOf === -1) {
            return [];
        }
        var arrayJSON = validJSON.substring(indexOf);
        indexOf = arrayJSON.indexOf('[');
        if (indexOf === -1) {
            return [];
        }
        arrayJSON = arrayJSON.substring(indexOf);
        indexOf = arrayJSON.indexOf(']');
        if (indexOf === -1) {
            return [];
        }
        arrayJSON = arrayJSON.substring(0, indexOf + 1);

        try {
            return JSON.parse(arrayJSON);
        } catch(err) {
            var msg = 'Error parsing JSON array "' + arrayName + '" from file:' + pathForLogging + '\nMessage: ' + err;
            console.log('ERROR ERROR');
            console.log(msg);
            console.log('ERROR ERROR');
            throw msg;
        }
    }

    this.removeSingleLineComments = function(content) {
        var lines = content.split("\n");
        var value = '';
        for (var i = 0; i < lines.length; ++i) {
            var uncommented = lines[i].split('//');
            value = value + uncommented[0];
        }
        return value;
    }

    this.removeBlockComments = function(content) {

        var indexOF = content.indexOf("/*");
        if (indexOF == -1) {
            return content;
        }
        var scripts = content.substring(indexOF);
        var endIndex = scripts.indexOf('*/');
        var value = content.substring(0, indexOF);
        value = value + scripts.substring(endIndex + 2);
        return this.removeBlockComments(value);
    }

    this.getFilesForComponent = function(component, arrayName) {
        var files = [];
        for (var i = 0; i < component.dependencies.length; ++i) {
            var array = component.dependencies[i][arrayName];
            files = files.concat(array);
        }
        return files;
    }
} 