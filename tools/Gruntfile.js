/*global module:false*/
var _ = require('lodash'),
    path =  require('path');

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
        watch: {
            appsetup: {
                files: '<%= compileAppSetupToStartupSequence.files %>',
                tasks: ['compileAppSetupToStartupSequence']
            },
            src: {
                //            files: '<config:lint.files>',
                files: ['../applications/**/*.js', '../bundles/**/*.js', '../libraries/**/*.js', '../packages/**/*.js', '../resources/**/*.js', '../sources/**/*.js'],
                // uncommented as validate causes unnecessary delay
                //            tasks: ['validate', 'compile', 'testacularRun:dev', 'yuidoc:dist']
                tasks: ['compileDev', 'karma:dev:run']
            },
            test: {
                files: ['../tests/**/*.js'],
                tasks: ['karma:dev:run']
            },
            sass: {
                files: ['../bundles/**/scss/*.scss', '../applications/**/scss/*.scss'],
                tasks: ['compileDev']
            }
        },
        sprite: {
            options: {
                iconDirectoryPath: '../applications/paikkatietoikkuna.fi/full-map/icons',
                resultImageName: '../applications/paikkatietoikkuna.fi/full-map/icons/icons.png',
                resultCSSName: '../applications/paikkatietoikkuna.fi/full-map/css/icons.css',
                spritePathInCSS: '../icons'
            }
        },
        compileDev: {
            options: {
                appSetupFile: '../tests/minifierFullMapAppSetup.json',
                dest: '../dist/',
                concat: true
            }
        },
        release: {
            options: {
                configs: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json,../applications/paikkatietoikkuna.fi/full-map_guest/minifierAppSetup.json,../applications/paikkatietoikkuna.fi/published-map/minifierAppSetup.json',
                // ,../applications/parcel/minifierAppSetup.json
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        buildApp: {
            options: {
                applicationPaths: '../applications/paikkatietoikkuna.fi/full-map/,../applications/paikkatietoikkuna.fi/full-map_guest/,../applications/paikkatietoikkuna.fi/published-map/,../applications/parcel/',
                buildsetupconfigFileName: 'buildsetupconfig.json',
                appsetupconfigFileName: 'appsetupconfig.json',
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                background: true
            },
            ci: {
                browsers: ['PhantomJS'],
                proxies: {
                    '/': 'http://dev.paikkatietoikkuna.fi/'
                },
                reporters: ['junit'],
                junitReporter: {
                    outputFile: 'test-results.xml'
                },
                singleRun: true
            },
            test: {
                configFile: 'src.conf.js'
            }
        },
        clean: {
            options: {
                force: true
            },
            build: ['../build'],
            dist: ['../dist']
        },
        oskaridoc: {
            dist: {
                options: {
                    paths: ['../sources/framework', '../bundles/framework', '../bundles/sample', '../bundles/catalogue'],
                    outdir: '../oskari.org/api/<%= version %>',
                    themedir: '../docs/yui/theme'
                }
            }
        },
        mddocs: {
            options: {
                'toolsPath': process.cwd(),
                'docsPath': '../docs',
                'docsurl': '/Oskari/<%= version %>docs/',
                'apiurl': '/Oskari/<%= version %>api/classes/',
                'outdir': '../dist/<%= version %>docs/'
            }
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
                src: ['../bundles/**/bundle/*/']
            }
        },
        compress: {
            zip: {
                options: {
                    archive: '../oskari.org/archives/oskari.<%= versionNum %>.zip',
                    mode: 'zip',
                    pretty: true
                },
                files: [
                    // Copy all files under the application template folder
                    {
                        cwd: './oskari_application_template/',
                        src: '**',
                        dest: '/',
                        expand: true
                    },
                    // Copy all minified oskari files
                    {
                        cwd: '../dist/<%= versionNum %>/<%= compress.options.fullMap %>',
                        src: 'oskari*',
                        dest: '/min/',
                        expand: true
                    }, {
                        src: '../bundles/bundle.js',
                        dest: '/',
                    }, {
                        src: '../packages/openlayers/startup.js',
                        dest: '/',
                    }
                ]
            },
            tgz: {
                options: {
                    archive: '../oskari.org/archives/oskari.<%= versionNum %>.tgz',
                    mode: 'tgz',
                    pretty: true
                },
                files: '<%= compress.zip.files %>'
            }
        }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task(s).
    grunt.registerTask('default', ['karma:dev', 'compileAppSetupToStartupSequence', 'compileDev', 'karma:dev:run', 'watch']);
    grunt.registerTask('ci', ['compileAppSetupToStartupSequence', 'compileDev', 'karma:ci']);
    // Default task.
    //    grunt.registerTask('default', 'watch testacularServer:dev');
    //    grunt.registerTask('default', 'testacularServer:dev watch');
    //    grunt.registerTask('default', 'lint test concat min');
    grunt.registerTask('compileDev', 'Developer compile', function () {
        var options = this.options();
        // set task configs
        grunt.config.set('compile.dev.options', options);
        grunt.task.run('compile');

        grunt.config.set(
            'compileAppCSS.dev.options', {
                appSetupFile: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json',
                dest: options.dest
            }
        );
        grunt.task.run('compileAppCSS');
    });

    grunt.registerTask('compileAppSetupToStartupSequence', function () {
        var done = this.async(),
            starttime = (new Date()).getTime(),
            files,
            outputFilename,
            fs = require('fs'),
            cfgFile,
            startupSequence,
            definedBundles = {},
            bundle,
            result = 'var _defaultsStartupSeq = ',
            i,
            ilen;

        grunt.log.writeln('Running compile AppSetup to startupSequence...');

        // read files and parse output name
        files = grunt.config(this.name).files[0];
        outputFilename = files.replace('.json', '.opts.js');

        // read file
        cfgFile = fs.readFileSync(files, 'utf8');

        // convert to usable format
        startupSequence = JSON.parse(cfgFile).startupSequence;

        // loop startup sequence bundles and add to hashmap of defined bundles
        for (i = 0, ilen = startupSequence.length; i < ilen; i += 1) {
            bundle = startupSequence[i];
            // Add here code to change bundlePath to "ignored/butRequiredToBeInMinifierFullMapAppSetupInTests/packages/framework/bundle/"
            // or something similar as the bundlePaths are not used with minifierAppSetup
            definedBundles[bundle.bundlename] = bundle;
        }

        // add stringified bundle definitions
        result += JSON.stringify(definedBundles);

        // write file to be used in testing as is
        fs.writeFileSync(outputFilename, result, 'utf8');

        grunt.log.writeln('compileAppSetupToStartupSequence completed in ' + (((new Date()).getTime() - starttime) / 1000) + ' seconds');
        done();
    });

    grunt.registerTask('release', 'Release build', function (version, configs, defaultIconDirectoryPath, copyResourcesToApplications, skipDocumentation) {
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
            version  = new Date().getTime();
            grunt.log.writeln('No version specified, using current timestamp: ' + version + 
                '\nUsage: grunt release:<version>:"../path/to/minifierAppSetup.json"');
        }
        if (options.configs && !configs) {
            configs = options.configs;
            grunt.log.writeln('No setup specified, using default: ' + configs + 
                '\nUsage: grunt release:<version>:"../path/to/minifierAppSetup.json"');
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
                iconDirectoryPath: config.substring(0, last) + '/icons',
                resultImageName: '../dist/<%= version %>' + appName + '/icons/icons.png',
                resultCSSName: '../dist/<%= version %>' + appName + '/css/icons.css',
                spritePathInCSS: '../icons',
                defaultIconDirectoryPath: defaultIconDirectoryPath
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
                options.iconDirectoryPath = options.iconDirectoryPath.replace(appName, parentAppName);
            }

            // add files to be copied
            files.push(copyFiles);

            // setting task configs
            grunt.config.set('copy.' + appName + '.files', files);

            grunt.config.set('compile.' + appName + '.options', {
                appSetupFile: config,
                dest: dest
            });
            grunt.config.set('compileAppCSS.' + appName + '.options', {
                appName: appName,
                appSetupFile: config,
                dest: dest,
                imageDest: imageDest
            });
            grunt.config.set('sprite.' + appName + '.options', options);

            if (appName === 'full-map') {
                grunt.config.set('compress.options.fullMap', appName);
            }
        }

        // add resources to dist
        grunt.config.set('copy.common.files', [{
            expand: true,
            cwd: '../',
            src: ['libraries/**', 'bundles/**'],
            dest: '../dist/'
        }
        ]);
        // 'resources/**', , 'sources/**', 'packages/**', 'src/**', 'applications/**'
        // {
//            expand: true,
//            cwd: '../docs/',
//            src: ['images/**', 'layout/**'],
//            dest: grunt.config.get('mddocs.options.outdir')
//        }, 
//        {
//            expand: true,
//            cwd: '../',
//            src: ['**/resources/images/**/*.{png,jpg,jpeg,svg,gif}'],
//            dest: dest + '/images/',
//            flatten: true
//        }

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
/*
            finalFiles.push({
                expand: true,
                cwd: '../',
                src: ['bundles/**/resources/images/*.{png,jpg,jpeg,svg,gif}'],
                dest: dest + '/images/',
                flatten: true
            });
*/
            // add final copy settings to be run after compilation
            grunt.config.set('copy.final.files', finalFiles);
        } else {
            grunt.task.run('copy');
        }

        grunt.task.run('compile');
        grunt.task.run('compileAppCSS');
        grunt.task.run('sprite');
        if (!skipDocumentation) {
//            grunt.task.run('oskaridoc');
        }

        if (grunt.config.get('compress.options.fullMap')) {
            grunt.task.run('compress');
        }
        if (copyResourcesToApplications) {
            grunt.task.run('copy:final');
        }
    });

    grunt.registerTask('watchSCSS', 'Watch task for SCSS files', function () {
        grunt.config.set('compileAppCSS.watchCSS.options', {
            appSetupFile: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json'
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
            grunt.log.writeln('Minifying...');
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
            findImageDir = '../images/',
            findImageDirRegExp = new RegExp(findImageDir, 'g'),
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

            // correct image paths
            value = value.replace(findImageDirRegExp, replaceImageDir);


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
            var TO_MATCH = 'Oskari' + path.sep + 'bundles',
                matcherSize = TO_MATCH.length + 1;
            var value = [];
            _.each(list, function(dep) {
                var actual =  dep.path || '';
                var index = actual.indexOf(TO_MATCH);
                if(index !== -1) {
                    //console.log(actual.substring(index + matcherSize));
                    var imagePath = actual + path.sep + 'resources' + path.sep + 'images';
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
