/**
 * @class Oskari.poc.oskari.Main
 *
 * Launcher Class for a sample featuring dojo.js and 960 layout
 *
 * /poc/dojo/index.html?oskariLoaderMode=yui&style=style1&zoomLevel=8&coord=528574_6759496&mapLayers=base_35+100+!default!,90+100+&showMarker=false&forceCache=true
 *
 */
(function() {

	/**
	 * Set This to true to load file by file and output debug messages
	 */
	var isDev = true;


	/**
	 * Let's declare Main for this application
	 */
	Oskari.clazz.define('Oskari.paikkatietohakemisto.Main', function() {

		this.args = null;
		this.styleBndl = null;
	}, {

		/**
		 * @method processArgs
		 *
		 * applies page args to this instance
		 */
		processArgs : function(args) {
			this.args = args;
			this.styleBndl = args.style;
		},
		/**
		 * @method start
		 *
		 * starts the application with bundle definitions declared
		 * in property appSetup.startupSequence
		 */
		start : function(cb) {

			var me = this;

			/** use sample bundle to fire the engine * */
			var appSetup = this.appSetup;
			var app = Oskari.app;

			/* me.applyStyle(appSetup,'ui'); */

			app.setApplicationSetup(appSetup);
			app.setConfiguration(appSetup.configuration);
			app.startApplication(function(startupInfos) {
				me.instance = startupInfos.bundlesInstanceInfos['mapfull'].bundleInstance;
				cb(me.instance, startupInfos.bundlesInstanceInfos['metadataflyout'].bundleInstance);
			});
		},
		/**
		 * @static
		 * @property appSetup.startupSequence
		 * 
		 * This is the startup setup with both application configuration and bundle startup sequences
		 *
		 */
		appSetup : {

			"configuration" : {
				"toolbar" : {
					"state" : {},
					"conf" : {}
				},
				"layerselection2" : {
					"state" : {},
					"conf" : {}
				},
				"search" : {
					"state" : {},
					"conf" : {}
				},
				"openlayers-default-theme" : {
					"state" : {},
					"conf" : {}
				},
				"statehandler" : {
					"state" : {},
					"conf" : {}
				},
				"divmanazer" : {
					"state" : {},
					"conf" : {}
				},
				"layerselector2" : {
					"state" : {},
					"conf" : {}
				},
				"infobox" : {
					"state" : {},
					"conf" : {}
				},
				"publisher" : {
					"state" : {},
					"conf" : {}
				},
				"personaldata" : {
					"state" : {},
					"conf" : {
						"url_changePassword" : "http://www.yle.fi",
						"url_changeInfo" : "http://www.paikkatietoikkuna.fi/web/fi/",
						"url_removeAccount" : "http://www.google.fi"
					}
				},
				"coordinatedisplay" : {
					"state" : {},
					"conf" : {}
				},
				"mapfull" : {
					"state" : {
						"selectedLayers" : [{
							"id" : "base_35"
						}],
						"zoom" : 1,
						"north" : "6874042",
						"east" : "517620"
					},
					"conf" : {
						"globalMapAjaxUrl" : /*"/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&",*/
						"layers.json?",
						"printWindowWidth" : 640,
						"printUrl" : "../print/print.html",
						"plugins" : [{
							"id" : "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.WmsLayerPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.MarkersPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.TilesGridPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.ControlsPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.WfsLayerPlugin"
						}, {
							"id" : "Oskari.mapframework.mapmodule.GetInfoPlugin"
						}, {
							"id" : "Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin"
						}, {
							"id" : "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
						}, {
							"id" : "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
						}, {
							"id" : "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"
						}],
						"layers" : [{
							"styles" : {},
							"type" : "base",
							"orgName" : "Taustakartta",
							"baseLayerId" : 35,
							"formats" : {},
							"isQueryable" : false,
							"id" : "base_35",
							"minScale" : 1.5E7,
							"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							"name" : "Taustakartta",
							"permissions" : {
								"publish" : "no_publication_permission"
							},
							"subLayer" : [{
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_5k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 184,
								"minScale" : 5000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 21,
								"name" : "Taustakartta 1:5000",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 1
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_10k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 185,
								"minScale" : 20000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 22,
								"name" : "Taustakartta 1:10k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 5001
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_20k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 186,
								"minScale" : 54000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 23,
								"name" : "Taustakartta 1:20k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 21000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_40k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 187,
								"minScale" : 133000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 24,
								"name" : "Taustakartta 1:40k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 55000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_80k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 188,
								"minScale" : 180000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 25,
								"name" : "Taustakartta 1:80k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 180000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_160k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 189,
								"minScale" : 250000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 26,
								"name" : "Taustakartta 1:160k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 133000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_320k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 190,
								"minScale" : 350000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 27,
								"name" : "Taustakartta 1:320k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 250000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_800k",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 191,
								"minScale" : 800000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 28,
								"name" : "Taustakartta 1:800k",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 351000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_2m",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 192,
								"minScale" : 2000000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 29,
								"name" : "Taustakartta 1:2milj",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 801000
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_4m",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 193,
								"minScale" : 4000000,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 30,
								"name" : "Taustakartta 1:4milj",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 2000001
							}, {
								"dataUrl_uuid" : "c22da116-5095-4878-bb04-dd7db3a1a341",
								"wmsName" : "taustakartta_8m",
								"styles" : {},
								"descriptionLink" : "",
								"baseLayerId" : 35,
								"orgName" : "Taustakartta",
								"type" : "wmslayer",
								"legendImage" : "",
								"formats" : {},
								"isQueryable" : false,
								"id" : 194,
								"minScale" : 1.5E7,
								"dataUrl" : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
								"style" : "",
								"wmsUrl" : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
								"orderNumber" : 31,
								"name" : "Taustakartta 1:8milj",
								"permissions" : {
									"publish" : "no_publication_permission"
								},
								"opacity" : 100,
								"inspire" : "Opaskartat",
								"maxScale" : 4000001
							}],
							"inspire" : "Taustakartta",
							"maxScale" : 1
						}],
						"imageLocation" : "../../resources",
						"user" : {
							"lastName" : "",
							"nickName" : "10110",
							"firstName" : "",
							"loginName" : "default@maanmittauslaitos.fi"
						},
						"printWindowHeight" : 672
					}
				}
			},
			"startupSequence" : [{
				"instanceProps" : {},
				"title" : "OpenLayers",
				"bundleinstancename" : "openlayers-default-theme",
				"fi" : "OpenLayers",
				/* enable / disable development mode here */
				"callback" : function() {
					if(isDev)
						Oskari.setLoaderMode('dev');
				},
				"sv" : "?",
				"en" : "OpenLayers",
				"bundlename" : "openlayers-default-theme",
				"metadata" : {
					"Import-Bundle" : {
						"openlayers-default-theme" : {
							"bundlePath" : "../../packages/openlayers/bundle/"
						},
						"openlayers-map-full" : {
							"bundlePath" : "../../packages/openlayers/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Map",
				"bundleinstancename" : "mapfull",
				"fi" : "Map",
				"sv" : "?",
				"en" : "Map",
				"bundlename" : "mapfull",
				"metadata" : {
					"Import-Bundle" : {
						"service-map-full" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"mapwmts" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"service-base" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"common" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"event-map-layer" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"runtime" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"request-map-layer" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"mapmodule-plugin" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"event-base" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"mapfull" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"core-base" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"request-base" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"domain" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"core-map" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"request-map" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"sandbox-base" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"service-map" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"sandbox-map" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"event-map" : {
							"bundlePath" : "../../packages/framework/bundle/"
						},
						"yui" : {
							bundlePath : '../../packages/tools/bundle/'
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Oskari DIV Manazer",
				"bundleinstancename" : "divmanazer",
				"fi" : "Oskari DIV Manazer",
				"sv" : "?",
				"en" : "Oskari DIV Manazer",
				"bundlename" : "divmanazer",
				"metadata" : {
					"Import-Bundle" : {
						"divmanazer" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Toolbar",
				"bundleinstancename" : "toolbar",
				"fi" : "toolbar",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "toolbar",
				"metadata" : {
					"Import-Bundle" : {
						"toolbar" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "StateHandler",
				"bundleinstancename" : "statehandler",
				"fi" : "jquery",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "statehandler",
				"metadata" : {
					"Import-Bundle" : {
						"statehandler" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Koordinaattinäyttö",
				"bundleinstancename" : "coordinatedisplay",
				"fi" : "coordinatedisplay",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "coordinatedisplay",
				"metadata" : {
					"Import-Bundle" : {
						"coordinatedisplay" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, /* {
			 "instanceProps" : {},
			 "title" : "Omat tiedot",
			 "bundleinstancename" : "personaldata",
			 "fi" : "personaldata",
			 "sv" : "?",
			 "en" : "?",
			 "bundlename" : "personaldata",
			 "metadata" : {
			 "Import-Bundle" : {
			 "personaldata" : {
			 "bundlePath" : "../../packages/framework/bundle/"
			 }
			 },
			 "Require-Bundle-Instance" : []
			 }
			 },*/
			{
				"instanceProps" : {},
				"title" : "Haku",
				"bundleinstancename" : "search",
				"fi" : "search",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "search",
				"metadata" : {
					"Import-Bundle" : {
						"search" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Valitut karttatasot",
				"bundleinstancename" : "layerselection2",
				"fi" : "layerselection",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "layerselection2",
				"metadata" : {
					"Import-Bundle" : {
						"layerselection2" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				"instanceProps" : {},
				"title" : "Karttatasot",
				"bundleinstancename" : "layerselector2",
				"fi" : "layerselector",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "layerselector2",
				"metadata" : {
					"Import-Bundle" : {
						"layerselector2" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}/*,  {
			 "instanceProps" : {},
			 "title" : "Karttajulkaisu",
			 "bundleinstancename" : "publisher",
			 "fi" : "jquery",
			 "sv" : "?",
			 "en" : "?",
			 "bundlename" : "publisher",
			 "metadata" : {
			 "Import-Bundle" : {
			 "publisher" : {
			 "bundlePath" : "../../packages/framework/bundle/"
			 }
			 },
			 "Require-Bundle-Instance" : []
			 }
			 }*/, {
				"instanceProps" : {},
				"title" : "Info Box",
				"bundleinstancename" : "infobox",
				"fi" : "infobox",
				"sv" : "?",
				"en" : "?",
				"bundlename" : "infobox",
				"metadata" : {
					"Import-Bundle" : {
						"infobox" : {
							"bundlePath" : "../../packages/framework/bundle/"
						}
					},
					"Require-Bundle-Instance" : []
				}
			}, {
				title : 'Metadata',
				fi : 'Metatieto',
				sv : 'Metadata',
				en : 'Metadata',
				bundlename : 'metadataflyout',
				bundleinstancename : 'metadataflyout',
				metadata : {
					"Import-Bundle" : {
						"metadataflyout" : {
							bundlePath : '../../packages/catalogue/bundle/'
						}
					},
					"Require-Bundle-Instance" : []
				},
				instanceProps : {}
			}, {
				title : 'User Guide',
				fi : 'Ohje',
				sv : 'Guide',
				en : 'User Guide',
				bundlename : 'userguide',
				bundleinstancename : 'userguide',
				metadata : {
					"Import-Bundle" : {
						"userguide" : {
							bundlePath : '../../packages/framework/bundle/'
						}
					},
					"Require-Bundle-Instance" : []
				},
				instanceProps : {}
			}]
		}

	});

	/**
	 * Demo only
	 */
	Oskari.clazz.category('Oskari.paikkatietohakemisto.Main', 'demo', {
		setupMainNavigation : function() {
			// Loop through flyout menu columns on hover
			// Apply height of the tallest column for all
			// Easing functions

			$.easing.cubicIn = function(x, t, b, c, d) {
				return c * (t /= d) * t * t + b;
			}
			$.easing.cubicOut = function(x, t, b, c, d) {
				return c * (( t = t / d - 1) * t * t + 1) + b;
			}
			$.easing.cubicInOut = function(x, t, b, c, d) {
				if((t /= d / 2) < 1)
					return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
			isMoving = false;

			$('.clearbutton').click(function() {
				$(this).prev().val('');
			});
			/* $('.sidebar-toggle').hover(menubarEnter,menubarExit); */

			$('.sidebar-toggle').click(menubarToggle);

			var tgl = false;
			function menubarToggle() {
				if(!tgl)
					menubarEnter();
			}


			$('.sidebar-toggle').hover(function() {
			}, menubarExit);
			function menubarEnter() {
				isMoving = true;
				showNavigationElements();
				$('#sidebar').animate({
					left : '0'
				}, 400, 'cubicOut', function() {
					endMove()
				});
				$('#maptools').animate({
					left : '53px'
				}, 300, 'cubicOut');
			}

			function menubarExit() {
				if(!isMoving) {
					isMoving = true;
					$('#sidebar').animate({
						left : '-160px'
					}, 300, 'cubicIn', function() {
						hideNavigationElements()
					});
					$('#maptools').animate({
						left : '40px'
					}, 300, 'cubicIn');
				}
			}

			function endMove() {
				isMoving = false;
			}

			function showNavigationElements() {
				$('#mainmenu, #searchform, #lang, #logo').css('display', 'block');
				$('#logo-only').css('display', 'none');
			}

			function hideNavigationElements() {
				$('#mainmenu, #searchform, #lang, #logo').css('display', 'none');
				$('#logo-only').css('display', 'block');
				endMove();
			}


			$('.mainlevel').hover(function() {
				var columns = $(this).find('.sublevel-1');
				var tallest = 0;

				$(columns).each(function(intIndex) {
					if($(this).height() < tallest) {
						$(this).css('height', tallest + 'px');
					} else
						tallest = $(this).height();
				});
			}, function() {
			});
		}
	});

	jQuery(document).ready(function() {

		var args = {
			oskariLoaderMode : 'yui',
			style : 'style1'
		};

		Oskari.setLang('fi');

		if(args.oskariLoaderMode)
			Oskari.setLoaderMode(args.oskariLoaderMode);
		else
			Oskari.setLoaderMode('yui');

		if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
			Oskari.setSupportBundleAsync(true);
		}

		var main = Oskari.clazz.create('Oskari.paikkatietohakemisto.Main');
		main.processArgs(args);
		main.start(function(instance, metadataflyoutInstance) {
			var sandbox = metadataflyoutInstance.getSandbox();

			if(!isDev) {
				sandbox.disableDebug();
				sandbox._core.disableDebug();

			}

			metadataflyoutInstance.loader.dev = true;

			sandbox.postRequestByName('catalogue.ShowMetadataRequest', [{
				uuid : '07dec67a-54a0-42f6-88d1-4198d9d526bf'
			}]);

			/*sandbox.postRequestByName('userguide.ShowUserGuideRequest', [{
			 extension: 'userinterface.UserGuide',
			 context : '#07dec67a-54a0-42f6-88d1-4198d9d526bf'
			 }]);*/
		});

		main.setupMainNavigation();

	});
})();
