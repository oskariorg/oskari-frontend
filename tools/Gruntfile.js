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
                tasks: ['compileDev', 'testacularRun:dev']
            },
            test: {
                files: ['../tests/**/*.js'],
                tasks: ['testacularRun:dev']
            },
            sass: {
                files: ['../bundles/**/*.scss', '../applications/**/*.scss'],
                tasks: ['watchSCSS']
            }
        },
		sass: {},
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
    grunt.loadNpmTasks('grunt-sass');

    // Default task.
    //    grunt.registerTask('default', 'watch testacularServer:dev');
    //    grunt.registerTask('default', 'testacularServer:dev watch');
    //    grunt.registerTask('default', 'lint test concat min');
    grunt.registerTask('compileDev', 'Developer compile', function() {
        // set task configs
        grunt.config.set("compile.dev.options", this.options());

        grunt.task.run('compile');
    });

    grunt.registerTask('compileAppSetupToStartupSequence', function() {
        var done = this.async();
        var starttime = (new Date()).getTime();

        grunt.log.writeln('Running compile AppSetup to startupSequence...');

        // read files and parse output name
        var files = grunt.config(this.name).files[0],
            outputFilename = files.replace(".json", ".opts.js");

        // read file
        var fs = require('fs'),
            cfgFile = fs.readFileSync(files, 'utf8');

        // convert to usable format
        var startupSequence = JSON.parse(cfgFile).startupSequence,
            definedBundles = {},
            bundle,
            result = "var _defaultsStartupSeq = ";

        // loop startup sequence bundles and add to hashmap of defined bundles
        for(var i = 0, ilen = startupSequence.length; i < ilen; i++) {
            bundle = startupSequence[i];
            // Add here code to change bundlePath to "ignored/butRequiredToBeInMinifierFullMapAppSetupInTests/packages/framework/bundle/"
            // or something similar as the bundlePaths are not used with minifierAppSetup
            definedBundles[bundle.bundlename] = bundle;
        }

        // add stringified bundle definitions
        result +=JSON.stringify(definedBundles);

        // write file to be used in testing as is
        fs.writeFileSync(outputFilename, result , 'utf8');

        var endtime = (new Date()).getTime();
        grunt.log.writeln('compileAppSetupToStartupSequence completed in ' + ((endtime - starttime) / 1000) + ' seconds');
        done();
    });

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
                files = [],
                copyFiles = {
                    "expand": true,
                    "cwd": cwd + "/",
                    "src": ["css/**", "images/**", "*.js"],
                    "dest": dest
                };

            // subsets have underscore (_) in appName, which means we need to
            // get the parent resources first and then replace with subset specific stuff
            var appNameSeparatorIndex = appName.indexOf('_');
            if (appNameSeparatorIndex > 0) {
                var parentAppName = appName.substring(0, appNameSeparatorIndex);
                // copy files from parent folder to be replaced by child
                files.push({
                    "expand": true,
                    "cwd": cwd.replace(appName, parentAppName) + "/",
                    "src": ["css/**", "images/**", "*.js"],
                    "dest": dest
                });
                // modify css-sprite to use parent icons instead
                options.iconDirectoryPath = options.iconDirectoryPath.replace(appName, parentAppName);
            }

            // add files to be copied
            files.push(copyFiles);

            // add mddocs to dist
            files.push({
                "expand": true,
                "cwd": "../docs/",
                "src": ["images/**", "layout/**"],
                "dest": grunt.config.get("mddocs.options.outdir")
            });

            // add resources to dist
            files.push({
                "expand": true,
                "cwd": "../",
                "src": ["resources/**", "libraries/**", "bundles/**"],
                "dest": "../dist/"
            });

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
			grunt.config.set("compileAppCSS." + appName + ".options", {
                "appSetupFile": config,
                "dest": dest
            });
            grunt.config.set("sprite." + appName + ".options", options);
        }

        // scss to css conversion
        grunt.task.run('compileAppCSS');

        grunt.task.run('validate');
        grunt.task.run('copy');
        grunt.task.run('compile');
        grunt.task.run('sprite');
        grunt.task.run('yuidoc');
        grunt.task.run('mddocs');
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
            outputFilenamePostfix = ".min.js",
            cfg = null,
            cfgFile = null,
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

	grunt.registerTask("watchSCSS", "Watch task for SCSS files", function() {
		grunt.config.set("compileAppCSS.watchCSS.options", {
			"appSetupFile": '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json'
		});
		grunt.task.run("compileAppCSS");
	})

	// TODO compile bundle css only for bundles that the application uses
	grunt.registerMultiTask("compileAppCSS", "Build css for application", function() {
		var varsDirectory = this.data.options.appSetupFile,
			appName = varsDirectory.substring(varsDirectory.lastIndexOf("/") + 1, varsDirectory.length);
			varsFileExists = true,
			invalidPaths = [],
			fs = require('fs');

		if(!varsDirectory) {
			grunt.fail.fatal('Missing parameter\nUsage: grunt sass-build-application:"../path/to/application"', 1);
		}


		// strip file part so we get the application path
		varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf("/"));
		grunt.log.writeln("Compiling app CSS with appPath " + varsDirectory);


		// find valid applicationVariables.scss path
		grunt.log.writeln("Finding valid applicationVariables.scss path");
		if (!fs.existsSync(varsDirectory + "/_applicationVariables.scss")) {
			if (varsDirectory.indexOf("_") > 0) {
				// get parent application path
				varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf("_"));
				if (!fs.existsSync(varsDirectory + "/_applicationVariables.scss")) {
					invalidPaths.push(varsDirectory);
					varsFileExists = false;
				}
			} else {
				invalidPaths.push(varsDirectory);
				varsFileExists = false;
			}
			if (!varsFileExists) {
				grunt.fail.fatal("applicationVariables.scss not found, looked in:\n" + invalidPaths, 1);
			}
		}


		// get application scss files
		grunt.log.writeln("Getting application SCSS files");
		var vars = fs.readFileSync(varsDirectory + "/_applicationVariables.scss"),
			scssFiles = fs.readdirSync(varsDirectory + "/scss/");

		// compile to css
		grunt.log.writeln("Compiling app SCSS to CSS");
		grunt.config.set(
			'sass.' + appName + '.files',
			[{
				"expand": true,
				"cwd": varsDirectory + "/scss/",
				"src": ['*.scss'],
				"dest": varsDirectory + '/css/',
				"ext": '.css'
			}]

		);

		// build bundle css files
		// hackhack, copy applicationVariables to a 'static' location
		// TODO change to copy
		fs.createReadStream(varsDirectory + '/_applicationVariables.scss').pipe(fs.createWriteStream('../applications/_applicationVariables.scss'));

		grunt.config.set(
			'sass.' + appName + "-bundles" + '.files',
			[{
				"expand": true,
				"cwd": "../bundles/",
				"src": "**/*.scss",
				"dest": '../resources/',
				"rename": function(dest,src) {return dest+src.replace("/scss/","/css/")},
				"ext": '.css'
			}]
		);
		grunt.task.run('sass');


		if (this.data && this.data.options) {
			grunt.log.writeln("Minifying...");
			grunt.config.set("minifyAppCSS." + appName + ".options", {
				"appSetupFile": this.data.options.appSetupFile,
				"dest": this.data.options.dest
			});
			grunt.task.run("minifyAppCSS");
		} else {
			if (!this.data) {
				grunt.log.writeln("this.data is undefined");
			}
			grunt.fail.fatal("Couldn't find options.");
		}

	});

	grunt.registerMultiTask("minifyAppCSS", "Concatenate and minify application css", function() {
		grunt.log.writeln("Concatenating and minifying css");

		var cssPacker = require('uglifycss'),
			parser = require('./parser.js'),
			cssfiles = [],
			options = this.data.json.options;
			
		grunt.log.writeln("Getting processedAppStup with " + options.appSetupFile);
		var processedAppSetup = parser.getComponents(options.appSetupFile);
		grunt.log.writeln("Variables set");

        // internal minify CSS function
        this.minifyCSS = function(files, outputFile) {

            var value = '';
			// read files to value
            for (var i = 0; i < files.length; ++i) {
                if (!fs.existsSync(files[i])) {
                    grunt.fail.fatal("Couldn't locate " + files[i]);
                }
				else {
					console.log("Found file: " + files[i]);
				}
                var content = fs.readFileSync(files[i], 'utf8');
                value = value + '\n' + content;
            }
			// minify value
            var packed = cssPacker.processString(value);

			// write value to outputfile
            fs.writeFile(outputFile, packed, function(err) {
                if (err) {
                    grunt.fail.fatal('Error writing packed CSS: ' + err);
                }
            });
        }

		// gather css files from bundles' minifierAppSetups
		for (var i = 0; i < processedAppSetup.length; ++i) {
			cssfiles = cssfiles.concat(parser.getFilesForComponent(processedAppSetup[i], 'css'));
		}
		this.minifyCSS(cssfiles, options.dest + 'oskari.min.css');
	});

};
