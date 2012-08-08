
/**
 * @class Oskari.mapframework.bundle.TrainsBundleInstance
 * 
 * Trains Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.TrainsBundleInstance",
				function(b) {
					
					this.url =
						//'http://jkorhonen.nls.fi'+
						'/rss/TrainRSS/TrainService.svc/AllTrains';
					this.name = 'TrainsModule';
					
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
					/**
					 * @method getStore
					 * returns (Ext) store
					 */
					getStore: function() {
						return this.store;
					},
					
					/**
					 * @method clear
					 * 
					 * clears store
					 * 
					 */
					clear: function() {
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
						this.createFormats();
						 

						/**
						 * data model
						 */

						this.createModels();
						this.createStores();

						this.startWorker();
						
								
						/**
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this, this.name,
								this.eventHandlers, this, 'E', {
									'fi' : {
										title : ' Trains'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ' Trains'
									}

								});
						this.def = def;

						this.layerId = '____Trains___'+this.mediator.instanceid;
						this.addVectorLayer();

						this.mediator.setState("started");
						return this;
					},
					
					/**
					 * @method startWorker
					 * 
					 * 
					 */
					startWorker: function() {
						var me = this;
						var xt = this.libs.ext;
						
						/**
						 * throttled func
						 */
					
						this.func = xt.Function.createThrottled(function() {
							this.processQuery();
						},3200,me);
						
						var task = {
							    run: this.func,
							    interval: 3200 
							};
						this.task = task;
						xt.TaskManager.start(task);

					},
					
					/**
					 * @method stopWorker
					 * 
					 * 
					 */
					stopWorker: function() {
						var me = this;
						var xt = this.libs.ext;
						xt.TaskManager.stop(me.task);
					},
					
					/**
					 * @method createProjs
					 * 
					 * Creates OpenLayers Projections for this bundle
					 */
					createProjs: function() {
						var me = this;
						
						/*
						 * projection support
						 */
						me.projs = {
								"EPSG:3067" : new OpenLayers.Projection("EPSG:3067"),
								"EPSG:4326" : new OpenLayers.Projection("EPSG:4326")
						};
					},

					/*
					 * @method creatFormats
					 * 
					 * Creates (OpenLayers) Formats for this bundle
					 */
					createFormats: function() {
						
						var me = this;
						/*
						 * format
						 */
						 var format = new OpenLayers.Format.GeoRSS({
							 internalProjection: me.projs['EPSG:3067'], 
							 externalProjection: me.projs['EPSG:4326']
						 });
						 
				        var readFlds = {
					        		'guid': {},
					        		'category' : {},
					        		'description' : {},
					        		'pubDate' : { type: 'date'},
					        		'from' : {},
					        		'to' : {},
					        		'status': {},
					        		'dir' : {}
				        };
				        format.readFields = readFlds;
				        
				        

						 /**
							 * some 'guidance' for building the attributes
							 */
						 format.createFeatureFromItem = function(item) {
						        var geometry = this.createGeometryFromItem(item);
						     
						        /* Provide defaults for title and description */
						        var title = this.getChildValue(item, "*", "title", this.featureTitle);
						       
						        /*
								 * First try RSS descriptions, then Atom
								 * summaries
								 */
						        var description = this.getChildValue(
						            item, "*", "description",
						            this.getChildValue(item, "*", "content",
						                this.getChildValue(item, "*", "summary", this.featureDescription)));

						        /*
								 * If no link URL is found in the first child
								 * node, try the href attribute
								 */
						        var link = this.getChildValue(item, "*", "link");
						        if(!link) {
						            try {
						                link = this.getElementsByTagNameNS(item, "*", "link")[0].getAttribute("href");
						            } catch(e) {
						                link = null;
						            }
						        }

						        var id = this.getChildValue(item, "*", "id", null);
						        
						        /*
								 * <item> <guid isPermaLink="false">H8152</guid>
								 * <category>2</category> <title>A</title>
								 * <description>Summary</description>
								 * <pubDate>Mon, 22 Aug 2011 14:59:08 +0300</pubDate>
								 * <georss:point>60.1761500000001
								 * 24.9393200000001</georss:point> <from>LPV</from>
								 * <to>HKI</to> <status>1</status> <dir>177</dir>
								 * </item>
								 */
						        
						        
						        var data = {
						            "title": title,
						            "description": description,
						            "link": link
						        };
						        
						        var readFlds = this.readFields;
						        for( f in readFlds ) {
						        	var val = this.getChildValue(item, "*", f, readFlds[f].defaultValue);
						        	data[f] = val;
						        }
						        
						        var feature = new OpenLayers.Feature.Vector(geometry, data);
						        feature.fid = id;
						        return feature;
						    };       
						 
						 
						 me.format = format;
						
					},
					
					/**
					 * @method createModels
					 * 
					 * creates any (Ext) data models required
					 * by this bundle 
					 */
					createModels: function() {
						var xt = this.libs.ext;
						var me = this;
						
						if(!xt.ClassManager.get('Train')) {
							xt.define('Train',
									{
										extend : 'Ext.data.Model',
										fields : [ "summary", "status", "title",
												"from", "to", "guid","category"
												]
									});
							}
					},
					

					/**
					 * @method createStores
					 * 
					 * creates any (Ext) stores required by this bundle
					 */
					createStores: function() {
						var xt = this.libs.ext;
						var me = this;
						var store = xt.create('Ext.data.Store', {
							model : 'Train',
							autoLoad : false
						});
						this.store = store;
					},
					
					/**
					 * @method init
					 * 
					 * init UI module called after start
					 * 
					 * This will be called by the framework
					 * 
					 */
					init : function(sandbox) {
						this.sandbox = sandbox;
						/*
						 * build UI
						 */

						var ui = Oskari.clazz.create(
								'Oskari.mapframework.bundle.TrainsBundleUI',
								this.libs,this);
						this.ui = ui;
						ui.setLibs(this.libs);
						ui.setStore(this.getStore());
						ui.create();

						return ui.get();
					},

					/**
					 * @method update
					 * notifications from the bundle manager
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
					 * 
					 */
					"stop" : function() {
						
						this.stopped = true;
						
						var xt = this.libs.ext;
						
						this.stopWorker();
						
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
					
					
					/**
					 * @method setNE 
					 *
					 * support function for feature info requests
					 * 
					 *  
					 */
					setNE: function(n,e) {
						this.n = n;
						this.e = e;
					},
					
					/*
					 * @method onEvent
					 * 
					 * event handler that dispatches events
					 * to handlers registered in eventHandlers props
					 *  
					 */
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/**
					 * @property defaults
					 * 
					 * some defaults for this bundle
					 */
					defaults: {
						minScale: 800000,
						maxScale: 1
					},
					
					/*
					 * @method getFeatureInfo
					 * 
					 * search for any hits using OpenLayers geometry operations
					 * 
					 */
					getFeatureInfo: function(lon,lat,dontShow) {

						var me = this;
						if( !me.features )
							return;
						
						var pt = new OpenLayers.Geometry.Point(lon,lat);
						var c  = OpenLayers.Geometry.Polygon.createRegularPolygon(pt,32,8);
						me.ui.showTrain({});
						
						for( var f = 0; f < me.features.length;f++) {
							var feat = me.features[f];
							
							if( !feat.geometry )
								continue;
							
							if(c.intersects(feat.geometry)) {
								if( dontShow ) 
									me.ui.showTrain(feat.attributes);
								else 
									me.ui.showTrainDetails(feat.attributes);
							}
						}
						
					},
					
					/*
					 * 
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						
						/**
						 * @method eventHandlers.AfterMapLayerRemoveEvent
						 * 
						 */
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

						/**
						 * @method eventHandlers.AfterMapMoveEvent
						 * 
						 */
						"AfterMapMoveEvent" : function(event) {
							var me = this;
							var sandbox = this.sandbox;
						
							var scale = event.getScale();
							
							if( !(scale < this.defaults.minScale && 
							        scale > this.defaults.maxScale) ) 
								return;
							
							var n = event.getCenterY();
							var e = event.getCenterX();

							me.sandbox.printDebug("N:" + n + " E:" + e);
							/**
							 * throttled func to avoid overloading trains JSONP
							 */
							me.setNE(n, e);
							me.func();
							

						},
						
						/**
						 * @method eventHandlers.FeaturesGetInfoEvent
						 * 
						 */
						"FeaturesGetInfoEvent" : function(event) {
							var sandbox = this.sandbox;
							
							var layer = event.getMapLayer();
							var layerId = layer.getId();
							if( layerId != this.layerId ) {
								sandbox.printDebug("FeaturesGetInfoEvent@Trains: "+this.layerId+" vs. queried "+layerId);								
								return;
							}
							
							sandbox.printDebug("Handling FeaturesGetInfoEvent for "+this.layerId);
								
							
							var lon = event.getLon();
							var lat = event.getLat();
							
							this.getFeatureInfo(lon,lat);
						},
						
						/**
						 * @method eventHandlers.MouseHoverEvent
						 * 
						 */
						"MouseHoverEvent" : function(event) {
							var x0 = event.getLon();
							var y0 = event.getLat();
							
							this.getFeatureInfo(x0,y0,true);
						},
						
						/**
						 * @method eventHandlers.AfterAddExternalMapLayerEvent
						 * 
						 */
						"AfterAddExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = event.getLayer();
						},
						/**
						 * @method eventHandlers.AfterRemoveExternalMapLayerEvent
						 * 
						 */
						"AfterRemoveExternalMapLayerEvent" : function(event) {
							if( event.getMapLayerId() == this.layerId )
								this.layer = null;
						}
					},
					
					/**
					 * @method processQuery
					 * 
					 * 
					 */
					
					processQuery: function() {
						
						var me = this;
						
						var n = this.n;
						var e = this.e;
						
						me.sandbox.printDebug("STARTING Trains LOAD N:"+n+" E:"+e);
						
						
						var xt = this.libs.ext;
						
						var pos = Proj4js.transform(
								me.projs["EPSG:3067"],me.projs["EPSG:4326"],{
							x: e, y: n });
					
						var lng = pos.x;
						var lat = pos.y;

						
						me.loadRss();
						
						/*
						 * me.ui.getStore().load( { params : { 'lat' : lat,
						 * 'lng' : lng }, callback: function(records) {
						 * 
						 * me.processResponse(records);
						 * 
						 * 
						 * me.sandbox.printDebug("finished WIKIPEDIA LOAD"); }
						 * 
						 * });
						 */
						
						
					},
					
					/**
					 * @method loadRSS
					 * 
					 */
					loadRss: function() {
						var me = this;
						var params = {};
						var tsNow = new Date().getTime();
						var rssOptions = {
								 url: me.url+"?ts="+tsNow,
						         params: OpenLayers.Util.upperCaseObject(params),
						            callback: function(request) {
										me.handleResponse(request);
						            },
						            scope: this
						};
						OpenLayers.Request.GET(rssOptions);
					},
					
					/**
					 * @method handleResponse
					 * 
					 * 
					 */
					handleResponse: function(request) {
						
						if( this.stopped )
							return;
						
						var me = this;
						var store = me.getStore();

						
						
						var xt = me.libs.ext;
						 var doc = request.responseXML;
					        if(!doc || !doc.documentElement) {
					            doc = request.responseText;
					        }
					        var feats = me.format.read(doc);
					        
					        if( this.stopped )
					        	return;
					        
							var event = this.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
									feats,
									"application/nlsfi-x-openlayers-feature",
									"EPSG:3067", 
									"replace");
						
							me.sandbox.notifyAll(event);
					
							this.features = feats;
							
							/*
							 * var recId = 0; var storeData = []; for( var f = 0 ;
							 * f < feats.length ; f++ ) { var feat = feats[f];
							 * storeData.push(feat.attributes); }
							 * store.add(storeData);
							 */
							
							
					},
					
					/**
					 * @property styledLayerDescriptors
					 * 
					 * A set of SLD descriptors for this bundle
					 * 
					 */
					styledLayerDescriptors: {
						'default' : '<StyledLayerDescriptor version="1.0.0" '+
						'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" '+ 
					    '    xmlns="http://www.opengis.net/sld" '+
					    '    xmlns:ogc="http://www.opengis.net/ogc" '+ 
					    '    xmlns:xlink="http://www.w3.org/1999/xlink" '+ 
					    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> '+
					    '  <NamedLayer> '+
					    '    <Name>Simple point with stroke</Name> '+
					     '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> '+
					      '    <FeatureTypeStyle><Rule>'+
					      '<PointSymbolizer>'						+
					      ' <Graphic><Mark><WellKnownName>circle</WellKnownName><Fill>'+
					              '        <CssParameter name="fill">#00A000</CssParameter>'+
					             '       </Fill><Stroke>'+
					            '          <CssParameter name="stroke">#000000</CssParameter>'+
					           '           <CssParameter name="stroke-width">2</CssParameter>'+
					          '          </Stroke></Mark><Size>12</Size></Graphic>'+
					         '     </PointSymbolizer>'+
					         '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>'+
					         '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>'+
					         '</Rule></FeatureTypeStyle>'+
					        '</UserStyle></NamedLayer></StyledLayerDescriptor>'
					},

					/**
					 * @method addVectorLayer
					 * 
					 * Adds a (OpenLayers) Vector Layer
					 * 
					 */
					addVectorLayer : function() {

						/*
						 * hack
						 */
						var mapLayerId = this.layerId, keepLayersOrder = true, isBasemap = false;
						
						var defaultSLD = this.styledLayerDescriptors['default'];
						
						var spec = {
								"text" : "",
								"name" : "Trains",
								"wmsName" : "1",
								"type" : "vectorlayer", 
								"styles" : {
									"title" : "Trains",
									"legend" : "",
									"name" : "1"
								},
								"descriptionLink" : "http://www.vr.fi/",
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
								"checked" : "false",
								"styledLayerDescriptor" : 
									defaultSLD
							};
						
					
						var request = this.sandbox.getRequestBuilder(
						"AddExternalMapLayerRequest")( mapLayerId, spec );
						this.sandbox.request(this.getName(), request);
						
						
						/**
						 * Note: Added Layer Info is received via Event see below
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
					 * removes this bundle's vector layer
					 * 
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
					
					/**
					 * @method getName
					 * 
					 * required method for 
					 * Oskari.mapframework.module.Module protocol
					 * 
					 */
					getName : function() {
						return this.__name;
					},
					
					/**
					 * @property __name
					 * 
					 *  this BundleInstance's name
					 * 
					 */
					__name : "Oskari.mapframework.bundle.TrainsBundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
