/* This is a unpacked Oskari bundle (bundle script version Wed Feb 15 2012 20:10:12 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * 
 * http://jkorhonen.nls.fi/geoserver/wms?request=GetCapabilities&version=1.3.0
 * 
 * Luodaan layerhandlerilla dynaamisesti WMS palvelun layereita
 * 
 */
/*
 * OpenLayers.Format.WMSCapabilities
 */

	/**
	 * WmsLayer Instance
	 */


Oskari.clazz.define("Oskari.mapframework.bundle.WmsCapsUI", function(
		libs, bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;
	this.lang = null;

}, {
	clear : function() {
		this.store = null;
		this.form = null;
		this.libs = null;
		this.ui = null;
		this.grid = null;
	},
	setLibs : function(libs) {
		this.libs = libs;
	},
	get : function() {
		return this.form;
	},
	setStore : function(s) {
		this.store = s;
	},
	getStore : function() {
		return this.store;
	},
	getGrid : function() {
		return this.grid;
	},
	setLang : function(l) {
		this.lang = l;
	},
	getLang : function() {
		return this.lang;
	},
	/*
	 * ...
	 */

	playWmsLayer : function(WmsLayerRec) {
		this.bundle.playWmsLayer(WmsLayerRec);
		
	},
		
	stopWmsLayer: function(WmsLayerRec) {
		this.bundle.stopWmsLayer(WmsLayerRec);
		
	},
	
	refresh: function() {
		this.grid.getView().refresh();
	},

	/**
	 * create UI with the provided libraries
	 */
	create : function() {
		var xt = this.libs.ext;

		/**
		 * store
		 */
		var xt = this.libs.ext;

		/**
		 * grid
		 */
		var me = this;
		var lang = me.lang;
		
		var gridActionColumn = {
				xtype : 'actioncolumn',
				width : 64,
				items : [
						{
							icon : '../resource/silk-icons/control_play_blue.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.playWmsLayer(rec);
							},
							getClass : function(v, meta, rec) {
								
								var layername = rec.get('name');
								if( me.bundle.layerManager.layers[layername ])
									return "hidden";

								else 
									return "";
								
									
							}
						},
						{
							icon : '../resource/silk-icons/control_stop.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.stopWmsLayer(rec);

							},
							getClass : function(v, meta, rec) {
								
								var layername  = rec.get('name');
								if( !me.bundle.layerManager.layers[layername ])
									return "hidden";
								else 
									return "";
							}
						} ]
			};

		
		var grid = xt.create('Ext.grid.Panel', {

			store : me.getStore(),
			/*
			 * width : 400, height : 200,
			 */
			title : 'Layers',
			columns : [ gridActionColumn/*
										 * { xtype : 'actioncolumn', width : 50,
										 * items : [ { icon :
										 * '../resource/silk-icons/control_play.png',
										 * tooltip : 'Apply', handler :
										 * function(grid, rowIndex, colIndex) { } } ] }
										 */, {
				text : 'Title',
				flex : 1,
				dataIndex : 'title'
				
					
			}, {
				text: "Layer Name",
				dataIndex : "name",
				flex: 1
				
			}]
		});
		this.grid = grid;

		/*
		 * form
		 */

		var form = new xt.create('Ext.Panel', {
			// title : 'Data',
			bodyStyle : 'padding:5px 5px 0',
			height : 384,
			layout : 'fit',
			defaults : {
				bodyPadding : 4
			},
			items : [ grid ]
		});

		this.form = form;
		return form;
	}

});



/* some temporary fixes end */

