/**
 * @class Oskari.framework.core-base.Sample
 */
Oskari.clazz.define('Oskari.framework.all.Sample', function() {

}, {

	/**
	 * @method start
	 *
	 */
	start : function() {
		if(location.search.length > 1) {
			Oskari.setLoaderMode(location.search.substring(1));
		}

		var def = {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'startup',
			bundleinstancename : 'startup',
			metadata : {
				"Import-Bundle" : {

					"common" : {
						bundlePath : "bundle/",
					},
					"coordinatedisplay" : {
						bundlePath : "bundle/",
					},
					"core-base" : {
						bundlePath : "bundle/",
					},
					"core-map" : {
						bundlePath : "bundle/",
					},
					"core-map-full" : {
						bundlePath : "bundle/",
					},
					"divmanazer" : {
						bundlePath : "bundle/",
					},
					"domain" : {
						bundlePath : "bundle/",
					},
					"event-base" : {
						bundlePath : "bundle/",
					},
					"event-map" : {
						bundlePath : "bundle/",
					},
					"event-map-full" : {
						bundlePath : "bundle/",
					},
					"event-map-layer" : {
						bundlePath : "bundle/",
					},
					"infobox" : {
						bundlePath : "bundle/",
					},
					"layerhandler" : {
						bundlePath : "bundle/",
					},
					"layerselection" : {
						bundlePath : "bundle/",
					},
					"layerselection2" : {
						bundlePath : "bundle/",
					},
					"layerselector" : {
						bundlePath : "bundle/",
					},
					"layerselector2" : {
						bundlePath : "bundle/",
					},
					"mapasker" : {
						bundlePath : "bundle/",
					},
					"mapcontrols" : {
						bundlePath : "bundle/",
					},
					"mapfull" : {
						bundlePath : "bundle/",
					},
					"mapmodule-core" : {
						bundlePath : "bundle/",
					},
					"mapmodule-plugin" : {
						bundlePath : "bundle/",
					},
					"mapoverlaypopup" : {
						bundlePath : "bundle/",
					},
					"mapposition" : {
						bundlePath : "bundle/",
					},
					"mapprint" : {
						bundlePath : "bundle/",
					},
					"mappublished" : {
						bundlePath : "bundle/",
					},
					"mapster" : {
						bundlePath : "bundle/",
					},
					"mapwmts" : {
						bundlePath : "bundle/",
					},
					"myplaces" : {
						bundlePath : "bundle/",
					},
					"myviews" : {
						bundlePath : "bundle/",
					},
					"personaldata" : {
						bundlePath : "bundle/",
					},
					"publisher" : {
						bundlePath : "bundle/",
					},
					"request-base" : {
						bundlePath : "bundle/",
					},
					"request-map" : {
						bundlePath : "bundle/",
					},
					"request-map-full" : {
						bundlePath : "bundle/",
					},
					"request-map-layer" : {
						bundlePath : "bundle/",
					},
					"runtime" : {
						bundlePath : "bundle/",
					},
					"sandbox-base" : {
						bundlePath : "bundle/",
					},
					"sandbox-map" : {
						bundlePath : "bundle/",
					},
					"search" : {
						bundlePath : "bundle/",
					},
					"searchservice" : {
						bundlePath : "bundle/",
					},
					"service-base" : {
						bundlePath : "bundle/",
					},
					"service-map" : {
						bundlePath : "bundle/",
					},
					"service-map-full" : {
						bundlePath : "bundle/",
					},
					"startup" : {
						bundlePath : "bundle/",
					},
					"statehandler" : {
						bundlePath : "bundle/",
					},
					"toolbar" : {
						bundlePath : "bundle/",
					},
					"userguide" : {
						bundlePath : "bundle/",
					},
					"yui" : {
						bundlePath : "../tools/bundle/",
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
		Oskari.bundle_facade.playBundle(def, function() {

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
			if(Oskari.getLoaderMode() == 'dev') {
				var cmp = Oskari.clazz.create('Oskari.tools.Yui');

				cmp.setExcludeTags({});

				var cmd = cmp.yui_command_line_for_app('%YUICOMPRESSOR%');

				document.write('<body><pre style="font: 9pt Verdana;">' + cmd + '</pre></body>');
			} else {
				document.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with ' + Oskari.getLoaderMode() + '</pre></body>');
			}

		});
	}
});

Oskari.clazz.create('Oskari.framework.all.Sample').start();
