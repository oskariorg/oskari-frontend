/**
 * @class Oskari.karttatiili.Main
 *
 * Launcher Class for a sample featuring yuilibrary.js and 960 layout
 *
 * /poc/yuilibrary/index.html?oskariLoaderMode=yui&style=style1&zoomLevel=8&coord=528574_6759496&mapLayers=base_35+100+!default!,90+100+&showMarker=false&forceCache=true
 *
 * 
 * var layerId = xxx;
 * Oskari.$("sandbox").postRequestByName('MapModulePlugin.MapLayerUpdateRequest',[layerId, true]);
 * 
 */
Oskari.clazz.define('Oskari.karttatiili.default.Main', function() {

	this.args = null;
	this.styleBndl = null;
}, {

	processArgs : function(args) {
		this.args = args;
		this.styleBndl = args.style;
	},
	/**
	 *
	 */

	/**
	 * @method start
	 *
	 * starts the application with bundle definitions declared
	 * in property appSetup.startupSequence
	 */
	start : function() {

		var me = this;

		/** use sample bundle to fire the engine * */
		var appSetup = this.appSetup;
		var app = Oskari.app;

		app.setApplicationSetup(appSetup);

		app.startApplication(function(startupInfos) {

Oskari.clazz.category('Oskari.mapframework.wmts.service.WMTSLayerService', 'hacks', {
				/**
				 * This is a temporary solution actual capabilities to be
				 * read in backend
				 *
				 */
				readWMTSCapabilitesWithCb : function(wmtsName, capsPath, matrixSet, layerDefaults, callback) {

					var me = this;
					var formatClazz = this.capabilitiesClazz.getPatch();
					// Oskari.$("WMTSCapabilities_v1_0_0");
					var format = new formatClazz();
					// OpenLayers.Format.WMTSCapabilities();

					OpenLayers.Request.GET({
						url : capsPath,
						params : {
							SERVICE : "WMTS",
							VERSION : "1.0.0",
							REQUEST : "GetCapabilities"
						},
						success : function(request) {
							var doc = request.responseXML;
							if(!doc || !doc.documentElement) {
								doc = request.responseText;
							}
							var caps = format.read(doc);

							me.setCapabilities(wmtsName, caps);
							me.parseCapabilitiesToLayers(wmtsName, caps, matrixSet, layerDefaults || {});

							callback(true);

						},
						failure : function() {
							alert("Trouble getting capabilities doc");
							OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
							callback(false);
						}
					});

				}
			});

			me.instance = startupInfos.bundlesInstanceInfos['main'].bundleInstance;

			var wmtsService = me.instance.getWMTSService();

			var wmtsSources = {
				/*'sample' : {
					url : 'sample-wmts-caps.xml'
				},*/
				/*'sample' : {
					url : 'sample-wmts-caps-ortokuva.xml',
					layerDefaults : {
						orgName : "karttatiili.fi",
						inspire : "karttatiili.fi"
					}
				}*/
				'sample' : {
					url : 'oof-sample-wmts-caps.xml',
					layerDefaults : {
						orgName : "viljonkkake01.nls.fi",
						inspire : "viljonkkake01.nls.fi"
					}
				}
				
				/*	'yleiskarttarasteri' : {
				 url : '/dataset/yleiskarttarasteri/service/wmts',
					layerDefaults : {
						orgName : "karttatiili.fi",
						inspire : "karttatiili.fi"
					}
				 },
				 'peruskarttarasteri' : {
				 url : '/dataset/peruskarttarasteri/service/wmts',
					layerDefaults : {
						orgName : "karttatiili.fi - peruskarttarasteri",
						inspire : "karttatiili.fi"
					}
				 },
				 'maastokarttarasteri' : {
				 url : '/dataset/maastokarttarasteri/service/wmts',
					layerDefaults : {
						orgName : "karttatiili.fi - maastokarttarasteri",
						inspire : "karttatiili.fi"
					}
				 },
				 'taustakarttarasteri' : {
				 url : '/dataset/taustakarttarasteri/service/wmts',
					layerDefaults : {
						orgName : "karttatiili.fi - taustakarttarasteri",
						inspire : "karttatiili.fi"
					}
				 },
				 'ortoilmakuva' : {
				 url : '/dataset/ortoilmakuva/service/wmts',
					layerDefaults : {
						orgName : "karttatiili.fi - ortoilmakuva",
						inspire : "karttatiili.fi"
					}
				 }
				 */
			};

			for(wmtsdatasetid in wmtsSources ) {
				var wmtsdataset = wmtsSources[wmtsdatasetid];

				wmtsService.readWMTSCapabilitesWithCb(wmtsdatasetid, wmtsdataset.url, "EPSG_3067_MML",wmtsdataset.layerDefaults,
				function(){
					me.instance.enhance();
				});
			}

		});
	},
	/**
	 * @static
	 * @property appSetup.startupSequence
	 *
	 */
	appSetup : {

		startupSequence : [

		/* openlayers */
		{

			callback : function() {
				/*Oskari.setLoaderMode('dev');*/
			},
			title : 'OpenLayers',
			fi : 'OpenLayers',
			sv : '?',
			en : 'OpenLayers',
			bundlename : 'openlayers-default-theme',
			bundleinstancename : 'openlayers-default-theme',
			metadata : {
				"Import-Bundle" : {
					"openlayers-default" : {
						bundlePath : '../../samples/openlayers/bundle/'
					},
					"openlayers-default-theme" : {
						bundlePath : '../../samples/openlayers/bundle/'
					}
					/*
					 * , "style" : { bundlePath : 'bundle/' }
					 */

				},

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : []

			},
			instanceProps : {

			}
		},

		/*
		 *
		 * app
		 */
		{			
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'main',
			bundleinstancename : 'main',
			metadata : {
				"Import-Bundle" : {
					"core-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"core-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"sandbox-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"sandbox-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"event-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"event-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"event-map-layer" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"request-map-layer" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"service-base" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"service-map" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"common" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"domain" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"runtime" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapwmts" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"mapmodule-plugin" : {
						bundlePath : '../../packages/framework/bundle/'
					},
					"layers" : {
						bundlePath : '../../applications/karttatiili.fi-default/bundle/'
					},
					"main" : {
						bundlePath : '../../applications/karttatiili.fi-default/bundle/'
					},
					"yui" : {
						bundlePath : '../../packages/tools/bundle/'
					},
					"layerhandler" : {
						bundlePath : '../../packages/framework/bundle/'
					}

				},

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : []

			},
			instanceProps : {

			}
		}]
	}

});

$(document).ready(function() {
	$.easing.cubicIn = function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	}
	var args = {
		oskariLoaderMode : 'yui'
	};
	

	if(args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else

		Oskari.setLoaderMode('yui');
	if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	var main = Oskari.clazz.create('Oskari.karttatiili.default.Main');
	main.processArgs(args);
	main.start();

});
