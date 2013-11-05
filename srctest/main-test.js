var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		// only include files with spec e.g. test.spec.js
		if (/spec/.test(file)) {
			tests.push(file);
		}
	}
}

require.config({
	// Karma serves files from '/base', maybe requires a change?
	baseUrl: "/Oskari/", // the base is set to requirejs lib to help requiring 3rd party libs
	paths: { // some path shortcuts to ease declarations
		oskari: "src/oskari/oskari-with-app",
		"oskari-with-app": "src/oskari/oskari-with-app",
		"oskari-with-loader": "src/oskari/oskari-with-loader",
		jquery: "http://code.jquery.com/jquery-1.9.1",
		"jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
		css: "libraries/requirejs/lib/css",
		json: "libraries/requirejs/lib/json",
		domReady: "libraries/requirejs/lib/domReady",
		text: "libraries/requirejs/lib/text",
		normalize: "libraries/requirejs/lib/normalize"
	},
	map: {
		// '*' means all modules will get 'jquery-private'
		// for their 'jquery' dependency.
		"*": {
			"jquery": "jquery-migrate",
			"map": "src/oskari/bundle/map-leaflet/module",
			"mapmodule-plugin": "src/leaflet/bundle/mapmodule-plugin/module",
			"mapfull": "src/leaflet/bundle/mapfull/module",
			"oskari": "oskari-with-app"
		},

		// 'jquery-private' wants the real jQuery module
		// though. If this line was not here, there would
		// be an unresolvable cyclic dependency.
		"jquery-migrate": {
			"jquery": "jquery"
		}
	},
	shim: {
		"oskari": {
			exports: "Oskari"
		},
		"jquery": {
			exports: "jQuery"
		}
	},
	// ask Require.js to load these files (all our tests)
	deps: tests,
	config: {
		i18n: {
			locale: 'fi'
		}
	},
	urlArgs: ("timestamp=" + (new Date()).getTime()),
	// start test run, once Require.js is done
	callback: window.__karma__.start,
	waitSeconds: 30
});