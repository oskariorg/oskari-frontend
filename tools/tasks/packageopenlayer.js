/*
 * package task to build OpenLayers 2 from source
 */

module.exports = function (grunt) {

    grunt.registerTask('packageopenlayer', 'Package openlayers according to packages', function (packages) {
        var starttime = (new Date()).getTime(),
            options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Packaging...');


        var fs = require('fs'),
            path = require('path'),
            wrench = require('wrench'),
            sourceDirectory,
            //outputFilenamePrefix = "OpenLayers.",
            //outputFilenamePostfix = ".min.js",
            cfg = null,
            cfgFile = null,
            i = null,
            ilen = null,
            j = null,
            jlen = null,
            k = null,
            klen = null,
            //cfgs = [],
            files = null,
            file = null,
            linegroup = null,
            profile = null,
            //dist = null,
            line = null,
            exclude,
            include,
            FIRST = '[first]',
            LAST = '[last]',
            INCLUDE = '[include]',
            EXCLUDE = '[exclude]';

        if (!packages) {
            grunt.log.writeln('No cfg packages given, reading all cfg files in current directory.');
            packages = [];
            files = fs.readdirSync(process.cwd());
            file = '';
            for (i in files) {
                if (files.hasOwnProperty(i)) {
                    file = files[i];
                    if (file.indexOf('.cfg') !== -1 && file.indexOf('2_13_1') !== -1) {
                        packages.push(file);
                    }
                }
            }
        } else {
            // transform comma separeted configs string to array
            packages = packages.split(',');
        }

        console.log('Running openlayers packager...');
        sourceDirectory = path.join(process.cwd(), '/components/openlayers/lib/');

        // read cfg files
        for (i = 0, ilen = packages.length; i < ilen; i += 1) {
            cfgFile = fs.readFileSync(packages[i], 'utf8').split('\r\n');
            profile = packages[i];
            profile = profile.substring(profile.lastIndexOf('/') + 1, profile.indexOf('.cfg'));

            cfg = {};
            for (j = 0, jlen = cfgFile.length; j < jlen; j += 1) {
                line = cfgFile[j];

                // skip empty lines and lines that start with #
                if ((line.length > 0) && (line[0] !== '#')) {
                    if (line === FIRST) {
                        linegroup = 'forceFirst';
                    } else if (line === LAST) {
                        linegroup = 'forceLast';
                    } else if (line === INCLUDE) {
                        linegroup = 'include';
                    } else if (line === EXCLUDE) {
                        linegroup = 'exclude';
                    } else {
                        // add array if not defined
                        if (!cfg[linegroup]) {
                            cfg[linegroup] = [];
                        }
                        // add line as absolute path to array

                        line = path.join(sourceDirectory, line);
                        cfg[linegroup].push(line);
                    }
                }
            }
            // assuming exclude can only occur when there is no include, or if there is, we overwrite it
            if (cfg.exclude) {
                exclude = cfg.exclude;
                include = null;
                cfg.include = [];

                // read all files in source folder
                files = wrench.readdirSyncRecursive(sourceDirectory);

                // loop files to exclude the ones that are not supposed to be included
                for (j = 0, jlen = files.length; j < jlen; j += 1) {
                    file = path.join(sourceDirectory, files[j]);
                    include = true;
                    for (k = 0, klen = exclude.length; k < klen; k += 1) {
                        // check the excluded path is not include
                        // exclude all non-js files such as folder as well
                        if (file.indexOf(exclude[k]) === 0) {
                            include = false;
                        } else if (file.indexOf('.js') === -1) {
                            include = false;
                        }
                    }
                    if (include) {
                        cfg.include.push(file);
                    }
                }
            }

            // clean up the profile name a bit
            if (profile.indexOf('openlayers-') === 0) {
                profile = profile.substring('openlayers-'.length);
            }

            // set configuration to concat
            grunt.config.set('concat.' + profile + '.src', cfg.include);
            grunt.config.set('concat.' + profile + '.dest', '../libraries/OpenLayers/OpenLayers.' + profile + '.js');
        }

        // concatenate the files
        grunt.task.run('concat');

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
