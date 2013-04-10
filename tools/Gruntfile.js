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
                dest: "../dist/",
                concat: true
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
        },
        yuidoc: {
            dist: {
                options: {
                    paths: ['../sources/framework', '../bundles/framework', '../bundles/sample', '../bundles/catalogue'],
                    outdir: '../dist/<%= version %>api/'
                }
            }
        },
        mddocs: {
            options: {
                "toolsPath": process.cwd(),
                "docsPath": "../docs",
                "docsurl": "/Oskari/docs/release/<%= version %>",
                "apiurl": "http://oskari.org/",
                "outdir": "../dist/<%= version %>docs"
            }
        }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-testacular');
    grunt.loadNpmTasks('grunt-contrib-concat');

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

        if(!version || !configs) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt release:1.7:"../path/to/minifierAppSetup.json"', 1);
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
                    "src": ["css/**", "images/**", "*.js"],
                    "dest": dest
                }];

            // setting task configs
            grunt.config.set("copy." + appName + ".files", files);
            grunt.config.set("validate." + appName + ".options", {
                "appSetupFile": config,
                "dest": dest
            });
            grunt.config.set("compile." + appName + ".options", {
                "appSetupFile": config,
                "dest": dest
            });
            grunt.config.set("sprite." + appName + ".options", options);
        }

        grunt.task.run('validate');
        grunt.task.run('copy');
        grunt.task.run('compile');
        grunt.task.run('sprite');
        grunt.task.run('yuidoc');
        //        grunt.task.run('mddocs');
    });

    grunt.registerTask('packageopenlayer', 'Package openlayers according to packages', function(packages) {
        if(!packages) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt packageopenlayer:"../path/to/profile.cfg"', 1);
        }

        console.log('Running openlayers packager...');
        var fs = require('fs'),
            path = require('path'),
            wrench = require('wrench'),
            sourceDirectory = path.join(process.cwd(), "/components/openlayers/lib/"),
            outputFilenamePrefix = "OpenLayers.",
            outputFilenamePostfix = ".min.js"
            cfg = null,
            i = null,
            ilen = null,
            j = null,
            jlen = null,
            k = null,
            klen = null,
            cfgs = [],
            files = null,
            file = null,
            linegroup = null,
            profile = null,
            dist = null,
            FIRST = "[first]",
            LAST = "[last]",
            INCLUDE = "[include]",
            EXCLUDE = "[exclude]";

        // transform comma separeted configs string to array
        packages = packages.split(',');

        // read cfg files
        for(i = 0, ilen = packages.length; i < ilen; i += 1) {
            cfgFile = fs.readFileSync(packages[i], 'utf8').split("\r\n");
            profile = packages[i];
            profile = profile.substring(profile.lastIndexOf("/") + 1, profile.indexOf('.cfg'));
            var line, cfg = {};
            for(j = 0, jlen = cfgFile.length; j < jlen; j += 1) {
                line = cfgFile[j];

                // skip empty lines and lines that start with #
                if((line.length > 0) && (line[0] !== "#")) {
                    if (line === FIRST) {
                        linegroup = "forceFirst";
                    } else if (line === LAST) {
                        linegroup = "forceLast";
                    } else if (line === INCLUDE) {
                        linegroup = "include";
                    } else if (line === EXCLUDE) {
                        linegroup = "exclude";
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
                var exclude = cfg.exclude;
                var include = null;
                cfg.include = [];

                // read all files in source folder
                files = wrench.readdirSyncRecursive(sourceDirectory);

                // loop files to exclude the ones that are not supposed to be included
                for(j = 0, jlen = files.length; j < jlen; j += 1) {
                    file = path.join(sourceDirectory, files[j]);
                    include = true;
                    for(k = 0, klen = exclude.length; k < klen; k += 1) {
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
            if (profile.indexOf("openlayers-" === 0)) {
                profile = profile.substring("openlayers-".length);
            }

            // set configuration to concat
            grunt.config.set("concat." + profile + ".src", cfg.include);
            grunt.config.set("concat." + profile + ".dest", "../libraries/OpenLayers/OpenLayers." + profile + ".js");
        }

        // concatenate the files
        grunt.task.run('concat');
    });
};