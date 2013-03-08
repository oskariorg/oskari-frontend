/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '* http://PROJECT_WEBSITE/\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> ' + 'YOUR_NAME; Licensed MIT */'
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
            files: ['../applications/**/*.js', '../bundles/**/*.js', '../libraries/**/*.js', '../packages/**/*.js', '../resources/**/*.js', '../sources/**/*.js', '../tests/**/*.js'],
            // uncommented as validate causes unnecessary delay
            //            tasks: ['validate', 'compile', 'testacularRun:dev', 'yuidoc:dist']
            tasks: ['compileDev', 'testacularRun:dev']
        },
        yuidoc: {
            dist: {
                options: {
                    paths: ['../sources/framework', '../bundles/framework', '../bundles/sample', '../bundles/catalogue'],
                    outdir: '../dist/<%= version %>docs/'
                }
            }
        },
        sprite: {
            options: {
                iconDirectoryPath: "../applications/paikkatietoikkuna.fi/full-map/icons",
                resultImageName: "../applications/paikkatietoikkuna.fi/full-map/icons/icons.png",
                resultCSSName: "../applications/paikkatietoikkuna.fi/full-map/css/icons.css",
                spritePathInCSS: "../icons"
            }
        },
        compileDev: {
            options: {
                appSetupFile: "../tests/minifierFullMapAppSetup.json",
                dest: "../dist/"
            }
        },
        testacularRun: {
            dev: {
                options: {
                    runnerPort: 9100
                }
            }
        },
        testacular: {
            dev: {
                options: {
                    configFile: 'testacular.conf.js',
                    keepalive: true
                }
            }
        },
        clean: {
            options: {
                force: true
            },
            build: ["../build"],
            dist: ["../dist"]
        }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-testacular');

    // Default task.
    //    grunt.registerTask('default', 'watch testacularServer:dev');
    //    grunt.registerTask('default', 'testacularServer:dev watch');
    //    grunt.registerTask('default', 'lint test concat min');

    grunt.registerTask('compileDev', 'Developer compile', function() {
        // set task configs
        grunt.config.set("compile.dev.options", this.options());

        grunt.task.run('compile');
    })

    grunt.registerTask('release', 'Release build', function(version, configs) {
        var apps = [],
            tasks = [];

        if (!version || !config) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt release:1.7:"../path/to/minifierAppSetup.json"');
        }
        // set version in config for grunt templating
        grunt.config.set("version", version + "/");

        // set multi task configs for compile and validate
        configs = configs.split(',');
        for(var i = 0, ilen = configs.length; i < ilen; i++) {
            var config = configs[i],
                last = (config.lastIndexOf('/')),
                cwd = config.substring(0, last),
                appName = config.substring(cwd.lastIndexOf('/') + 1, last),
                dest = "../dist/<%= version %>" + appName + "/",
                options = {
                    iconDirectoryPath: config.substring(0, last) + "/icons",
                    resultImageName: "../dist/<%= version %>" + appName + "/icons/icons.png",
                    resultCSSName: "../dist/<%= version %>" + appName + "/css/icons.css",
                    spritePathInCSS: "../icons"
                },
                files = [{
                    "expand": true,
                    "cwd": cwd + "/",
                    "src": ["css/**","*.js"],
                    "dest": dest
                }];

            // setting task configs
            grunt.config.set("copy." + appName + ".files", files);
            grunt.config.set("validate." + appName + ".options", {"appSetupFile": config, "dest": dest});
            grunt.config.set("compile." + appName + ".options", {"appSetupFile": config, "dest": dest});
            grunt.config.set("sprite." + appName + ".options", options);
        }

        grunt.task.run('validate');
        grunt.task.run('copy');
        grunt.task.run('compile');
        grunt.task.run('sprite');
    });
};