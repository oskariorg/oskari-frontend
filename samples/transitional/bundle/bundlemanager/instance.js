
/**
 * @class Oskari.mapframework.bundle.BundleManagerInstance
 * 
 * Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.BundleManagerInstance",
		function(b) {

			this.name = 'bundlemanagerModule';

			this.mediator = null;
			this.sandbox = null;

			this.layerId = null;
			this.layer = null;

			this.ui = null;
			
			this.bundles = {};
			this.bundleInstances = {};

		},

		/*
		 * prototype
		 */
		{
			/*
			 * @method getStore
			 */
			getStore : function() {
				return this.store;
			},

			
			/**
			 * @method getUI
			 */
			getUI: function() {
				return this.ui;
			},
			
			/**
			 * @method playBundle
			 * 
			 * plays a bundle and !tries! to load any bundle and
			 * instance dependencies.
			 * 
			 * Work in Progress
			 * 
			 * 
			 */
			playBundle : function(rec) {
				// alert(bundleRec.get('title'));
				var recMetadata = rec.get('metadata');
				var bundlename = rec.get('bundlename');
				var bundleinstancename = rec.get('bundleinstancename');
				var fcd = Oskari.bundle_facade;
				
				var def = {
						title : bundleinstancename,
						fi : bundleinstancename,
						sv : '?',
						en : bundleinstancename,
						bundlename : bundlename,
						bundleinstancename : bundleinstancename,
						metadata: recMetadata
				};
				
				fcd.playBundle(def,function() { 
					
				});
			},
			
			/*
			 * @method pauseBundle
			 * NYI
			 * 
			 */
			pauseBundle: function(bundleRec) {
				
			},
			/*
			 * @method resumeBundle
			 * NYI
			 * 
			 */
			resumeBundle: function(bundleRec) {
				
			},
			/*
			 * @method stopBundle
			 * NYI
			 * 
			 */
			stopBundle: function(bundleRec) {
				
			},


			/**
			 * @method clear
			 */
			clear : function() {
				this.store.clearData();
				this.store.destroyStore();
				this.store = null;
			},

			/**
			 * @method start
			 * 
			 * start bundle instance
			 * 
			 */
			"start" : function() {

				if (this.mediator.getState() == "started")
					return;

				/**
				 * These should be SET BY Manifest begin
				 */
				this.libs = {
					ext : Oskari.$("Ext")
				};
				this.facade = Oskari.$('UI.facade');
				/**
				 * These should be SET BY Manifest end
				 */

				/*
				 * projection support
				 */
				this.projs = {
					"EPSG:4326" : new Proj4js.Proj("EPSG:4326"),
					"EPSG:3067" : new Proj4js.Proj("EPSG:3067")
				};

				/**
				 * data model
				 */
				var xt = this.libs.ext;

				var me = this;

				this.createModels();
				this.createStores();

				var me = this;

				/**
				 * throttled func
				 */

				this.func = xt.Function.createThrottled(function(n, e) {
					this.processQuery(n, e);
				}, 1000, me);

				/**
				 * register to framework and eventHandlers
				 */
				var def = this.facade.appendExtensionModule(this, this.name,
						this.eventHandlers, this, 'E', {
							'fi' : {
								title : ' bundlemanager'
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : ' bundlemanager'
							}

						});
				this.def = def;

				this.mediator.setState("started");
				return this;
			},
			
			/**
			 * @method getStore
			 */
			getStore: function() {
				return this.store;
			},

			/**
			 * @method createModesl
			 */
			createModels : function() {
				var xt = this.libs.ext;
				var me = this;

				if (!xt.ClassManager.get('Bundle')) {
					xt.define('Bundle', {
						extend : 'Ext.data.Model',
						fields : [ "title", "fi", "en", "sv", "bundlename",
								"bundleinstancename", "metadata" ]
					});
				}
			},

			/**
			 * @method createStores
			 */
			createStores : function() {

				var data = this.defaultBundleData;

				var xt = this.libs.ext;
				var me = this;
				var store = xt.create('Ext.data.Store', {
					model : 'Bundle',
					autoLoad : false,
					data : data,
					proxy : {
						type : 'memory',
						/*
						 * url :
						 * "http://api.geonames.org/findNearbybundlemanagerJSON",
						 * pageParam : null, startParam : null, limitParam :
						 * null,
						 */
						reader : {

							type : 'json',
							model : 'Bundle',
							root : 'bundles'
						}

					}
				});
				this.store = store;
			},

			/**
			 * @method init
			 * 
			 * init UI module called after start
			 */
			init : function(sandbox) {
				this.sandbox = sandbox;
				/*
				 * build UI
				 */

				var ui = Oskari.clazz.create(
						'Oskari.mapframework.bundle.BundleManagerUI',
						this.libs, this);
				var lang = sandbox.getLanguage();
				ui.setLang(lang);
				this.ui = ui;
				ui.setLibs(this.libs);
				ui.setStore(this.getStore());
				ui.create();

				return ui.get();
			},

			/**
			 * 
			 * @method update
			 * 
			 * notifications from bundle manager
			 */
			"update" : function(manager, b, bi, info) {
				manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
						+ info);
			},

			/**
			 * @method stop
			 * 
			 * stop bundle instance
			 * 
			 */
			"stop" : function() {

				this.facade.removeExtensionModule(this, this.name,
						this.eventHandlers, this, this.def);
				this.def = null;
				this.sandbox.printDebug("Clearing STORE etc");

				this.ui.clear();
				this.ui = null;
				this.clear();

				this.mediator.setState("stopped");

				return this;
			},

			/**
			 * @method onEvent
			 * 
			 * dispatches events to event handlers defined
			 * in hashmap 'eventHandlers'
			 * 
			 *  This receives only events registered to on startup
			 * 
			 */
			onEvent : function(event) {
				return this.eventHandlers[event.getName()].apply(this,
						[ event ]);
			},

			defaults : {
				minScale : 40000,
				maxScale : 1
			},

			/*
			 * @property eventHandlers
			 * eventHandlers to be bound to map framework
			 * 
			 */
			eventHandlers : {

			},

			/**
			 * 
			 */

			/**
			 * @method processResponse
			 * process bundlemanager JSON service response (in the future)
			 */
			processResponse : function(records) {
				var xt = this.libs.ext;
				var me = this;

			},

			/**
			 * @property defaultBundleData
			 */
			defaultBundleData : {
				bundles : [ /*{
					title : 'Terminal',
					fi : 'P\u00E4\u00E4te',
					sv : '?',
					en : '?',
					bundlename : 'terminal',
					bundleinstancename : 'terminal',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"terminal" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},*/ {
					title : 'Location Info',
					fi : 'Location Info',
					sv : '?',
					en : '?',
					bundlename : 'positioninfo',
					bundleinstancename : 'positioninfo',
					metadata : {
						
						"Import-Bundle" : {
							"positioninfo" : {
								bundlePath: "../complexbundle/bundle/"
							}
						}
					}
				},  {
					title : 'Wikipedia',
					fi : 'Wikipedia',
					sv : '?',
					en : 'Wikipedia',
					bundlename : 'wikipedia',
					bundleinstancename : 'wikipedia',
					metadata : {
						"Import-Bundle" : {
							"mapmodule" : {},
							"wikipedia" : {
								bundlePath: "../complexbundle/bundle/"
							},
							"mapoverlaypopup" : {},
							"layerhandler" : {}
						}
					}
				}, {
					title : 'Sade From Demo 3',
					fi : 'SADE Lomakedemo 3',
					sv : '?',
					en : 'SADE Form Demo 3',
					bundlename : 'sade3',
					bundleinstancename : 'sade3',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"sade3" : {
								bundlePath: "../example-bundles/bundle/"
							},
							"mapmodule" : {},
							"layerhandler" : {}
						},
						"Require-Bundle-Instance" : [
						]
					}
				},/* {
					title : 'Map Sideview',
					fi : 'Oheiskartta',
					sv : '?',
					en : 'Map Sideview',
					bundlename : 'overview',
					bundleinstancename : 'overview',
					metadata : {
						"Import-Bundle" : {
							"overview" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},*/
				{
					title : 'Trains GeoRSS',
					fi : 'Trains GeoRSS',
					sv : '?',
					en : 'Trains GeoRSS',
					bundlename : 'trains',
					bundleinstancename : 'trains',
					metadata : {
						"Import-Bundle" : {
							"mapmodule" : {},
							"layerhandler": {},
							"trains" : {
								bundlePath: "../complexbundle/bundle/"
							}
						},
						"Require-Bundle-Instance" : [
												]
				
					}
				}/*,{
					title : 'Grid Calc POC',
					fi : 'Grid Calc POC',
					sv : '?',
					en : 'Grid Calc POC',
					bundlename : 'gridcalc',
					bundleinstancename : 'gridcalc',
					metadata : {
						"Import-Bundle" : {
							"gridcalc" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				},{
					title : 'Minimal POC',
					fi : 'Minimal POC',
					sv : '?',
					en : 'Minimal POC',
					bundlename : 'minimal',
					bundleinstancename : 'minimal',
					metadata : {
						"Singleton": true,
						"Import-Bundle" : {
							"minimal" : {
								bundlePath: "../example-bundles/bundle/"
							}
						}
					}
				}*/  ]
			},

			getName : function() {
				return this.__name;
			},
			__name : "Oskari.mapframework.bundle.BundleManagerInstance"

		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance",
					"Oskari.mapframework.module.Module",
					"Oskari.mapframework.bundle.extension.Extension",
					"Oskari.mapframework.bundle.extension.EventListener" ]
		});
