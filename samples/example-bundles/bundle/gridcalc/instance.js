

/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.GridCalcBundleInstance",
				function(b) {
					
					this.name = 'gridcalc';
					
					this.mediator = null;
					this.sandbox = null;
					
					this.layerId = null;
					this.layer = null;
					
					this.ui = null;

					this.features = null;
				},
				
				
				/*
				 * prototype
				 */
				{
					getStore: function() {
						return this.store;
					},
					
					clear: function() {
						this.store.clearData();	
						this.store.destroyStore();
						this.store = null;
					},

					/**
					 * start bundle instance
					 * 
					 */
					"start" : function() {
						var me = this;

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
					
						this.createProjs();
						this.createGridMath();
						 

						/**
						 * data model
						 */

						this.createModels();
						this.createStores();

						var xt = this.libs.ext;
						/*this.func = xt.Function.createThrottled(function() {
							this.processGrid();
						},3200,me);*/
						//this.startWorker();
						
								
						/**
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this, this.name,
								this.eventHandlers, this, 'E', {
									'fi' : {
										title : ' gridcalc'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ' gridcalc'
									}

								});
						this.def = def;

						this.layerId = '____gridcalc___'+this.mediator.instanceid;
						this.addVectorLayer();

						this.mediator.setState("started");
						return this;
					},
					
					createGridMath: function()  {
					
						var tileQueue = Oskari.clazz.create("Oskari.mapframework.gridcalc.TileQueue");
				        var strategy = Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTilesStrategy",{
				                tileQueue: tileQueue
				        });
				        this.tileQueue = tileQueue;
				        this.tileStrategy = strategy;											
					},
					
					/**
					 * 
					 */
					startWorker: function() {
						var me = this;
						var xt = this.libs.ext;
						
						/**
						 * throttled func
						 */
					
					
						
						var task = {
							    run: this.func,
							    interval: 3200 
							};
						this.task = task;
						xt.TaskManager.start(task);

					},
					
					/**
					 * 
					 */
					stopWorker: function() {
						var me = this;
						var xt = this.libs.ext;
						xt.TaskManager.stop(me.task);
					},
					
					/**
					 * 
					 */
					createProjs: function() {
						var me = this;
						
						/*
						 * projection support
						 */
						me.projs = {
								"EPSG:3067" : new OpenLayers.Projection("EPSG:3067")
						};
					},

					/**
					 * 
					 */
					createModels: function() {
						var xt = this.libs.ext;
						var me = this;
						
						if(!xt.ClassManager.get('GridTile')) {
							xt.define('GridTile',
									{
										extend : 'Ext.data.Model',
										fields : [ "left","bottom","right","top" ]
									});
							}
					},
					

					/**
					 * 
					 */
					createStores: function() {
						var xt = this.libs.ext;
						var me = this;
						var store = xt.create('Ext.data.Store', {
							model : 'GridTile',
							autoLoad : false
						});
						this.store = store;
					},
					
					/**
					 * init UI module called after start
					 */
					init : function(sandbox) {
						this.sandbox = sandbox;
						/*
						 * build UI
						 */

						var ui = Oskari.clazz.create(
								'Oskari.mapframework.bundle.GridCalcBundleUI',
								this.libs,this);
						this.ui = ui;
						ui.setLibs(this.libs);
						ui.setStore(this.getStore());
						ui.create();

						return ui.get();
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
						
						var xt = this.libs.ext;
						
						//this.stopWorker();
						
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
					
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					defaults: {
						minScale: 12000000,
						maxScale: 1
					},
					
					getFeatureInfo: function(lon,lat,dontShow) {

						var me = this;
						if( !me.features )
							return;
						
						var pt = new OpenLayers.Geometry.Point(lon,lat);
						var c  = OpenLayers.Geometry.Polygon.createRegularPolygon(pt,32,8);
						me.ui.showTile({});
						
						for( var f = 0; f < me.features.length;f++) {
							var feat = me.features[f];
							
							if( !feat.geometry )
								continue;
							
							if(c.intersects(feat.geometry)) {
								if( dontShow ) 
									me.ui.showTile(feat.attributes);
								else 
									me.ui.showTileDetails(feat.attributes);
							}
						}
						
					},
					
					/*
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						"AfterMapLayerRemoveEvent": function(event) {
							var layer = event.getMapLayer();
							if( layer.getId() == this.layerId ) {
								if(this.sandbox.getObjectCreator(event) 
								        != this.getName()) {								
									 this.stop(); var manager =
									 this.mediator.manager; 
									 var instanceid =
									 this.mediator.instanceid;
									 manager.destroyInstance(instanceid);
									 
									
								}
									
							}
						},
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
							 * throttled func to avoid overloading gridcalc JSONP
							 */
							me.setNE(n,e);
							//me.func();
							me.processGrid();
							

						},
						
						"FeaturesGetInfoEvent" : function(event) {
							var sandbox = this.sandbox;
							
							var layer = event.getMapLayer();
							var layerId = layer.getId();
							if( layerId != this.layerId ) {
								sandbox.printDebug("FeaturesGetInfoEvent@gridcalc: "+this.layerId+" vs. queried "+layerId);								
								return;
							}
							
							sandbox.printDebug("Handling FeaturesGetInfoEvent for "+this.layerId);
								
							
							var lon = event.getLon();
							var lat = event.getLat();
							
							this.getFeatureInfo(lon,lat);
						},
						"MouseHoverEvent" : function(event) {
							var x0 = event.getLon();
							var y0 = event.getLat();
							
							this.getFeatureInfo(x0,y0,true);
						},
						"AfterAddExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = event.getLayer();
						},
						"AfterRemoveExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = null;
						}
					},
					
					/**
					 * 
					 */
					
					processGrid: function() {
						
						var me = this;
						
						var n = this.n;
						var e = this.e;
						
						var tileQueue = me.sandbox.getMap().getTileQueue();
						if( !tileQueue)
							return;
							
						var tiles = tileQueue.getQueue();
						
						var feats = [];
						
						
						var tl = tiles.length;
						for ( var t = 0; t < tl; t++ ) {
							  var tile = tiles[t];
							  var bbox = tile.getBounds();
							  var bounds = new OpenLayers.Bounds(bbox.left, bbox.bottom,bbox.right,bbox.top);
						      var geometry = bounds.toGeometry();
						      var data = { title: bounds.toString() };
							
							  var feat = new OpenLayers.Feature.Vector(geometry, data);
						      //feat.fid = id;
							  feats.push(feat);
						}
						
						me.features = feats;
						me.sandbox.printDebug("SENDING "+tiles.length+" FEATURES");
					        
						var event = me.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
								feats,
								"application/nlsfi-x-openlayers-feature",
								"EPSG:3067", 
								"replace");
					
						me.sandbox.notifyAll(event);
						
					     
					
						
						
					},
					
		
					/**
					 * add (hack) vector layer for these features
					 */
					addVectorLayer : function() {

						/*
						 * hack
						 */
						var mapLayerId = this.layerId, keepLayersOrder = true, isBasemap = false;
						var strategy = this.tileStrategy;
						var strategies = [strategy];
						var spec = {
								"name" : "gridcalc",
								"wmsName" : "1",
								"type" : "vectorlayer", 
								"styles" : {
									"title" : "gridcalc",
									"legend" : "",
									"name" : "1"
								},
								"descriptionLink" : "http://en.gridcalc.org/",
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
								"opacity" : 20,
								"checked" : "false",
								"styledLayerDescriptor" : 
									'<StyledLayerDescriptor version="1.0.0" '+
									'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" '+ 
								    '    xmlns="http://www.opengis.net/sld" '+
								    '    xmlns:ogc="http://www.opengis.net/ogc" '+ 
								    '    xmlns:xlink="http://www.w3.org/1999/xlink" '+ 
								    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> '+
								    '  <NamedLayer> '+
								    '    <Name>Simple point with stroke</Name> '+
								     '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> '+
								      '    <FeatureTypeStyle><Rule>'+
								      '<PolygonSymbolizer>'+
								         '<Fill><CssParameter name="fill">#ffffff</CssParameter></Fill>'+
								         '<Stroke><CssParameter name="stroke">#ff0000</CssParameter><CssParameter name="stroke-width">5</CssParameter></Stroke>'+
								         '</PolygonSymbolizer>'+
								         '</Rule></FeatureTypeStyle>'+
								        '</UserStyle></NamedLayer></StyledLayerDescriptor>',
								"strategies" : strategies
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
					__name : "Oskari.mapframework.bundle.GridCalcBundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
