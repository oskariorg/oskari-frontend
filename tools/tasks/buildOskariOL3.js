module.exports = function (grunt) {
	grunt.registerTask('buildOpenLayers','', function(mode) {
		var ol3Builder = require('../node_modules/openlayers/tasks/build.js'),
			ol3BuildConfig = (mode !== "debug") ? require('../conf/ol3/ol.json') : require('../conf/ol3/ol-debug.json'),
			ol3BuildPath = '../libraries/ol3/',
			fs = require('fs'),
			olVersion = require('../package.json').devDependencies.openlayers,
			outputFileName = mode !== "debug" ? "ol-v"+olVersion+"-oskari.js" : "ol-v"+olVersion+"-debug-oskari.js";

		var done = this.async();

		ol3Builder(ol3BuildConfig, function(error, result) {
			if (error) {
				console.error("Error building openlayers! "+error);
			} else {
				fs.writeFileSync(ol3BuildPath+outputFileName, result, 'utf8');
			}

			done();
		});
	});

    grunt.registerTask(
        'buildOskariOL3',
        'Create a custom build of ol3 with oskari specific enhancements',
        function () {
			var sourcePath = '../libraries/ol3/oskari/*.js',
				destPath = 'node_modules/openlayers/src/ol/source/';

        	/*copy our own sources */
            var files = {
                src: sourcePath,
                dest: destPath,
                expand: true,
                flatten: true
            };

	        grunt.config.set('copy.oskariOL3sources', files);
			grunt.task.run(['copy:oskariOL3sources','buildOpenLayers', 'buildOpenLayers:debug']);
		}
	);
}