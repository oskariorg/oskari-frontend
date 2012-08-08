

/*
 * Events
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AfterAddExternalMapLayerEvent',
		function(mapLayerId, spec,layer) {
			this._creator = null;
			this._mapLayerId = mapLayerId;
			this._spec = spec;
			this._layer = layer;

		}, {
			__name : "AfterAddExternalMapLayerEvent",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			},

			getSpec: function() {
				return this._spec;
			},
			
			getLayer: function() {
				return this._layer;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

Oskari.clazz.define('Oskari.mapframework.request.common.AfterRemoveExternalMapLayerEvent',
		function(mapLayerId) {
			this._creator = null;
			this._mapLayerId = mapLayerId;

		}, {
			__name : "AfterRemoveExternalMapLayerEvent",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});


/*
 * Requests
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AddExternalMapLayerRequest',
		function(mapLayerId, spec,sldSpec) {
			this._creator = null;
			this._mapLayerId = mapLayerId;
			this._spec = spec;
			this._sldSpec = sldSpec;

		}, {
			__name : "AddExternalMapLayerRequest",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			},

			getSpec: function() {
				return this._spec;
			},
			
			getSLDSpec: function() {
				return this._sldSpec;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

Oskari.clazz.define('Oskari.mapframework.request.common.RemoveExternalMapLayerRequest',
		function(mapLayerId) {
			this._creator = null;
			this._mapLayerId = mapLayerId;

		}, {
			__name : "RemoveExternalMapLayerRequest",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});



/*
 * Bundle Instance Handlers
 */
 
Oskari.clazz
 .define(
 		'Oskari.mapframework.bundle.AddExternalMapLayerHandler',
 		function(sandbox) {
 			
 			this.sandbox = sandbox;
 			
 		},
 		{
 			handleRequest: function(core,request) {
 			
 				var mapLayerId = request.getMapLayerId();
 				var spec  =  request.getSpec();
 			
 				////var mapLayerService = core.getService('Oskari.mapframework.service.MapLayerService');
 				var layers = [spec];
 				core.createMapLayerDomain({
 					layers: layers
 				});
                var mapLayerService = core.getService('Oskari.mapframework.service.MapLayerService');
 				var layer = mapLayerService.findMapLayer(mapLayerId);
			
 				this.sandbox.printDebug("###!!### Added Layer Spec @AddExternalMapLayerHandler");
 				var event = this.sandbox.getEventBuilder('AfterAddExternalMapLayerEvent')(mapLayerId,spec,layer);
 				this.sandbox.notifyAll(event);
 				
 				//return layer;
 			}
 		},{
 			protocol: ['Oskari.mapframework.core.RequestHandler']
 		});
 
 Oskari.clazz
 .define(
 		'Oskari.mapframework.bundle.RemoveExternalMapLayerHandler',
 		function(sandbox) {
 			
 			this.sandbox = sandbox;
 			
 		},
 		{
 			handleRequest: function(core,request) {
 				var mapLayerId = request.getMapLayerId();

 				this.sandbox.printDebug("###!!### Leaving Layer Spec "+mapLayerId+" TO core._allAvailableLaeyrs FIXIT! / @RemoveExternalMapLayerHandler")
 				
 				var event = this.sandbox.getEventBuilder('AfterRemoveExternalMapLayerEvent')(mapLayerId);
 				this.sandbox.notifyAll(event);

 			}
 		},{
 			protocol: ['Oskari.mapframework.core.RequestHandler']
 		});
 
  
 /**
  * Bundle Instance
  */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.LayerHandlerBundleInstance",
				function(b) {
					this.name = 'layerhandlerModule';
					this.mediator = null;
					this.sandbox = null;
					
					
					
					
				},
				/*
				 * prototype
				 */
				{

					/**
					 * start bundle instance
					 * 
					 */					
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;
						
						var sandbox = Oskari.$("sandbox"); /* ? */
						this.sandbox = sandbox;
						
						this.handlers = {
								addExternalMapLayer: Oskari.clazz.create(
										'Oskari.mapframework.bundle.AddExternalMapLayerHandler',sandbox),
								removeExternalMapLayer: Oskari.clazz.create(
										'Oskari.mapframework.bundle.RemoveExternalMapLayerHandler',sandbox)
									
						}; 

						this.sandbox.addRequestHandler(
								'AddExternalMapLayerRequest',this.handlers.addExternalMapLayer);
						this.sandbox.addRequestHandler(
								'RemoveExternalMapLayerRequest',this.handlers.removeExternalMapLayer);
						
						this.mediator.setState("started");
						return this;
					},

					/**
					 * init UI module called after start
					 */
					init : function(sandbox) {
						this.sandbox = sandbox;

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
						
						this.sandbox.removeRequestHandler(
								'AddExternalMapLayerRequest',this.handlers.addExternalMapLayer);
						this.sandbox.removeRequestHandler(
								'RemoveExternalMapLayerRequest',this.handlers.removeExternalMapLayer);
						
						this.sandbox = null;
						
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
						"AfterMapMoveEvent" : function(event) {

							var n = event.getCenterY();
							var e = event.getCenterX();

							this.ui.updateLocationInfo(n, e);

							this.mediator.manager
									.alert("AfterMapMoveEvent "
											+ n
											+ ","
											+ e
											+ " @Oskari.mapframework.bundle.LayerHandlerBundleInstance "
											+ event.getName());
						}
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.LayerHandlerBundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.LayerHandler",

				function() {
					this.singleton = null;
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						if( !this.singleton ) {
						this.singleton = Oskari.clazz
								.create("Oskari.mapframework.bundle.LayerHandlerBundleInstance");
						}
						return this.singleton;

					},

					"update" : function(manager, bundle, bi, info) {
						manager.alert("RECEIVED update notification " + info);
					}


				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "layerhandler",
							"Bundle-Name" : "layerhandler",
							"Bundle-Icon" : {
								"href" : "icon.png"
							},
							"Bundle-Author" : [ {
								"Name" : "jjk",
								"Organisation" : "nls.fi",
								"Temporal" : {
									"Start" : "2009",
									"End" : "2011"
								},
								"Copyleft" : {
									"License" : {
										"License-Name" : "EUPL",
										"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
									}
								}
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : "",
									"Title" : ""
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ]
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("layerhandler",
		"Oskari.mapframework.bundle.LayerHandler");