Oskari.clazz.define("Oskari.mapframework.bundle.WmsCapsBundleInstance", function(
		b) {
	this.name = 'WmsCaps';
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
					minScale: 40000,
					maxScale: 1
			
			},
			
			"start" : function() {

				if (this.mediator.getState() == "started")
					return;

				/** temporary * */
				this.libs = {
					ext : Oskari.$("Ext")
				};
				
				this.facade = Oskari.$('UI.facade');
				var sandbox = this.facade.getSandbox();
				this.sandbox = sandbox;
				
				this.adapt(sandbox);
				this.createModels();
				this.createStores();

				
				var def = this.facade.appendExtensionModule(this, this.name,
						this.eventHandlers, this, 'E', {
							'fi' : {
								title : 'WmsCaps'
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : 'Sade'
							}
						});
				this.def = def;
				
				this.loadWmsCaps();
				
				
				this.mediator.setState("started");
				return this;
			},
			
			fixLayerNameTemp: function(name) {
				return name;
			},
			
			playWmsLayer: function(rec) {
				var wmsname = rec.get('name');
				var name = rec.get('name');
				var url = this.caps.capability.request.getmap.href;
				var format = "image/png";
				
				this.layerManager.createLayer(this.fixLayerNameTemp(name),wmsname,true,null,url,format);
			},
			
			stopWmsLayer : function(rec) {
				var name = rec.get('name');
				this.layerManager.destroyLayer(this.fixLayerNameTemp(name));
			},
			
			loadWmsCaps: function() {
				var params = {};
				
				
				var wmsOptions = {
						 url: 'wms.xml',
				         params: OpenLayers.Util.upperCaseObject(params),
				            callback: function(request) {
				                this.handleResponse(request);
				            },
				            scope: this
				};
				OpenLayers.Request.GET(wmsOptions);
			},
			
			handleResponse: function(request) {
				 var format = new OpenLayers.Format.WMSCapabilities();
				 var doc = request.responseXML;
			        if(!doc || !doc.documentElement) {
			            doc = request.responseText;
			        }
			        var caps = format.read(doc);
			        
			        window.caps= caps;
			        
			        this.caps = caps;
			        this.getStore().loadData(caps.capability.layers);
				
			},
			
			getStore: function() {
				return this.store;
			},
			
			"init" : function(sandbox) {
				var ui = Oskari.clazz.create(
						'Oskari.mapframework.bundle.WmsCapsUI',
						this.libs, this);
				var lang = sandbox.getLanguage();
				ui.setLang(lang);
				this.ui = ui;
				ui.setLibs(this.libs);
				ui.setStore(this.getStore());
				ui.create();

				return ui.get();
			},
			
			createModels : function() {
				var xt = this.libs.ext;
				var me = this;

				if (!xt.ClassManager.get('WmsLayer')) {
					xt.define('WmsLayer', {
						extend : 'Ext.data.Model',
						fields : ['abstract',
							'authorityURLs',
							'bbox',
							'cascaded',
							'dimensions',
							'fixedHeight',
							'fixedWidth',
							'formats',
							'identifiers',
							'keywords',
							'llbbox',
							'metadataURLs',
							'name',
							'nestedLayers',
							'noSubsets',
							'opaque',
							'prefix',
							'queryable',
							'srs',
							'styles',
							'title' ]
					});
				}
			},

			/**
			 * 
			 */
			createStores : function() {

				var data = [];

				var xt = this.libs.ext;
				var me = this;
				var store = xt.create('Ext.data.Store', {
					model : 'WmsLayer',
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
							model : 'WmsLayer',
							root : 'layers'
						}

					}
				});
				this.store = store;
			},
			
			/**
			 * a lot of hacks to embed 2009 app to framework
			 */
			adapt: function(sandbox) {
				

				var xt = this.libs.ext;

				var bundleInstance = this;

				var me = this;
				
				function Layer(lm,layerId,spec) {
					this.layerId = layerId;
					this.layer = null;
					this.spec = spec;
					this.layerImpl = null;
					this.lm = lm;
				};
				Layer.prototype = {
						setOpacity: function(o) {
							this.opacity = o;
						},
						getVisibility : function() {
							return true;
						},
						addFeatures: function(feats) {
							var event = this.lm.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
									feats,
									"application/nlsfi-x-openlayers-feature",
									"EPSG:3067",
									"replace");
						
							this.lm.sandbox.notifyAll(event);

						},
						destroyFeatures : function(feats) {
							
						} 
				};

				function LayerManager(sandbox,defaults,shared) {
					
					this.layers = {};
					this.defaults = defaults;
					this.sandbox = sandbox;
					this.shared = shared;
				};
				
				
				
				
				LayerManager.prototype = {
					getName: function() {
						return me.getName();
					},
					createLayer : function(name, wmsname,visibility, styles,url,format) {
						if( this.shared && this.sharedLayer )
							return this.sharedLayer;
						
						var mapLayerId = "1", keepLayersOrder = true, isBasemap = false;
					
						var spec = {
							"name" : name,
							"wmsName" : wmsname,
							"type" : "maplayer", 
							"styles" : {
								"title" : "",
								"legend" : "",
								"name" : ""
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
							"wmsUrl" : url,
							"opacity" : 100,
							"checked" : "false"
						};
						
						
						
					var layer = new Layer(this,name,spec);
					this.layers[name] = layer;
					if( this.shared && !this.sharedLayer )
						this.sharedLayer = layer;
				
					try {
					

					var request = this.sandbox.getRequestBuilder(
					"AddExternalMapLayerRequest")( mapLayerId, spec );
					this.sandbox.request(this.getName(), request);
					} catch(err){
					}					
					/*
					 * Note: AfterAddExternalMapLayerEvent sets this.layer
					 */
					
					
					/*
					 * 
					 */
					var requestAddToMap = this.sandbox.getRequestBuilder(
							"AddMapLayerRequest")( mapLayerId,
							keepLayersOrder,null,true);
					requestAddToMap._isBasemap = false;
					//alert(requestAddToMap.isBasemap());

					this.sandbox.request(this.getName(), requestAddToMap);

					
					
					
					
					return layer;
					
					},
					unregisterLayerImpl: function(layername) {
						if( this.shared) 
							this.sharedLayer = null;
						else { 
							this.layers[layername] = null;
						}
					},
					
					registerLayerImpl: function(layer) {
						if( this.shared) 
							this.sharedLayer.layer = layer;
						else {
							var data = this.layers[layer.getId()];
							if( data ) 
								data.layer = layer;
						}
					},
					
					destroyLayers: function() {
						 for( p in this.layers ) {
							 this.destroyLayer(p); 
						 }
						
					},
					
					destroyLayer: function(layerId) {
						
						var requestRemovalFromMap = this.sandbox.getRequestBuilder(
								"RemoveMapLayerRequest")( layerId);

						this.sandbox.request(this.getName(), requestRemovalFromMap);

						
						/**
						 * remove map layer spec
						 */
						var request = this.sandbox.getRequestBuilder(
						"RemoveExternalMapLayerRequest")( layerId);

						this.sandbox.request(this.getName(), request);
						

					}
				};
				
				var lm = new LayerManager(sandbox,this.defaults,false);
				
				this.layerManager = lm;

			},

			/**
			 * notifications from bundle manager
			 */
			"update" : function(manager, b, bi, info) {
				manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
						+ info);
			},

			/**
			 * stop bundle instance
			 */
			"stop" : function() {

			
				this.layerManager.destroyLayers();
				
				this.facade.removeExtensionModule(this, this.name,
						this.eventHandlers, this, this.def);
				this.def = null;
				
				this.mediator.setState("stopped");

				return this;
			},
			
			eventHandlers : {
				
				"AfterMapMoveEvent" : function(event) {
					var me = this;
					var sandbox = this.sandbox;
				
					
					var scale = event.getScale();
					
					if( !( scale < this.defaults.minScale && 
							scale > this.defaults.maxScale ) ) 
						return;
					
					var n = event.getCenterY();
					var e = event.getCenterX();

					// TBD
					

				},
				"FeaturesGetInfoEvent" : function(event) {
					var layer = event.getMapLayer();
					var layerId = layer.getId();
					
					// check if this is 'ours'
					if( !this.layerManager.layers[layerId] )
						return;
					
					var sandbox = this.sandbox;
					sandbox.printDebug("Handling FeaturesGetInfoEvent for "+layerId);
					
					var xt = this.libs.ext;	
					var x0 = event.getLon();
					var y0 = event.getLat();
					
					var me = this;
	                var lonlat = new OpenLayers.LonLat(x0,y0);
	                
					// TBD GetFeatureInfo
					
				},
				"AfterAddExternalMapLayerEvent" : function(event) {
					var layer = event.getLayer();					
					this.layerManager.registerLayerImpl(layer);
					this.ui.refresh();
				},
				"AfterRemoveExternalMapLayerEvent" : function(event) {
					var layername = event.getMapLayerId();
					this.layerManager.unregisterLayerImpl(layername);
					this.ui.refresh();
				},
				'AfterMapLayerAddEvent' : function(event) {
					this.ui.refresh();
				},
				'AfterMapLayerRemoveEvent' : function(event) {
					this.ui.refresh();
				}
			},
			onEvent : function(event) {
				return this.eventHandlers[event.getName()].apply(this,
						[ event ]);
			},

			getName : function() {
				return this.__name;
			},
			__name : "Oskari.mapframework.bundle.WmsCapsBundleInstance"

		}, {
			"protocol" : [ 
			        "Oskari.bundle.BundleInstance",
			        "Oskari.mapframework.module.Module",
					"Oskari.mapframework.bundle.extension.Extension",
					"Oskari.mapframework.bundle.extension.EventListener"  ]
		});

