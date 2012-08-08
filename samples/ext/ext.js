/**
 * @class Oskari.framework.core-base.Sample
 */

/**
 * Hacks
 */
var debug_injectScriptElement = Ext.Loader.injectScriptElement;
var debug_files = []
var debug_classes = []
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
/*
Ext.Loader.setConfig( {
	enabled : true,
	paths : {
		'Ext' : '../../../sencha/ext-4.1.0-beta-2/src',
		'Ext.ux' : '../../../sencha/ext-4.1.0-beta-2/examples/ux',
		'Ext.app' : '../../../sencha/ext-4.1.0-beta-2/examples/portal/classes'
	}
});
*/

Oskari.clazz
		.define(
				'Oskari.framework.Ext',
				function() {

				},
				{

					/**
					 * @method start
					 * 
					 */
					start : function() {

						Oskari.setLoaderMode('dev');
						Oskari.setSupportBundleAsync(false);

						var def = {
							title : 'Ext',
							fi : 'Ext',
							sv : '?',
							en : 'Ext',
							bundlename : 'extstartup',
							bundleinstancename : 'extstartup',
							metadata : {
								"Import-Bundle" : {
									/** core of core * */
									"quickie" : {
										bundlePath : 'bundle/'
									},
									/** core map * */
									"extstartup" : {
										bundlePath : 'bundle/'
									},
									"yui" : {
										bundlePath : '../tools/bundle/'
									}
								},

								/**
								 * A list of bundles to be started
								 */
								"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};

						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade
								.playBundle(
										def,
										function() {

											/**
											 * now we're ready to do something
											 * with the core
											 */

											/**
											 * Core isn't really a core at all
											 * It requires some services, a
											 * bunch of events, requests, user
											 * interface manager of some kind
											 * 
											 */

											if (Oskari.getLoaderMode() == 'dev') {
												var cmp = Oskari.clazz
														.create('Oskari.tools.Yui');

												cmp.setExcludeTags( {});

												var cmd = cmp
														.yui_command_line_for_app('%YUICOMPRESSOR%');

												document
														.write('<body><pre style="font: 9pt Verdana;">' + cmd + '</pre></body>');
											} else {
												document
														.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with ' + Oskari
																.getLoaderMode() + '</pre></body>');
											}

										});
					}
				});

Ext.onReady(function() {
	Oskari.clazz.create('Oskari.framework.Ext').start();
});
