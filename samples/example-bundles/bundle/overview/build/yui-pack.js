/* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultOverviewMapBundleInstance",
				function(b) {
					this.name = 'overview';
					this.mediator = null;
					this.sandbox = null;
					this.conf = null;
					
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

					"init" : function() {
					
					},
					
					/**
					 * creates (Ext) map panel
					 */
					createMapPanel: function() {
						var xt = this.libs.ext;
						var pnl = xt.create('Ext.Panel', {
							height: 256,
							region : 'center',
							layout : 'fit',
							items : []
						});
						
						return pnl;
						
					},
					
					createMapContainer: function(map) {
						var xt = this.libs.ext;
						var mapster = xt.createWidget('nlsfimappanel', {
							olmap : map,
							layout:'absolute'
						});

						return mapster;
					},

					
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
						for( p in this.eventHandlers ) {
							sandbox.registerForEventByName(this, p);
						}
						
						this.conf = conf;
						
						var showIndexMap = false;
						var showZoomBar = false;
						var showScaleBar = false;
						var allowMapMovements = false;
						
						var impl = Oskari.clazz
								.create('Oskari.mapframework.ui.module.common.MapModule',
										"Overview", showIndexMap, showZoomBar,
										showScaleBar, allowMapMovements);
						
					
						
						impl.setStealth(true);
						
						
						this.impl = impl;
						
						
						var pnl = this.createMapPanel();
						this._panel = pnl;

						var def = this.facade.appendExtensionModule(this.impl,
								this.name, {}, this,
								'E', {
									'fi' : {
										title : ''
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ''
									}

								},pnl);
						
						this.def = def;
						
						/**
						 * plugins
						 */
						var plugins = [];
						plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
						plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
				        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
						
				        for(var i = 0; i < plugins.length; i++) {
				            var plugin = Oskari.clazz.create(plugins[i]);
				            impl.registerPlugin(plugin);
				        } 
						
						var mapster = this.createMapContainer(this.impl.getMap());
						this._mapster = mapster;
						pnl.add(mapster);
						
						this.impl.start(sandbox);
						
						//facade.registerPart('Overview',this._mapster);
						
						this.impl.updateCurrentState();

						this.mediator.setState("started");
						return this;
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

						this.impl.stop(this.sandbox);
						
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
					
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/*
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						"MouseHoverEvent" : function(event) {
							var n = event.getLat();
							var e = event.getLon();
							
							//this.impl.centerMap(e,n,false,8);
						},
						
						"AfterMapMoveEvent" : function(event) {

							var n = event.getCenterY();
							var e = event.getCenterX();


							
							
							this.impl.moveMapToLanLot(e,n,event.getZoom());
							
							this.mediator.manager
									.alert("AfterMapMoveEvent "
											+ n
											+ ","
											+ e
											+ " @Oskari.mapframework.bundle.DefaultMapModuleBundleInstance "
											+ event.getName());
						}
					},


					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultOverviewMapBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
