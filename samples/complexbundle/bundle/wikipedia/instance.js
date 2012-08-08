
/**
 * Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.WikipediaBundleInstance
 * 
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WikipediaBundleInstance",
				function(b) {
					
					this.name = 'WikipediaModule';
					
					this.mediator = null;
					this.sandbox = null;
					
					this.layerId = null;
					this.layer = null;
					
					this.ui = null;

				},
				
				
				/*
				 * prototype
				 */
				{
					getStore: function() {
						return this.store;
					},
					showArticle: function(urlPart) {
                        var url = "http://"+urlPart;
						var request = this.sandbox.getRequestBuilder('ShowOverlayPopupRequest')(url);
						this.sandbox.request(this.getName(),request);
					},
					
					clear: function() {
						this.store.clearData();	
						this.store.destroyStore();
						this.store = null;
					},

					/**
					 * @method start
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
					
						this.func = xt.Function.createThrottled(function() {
							this.processQuery();
						},3200,me);
						
								
						/**
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this, this.name,
								this.eventHandlers, this, 'E', {
									'fi' : {
										title : ' Wikipedia'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ' Wikipedia'
									}

								});
						this.def = def;

						this.layerId = '____WikiMedia___'+this.mediator.instanceid;
						this.addVectorLayer();

						this.mediator.setState("started");
						return this;
					},
					
					/**
					 * @method createModels
					 * 
					 * create (Ext) data models if not already done
					 * 
					 */
					createModels: function() {
						var xt = this.libs.ext;
						var me = this;
						
						if(!xt.ClassManager.get('Wiki')) {
							xt.define('Wiki',
									{
										extend : 'Ext.data.Model',
										fields : [ "summary", "distance", "rank", "title",
												"wikipediaUrl", "elevation", "countryCode", "lng",
												"feature", "lang", "lat", {
													name : "n",
													convert: function(value, r) {
										               
										            	var point = 						
															Proj4js.transform(me.projs["EPSG:4326"], 
																	me.projs["EPSG:3067"], { x: r.get('lng'),
																		  y: r.get('lat') });

										                return point.y;
										            }
														
														}, { name : "e" ,convert: function(value, r) {
												               
											            	var point = 						
																Proj4js.transform(me.projs["EPSG:4326"], 
																		me.projs["EPSG:3067"], { x: r.get('lng'),
																			  y: r.get('lat') });
																

											                return point.x;
											            }
															
														}]
									});
							}
					},
					

					/**
					 * @method createStores
					 * 
					 * create (Ext) Stores for the UI
					 */
					createStores: function() {
						var xt = this.libs.ext;
						var me = this;
						var store = xt.create('Ext.data.Store', {
							model : 'Wiki',
							autoLoad : false,
							
							proxy : {
								type : 'jsonp',
								url : "http://api.geonames.org/findNearbyWikipediaJSON",
								pageParam : null,
								startParam : null,
								limitParam : null,
								reader : {

									type : 'json',
									model : 'Wiki',
									root : 'geonames'
								},
								extraParams : {
									username : 'oskari'
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
						this.map = sandbox.getMap();
						/*
						 * build UI
						 */

						
						
						var ui = Oskari.clazz.create(
								'Oskari.mapframework.bundle.WikipediaBundleUI',
								this.libs,this);
						this.ui = ui;
						ui.setLibs(this.libs);
						ui.setStore(this.getStore());
						ui.create();

						return ui.get();
					},

					/**
					 * @method update
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * @method stop
					 * 
					 * stop bundle instance
					 */
					"stop" : function() {
						this.stopped = true;
						this.removeVectorLayer();
						
						this.facade.removeExtensionModule(this, this.name,
								this.eventHandlers, this,this.def);
						this.def = null;
						this.sandbox.printDebug("Clearing STORE etc");

						this.ui.clear();
						this.ui = null;
						this.clear();
						
						this.mediator.setState("stopped");

						return this;
					},
					
					
					setNE: function(n,e) {
						this.n = n;
						this.e = e;
					},
					
					/**
					 * @method onEvent
					 * dispatches events to eventHandlers
					 * 
					 */
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					defaults: {
						minScale: 40000,
						maxScale: 1
					},
					
					/**
					 * @method getFeatureInfo
					 * 
					 * shows info based on location
					 *  
					 */
					getFeatureInfo: function(x0,y0,dontShow) {
						var tol = 30;
						var xt = this.libs.ext;	

						var ui = this.ui;
						var store = ui.getStore();
						var sel = ui.getGrid().getSelectionModel();
						var me = this;
						
						store.each(function(rec) {
							
							var x1 = rec.get('e');
				            var y1 = rec.get('n');
				            var distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
				            
				            
				            if( distance < tol ) {
				            	sel.select(rec);
				            	
				            	var urlPart = rec.get('wikipediaUrl');
				            	if( !dontShow) {
				            		me.showArticle(urlPart);
				            	}
				            }
							
						});
					},
					
					/*
					 * @property eventHandlers
					 * 
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						
						/**
						 * @method AfterMapLayerRemoveEvent
						 */
						"AfterMapLayerRemoveEvent": function(event) {
							var layer = event.getMapLayer();
							if( layer.getId() == this.layerId ) {
								if( this.sandbox.getObjectCreator(event) 
								        != this.getName() ) {
								
									 this.stop(); var manager =
									 this.mediator.manager; 
									 var instanceid =
									 this.mediator.instanceid;
									 manager.destroyInstance(instanceid);
									 
									
								}
									
							}
						},
						
						/**
						 * @method AfterMapMoveEvent
						 */
						"AfterMapMoveEvent" : function(event) {
							var me = this;
							var sandbox = this.sandbox;
						
							
							var scale = event.getScale();
							
							if( !( scale < this.defaults.minScale && 
									scale > this.defaults.maxScale ) ) 
								return;
							
							var n = event.getCenterY();
							var e = event.getCenterX();

							me.sandbox.printDebug("N:"+n+" E:"+e);
							/**
							 * throttled func to avoid overloading wikipedia
							 * JSONP
							 */
							me.setNE(n,e);
							me.func();
							// me.processQuery(n,e);
							

						},
						
						/**
						 * @method FeaturesGetInfoEvent
						 */
						"FeaturesGetInfoEvent" : function(event) {
							var layer = event.getMapLayer();
							var layerId = layer.getId();
							if( layerId != this.layerId )
								return;
							
							var sandbox = this.sandbox;
							sandbox.printDebug("Handling FeaturesGetInfoEvent for "+this.layerId);
								
							
							var x0 = event.getLon();
							var y0 = event.getLat();
							
							this.getFeatureInfo(x0,y0);
						},
						
						/**
						 * @method MouseHoverEvent
						 */
						"MouseHoverEvent" : function(event) {
							var x0 = event.getLon();
							var y0 = event.getLat();
							
							this.getFeatureInfo(x0,y0,true);
						},
						
						/**
						 * @method AfterAddExternalMapLayerEvent
						 */
						"AfterAddExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = event.getLayer();
						},
						
						/**
						 * @method AfterRemoveExternalMapLayerEvent
						 */
						"AfterRemoveExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = null;
						}
					},
					
					/**
					 * @method processQuery 
					 */
					processQuery: function() {
						
						var me = this;
						
						if( me.stopped )
							return;
						
						var n = this.n;
						var e = this.e;
						
						me.sandbox.printDebug("STARTING WIKIPEDIA LOAD N:"+n+" E:"+e);
						
						
						var xt = this.libs.ext;
						
						var pos = Proj4js.transform(
								me.projs["EPSG:3067"],me.projs["EPSG:4326"],{
							x: e, y: n });
					
						var lng = pos.x;
						var lat = pos.y;

						
						me.busy = true;
						me.ui.getStore().load( {
							params : {
								'lat' : lat,
								'lng' : lng
							},
							callback: function(records) {
							
								me.processResponse(records);

								
								me.sandbox.printDebug("finished WIKIPEDIA LOAD");								
							}
							
						});
						
					},
					
					/**
					 * @method processResponse
					 * 
					 * process wikipedia response to geojson
					 */
					processResponse: function(records) {
						var xt = this.libs.ext;					
						var me = this;
						var features = [];
						var fc = { "type": "FeatureCollection",
								  "features": features };
						
						xt.Array.each(records,function(r) {
							
						
							
							features.push(
									{ "type": "Feature",
										"geometry": {
			                   "type": "Point",
			                   "coordinates": [r.get('e'), r.get('n')] }
			                   ,
			                 "properties": {
			                   "title": r.get('title'),
			                   "feature": r.get('feature'),
			                   "wikipediaUrl" : r.get('wikipediaUrl'),
			                   "summary" : r.get('summary')
			                   }
			                 });
						});
						
						/**
						 * This maybe should be a request if we would follow the
						 * guidelines set by PORTTI1
						 */
						if( this.stopped) 
							return;
						
						var event = me.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
							fc,
							"application/json",
							"EPSG:3067",
							"replace");
				
						me.sandbox.notifyAll(event);
					},

					/**
					 * @method addVectorLayer
					 * 
					 * add vector layer for these features
					 */
					addVectorLayer : function() {

						/*
						 * hack
						 */
						var mapLayerId = this.layerId, keepLayersOrder = true, isBasemap = false;
						
						var spec = {
								"name" : "Wikipedia",
								"wmsName" : "1",
								"type" : "vectorlayer", 
								"styles" : {
									"title" : "Wikipedia",
									"legend" : "",
									"name" : "1"
								},
								"descriptionLink" : "http://en.wikipedia.org/",
								"legendImage" : "",
								"info" : "",
								"isQueryable" : true,
								"formats" : {
									"value" : "text/html"
								},
								"id" : mapLayerId,
								"minScale" : this.defaults.minScale,
								"maxScale" : this.defaults.maxScale,
								"style" : "",
								"dataUrl" : "",
								"wmsUrl" : "x",
								"opacity" : 100,
								"checked" : "false"
							};
						
					
						var request = this.sandbox.getRequestBuilder(
						"AddExternalMapLayerRequest")( mapLayerId, spec );
						this.sandbox.request(this.getName(), request);
						
						/*
						 * Note: AfterAddExternalMapLayerEvent sets this.layer
						 */
						
						
						/*
						 * 
						 */
						var requestAddToMap = this.sandbox.getRequestBuilder(
								"AddMapLayerRequest")( mapLayerId,
								keepLayersOrder);

						this.sandbox.request(this.getName(), requestAddToMap);

					},

				
					/*
					 * @method removeVectorLayer
					 * 
					 * clear vector layer
					 */
					removeVectorLayer : function() {

						/**
						 * remove map layer from map
						 */
						var mapLayerId = this.layerId;
						var requestRemovalFromMap = this.sandbox.getRequestBuilder(
								"RemoveMapLayerRequest")( mapLayerId);

						this.sandbox.request(this.getName(), requestRemovalFromMap);

						
						/**
						 * remove map layer spec
						 */
						var request = this.sandbox.getRequestBuilder(
						"RemoveExternalMapLayerRequest")( mapLayerId);

						this.sandbox.request(this.getName(), request);
						
						/*
						 * Note: AfterRemoveExternalMapLayerEvent resets
						 * this.layer
						 */

					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.WikipediaBundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
