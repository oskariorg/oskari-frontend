/*global module:false*/
var _ = require('lodash'),
    path =  require('path');
var workDir = process.cwd();
console.log('Running process from:', workDir);
var OSKARI_FOLDER = path.basename(path.join(workDir,'..'));

module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '* http://PROJECT_WEBSITE/\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> ' + 'YOUR_NAME; Licensed MIT */'
        },
        compileAppSetupToStartupSequence: {
            files: ['../tests/minifierFullMapAppSetup.json']
        },
        sprite: {
            main : {
                options: {
                    //targetDir: '../resources'
                }
            }
        },
        releaseManual: {
            options: {
                configs: '../applications/sample/servlet/minifierAppSetup.json,../applications/sample/servlet_published_ol3/minifierAppSetup.json',
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        buildApp: {
            options: {
                applicationPaths: '../applications/sample/servlet/',
                buildsetupconfigFileName: 'buildsetupconfig.json',
                appsetupconfigFileName: 'appsetupconfig.json',
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        clean: {
            options: {
                force: true
            },
            build: ['../build', 'Oskari', '../bundles/statistics/statsgrid.polymer/vulcanized.html'],
            dist: ['../dist']
        },
        validateLocalizationJSON: {
            target: {
                src: ['../bundles/**/locale/*.js']
            }
        },
        beautifyJS: {
            target: {
                src: ['../{bundles,packages}/**/*.js']
            }
        },
        impL10nExcels: {
            target: {}
        },
        genL10nExcels: {
            target: {
                expand: true,
                src: ['../bundles/*/*/']
            }
        },
        genL10nEmptyExcels: {
            target: {
                expand: true,
                src: ['../bundles/*/*/']
            }
        },
        genL10nEmptyExcelsLog: {
            target: {
                expand: true,
                src: ['../bundles/*/*/']
            }
        },
        trimtrailingspaces: {
            main: {
              src: ['../bundles/**/*.js'],
              options: {
                filter: 'isFile',
                encoding: 'utf8',
                failIfTrimmed: false
              }
            }
        },
        localizationJSCleanup: {
            target: {
                src: ['../bundles/**/locale/*.js']
            }
        },
        buildOskariOL3: {
            main: {
            }
        }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-trimtrailingspaces');

    // Default task(s).
    grunt.registerTask('default', ['build']);

    grunt.registerTask('devRelease', 'Release build without minification',
        function (version, configs, defaultIconDirectoryPath, copyResourcesToApplications, skipDocumentation) {
            var releaseManualTaskStr = 'releaseManual:' + (version || '') + ':' + (configs || '') + ':' +
                    (defaultIconDirectoryPath || '') + ':' + (copyResourcesToApplications || '') + ':' + (skipDocumentation || '');
            grunt.task.run(releaseManualTaskStr);
    });

    grunt.registerTask('release', 'Release build',
        function (version, configs, defaultIconDirectoryPath, copyResourcesToApplications, skipDocumentation) {
            var releaseManualTaskStr = 'releaseManual:' + (version || '') + ':' + (configs || '') + ':' +
                    (defaultIconDirectoryPath || '') + ':' + (copyResourcesToApplications || '') + ':' + (skipDocumentation || '');
            grunt.task.run(releaseManualTaskStr);
    });

    grunt.registerTask('releaseManual', 'Release build', function (version, configs, defaultIconDirectoryPath, copyResourcesToApplications, skipDocumentation) {
        var i,
            ilen,
            config,
            last,
            cwd,
            appName,
            APPSFOLDERNAME = 'applications',
            dest,
            options = this.options(),
            files,
            copyFiles,
            appNameSeparatorIndex,
            parentAppName,
            imageDest;

        // use grunt default options
        if(!version) {
            version  = new Date().toISOString().replace(/:/g,'');
            grunt.log.writeln('No version specified, using current timestamp: ' + version + 
                '\nUsage: grunt releaseManual:<version>:"../path/to/minifierAppSetup.json"');
        }
        if (options.configs && !configs) {
            configs = options.configs;
            grunt.log.writeln('No setup specified, using default: ' + configs + 
                '\nUsage: grunt releaseManual:<version>:"../path/to/minifierAppSetup.json"');
        }
        if (options.defaultIconDirectoryPath && !defaultIconDirectoryPath) {
            defaultIconDirectoryPath = options.defaultIconDirectoryPath;
        }

        // set version in config for grunt templating
        grunt.config.set('version', version + '/');
        grunt.config.set('versionNum', version);

        // set multi task configs for compile and validate
        configs = configs.split(',');
        for (i = 0, ilen = configs.length; i < ilen; i += 1) {
            config = configs[i];
            last = (config.lastIndexOf('/'));
            cwd = config.substring(0, last);
            appName = config.substring(cwd.lastIndexOf('/') + 1, last);
            dest = '../dist/<%= version %>' + appName + '/';
            imageDest = './' + appName + '/images/';
            options = {
                targetDir: '../dist/<%= version %>' + appName,
                appIconsDir : config.substring(0, last) + '/icons'
            };
            files = [];
            copyFiles = {
                expand: true,
                cwd: cwd + '/',
                src: ['css/**', 'images/**', '*.js'],
                dest: dest
            };

            // subsets have underscore (_) in appName, which means we need to
            // get the parent resources first and then replace with subset specific stuff
            appNameSeparatorIndex = appName.indexOf('_');
            if (appNameSeparatorIndex > 0) {
                parentAppName = appName.substring(0, appNameSeparatorIndex);
                // copy files from parent folder to be replaced by child
                files.push({
                    expand: true,
                    cwd: cwd.replace(appName, parentAppName) + '/',
                    src: ['css/**', 'images/**', '*.js'],
                    dest: dest
                });
                // modify css-sprite to use parent icons instead
                options.appIconsDir = options.appIconsDir.replace(appName, parentAppName);
            }

            // add files to be copied
            files.push(copyFiles);

            // setting task configs
            grunt.config.set('copy.' + appName + '.files', files);

            // Change to true to get oskari.min.js with non-minified content (it's big, don't use in production)
            var concatInsteadOfMinify = false;
            if(concatInsteadOfMinify) {
                grunt.log.warn('!!!Using concatenated instead of minified build!!!');
            }
            grunt.config.set('compile.' + appName + '.options', {
                appSetupFile: config,
                dest: dest,
                concat: concatInsteadOfMinify
            });
            grunt.config.set('compileAppCSS.' + appName + '.options', {
                appName: appName,
                appSetupFile: config,
                dest: dest,
                imageDest: imageDest,
                concat: true
            });
            grunt.config.set('sprite.' + appName + '.options', options);
        }

        // add resources to dist
        grunt.config.set('copy.common.files', [{
            expand: true,
            cwd: '../',
            src: ['libraries/**', 'bundles/**', 'resources/**'],
            dest: '../dist/'
        }
        ]);

        // configure copy-task to copy back the results from dist/css and dist/icons to applications/appname/(css || icons)
        if (copyResourcesToApplications) {
            var copyApps = Object.keys(grunt.config.get('copy')),
                finalFiles = [];

            for (i = 0, ilen = copyApps.length; i < ilen; i += 1) {
                appName = copyApps[i];

                // skip common copy task, the rest should be real apps that are copied
                if ('common' !== appName) {
                    copyFiles = grunt.config.get('copy.' + copyApps[i] + '.files')[0];
                    finalFiles.push({
                        expand: true,
                        cwd: copyFiles.dest,
                        src: ['css/**', 'icons/**'],
                        dest: copyFiles.cwd
                    });
                }
                // only run the given copy tasks
                grunt.task.run('copy:' + copyApps[i]);
            }
            // add final copy settings to be run after compilation
            grunt.config.set('copy.final.files', finalFiles);
        } else {
            grunt.task.run('copy');
        }

        grunt.task.run('compile');
        grunt.task.run('compileAppCSS');
        grunt.task.run('sprite');

        if (copyResourcesToApplications) {
            grunt.task.run('copy:final');
        }
    });

    grunt.registerTask('watchSCSS', 'Watch task for SCSS files', function () {
        grunt.config.set('compileAppCSS.watchCSS.options', {
            appSetupFile: '../applications/sample/servlet/minifierAppSetup.json'
        });
        grunt.task.run('compileAppCSS');
    });

    // TODO compile bundle css only for bundles that the application uses
    grunt.registerMultiTask('compileAppCSS', 'Build css for application', function () {
        var varsDirectory = this.data.options.appSetupFile,
            appName = this.data.options.appName || varsDirectory.substring(varsDirectory.lastIndexOf('/') + 1, varsDirectory.length),
            //appName = varsDirectory.substring(varsDirectory.lastIndexOf('/') + 1, varsDirectory.length),
            varsFileExists = true,
            invalidPaths = [],
            fs = require('fs');

        if (!varsDirectory) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt sass-build-application:"../path/to/application"', 1);
        }
/*

        // strip file part so we get the application path
        varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf('/'));
        grunt.log.writeln('Compiling app CSS with appPath ' + varsDirectory);


        // find valid applicationVariables.scss path
        grunt.log.writeln('Finding valid applicationVariables.scss path');
        if (!fs.existsSync(varsDirectory + '/_applicationVariables.scss')) {
            if (varsDirectory.indexOf('_') > 0) {
                // get parent application path
                varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf('_'));
                if (!fs.existsSync(varsDirectory + '/_applicationVariables.scss')) {
                    invalidPaths.push(varsDirectory);
                    varsFileExists = false;
                }
            } else {
                invalidPaths.push(varsDirectory);
                varsFileExists = false;
            }
            if (!varsFileExists) {
                grunt.fail.fatal('applicationVariables.scss not found, looked in:\n' + invalidPaths, 1);
            } else {
                grunt.log.writeln('Found valid applicationVariables.scss path:\n' + varsDirectory);
            }
        }


        // get application scss files

        // compile to css
        grunt.log.writeln('Compiling app SCSS to CSS, using ' + varsDirectory + '/scss/ as SCSS folder.');
        grunt.config.set(
            'sass.' + appName + '.files', [{
                expand: true,
                cwd: varsDirectory + '/scss/',
                src: ['*.scss'],
                dest: varsDirectory + '/css/',
                ext: '.css'
            }]

        );

        grunt.task.run('sass');

        // build bundle css files
        // hackhack, copy applicationVariables to a 'static' location
        // TODO change to copy
        fs.createReadStream(varsDirectory + '/_applicationVariables.scss').pipe(fs.createWriteStream('../applications/_applicationVariables.scss'));
*/
        grunt.log.writeln('Compiling bundle CSS');

        grunt.task.run('compileBundleCSS');


        if (this.data && this.data.options) {
            grunt.log.writeln('Minifying... ' + appName);
            grunt.config.set('minifyAppCSS.' + appName + '.options', {
                appName: appName,
                appSetupFile: this.data.options.appSetupFile,
                dest: this.data.options.dest,
                imageDest: this.data.options.imageDest
            });
            grunt.task.run('minifyAppCSS');
        } else {
            if (!this.data) {
                grunt.log.writeln('this.data is undefined');
            }
            grunt.fail.fatal('Couldn\'t find options.');
        }

    });

    grunt.registerTask('compileBundleCSS', 'Compile bundle SASS to CSS', function () {
        grunt.config.set(
            'sass.' + 'test' + '-bundles' + '.files', [{
                expand: true,
                cwd: '../bundles/',
                src: '**/*.scss',
                dest: '../bundles/',
                rename: function (dest, src) {
                    var target = dest + src.replace('/scss/', '/resources/css/');
                    grunt.log.writeln('Target: ' + target);
                    return target;
                },
                ext: '.css'
            }]
        );
        grunt.task.run('sass');
    });

    grunt.registerMultiTask('minifyAppCSS', 'Concatenate and minify application css', function () {
        var done = this.async(),
            cssPacker = require('uglifycss'),
            parser = require('./parser.js'),
            fs = require('fs'),
            cssfiles = [],
            options = this.options(),
            processedAppSetup = parser.getComponents(options.appSetupFile),
            i,
            pasFiles,
            replaceImageDir = './images/';

        grunt.log.writeln('Concatenating and minifying css');

        // internal minify CSS function
        this.minifyCSS = function (files, outputFile) {
            var value = '',
                j,
                content,
                packed;

            // read files to value
            grunt.log.writeln('Concatenating and minifying ' + files.length + ' files');
            for (j = 0; j < files.length; j += 1) {
                if (!fs.existsSync(files[j])) {
                    grunt.fail.fatal('Couldnt locate ' + files[j]);
                }
                content = fs.readFileSync(files[j], 'utf8');
                value = value + '\n' + content;
            }

            // FIXME: Make a better effort when improving tooling for Oskari2
            // fix image paths to minified form
            // "../images/pic.png" -> "./images/pic.png"
            value = value.replace(/\.\.\/images\//g, replaceImageDir);
            // "../../../something/resources/images/pic.png" -> "./images/pic.png"
            value = value.replace(/\.\.\/\.\.\/\.\.\/.*\/images\//g, replaceImageDir);

            // minify value
            packed = cssPacker.processString(value);
            grunt.log.writeln('Writing packed CSS to ' + outputFile);

            // write value to outputfile
            fs.writeFile(outputFile, packed, function (err) {
                // ENOENT means the file did not exist, which is ok. Let's just create it.
                if (err && err.code !== 'ENOENT') {
                    grunt.fail.fatal('Error writing packed CSS: ' + err);
                }
                done();
            });
        };
        var getResourcePaths = function(list) {
            var TO_MATCH = (OSKARI_FOLDER + path.sep + 'bundles').toLowerCase();
            console.log('Trying to find resources under:', TO_MATCH);
            var matcherSize = TO_MATCH.length + 1;
            var value = [];
            _.each(list, function(dep) {
                // resourcesPath is the one we find the first CSS-reference for the bundle
                var actual =  dep.resourcesPath || '';
                var index = actual.toLowerCase().indexOf(TO_MATCH);
                if(index !== -1) {
                    var imagePath = actual + path.sep + 'resources' + path.sep + 'images';
                    console.log(imagePath);
                    if(fs.existsSync(imagePath)) {
                        value.push(imagePath);
                    }
                }
            });
            return value;
        }
        var imageDirs = [];
        // gather css files from bundles' minifierAppSetups
        grunt.log.writeln('Getting files from processedAppSetups');
        for (i = 0; i < processedAppSetup.length; i += 1) {
            //console.log(JSON.stringify(processedAppSetup[i], null, 3));
            imageDirs = imageDirs.concat(getResourcePaths(processedAppSetup[i].dependencies));
            pasFiles = parser.getFilesForComponent(processedAppSetup[i], 'css');
            cssfiles = cssfiles.concat(pasFiles);
        }

        var copyBundleImages = function(imageDirs, dest) {

            console.log('Copying image resources from:\n', imageDirs);
            var files = [];
            _.each(imageDirs, function(dirPath) {
                files.push({
                    cwd: dirPath,
                    expand: true,
                    src: ['*', '**/*'],
                    dest: dest
                });
            });

            grunt.config.set('copy.images' + options.appName + '.files', files);
            grunt.task.run('copy:images' + options.appName);
        }
        var imageDestDir = options.dest + 'images';
        copyBundleImages(imageDirs, imageDestDir);
        //grunt.fail.fatal('stpo processing ');
        this.minifyCSS(cssfiles, options.dest + 'oskari.min.css');
    });

};
