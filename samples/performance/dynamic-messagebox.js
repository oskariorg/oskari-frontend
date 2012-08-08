/*Ext.require( [ '*' ]);
 */



/**
 * Hacks
 */
var debug_injectScriptElement = Ext.Loader.injectScriptElement;
var debug_files = [];
var debug_classes = [];
var debug_extras = {};
Ext.Loader.injectScriptElement = function() {

	debug_files.push( {
		"context" : "inject",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_injectScriptElement.apply(Ext.Loader, arguments);
};

var debug_require = Ext.Loader.require;

Ext.Loader.require = function(expressions, fn, scope, excludes) {
	debug_classes.push( {
		require : expressions
	});
	console.log("REQUIRE", expressions);
	return debug_require.apply(Ext.Loader, arguments);
}
Ext.require = Ext.Loader.require;

var debug_triggerCreated = Ext.ClassManager.triggerCreated;

Ext.ClassManager.triggerCreated = function(className) {
	debug_classes.push( {
		created : className
	});
	console.log("CREATED", className);
	return debug_triggerCreated.apply(Ext.ClassManager, arguments);
}

var debug_loadScriptFile = Ext.Loader.loadScriptFile;

Ext.Loader.loadScriptFile = function(url, onLoad, onError, scope, synchronous) {
	console.log("LOADING", url);
	debug_files.push( {
		"context" : "loadCall",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_loadScriptFile.apply(Ext.Loader, arguments);
}

Oskari.debug_stats = function() {
	var count = 0;
	for ( var n = 0, len = debug_files.length; n < len; n++) {
		var itm = debug_files[n];

		if (itm.context == 'loadCall')
			count++;
	}

	var count_created = 0;
	var count_requires = 0;
	var count_extras = 0;

	var createdClasses = {};
	var requiredClasses = {};
	var extraClasses = {};

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created) {
			count_created++;
			createdClasses[itm.created] = true;
		}
		if (itm.require) {

			for ( var i = 0; i < itm.require.length; i++) {
				var req = itm.require[i];
				if (requiredClasses[req])
					continue;
				requiredClasses[req] = true;
				count_requires++;
			}

		}
	}

	for (e in debug_extras) {
		if (requiredClasses[e])
			continue;
		extraClasses[e] = true;
		count_extras++;
	}

	console.log("================== Loaded " + count + " files");
	console.log("================== Created " + count_created + " classes");
	console
			.log("================== Resolved Required Classes"
					+ count_requires);
	console.log("================== Created Unreferenced Classes"
			+ count_extras);

	var clsssForInclusion = [];
	var clsssForExclusion = [];

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created)
			clsssForInclusion.push(itm.created);
	}
	for (e in extraClasses) {
		clsssForExclusion.push(e);
	}
	return {
		include : clsssForInclusion,
		exclude : clsssForExclusion,
		createdClasses: createdClasses,
		requiredClasses: requiredClasses,
		extraClasses: extraClasses
		
	};
}


/*
*
*/

/**
 * 
 */
Ext.Loader.setConfig( {
	enabled : true,
	paths : {
		'Ext' : '../../../sencha/ext-4.1.0-beta-2/src',
		'Ext.ux' : '../../../sencha/ext-4.1.0-beta-2/examples/ux',
		'Ext.app' : '../../../sencha/ext-4.1.0-beta-2/examples/portal/classes'
	}
});

Ext.require('Ext.window.MessageBox');

Ext.onReady(function() {

	var args = null;
	if (location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if (args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');
	if (args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}




		Ext.MessageBox.show( {
			title : 'Oskari Clazz Zystem',
			msg : '...',
			progressText : '...',
			width : 300,
			progress : true,
			closable : true,
			icon : 'logo',
			modal : true
		});
	
		Oskari.debug_stats();

});