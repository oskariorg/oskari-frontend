/**
 * Bundle Instance
 * @class Oskari.mapframework.bundle.DefaultthirdpartymapsBundleInstance
 * 
 * This class is POC for adding 3rd party maps to mapframework UI
 * 
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultthirdpartymapsBundleInstance",
				/**
				 * @constructor
				 */
				function(b) {
					this.name = 'thirdpartymaps';
					this.mediator = null;
					this.sandbox = null;
					this.conf = null;

					this.impl = null;

					this.ui = null;
				},
				/*
				 * 
				 */
				{

					/**
					 * @method init
					 * start bundle instance
					 * 
					 */

					"init" : function() {

					},

					/**
					 * @method createProjs
					 * 
					 * create any required projection objects
					 * 
					 */
					createProjs: function() {
						var me = this;
						
						/*
						 * projection support
						 */
						me.projs = {
								"EPSG:3067" : new OpenLayers.Projection("EPSG:3067"),
								"EPSG:4326" : new OpenLayers.Projection("EPSG:4326"),
								"EPSG:900913" : new OpenLayers.Projection("EPSG:900913")
						
						};
					},
					/**
					 * @method createMapPanel
					 * creates (Ext) map panel
					 */
					createMapPanel : function() {
						var xt = this.libs.ext;
						var pnl = xt.create('Ext.Panel', {
							height : 384,
							region : 'center',
							layout : 'fit',
							items : []
						});

						return pnl;

					},

					/**
					 * @method createMap
					 * 
					 * creates openstreetmap
					 */
					createMap : function() {
						var  map = new OpenLayers.Map(null,{
						        projection: this.projs["EPSG:900913"],
						        units: "m",
						        maxResolution: 156543.0339,
						        maxExtent: new OpenLayers.Bounds(
						            -20037508, -20037508, 20037508, 20037508.34
						        ),
						        theme: null
						    });
						    
						    var osm = new OpenLayers.Layer.OSM();            
						    var gmap = new OpenLayers.Layer.Google("Google Streets");
						    
						    map.addLayers([osm, gmap]);

						    map.addControl(new OpenLayers.Control.LayerSwitcher());

						    map.moveMapToLanLot(
						        new OpenLayers.LonLat(10.2, 48.9).transform(
						            this.projs["EPSG:4326"],
						            map.getProjectionObject()
						        ), 
						        5
						    );
						    return map;
					},

					/**
					 * @method createMapContainer
					 * 
					 * Creates NLSFI Map Panel Widget for the map
					 */
					createMapContainer : function(map) {
						var xt = this.libs.ext;
						var mapster = xt.createWidget('nlsfimappanel', {
							olmap : map,
							layout : 'absolute'
						});

						return mapster;
					},

					/**
					 * @method start
					 * 
					 * starts the bundle registers events
					 * creates map, map container and ui panel
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						this.libs = {
							ext : Oskari.$("Ext")
						};

						var conf = Oskari.$("startup");
						var facade = Oskari.$('UI.facade');
						this.facade = facade;
						var sandbox = facade.getSandbox();
						this.sandbox = sandbox;

						sandbox.register(this);
						for (p in this.eventHandlers) {
							sandbox.registerForEventByName(this, p);
						}

						this.conf = conf;

						var showIndexMap = false;
						var showZoomBar = false;
						var showScaleBar = false;
						var allowMapMovements = false;

						this.createProjs();

						var pnl = this.createMapPanel();
						this._panel = pnl;

						var def = this.facade.appendExtensionModule(this,
								this.name, this.eventHandlers, this, 'E', {
									'fi' : {
										title : ''
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ''
									}

								}, pnl);

						this.def = def;

						this.map = this.createMap();
						
						var mapster = this.createMapContainer(this.map);
						this._mapster = mapster;
						pnl.add(mapster);

						

						// facade.registerPart('thirdpartymaps',this._mapster);

						

						this.mediator.setState("started");
						return this;
					},

					/**
					 * @method centerMap
					 * 
					 * centers map 
					 */
					centerMap: function(n,e,isAfterMove,mainMapZoom) {
						if( !isAfterMove)
							return;
						
						this.map.setCenter(
							        new OpenLayers.LonLat(e,n).transform(
							            this.projs["EPSG:3067"],
							            this.projs["EPSG:900913"]
							        ), 
							        12
							    );
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

						this.facade.removeExtensionModule(this.impl, this.name,
								{}, this, this.def);
						this.def = null;

						for (p in this.eventHandlers) {
							this.sandbox.unregisterFromEventByName(this, p);
						}

						this.sandbox.unregister(this);

						this.mediator.setState("stopped");

						return this;
					},

					/*
					 * @method onEvent
					 * 
					 * dispatches events to eventhandler methods
					 */
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/*
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						/*
						 * @method MouseHoverEvent
						 */
						"MouseHoverEvent" : function(event) {
							var n = event.getLat();
							var e = event.getLon();

							this.centerMap(n,e,false,8);
							
						},

						/**
						 * @method AfterMapMoveEvent
						 */
						"AfterMapMoveEvent" : function(event) {

							var n = event.getCenterY();
							var e = event.getCenterX();

							this.centerMap(n,e, true, event.getZoom());

							this.mediator.manager
									.alert("AfterMapMoveEvent "
											+ n
											+ ","
											+ e
											+ " @Oskari.mapframework.bundle.DefaultMapModuleBundleInstance "
											+ event.getName());
						}
					},

					/**
					 * @method getName
					 * 
					 */
					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultthirdpartymapsBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
