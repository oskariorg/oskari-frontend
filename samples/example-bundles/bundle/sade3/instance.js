/* some temporary fixes end */

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.Sade3BundleInstance",
				function(b) {
					this.name = 'sade3';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					this.ui = null;

				},
				/*
				 * prototype
				 */
				{

					/**
					 * start bundle instance
					 * 
					 */
					defaults : {
						minScale : 40000,
						maxScale : 1

					},

					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						/** temporary * */
						this.libs = {
							ext : Oskari.$("Ext")
						};

						this.facade = Oskari.$('UI.facade');
						var sandbox = Oskari.$("sandbox");

						var def = this.facade.appendExtensionModule(this,
								this.name, this.eventHandlers, this, null, {
									'fi' : {
										title : 'Sade'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : 'Sade'
									}
								});
						this.def = def;

						this.adapt(sandbox);
						this.mediator.setState("started");
						return this;
					},

					"init" : function(sandbox) {
						return null;
					},

					getUserInterface: function() {
						return this.ui;
					},
					getApp: function() {
						return this.app;
					},
					
					/**
					 * a lot of hacks to embed 2009 app to framework
					 */
					adapt : function(sandbox) {

						var xt = this.libs.ext;

						var bundleInstance = this;

						var app = Oskari.clazz.create(
								'Oskari.poc.sade3.SadeApp', {});
						this.app = app;
						app.setSandbox(sandbox);

						var mediator = Oskari.clazz
								.create('Oskari.poc.sade3.Mediator');
						app.setMediator(mediator);

						var worker = Oskari.clazz
								.create(
										'Oskari.poc.sade3.SadeWorker',
										{
											urls : {

												KTJkiiWFS : "../../../wfs-dispatch/ktjkii-wfs/wfs",
												RakennustiedotWFS : "../../../wfs-dispatch/rahu/wfs",
												NimistoWFS : "../../../wfs-dispatch/nimisto/wfs",
												MaastoWFS : "../../../wfs-dispatch/maasto/wfs"

											/*
											 * KTJkiiWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/ktjkii-wfs/wfs",
											 * 
											 * RakennustiedotWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/rahu/wfs",
											 * 
											 * NimistoWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/nimisto/wfs",
											 * 
											 * MaastoWFS:
											 * "http://kiti01.nls.fi/wfs-dispatch/maasto/wfs"
											 * 
											 */

											}
										});

						var me = this;

						var lm = Oskari.clazz.create(
								'Oskari.poc.sade3.LayerManager', sandbox,
								worker.workerLayers, this.defaults, true, me
										.getName());
						this.layerManager = lm;
						app.setLayerManager(lm);

						lm.createLayer("sade", true, null);

						worker.mapplet.setLayerManager(lm);
						worker.mapplet.mapProj = new OpenLayers.Projection(
								"EPSG:3067");

						worker.setupWorkers();

						app.setWorker(worker);

						var ui = Oskari.clazz.create('Oskari.poc.sade3.SadeUI');
						ui.setMapAdapter(lm);

						ui.setApp(app);

						ui.createUserInterface( {
							close : function() {
								me.stop();
								var manager = me.mediator.manager;
								var instanceid = me.mediator.instanceid;
								bundleInstance = null;
								manager.destroyInstance(instanceid);
							}
						});

						this.ui = ui;

						var adapter = Oskari.clazz.create(
								'Oskari.poc.sade3.Adapter', app, ui);
						app.setAdapter(adapter);

						/*
						 * callback: function(lonlat,scale,bbox,options) {
						 * ui.reset(); //form me.getWorker().reset(); //layers
						 * me.getMediator().reset(); // store
						 * me.getWorker().searchAnyByLonLat(lonlat,scale,bbox,options); }
						 * 
						 */

						ui.showUserInterface();

						this.worker = worker;

						worker.start();

						return null;
					},

					/**
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * stop bundle instance
					 */
					"stop" : function() {

						this.worker.stop();
						this.layerManager.destroyLayers();

						this.facade.removeExtensionModule(this, this.name,
								this.eventHandlers, this, this.def);
						this.def = null;
						this.app = null;
						this.ui = null;

						this.mediator.setState("stopped");

						return this;
					},

					eventHandlers : {

						"MyPlaces.MyPlaceSelectedEvent" : function(event) {
							/**
							 * a HACK used to cancel highlight
							 *   
							 */
							this.app.getLayerManager().dimMapLayer();
						},
						
						"AfterMapMoveEvent" : function(event) {
							var me = this;
							var sandbox = this.sandbox;

							var scale = event.getScale();

							if (!(scale < this.defaults.minScale && scale > this.defaults.maxScale))
								return;

							var n = event.getCenterY();
							var e = event.getCenterX();

							// TBD

						},
						"FeaturesGetInfoEvent" : function(event) {
							var xt = this.libs.ext;
							var x0 = event.getLon();
							var y0 = event.getLat();
							var layer = event.getMapLayer();
							var sandbox = this.layerManager.sandbox;

							// hack
						if (layer.getId() != this.layerManager.layers["sade"].layerId) {
							return;
						}
						var me = this;
						var ui = me.ui;

						ui.reset(); // form

						me.worker.reset(); // layers

						me.worker.reset(); // store

						var lonlat = new OpenLayers.LonLat(x0, y0);

						me.worker.searchAnyByLonLat(lonlat);

						// TBD

					},
					"AfterAddExternalMapLayerEvent" : function(event) {
						var layer = event.getLayer();

						this.layerManager.registerLayerImpl(layer);
					},
					"AfterRemoveExternalMapLayerEvent" : function(event) {

					}
					},
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.Sade3BundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
