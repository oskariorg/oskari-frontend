/*
 * oskari build app (old Oskari2 tasks(?))
 */

module.exports = function (grunt) {


    grunt.registerMultiTask('modulizeAll', 'Convert all bundles to modules', function () {
    	var input = {
            'admin-layerrights': '../packages/framework/bundle/admin-layerrights',
            'backendstatus': '../packages/framework/bundle/backendstatus',
            'coordinatedisplay': '../packages/framework/bundle/coordinatedisplay',
            // Manual modification          'divmanazer': '../packages/framework/bundle/divmanazer',
            'featuredata': '../packages/framework/bundle/featuredata',
            'featuredata2': '../packages/framework/bundle/featuredata2',
            // Manual modification          'guidedtour': '../packages/framework/bundle/guidedtour',
            'infobox': '../packages/framework/bundle/infobox',
            // Manual modification          'layerselection2': '../packages/framework/bundle/layerselection2',
            'layerselector2': '../packages/framework/bundle/layerselector2',
            'mapanalysis': '../packages/framework/bundle/mapanalysis',
            'mapfull': '../packages/framework/bundle/mapfull',
            'maplegend': '../packages/framework/bundle/maplegend',
            // Manual replaced by src/mapping/mapmodule-plugin          'mapmodule-plugin': '../packages/framework/bundle/mapmodule-plugin',
            'mapstats': '../packages/framework/bundle/mapstats',
            'mapwfs': '../packages/framework/bundle/mapwfs',
            'mapwfs2': '../packages/framework/bundle/mapwfs2',
            // Manual replaced by src/framework/mapwmts          'mapwmts': '../packages/framework/bundle/mapwmts',
            'metadata': '../packages/framework/bundle/metadata',
            'myplaces2': '../packages/framework/bundle/myplaces2',
            // Manual modification          'oskariui': '../packages/framework/bundle/oskariui',
            'parcel': '../packages/framework/bundle/parcel',
            'parcelinfo': '../packages/framework/bundle/parcelinfo',
            'parcelselector': '../packages/framework/bundle/parcelselector',
            'personaldata': '../packages/framework/bundle/personaldata',
            'postprocessor': '../packages/framework/bundle/postprocessor',
            'printout': '../packages/framework/bundle/printout',
            'promote': '../packages/framework/bundle/promote',
            'publisher': '../packages/framework/bundle/publisher',
            'routesearch': '../packages/framework/bundle/routesearch',
            'search': '../packages/framework/bundle/search',
            'statehandler': '../packages/framework/bundle/statehandler',
            'toolbar': '../packages/framework/bundle/toolbar',
            'usagetracker': '../packages/framework/bundle/usagetracker',
            'userguide': '../packages/framework/bundle/userguide',
            // Manual modification          'statsgrid': '../packages/statistics/bundle/statsgrid',
            'analyse': '../packages/analysis/bundle/analyse',
            // Manual modification          'metadataflyout': '../packages/catalogue/bundle/metadataflyout',
            'metadatacatalogue': '../packages/catalogue/bundle/metadataflyout'
    	}
        grunt.task.run('bundle2module:' + input);
    });

    grunt.registerMultiTask('minifyAll', 'Minify all modules', function () {
    	/*
    	
    grunt.initConfig({ -> 
        minifyAll: {
            options: {
                baseUrl: '../',
                paths: {
                    jquery: 'empty:',
                    oskari: 'empty:',
                    css: 'libraries/requirejs/lib/css',
                    json: 'libraries/requirejs/lib/json',
                    domReady: 'libraries/requirejs/lib/domReady',
                    normalize: 'libraries/requirejs/lib/normalize',
                    i18n: 'libraries/requirejs/lib/i18n',
                    'css-builder': 'libraries/requirejs/lib/css-builder'
                },
                optimizeAllPluginResources: true,
                findNestedDependencies: true,
                preserveLicenseComments: true
            },
            'admin-layerrights': {
                name: 'src/framework/admin-layerrights/module',
                out: '../src/framework/admin-layerrights/minified.js'
            },
            'backendstatus': {
                name: 'src/framework/backendstatus/module',
                out: '../src/framework/backendstatus/minified.js'
            },
            'coordinatedisplay': {
                name: 'src/framework/coordinatedisplay/module',
                out: '../src/framework/coordinatedisplay/minified.js'
            },
            'divmanazer': {
                name: 'src/framework/divmanazer/module',
                out: '../src/framework/divmanazer/minified.js'
            },
            'featuredata': {
                name: 'src/framework/featuredata/module',
                out: '../src/framework/featuredata/minified.js'
            },
            'featuredata2': {
                name: 'src/framework/featuredata2/module',
                out: '../src/framework/featuredata2/minified.js'
            },
            'guidedtour': {
                name: 'src/framework/guidedtour/module',
                out: '../src/framework/guidedtour/minified.js'
            },
            'infobox': {
                name: 'src/framework/infobox/module',
                out: '../src/framework/infobox/minified.js'
            },
            'layerselection2': {
                name: 'src/framework/layerselection2/module',
                out: '../src/framework/layerselection2/minified.js'
            },
            'layerselector2': {
                name: 'src/framework/layerselector2/module',
                out: '../src/framework/layerselector2/minified.js'
            },
            'mapanalysis': {
                name: 'src/framework/mapanalysis/module',
                out: '../src/framework/mapanalysis/minified.js'
            },
            'mapfull': {
                name: 'src/framework/mapfull/module',
                out: '../src/framework/mapfull/minified.js'
            },
            'maplegend': {
                name: 'src/framework/maplegend/module',
                out: '../src/framework/maplegend/minified.js'
            },
            'mapstats': {
                name: 'src/framework/mapstats/module',
                out: '../src/framework/mapstats/minified.js'
            },
            'mapwfs': {
                name: 'src/framework/mapwfs/module',
                out: '../src/framework/mapwfs/minified.js'
            },
            'mapwfs2': {
                name: 'src/framework/mapwfs2/module',
                out: '../src/framework/mapwfs2/minified.js'
            },
            'mapwmts': {
                name: 'src/framework/mapwmts/module',
                out: '../src/framework/mapwmts/minified.js'
            },
            'metadata': {
                name: 'src/framework/metadata/module',
                out: '../src/framework/metadata/minified.js'
            },
            'myplaces2': {
                name: 'src/framework/myplaces2/module',
                out: '../src/framework/myplaces2/minified.js'
            },
            'oskariui': {
                name: 'src/framework/oskariui/module',
                out: '../src/framework/oskariui/minified.js'
            },
            'parcel': {
                name: 'src/framework/parcel/module',
                out: '../src/framework/parcel/minified.js'
            },
            'parcelinfo': {
                name: 'src/framework/parcelinfo/module',
                out: '../src/framework/parcelinfo/minified.js'
            },
            'parcelselector': {
                name: 'src/framework/parcelselector/module',
                out: '../src/framework/parcelselector/minified.js'
            },
            'personaldata': {
                name: 'src/framework/personaldata/module',
                out: '../src/framework/personaldata/minified.js'
            },
            'postprocessor': {
                name: 'src/framework/postprocessor/module',
                out: '../src/framework/postprocessor/minified.js'
            },
            'printout': {
                name: 'src/framework/printout/module',
                out: '../src/framework/printout/minified.js'
            },
            'promote': {
                name: 'src/framework/promote/module',
                out: '../src/framework/promote/minified.js'
            },
            'publisher': {
                name: 'src/framework/publisher/module',
                out: '../src/framework/publisher/minified.js'
            },
            'search': {
                name: 'src/framework/search/module',
                out: '../src/framework/search/minified.js'
            },
            'statehandler': {
                name: 'src/framework/statehandler/module',
                out: '../src/framework/statehandler/minified.js'
            },
            'toolbar': {
                name: 'src/framework/toolbar/module',
                out: '../src/framework/toolbar/minified.js'
            },
            'usagetracker': {
                name: 'src/framework/usagetracker/module',
                out: '../src/framework/usagetracker/minified.js'
            },
            'userguide': {
                name: 'src/framework/userguide/module',
                out: '../src/framework/userguide/minified.js'
            }
        }
    	 */
        var options = this.options(this.data);
        grunt.config.set('requirejs.' + this.target + '.options', options);
        grunt.task.run('requirejs:' + this.target);
    });

    grunt.registerTask('buildApp', 'Build App', function (applicationPaths, version, defaultIconDirectoryPath, copyResourcesToApplications) {
        var starttime = (new Date()).getTime(),
            options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Building...');

        grunt.log.writeln('Building Apps in ', applicationPaths);
        var i,
            ilen,
            applicationPath,
            buildsetupconfig,
            appsetupconfig,
            last,
            cwd,
            appName,
            APPSFOLDERNAME = 'applications',
            dest,
            options = this.options(),
            buildoptions,
            files,
            copyFiles,
            appNameSeparatorIndex,
            parentAppName;

        // use grunt default options
        if (options.applicationPaths && !applicationPaths) {
            applicationPaths = options.applicationPaths;
        }
        if (!version) {
            var packagejson = grunt.file.readJSON('../package.json');
            version = packagejson.version;
        }
        if (options.defaultIconDirectoryPath && !defaultIconDirectoryPath) {
            defaultIconDirectoryPath = options.defaultIconDirectoryPath;
        }

        // set version in config for grunt templating
        grunt.config.set('version', version);

        // set multi task configs for compile and validate
        applicationPaths = applicationPaths.split(',');
        for (i = 0, ilen = applicationPaths.length; i < ilen; i += 1) {
            applicationPath = applicationPaths[i];
            buildsetupconfig = applicationPath + options.buildsetupconfigFileName;
            appsetupconfig = applicationPath + options.appsetupconfigFileName;
            last = (applicationPath.lastIndexOf('/'));
            cwd = applicationPath.substring(0, last);
            appName = applicationPath.substring(cwd.lastIndexOf('/') + 1, last);
            dest = '../dist/<%= version %>/' + appName + '/';
            options = {
                iconDirectoryPath: applicationPath.substring(0, last) + '/icons',
                resultImageName: '../dist/<%= version %>/' + appName + '/icons/icons.png',
                resultCSSName: '../dist/<%= version %>/' + appName + '/css/icons.css',
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
            grunt.config.set('compileAppCSS.' + appName + '.options', {
                appSetupFile: appsetupconfig,
                dest: dest
            });
            grunt.config.set('sprite.' + appName + '.options', options);

            buildoptions = grunt.file.readJSON(buildsetupconfig);
            buildoptions.out = '../dist/' + version + '/' + appName + '/oskari.min.js';
            grunt.config.set('requirejs.' + appName + '.options', buildoptions);
        }

        // add resources to dist
        grunt.config.set('copy.common.files', [{
            expand: true,
            cwd: '../',
            src: ['resources/**', 'libraries/**', 'bundles/**', 'packages/**', 'src/**', 'applications/**', 'sources/**'],
            dest: '../dist/'
        }]);

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

        grunt.task.run('compileAppCSS');
        grunt.task.run('requirejs');
        grunt.task.run('sprite');

        if (copyResourcesToApplications) {
            grunt.task.run('copy:final');
        }

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
