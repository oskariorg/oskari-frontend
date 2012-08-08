(function() {
	var isDev = false;

	Oskari.clazz.define('Oskari.framework.oskari.Candy1', function() {

	}, {

		/**
		 *
		 */

		/**
		 * @method start
		 *
		 */
		start : function() {

			Oskari.setLang('fi');
			Oskari.setLoaderMode('yui');
			var me = this;

			/** use sample bundle to fire the engine * */
			var appSetup = this.appSetup;
			var app = Oskari.app;

			app.setApplicationSetup(appSetup);
			app.setConfiguration(appSetup.configuration);

			app.startApplication(function(startupInfos) {
				me.instance = startupInfos.bundlesInstanceInfos['candy1'].bundleInstance;
				var sandbox = me.instance.getSandbox();
				if(!isDev) {
					sandbox.disableDebug();
					sandbox._core.disableDebug();
				}
			});
		},
		/**
		 *
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
				"candy1" : {
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
						},  {
							"id" : "Oskari.mapframework.mapmodule.ControlsPlugin"
						},  {
							"id" : "Oskari.mapframework.mapmodule.GetInfoPlugin"
						}, 
						{
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

			startupSequence : [
			/* openlayers */

			{
				callback : function() {
					if(isDev)
						Oskari.setLoaderMode('dev');
				},
				title : 'OpenLayers with Proj4',
				fi : 'OpenLayers with Proj4',
				sv : '?',
				en : 'OpenLayers with Proj4',
				bundlename : 'openlayers-map',
				bundleinstancename : 'openlayers-map',
				metadata : {
					"Import-Bundle" : {
						"openlayers-map" : {
							bundlePath : '../../packages/openlayers/bundle/'
						},
						"openlayers-default-theme" : {
							bundlePath : '../../packages/openlayers/bundle/'
						}
					},
					/**
					 * A list of bundles to be started
					 */
					"Require-Bundle-Instance" : ['openlayers-default-theme']
				}
			},
			/*
			 * app
			 */
			{
				title : 'Map',
				fi : 'Map',
				sv : '?',
				en : 'Map',
				bundlename : 'candy1',
				bundleinstancename : 'candy1',
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
						"mapmodule-plugin" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"domain" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"runtime" : {
							bundlePath : '../../packages/framework/bundle/'
						},
						"layers" : {
							bundlePath : 'bundle/'
						},
						"yui" : {
							bundlePath : '../../packages/tools/bundle/'
						},

						"mapwmts" : {
							bundlePath : '../../packages/framework/bundle/'
						},

						"candy1" : {
							bundlePath : 'bundle/'
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

	Oskari.clazz.create('Oskari.framework.oskari.Candy1').start();
})();
