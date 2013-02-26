/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://PROJECT_WEBSITE/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'YOUR_NAME; Licensed MIT */'
        },
//        lint: {
//            files: ['applications/**/*.js', 'bundles/**/*.js', 'libraries/**/*.js', 'packages/**/*.js', 'resources/**/*.js', 'sources/**/*.js']
//        },
//        test: {
//            files: ['test/**/*.js']
//        },
//        concat: {
//            dist: {
//                src: ['<banner:meta.banner>', '<file_strip_banner:lib/FILE_NAME.js>'],
//                dest: 'dist/FILE_NAME.js'
//            }
//        },
//        min: {
//            dist: {
//                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
//                dest: 'dist/FILE_NAME.min.js'
//            }
//        },
        watch: {
//            files: '<config:lint.files>',
            files: [
                '../applications/**/*.js',
                '../bundles/**/*.js',
                '../libraries/**/*.js',
                '../packages/**/*.js',
                '../resources/**/*.js',
                '../sources/**/*.js',
                '../tests/**/*.js'
                ],
// uncommented as validate causes unnecessary delay
//            tasks: 'validate compile testacularRun:dev yuidoc'
            tasks: 'compile testacularRun:dev'
        },
        yuidoc: {
            options: {
                paths: [ '../sources/framework',
                         '../bundles/framework',
                         '../bundles/sample',
                         '../bundles/catalogue' ],
                outdir: '../dist/docs/'
            }
        },
        testacularRun: {
            dev: {
                runnerPort: 9100
            }
        },
        testacularServer: {
            dev: {
                configFile: 'testacular.conf.js',
                options: {
                    keepalive: true
                }
            },
            ci: {
                configFile: 'testacular.conf.js'
            }
        },
        testacularS: {
            configFile: 'testacular.conf.js'
        },
        uglify: {}
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-testacular');

    // Default task.
//    grunt.registerTask('default', 'watch testacularServer:dev');
//    grunt.registerTask('default', 'testacularServer:dev watch');
//    grunt.registerTask('default', 'lint test concat min');

    grunt.registerTask('compile', 'experimental build', function(appSetupFile, arg) {
        if (!appSetupFile) {
            appSetupFile = "../applications/sample/full/full_appsetup.json";
        }
        var parser = require('./parser.js');
        var actionHandler = require('./action_compile.js');

        var processedAppSetup = parser.getComponents(appSetupFile);
        actionHandler.handle(processedAppSetup, arg);

        var unknownfiles = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            unknownfiles = unknownfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'unknown'));
        }
        if(unknownfiles.length != 0) {
            console.log('Appsetup referenced types of files that couldn\'t be handled: ' + unknownfiles);
        }
    });

    grunt.registerTask('validate', 'experimental build', function(appSetupFile, arg) {
        if (!appSetupFile) {
            appSetupFile = "../applications/sample/full/full_appsetup.json";
        }
        var parser = require('./parser.js');
        var actionHandler = require('./action_validate.js');

        var processedAppSetup = parser.getComponents(appSetupFile);
        actionHandler.handle(processedAppSetup, arg);

        var unknownfiles = [];
        for (var j = 0; j < processedAppSetup.length; ++j) {
            unknownfiles = unknownfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'unknown'));
        }
        if(unknownfiles.length != 0) {
            console.log('Appsetup referenced types of files that couldn\'t be handled: ' + unknownfiles);
        }
    });
};
