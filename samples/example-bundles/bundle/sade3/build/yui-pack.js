/* This is a unpacked Oskari bundle (bundle script version Thu Feb 23 2012 11:08:28 GMT+0200 (Suomen normaaliaika)) */ 
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

Oskari.clazz.define('Oskari.poc.sade3.Layer',
		function(lm,layerId,spec) {
					this.layerId = layerId;
					this.layer = null;
					this.spec = spec;
					this.layerImpl = null;
					this.lm = lm;
				},{
						getLayerId: function() {
							return this.layerId;
						},
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
									null);// "replace");
						
							this.lm.sandbox.notifyAll(event);

						},
						destroyFeatures : function() {
							var event = this.lm.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
									[],
									"application/nlsfi-x-openlayers-feature",
									"EPSG:3067",
									"replace");
						
							this.lm.sandbox.notifyAll(event);
						}
				});

Oskari.clazz.define('Oskari.poc.sade3.LayerManager',
				function(sandbox,layersAndWorkers,defaults,shared,name) {
					this.layersAndWorkers = layersAndWorkers;
					this.layers = {};
					this.defaults = defaults;
					this.sandbox = sandbox;
					this.shared = shared;
					this.name = name;
				},
				{
					getName: function() {
						return this.name;
					},
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
					         '<LineSymbolizer>'						+
					         	'<Stroke>'+
						            '          <CssParameter name="stroke">#a00000</CssParameter>'+
						           '           <CssParameter name="stroke-width">4</CssParameter>'+
						          '          </Stroke>'+
						         '     </LineSymbolizer>'+
					         '<PolygonSymbolizer>'						+
						      ' <Fill>'+
						              '        <CssParameter name="fill">#c0d0e0</CssParameter>'+
						             '       </Fill><Stroke>'+
						            '          <CssParameter name="stroke">#0000a0</CssParameter>'+
						           '           <CssParameter name="stroke-width">2</CssParameter>'+
						          '          </Stroke>'+
						         '     </PolygonSymbolizer>'+
					         
					         '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>'+
					         '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>'+
					         '</Rule></FeatureTypeStyle>'+
					        '</UserStyle></NamedLayer></StyledLayerDescriptor>'
					},
					
					createLayer : function(name, visibility, styles) {
						if( this.shared && this.sharedLayer )
							return this.sharedLayer;
						
						var mapLayerId = name, keepLayersOrder = true, isBasemap = false;
						var defaultSLD = this.styledLayerDescriptors['default'];
						var spec = {
							"name" : name,
							"wmsName" : "1",
							"orgName" : "SADE",
							"type" : "vectorlayer", 
							"styles" : {
								"title" : "Default",
								"legend" : "",
								"name" : "1"
							},
							"descriptionLink" : "http://en.wikipedia.org/",
							"leaf" : "true",
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
							"opacity" : 70,
							"checked" : "false",
							"styledLayerDescriptor" : 
								defaultSLD
						};
					
						
					var layer = Oskari.clazz.create('Oskari.poc.sade3.Layer',this,name,spec);
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
							keepLayersOrder);

					this.sandbox.request(this.getName(), requestAddToMap);
					

					
					
					
					
					return layer;
					
					},

					
					registerLayerImpl: function(layer) {
						
						console.log("### registerLayerImpl",layer);
						if( this.shared) 
							this.sharedLayer.layer = layer;
						else 
							this.layers[layer.getId()].layer = layer; 
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
						
						

					},
					
					/** mapadapter * */
					
					zoomTo: function(lon,lat,scale) {
						var zoom  = this.sandbox.getMap().getZoom();
						var req = this.sandbox.getRequestBuilder("MapMoveRequest")(lon,lat,zoom,false,20000);
						this.sandbox.request(this.name,req);
						
					},
					clearFeatures: function() {
						if( this.shared) 
							this.sharedLayer.destroyFeatures();
					},
					
					highlightMapLayer: function(){
						var mapLayerId =  this.sharedLayer.getLayerId();
				        this.sandbox.request(/** "SelectedLayersModule", */
				        		this.name,
				        		this.sandbox.getRequestBuilder('HighlightMapLayerRequest')(mapLayerId));
					},
					dimMapLayer: function(){
						var mapLayerId =  this.sharedLayer.getLayerId();
				        this.sandbox.request(/** "SelectedLayersModule", */
				        		this.name,
				        		this.sandbox.getRequestBuilder('DimMapLayerRequest')(mapLayerId));
					}

				});
	/**
	 * Bundle Instance
	 */


Oskari.clazz.define('Oskari.poc.sade3.SadeApp',function(a) {


	this.args = a || {};

	this.uiManager = null;

	this.core = null;

	this.userInterfaceLanguage = this.args.lang || "fi";

	this.locale = Oskari.clazz.create('Oskari.poc.sade3.SadeLocale',this.userInterfaceLanguage);

	this.worker = null;

	this.mediator = null;

	this.adapter = null;
	
	
	this.sandbox = null;
	
	this.layermanager  = null;
	
	

},{

	getWorker : function(w) {

		return this.worker;

	},

	setWorker : function(w) {

		this.worker = w;

	},

	getLocale : function() {

		return this.locale;

	},


	getMediator : function() {

		return this.mediator;

	},

	setMediator : function(m) {

		this.mediator = m;

	},

	setAdapter : function(a) {

		this.adapter = a;

	},

	getAdapter : function() {

		return this.adapter;

	},
	
	setSandbox: function(sb) {
		this.sandbox = sb;
	},
	getSandbox: function() {
		return this.sandbox;
	},
	setLayerManager: function(lm) {
		this.layermanager = lm;
	},
	getLayerManager: function() {
		return this.layermanager;
	}
	
});
/** free software (c) 2009-IV maanmittauslaitos.fi * */
Oskari.clazz.define('Oskari.NLSFI.OpenLayers.Strategy.QueuedTile', function(
		options) {

	var props = {
		/** op not in use */
		op : null,

		/** bounds OpenLayers.Bounds (either bounds or filter) for spatial query */
		bounds : null,

		/** feature used as spatial filter */
		feature : null,

		/** OpenLayers.Filter (either bounds or filter) */
		filter : null,

		/** optional list of qualified query property names */
		propertyNames : null,

		/** tileFeature for tile visualisation only */
		tileFeature : null,

		/** filterType FilterType OpenLayers.Filter.Spatial.*(String) */
		filterType : null
	};

	for (p in props)
		this[p] = props[p];

	this.op = options.op;
	this.filterType = options.filterType ? options.filterType
			: OpenLayers.Filter.Spatial.BBOX;

	this.bounds = options.bounds;
	this.feature = options.feature;
	this.tileFeature = options.tileFeature;
	this.filter = options.filter;
	this.propertyNames = options.propertyNames;

}, {

	/** shallow clone instance of queued tile */
	clone : function() {
		return Oskari.clazz.create(
				'Oskari.NLSFI.OpenLayers.Strategy.QueuedTile', {
					bounds : this.bounds.clone(),
					feature : this.feature,
					tileFeature : this.tileFeature
				});
	},

	CLASS_NAME : "NLSFI.OpenLayers.Strategy.QueuedTile"
});

Oskari.clazz.define('Oskari.NLSFI.OpenLayers.Strategy.TileQueue', function(
		options) {
	this.queue = [];
}, {

	getLength : function() {
		return this.queue.length;
	},

	/** pop a job from mid queue or from top if queue size is less than 4 */
	popJob : function() {
		var q = this.queue;
		var qLength = q.length;
		if (qLength === 0) {
			return null;
		}

		if (qLength < 4) {
			return q.shift(-1);
		}

		var tdef = null;
		var qIndex = Math.floor(qLength / 2);

		tdef = q[qIndex];
		this.queue = q.slice(0, qIndex).concat(q.slice(qIndex + 1));

		return tdef;
	},

	/** push a job as QueuedTile or a json object to queue */
	pushJob : function(obj) {
		this.queue.push(obj);
	},

	/** replace queue with an empty one */
	flushQueue : function() {
		this.queue = [];
	},

	CLASS_NAME : "NLSFI.OpenLayers.Strategy.TileQueue"
});
/** modifications free software  (c) 2009-IV maanmittauslaitos.fi **/
/** OpenLayers.Strategy.Grid CLONE - REVIEW NEEDED */
/*
 * Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license. See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */

Oskari.clazz.define('Oskari.NLSFI.OpenLayers.Strategy.QueuedTilesGrid',function(options) {

	var props = {
			
		    /**
			 * APIProperty: tileSize {<OpenLayers.Size>}
			 */
		    map: null,

		      // layer: null, // visualisation...
		    /**
			 * APIProperty: tileSize {<OpenLayers.Size>}
			 */
		    tileSize: null,

		      maxExtent: null,

		    /**
			 * Property: grid {Array(Array(<OpenLayers.Tile>))} This is an
			 * array of rows, each row is an array of tiles.
			 */
		    grid: null,


		    /**
			 * APIProperty: buffer {Integer} Used only when in gridded mode,
			 * this specifies the number of extra rows and colums of tiles on
			 * each side which will surround the minimum grid tiles to cover the
			 * map.
			 */
		    buffer: 0,

		    /**
			 * APIProperty: numLoadingTiles {Integer} How many tiles are still
			 * loading?
			 */
		    numLoadingTiles: 0

		    /**
			 * Constructor: OpenLayers.Layer.Grid Create a new grid layer
			 * 
			 * Parameters:
			 */
		    };
	for( p in props ) this[p] = props.p ;
	for( p in options ) this[p] = options.p;

    this.grid = [];
    

    
	},{
    

    /**
	 * APIMethod: destroy Deconstruct the layer and clear the grid.
	 */
    destroy: function() {
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
    },

    /**
	 * Method: clearGrid Go through and remove all tiles from the grid, calling
	 * destroy() on each of them to kill circular references
	 */
    clearGrid:function() {
        if (this.grid) {
            for(var iRow=0, len=this.grid.length; iRow<len; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0, clen=row.length; iCol<clen; iCol++) {
                    var tile = row[iCol];
                    tile.destroy();
                }
            }
            this.grid = [];
        }
    },

    /**
	 * APIMethod: clone Create a clone of this layer
	 * 
	 * Parameters: obj - {Object} Is this ever used?
	 * 
	 * Returns: {<OpenLayers.Layer.Grid>} An exact clone of this
	 * OpenLayers.Layer.Grid
	 */
    clone: function (obj) {

        if (obj == null) {
            obj = new OpenLayers.Layer.QueuedTilesGrid(this.map);
        }


        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }

        // we do not want to copy reference to grid, so we make a new array
        obj.grid = [];

        return obj;
    },

    /**
	 * Method: moveTo This function is called whenever the map is moved. All the
	 * moving of actual 'tiles' is done by the map, but moveTo's role is to
	 * accept a bounds and make sure the data that that bounds requires is
	 * pre-loaded.
	 * 
	 * Parameters: bounds - {<OpenLayers.Bounds>} zoomChanged - {Boolean}
	 * dragging - {Boolean}
	 */
    moveTo:function(bounds, zoomChanged) {

        bounds = bounds || this.map.getExtent();

        if (bounds != null) {

            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;

            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();


                // if the bounds have changed such that they are not even
                // *partially* contained by our tiles (IE user has
                // programmatically panned to the other side of the earth)
                // then we want to reTile (thus, partial true).
                //
                if (forceReTile || !tilesBounds.containsBounds(bounds, true)) {
                    this.initGriddedTiles(bounds);
                } else {
                    // we might have to shift our buffer tiles
                    this.moveGriddedTiles(bounds);
                }
        }
    },

    /**
	 * APIMethod: setTileSize Check if we are in singleTile mode and if so, set
	 * the size as a ratio of the map size (as specified by the layer's 'ratio'
	 * property).
	 * 
	 * Parameters: size - {<OpenLayers.Size>}
	 */
    setTileSize: function(size) {

    },



    /**
	 * APIMethod: getTilesBounds Return the bounds of the tile grid.
	 * 
	 * Returns: {<OpenLayers.Bounds>} A Bounds object representing the bounds
	 * of all the currently loaded tiles (including those partially or not at
	 * all seen onscreen).
	 */
    getTilesBounds: function() {
        var bounds = null;

        if (this.grid.length) {
            var bottom = this.grid.length - 1;
            var bottomLeftTile = this.grid[bottom][0];

            var right = this.grid[0].length - 1;
            var topRightTile = this.grid[0][right];

            bounds = new OpenLayers.Bounds(bottomLeftTile.bounds.left,
                                           bottomLeftTile.bounds.bottom,
                                           topRightTile.bounds.right,
                                           topRightTile.bounds.top);

        }
        return bounds;
    },


    /**
	 * Method: calculateGridLayout Generate parameters for the grid layout. This
	 * 
	 * Parameters: bounds - {<OpenLayers.Bound>} extent - {<OpenLayers.Bounds>}
	 * resolution - {Number}
	 * 
	 * Returns: Object containing properties tilelon, tilelat, tileoffsetlat,
	 * tileoffsetlat, tileoffsetx, tileoffsety
	 */
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;

        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;

        var offsetlat = bounds.top - (extent.bottom + tilelat);
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.bottom + tilerow * tilelat;

        return {
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },

    /**
	 * Method: initGriddedTiles
	 * 
	 * Parameters: bounds - {<OpenLayers.Bounds>}
	 */
    initGriddedTiles:function(bounds) {

        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus at least one for panning

        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) +
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);

        var extent = this.maxExtent;
        var resolution = this.map.getResolution();

        var tileLayout = this.calculateGridLayout(bounds, extent, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help
																// us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;

        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx;
        var startLon = tileoffsetlon;

        var rowidx = 0;

        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);


        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;

            do {
                var tileBounds =
                    new OpenLayers.Bounds(tileoffsetlon,
                                          tileoffsetlat,
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }

                tileoffsetlon += tilelon;
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols)

            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows)

        // shave off exceess rows and colums
        this.removeExcessTiles(rowidx, colidx);

    },


    /**
	 * APIMethod: addTile Gives subclasses of Grid the opportunity to create an
	 * OpenLayer.Tile of their choosing. The implementer should initialize the
	 * new tile and take whatever steps necessary to display it.
	 * 
	 * Parameters bounds - {<OpenLayers.Bounds>} position - {<OpenLayers.Pixel>}
	 * 
	 * Returns: {<OpenLayers.Tile>} The added OpenLayers.Tile
	 */

        addTile: function(bounds, position) {
                var bfix = bounds;// .transform(map.projection,
									// map.displayProjection);
                var boundsGeom = bfix.toGeometry();
              var boundsFeature = new OpenLayers.Feature.Vector(boundsGeom);

              this.layer.addFeatures([boundsFeature]);
              return new OpenLayers.Tile(this.layer,bounds,position,"",this.tileSize);
    },


    /**
	 * Method: moveGriddedTiles
	 * 
	 * Parameters: bounds - {<OpenLayers.Bounds>}
	 */
    moveGriddedTiles: function(bounds) {
        var buffer = this.buffer || 1;
        while (true) {
            var tlLayer = this.grid[0][0].position;
            var tlViewPort =
                this.map.getViewPortPxFromLayerPx(tlLayer);
            if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        };
    },

    /**
	 * Method: shiftRow Shifty grid work
	 * 
	 * Parameters: prepend - {Boolean} if true, prepend to beginning. if false,
	 * then append to end
	 */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];

        var resolution = this.map.getResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? grid.pop() : grid.shift();

        for (var i=0, len=modelRow.length; i<len; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },

    /**
	 * Method: shiftColumn Shift grid work in the other dimension
	 * 
	 * Parameters: prepend - {Boolean} if true, prepend to beginning. if false,
	 * then append to end
	 */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.map.getResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0, len=this.grid.length; i<len; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];

            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },

    /**
	 * Method: removeExcessTiles When the size of the map or the buffer changes,
	 * we may need to remove some excess rows and columns.
	 * 
	 * Parameters: rows - {Integer} Maximum number of rows we want our grid to
	 * have. colums - {Integer} Maximum number of columns we want our grid to
	 * have.
	 */
    removeExcessTiles: function(rows, columns) {

        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                tile.destroy();
            }
        }

        // remove extra columns
        while (this.grid[0].length > columns) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                tile.destroy();
           }
        }
    },

    /**
	 * Method: onMapResize For singleTile layers, this will set a new tile size
	 * according to the dimensions of the map pane.
	 */
    onMapResize: function() {
    },



    CLASS_NAME: "NLSFI.OpenLayers.Strategy.QueuedTilesGrid"
});
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */
/**
 * @requires OpenLayers/Strategy.js
 * @requires OpenLayers/Filter/Spatial.js
 */
/**
 * Class: OpenLayers.Strategy.QueuedTilesStrategy
 * A simple strategy that reads new features when the viewport invalidates
 *     some bounds.

 * We'll split requested area into a NUMBER of subrequests which we'll 
 * ask the protocol to fulfill sequentially. Subrequests are processed 'in background'
 *
 * Inherits from:
 *  - <OpenLayers.Strategy>
 */


Oskari.$('Oskari.NLSFI.OpenLayers.Strategy.QueuedTilesStrategy', OpenLayers.Class(OpenLayers.Strategy, {

    /** strategy  activates when map.getZoom() is equal or greater than minZoom */
    minZoom: 9, // 15

    /** option to keep loaded features (if set to true will eventually kill the browser) */
    keepFeatures: false,

    /**  A queue of pending layer operations */
    tileQueue: null,

    /** unload job requests  and optional tile visualisations */
    flushTileQueue: function() {
        var q = this.tileQueue.queue;

        var tileFeatures = [];
        for( var n = 0 ; n <q.length ; n++ ) {
            if( q[n].tileFeature != null ) {
                tileFeatures.push(q[n].tileFeature);
                q[n].tileFeature = null;
            }
        }
        if( tileFeatures.length > 0 ) {
            this.layer.destroyFeatures(tileFeatures);
        }
        this.tileQueue.flushQueue();

    },

    /** unload out of view features to save(?) some memory DID kill browser let's not */
    unloadOutOfViewFeatures: function() {

    },

    /** grid implementation that calculates tile bounds */
    grid: null,

    /** current data bounds */
    bounds: null,
    
    /**
     * Property: ratio
     * {Float} The ratio of the data bounds to the viewport bounds (in each
     *     dimension).
     */
    ratio: 1.2,

    /**
     * Property: response
     * {<OpenLayers.Protocol.Response>} The protocol response object returned
     *      by the layer protocol.
     */
    response: null,

    /** Create a new QueuedTilesStrategy strategy.*/
    initialize: function(options) {
        OpenLayers.Strategy.prototype.initialize.apply(this, [options]);
        this.tileQueue = options.tileQueue;
	
    },

    /**
     * Method: activate
     * Set up strategy with regard to reading new batches of remote data.
     * 
     * Returns:
     * {Boolean} The strategy was successfully activated.
     */
    activate: function() {
        var activated = OpenLayers.Strategy.prototype.activate.call(this);
        if(activated) {
	    this.grid = Oskari.clazz.create('Oskari.NLSFI.OpenLayers.Strategy.QueuedTilesGrid',{
	      map: this.layer.map, layer: this.layer,
		  maxExtent: this.layer.map.getMaxExtent(),
		  tileSize: this.layer.map.getTileSize()

            });
            this.layer.events.on({
                "moveend": this.updateMoveEnd,
                scope: this
            });
            this.layer.events.on({
                "refresh": this.updateRefresh,
                scope: this
            });
        }
       
        return activated;
    },
    

    
    /**
     * Method: deactivate
     * Tear down strategy with regard to reading new batches of remote data.
     * 
     * Returns:
     * {Boolean} The strategy was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
        if(deactivated) {
            this.layer.events.un({
                "moveend": this.update,
                scope: this
            });
            this.layer.events.un({
                "refresh": this.update,
                scope: this
            });
            this.grid.destroy();
            this.grid = null;
        }
        return deactivated;
    },

	updateRefresh: function(options) {
		this.update();
	},
	updateMoveEnd: function(options) {
		this.update();
	},

    /**
     * Method: update
     * Callback function called on "moveend" or "refresh" layer events.
     *
     * Parameters:
     * options - {Object} An object with a property named "force", this
     *      property references a boolean value indicating if new data
     *      must be incondtionally read.
     */
    update: function(options) {
        var mapBounds = this.layer.map.getExtent();
        this.grid.moveTo(mapBounds,true);
        this.flushTileQueue();
        window.console.log("FLUSHED TILE QUEUE");
        if( !this.keepFeatures ) {
            this.triggerUnload(mapBounds);
        }
        
        

        var mapZoom = this.layer.map.getZoom();
  
        
        if( mapZoom < this.minZoom ) {
            return;
        }
        this.triggerRead();

    },

    /**
     * Method: invalidBounds
     *
     * Parameters:
     * mapBounds - {<OpenLayers.Bounds>} the current map extent, will be
     *      retrieved from the map object if not provided
     *
     * Returns:
     * {Boolean} 
     */
    invalidBounds: function(mapBounds) {
        if(!mapBounds) {
            mapBounds = this.layer.map.getExtent();
        }
        return !this.bounds || !this.bounds.containsBounds(mapBounds);
    },

    /** killed browser destruction is the right thing to do */
    triggerUnload: function(bounds) {

        this.layer.destroyFeatures();

    },

    /**
     * Method: triggerRead
     *
     * Returns:
     * {<OpenLayers.Protocol.Response>} The protocol response object
     *      returned by the layer protocol.
     */
    triggerRead: function() {

        var gridGrid = this.grid.grid;
        var gridFeatures = [];

        for( var r =0 ; r < gridGrid.length ;r++ ) {
            for( var c =0 ; c < gridGrid[r].length ;c++ ) {
                var bs = gridGrid[r][c].bounds.clone();
                var wfsBounds =bs.clone();

                // just for drawing
                var ptFromA = new OpenLayers.Geometry.Point(bs.left,bs.bottom);
                var ptToA = new OpenLayers.Geometry.Point(bs.right,bs.top);
                var ptFromB = new OpenLayers.Geometry.Point(bs.left,bs.top);
                var ptToB = new OpenLayers.Geometry.Point(bs.right,bs.bottom);
                var boundGeomArea = new OpenLayers.Geometry.LineString([ptFromA,ptToB,ptToA,ptFromB,ptFromA]);
                var boundsFeature = new OpenLayers.Feature.Vector(boundGeomArea,{
                    featureClassName: this.CLASS_NAME,
                    description: "" //wfsBounds.toString()
                });
                boundsFeature.renderIntent = "tile";
                var qObj = new NLSFI.OpenLayers.Strategy.QueuedTile({
                    bounds: wfsBounds,
                    tileFeature: boundsFeature
                });
                this.tileQueue.pushJob(qObj);                
                gridFeatures.push(boundsFeature);
            }
        }
        window.console.log(this.tileQueue.getLength());
        this.layer.addFeatures(gridFeatures);

    },

/**
     * Method: merge
     * Given a list of features, determine which ones to add to the layer.
     *
     * Parameters:
     * resp - {<OpenLayers.Protocol.Response>} The response object passed
     *      by the protocol.
     */
    merge: function(resp) {
	  // this will NOT destroy ANY features 
	  // we'll just trigger a unload job
        // this.layer.destroyFeatures();
        var features = resp.features;
        if(features && features.length > 0) {
            this.layer.addFeatures(features);
        }
    },
   
    CLASS_NAME: "NLSFI.OpenLayers.Strategy.QueuedTilesStrategy" 
}));
Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.ArcInterPoints',
				OpenLayers
						.Class( {

							initialize : function() {
								return this;
							},
							arcInterPointsFromPosList : function(points) {
								return this.InterPoints(points[0], points[2],
										points[1], 7, 1.0);
							},
							InterPoints : function(xsys, xeye, x0y0,
									nrIntPoints, w) {

								// Laskee välipisteitä ympyrän kaarelle,
								// Math.pow(2,nrIntPoints)+1 kappaletta
								// Parametrit: katso metodi doInterPoints

								// double[] int_points;
								var int_points = [];

								// alle 1 metrin väleille ei lasketa
								// välipisteitä
								// double d = Point2D.distance(xs,ys,xe,ye);
								var d = xsys.distanceTo(xeye);
								if (d < 1) {
									int_points.push(xsys);
									int_points.push(xeye);
									return int_points;
								}

								int_points = this.doInterPoints(xsys.x, xsys.y,
										xeye.x, xeye.y, x0y0.x, x0y0.x,
										nrIntPoints, w);

								return int_points;

							},

							doInterPoints : function(xs, ys, xe, ye, x0, y0,
									nrIntPoints, w) {

								// Laskee Math.pow(2,nrIntPoints)+1 kappaletta
								// välipisteitä ympyrän kaarelle, jonka
								// parametrit ovat:
								// xs, ys = kaaren alkupisteen koordinaatit
								// xe, ye = kaaren loppupisteen koordinaatit
								// x0, y0 = kaarta vastaavan ympyrän
								// keskipisteen koordinaatit
								// w = painokerroin (weight)

								var vali_piste_lkm = Math.floor(Math.pow(2,
										nrIntPoints) + 1);

								if (nrIntPoints < 1) {
									return [];
								}

								var intPoints = new Array(vali_piste_lkm);// [];

								intPoints[0] = new OpenLayers.Geometry.Point(
										xs, ys);
								intPoints[vali_piste_lkm - 1] = new OpenLayers.Geometry.Point(
										xe, ye);

								for (k = nrIntPoints; k > 0; k--) {

									var k1 = Math.floor(Math.pow(2, k));
									var k2_ed = -1;
									for (k2 = 0; k2 < vali_piste_lkm; k2 += k1) {
										if (k2_ed > -1) {
											var apx = intPoints[k2_ed].x;
											var apy = intPoints[k2_ed].y;
											var lpx = intPoints[k2].x;
											var lpy = intPoints[k2].y;
											var valip = this.kaarenValipiste(
													apx, apy, lpx, lpy, x0, y0,
													w);
											intPoints[Math.floor((k2 - k2_ed)
													/ 2 + k2_ed)] = valip;
											if (w < 1.0)
												w = 1.1;
										}
										k2_ed = k2;
									}
								}

								return intPoints;

							},

							kaarenValipiste : function(xs, ys, xe, ye, x0, y0,
									w) {
								// xs, ys = kaaren alkupisteen koordinaatit
								// xe, ye = kaaren loppupisteen koordinaatit
								// w = paino (weight) keskipisteelle

								var sade;
								var sade1 = Math.sqrt((x0 - xs) * (x0 - xs)
										+ (y0 - ys) * (y0 - ys));
								var sade2 = Math.sqrt((x0 - xe) * (x0 - xe)
										+ (y0 - ye) * (y0 - ye));

								sade = Math.max(sade1, sade2);

								var suunta1 = Math.acos((xs - x0) / sade);

								if (ys < y0)
									suunta1 = -1 * suunta1;

								var suunta2 = Math.acos((xe - x0) / sade);
								if (ye < y0)
									suunta2 = -1 * suunta2;
								while (suunta2 < suunta1)
									suunta2 = suunta2 + 2 * Math.PI;
								var suunta3 = (suunta2 + suunta1) / 2.0;

								var arcx1 = Math.cos(suunta3) * sade + x0;
								var arcy1 = Math.sin(suunta3) * sade + y0;
								var et_1 = Math.sqrt((arcx1 - xs)
										* (arcx1 - xs) + (arcy1 - ys)
										* (arcy1 - ys));

								var arcx2 = x0 - Math.cos(suunta3) * sade;
								var arcy2 = y0 - Math.sin(suunta3) * sade;
								var et_2 = Math.sqrt((arcx2 - xs)
										* (arcx2 - xs) + (arcy2 - ys)
										* (arcy2 - ys));

								var vali_piste = new OpenLayers.Geometry.Point(
										0, 0);

								if (w < 1.0) {
									if (et_1 < et_2) {
										vali_piste.x = arcx2;
										vali_piste.y = arcy2;
									} else {
										vali_piste.x = arcx1;
										vali_piste.y = arcy1;
									}
								} else {
									if (et_1 < et_2) {
										vali_piste.x = arcx1;
										vali_piste.y = arcy1;
									} else {
										vali_piste.x = arcx2;
										vali_piste.y = arcy2;
									}
								}

								return vali_piste;

							}
						}));
/**
	
	2009-09 janne.korhonen<at>maanmittauslaitos.fi
	
	\LICENSE
	
	Class: NLSFI.OpenLayers.Format.GML.KTJkiiWFS

	Tämä luokka käsittelee WFS palvelun vastauksen.
	
	- Kiertää OpenLayers boundedBy projektiomuunnottomuus bugin
	- Lisää OpenLayersiin puuttuvan Arc käsittelyn, joka
		toteutetaan ensin Deegreen puuttuvan Arc käsittelyn vuoksi
			ns. proprietary extensiona eli hakkeroidaan
			
	TILAPÄINEN!		
	
	TÄMÄ KIERTÄÄ BUGIA 
	
**/

 // TEMP tän voi varmaan lopulta poistaa koko luokan
 // TEMP muuttuja tämä voi laittaa namespacesiin kohta
 var ktjkiiWfsNs = "http://xml.nls.fi/ktjkiiwfs/2010/02";
 var ktjkiiWfsNsPrefix = "ktjkiiwfs";
 
 

 Oskari
	.$('Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiWFS', OpenLayers.Class(OpenLayers.Format.GML.v3, 
 {
 	arcInterPoints: null,
 	alerted: true, // let's not
 	
 	stats: {},
 	
 	featureTypeSchema: null,
 	otherFeatureTypes: null,
 	knownFeatureTypes: {},
 	
    namespaces : {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
	    wfs: "http://www.opengis.net/wfs" 
    },

    initialize: function(options) {
        OpenLayers.Format.GML.v3.prototype.initialize.apply(this, [options]);
		
	  this.singleFeatureType = false;

	  this.namespaces[ktjkiiWfsNsPrefix] = ktjkiiWfsNs;
	  this.namespaceAlias[ktjkiiWfsNs] = ktjkiiWfsNsPrefix;
	  
	  //this.setNamespace("feature", ktjkiiWfsNs)
	  this.arcInterPoints = new (Oskari.$('Oskari.NLSFI.OpenLayers.Format.GML.ArcInterPoints'))();
	  
	  this.featureTypeSchema = options.featureTypeSchema;
	  this.otherFeatureTypes = options.otherFeatureTypes;
	  
	  if( this.featureTypeSchema != null )
		  this.knownFeatureTypes[this.featureTypeSchema.typeName] = this.featureTypeSchema;
	  if(	  this.otherFeatureTypes != null ) { 
		  for( var n = 0 ; n < 	  this.otherFeatureTypes.length ; n++ ) {
		  	 var ftSchema = this.otherFeatureTypes[n] ;
		  	 this.knownFeatureTypes[ftSchema.typeName] = ftSchema;
		  }
	  }
	  /*
	  var msg = "";
	  for( p in this.knownFeatureTypes ) {
	  	msg += p + " = "+this.knownFeatureTypes[p]+"\n";
	  }
	  window.alert(msg);
	  */
	  
    }, 
    readers: {
        "gml": OpenLayers.Util.applyDefaults({
                
     	"Curve": function(node, container) {
                var obj = {points: []};
                
					
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }	
				
				if( container.interpolate == "circularArc3Points" ) {
				    if( !this.alerted )  {
						this.alerted = true;
						window.alert(
						"OpenLayers 2.8 does not implement Curve Segment interpolation: "+container.interpolate);
					}
				
					// onkohan oikea, mutta kokeillaan
					
					// lasketaan pisteitä, jotta näyttää nätiltä
					// tarvittaisiin Weight tieto. ei jatketa tätä tän enempää
					var arcPoints = 
							obj.points; 
							//this.arcInterPoints.arcInterPointsFromPosList(obj.points );
					
					
	                container.components.push(
    	                new OpenLayers.Geometry.LineString(arcPoints)
                	);
				
				} else if( container.interpolate == "linear" ) {
	                container.components.push(
    	                new OpenLayers.Geometry.LineString(obj.points)
                	);
                }
         },
	      "*": function(node, obj) {
               this.readChildNodes(node, obj);
            }
        }, OpenLayers.Format.GML.v3.prototype.readers["gml"]),            
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Util.applyDefaults({
            
/*            "*": function(node, obj) {
               this.readChildNodes(node, obj);
            }*/
        }, OpenLayers.Format.GML.v3.prototype.readers["wfs"]),
	  "ktjkiiwfs": {

	  		 
			
			"_feature": 
			function(node,obj) {
				 var container = {
                 	interpolate: "linear",
                 	components: [], 
                 	attributes: {},
                 	features: obj.features,
                 	featSchema: obj.featSchema,
                 	featType: obj.featType
                 	
                 	};            
                               
//                 this.readKnownProperties(node, container);
                 this.readChildNodes(node, container);

                 // look for common gml namespaced elements
                 if(container.name) {
                     container.attributes.name = container.name;
                 }
                 
                 container.attributes.featType = obj.featType;
                 
	             var feature = new OpenLayers.Feature.Vector(
                     container.components[0], container.attributes
                 );
                 if (!this.singleFeatureType) {
                     feature.type = node.nodeName.split(":").pop();
                     feature.namespace = node.namespaceURI;
                 }
                 
                 var fid = node.getAttribute("fid") ||
                     this.getAttributeNS(node, this.namespaces["gml"], "id");
                 if(fid) {
                     feature.fid = fid;
                 }

                 if(container.bounds && feature.geometry ) {
                     feature.geometry.bounds = container.bounds;
                 }

                 if(this.internalProjection && this.externalProjection && feature.geometry) {
                     feature.geometry.transform(
		                this.externalProjection, this.internalProjection
                     );
                 }
                 
                 if( feature.geometry ) {
                 var statsKey = "geometry";
                 if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
				 else 
					this.stats[statsKey] += 1;
                 }
                 
                 obj.features.push(feature);
			},

            "*": function(node, obj) {
                      
 	            var local = node.localName || node.nodeName.split(":").pop();
 	            var ns = node.namespaceURI;
 	            
				if( ns == this.featureNS ) {
					if( this.stats[local] == null )
						this.stats[local] = 1;
					else
						this.stats[local] += 1;
				}
 	            
 	            if( ns == this.featureNS && local == this.featureType ) {
					obj.featType = local ;
 	            	obj.featSchema = this.knownFeatureTypes[local];
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else if( ns == this.featureNS && this.knownFeatureTypes[local] != null) {
 	            
 	            	var statsKey = "HACK_"+local;
 	            	if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
					else
						this.stats[statsKey] += 1;

					obj.featType = local ;
 	            	obj.featSchema = this.knownFeatureTypes[local];
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else if( ns == this.featureNS && local == "RekisteriyksikonPalstanTietoja" ) {
 	            
 	            	var statsKey = "HACK_"+local;
 	            	if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
					else
						this.stats[statsKey] += 1;
 	            
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else {
					 // Assume attribute elements have one child node and that the child
                    // is a text node.  Otherwise assume it is a geometry node.
                    if(node.childNodes.length == 0 ||
                       (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
                        if(this.extractAttributes) {
    			            var value = this.getChildValue(node);
    			            if( obj.attributes != null )
	                			obj.attributes[local] = value;
                        }
                    } 	            
 	            }
        	  
	            this.readChildNodes(node, obj);
            }
        }

    },
    
    
/*    readKnownProperties: function(node,obj) {
    
    	var atts = obj.attributes ;
    	var featSchema = obj.featSchema;
    	
    	var featSchemaProps = featSchema.properties;
    	
    	for( var n = 0 ; n < featSchemaProps
   	
    
    },
*/

    // DEBUG ONLY
    readNode: function(node, obj) {
        if(!obj) {
            obj = {};
        }
	  var nsAlias = this.namespaceAlias[node.namespaceURI];
        var group = this.readers[nsAlias];

           var local = node.localName || node.nodeName.split(":").pop();
        if(group) {

            var reader = group[local] || group["*"];
            if(reader) {
                reader.apply(this, [node, obj]);
            }
        }
        return obj;
    },
	
    read:  function(data) {

        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        
        
        this.stats = {};
        
        var features = [];
        this.readNode(data, {features: features});
        if(features.length == 0) {
            // look for gml:featureMember elements
            var elements = this.getElementsByTagNameNS(
                data, this.namespaces.gml, "featureMember"
            );
            if(elements.length) {
                for(var i=0, len=elements.length; i<len; ++i) {
                    this.readNode(elements[i], {features: features});
                }
            } else {
                // look for gml:featureMembers elements (this is v3, but does no harm here)
                var elements = this.getElementsByTagNameNS(
                    data, this.namespaces.gml, "featureMembers"
                );
                if(elements.length) {
                    // there can be only one
                    this.readNode(elements[0], {features: features});
                }
            }
        }

        return features;
    },

    CLASS_NAME: "NLSFI.OpenLayers.Format.GML.KTJkiiWFS"


    
  }));





/**
 * 
 * 2009-12 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.OpenLayers.Format.GML.WFSResponse
 * 
 * Tï¿½mï¿½ luokka kï¿½sittelee WFS palvelun vastauksen. Kerï¿½ilee jonkinmoisen
 * tilaston.
 * 
 * Jatkossa opetetaan kï¿½sittelemï¿½ï¿½n myï¿½s Exceptionit
 *  - Kiertï¿½ï¿½ OpenLayers boundedBy projektiomuunnottomuus bugin
 * 
 * 
 * 
 */

Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.WFSResponse',
				OpenLayers
						.Class(
								OpenLayers.Format.GML.v3,
								{
									arcInterPoints : null,
									alerted : true, // let's not

									stats : {},

									featureTypeSchema : null,
									otherFeatureTypes : null,
									knownFeatureTypes : {},

									namespaces : {
										gml : "http://www.opengis.net/gml",
										xlink : "http://www.w3.org/1999/xlink",
										xsi : "http://www.w3.org/2001/XMLSchema-instance",
										wfs : "http://www.opengis.net/wfs",
										ows : "http://www.opengis.net/ows"
									},

									initialize : function(options) {

										OpenLayers.Format.GML.v3.prototype.initialize
												.apply(this, [ options ]);

										this.singleFeatureType = false;

										this.namespaces[options.nsPrefix] = options.ns;
										this.namespaceAlias[options.ns] = options.nsPrefix;

										this
												.setNamespace("feature",
														options.ns)

										this.featureTypeSchema = options.featureTypeSchema;
										this.otherFeatureTypes = options.otherFeatureTypes;

										if (this.featureTypeSchema != null)
											this.knownFeatureTypes[this.featureTypeSchema.typeName] = this.featureTypeSchema;

										if (this.otherFeatureTypes != null) {
											for ( var n = 0; n < this.otherFeatureTypes.length; n++) {
												var ftSchema = this.otherFeatureTypes[n];
												this.knownFeatureTypes[ftSchema.typeName] = ftSchema;
											}
										}
									},

									readers : {
										// Kï¿½sitellï¿½ï¿½n ainakin
										// ExceptionReport
										// http://schemas.opengis.net/ows/1.1.0/owsExceptionReport.xsd
										"ows" : {
											"ExceptionReport" : function(node,
													obj) {

												var version = node
														.getAttribute("version");
												var exceptionsInfo = {
													version : version,
													exceptions : null
												};

												this.readChildNodes(node,
														exceptionsInfo);

												// laitetaan ihka oikea
												// JavaScript virhe
												// joskus
												if (exceptionsInfo.exceptions
														&& exceptionsInfo.exceptions.length > 0) {
													// throw exceptionsInfo;
													this.stats['ERROR_COUNT'] = exceptionsInfo.exceptions.length;
												}

											},
											"Exception" : function(node, obj) {

												var exceptionCode = node
														.getAttribute("exceptionCode");

												var exceptionInfo = {
													exceptionCode : exceptionCode,
													exceptionTexts : null
												};

												this.readChildNodes(node, obj);

												if (obj.exceptions == null)
													obj.exceptions = [];
												obj.exceptions
														.push(exceptionInfo);

											},
											"ExceptionText" : function(node,
													obj) {

												var exceptionText = this
														.getChildValue(node);
												// Viskotaan JavaScript
												// Exception

												if (obj.exceptionTexts == null)
													obj.exceptionTexts = [];
												obj.exceptionTexts
														.push(exceptionText ? exceptionText
																: "?");
												if (exceptionText)
													this.stats['ERROR_LAST'] = exceptionText;

											}
										},
										"gml" : OpenLayers.Util
												.applyDefaults(
														{
															"*" : function(
																	node, obj) {
																this
																		.readChildNodes(
																				node,
																				obj);
															}
														},
														OpenLayers.Format.GML.v3.prototype.readers["gml"]),

										"wfs" : OpenLayers.Util
												.applyDefaults(
														{},
														OpenLayers.Format.GML.v3.prototype.readers["wfs"]),

										"feature" : OpenLayers.Util
												.applyDefaults(
														{
															"_feature" : function(
																	node, obj) {
																var container = {
																	interpolate : "linear",
																	components : [],
																	attributes : {},
																	features : obj.features,
																	featSchema : obj.featSchema,
																	featType : obj.featType
																};
																// this.readKnownProperties(node,
																// container);
																this
																		.readChildNodes(
																				node,
																				container);

																// look for
																// common gml
																// namespaced
																// elements
																if (container.name) {
																	container.attributes.name = container.name;
																}

																// window.console.log("READING
																// at
																// "+obj.featType);

																container.attributes.featType = obj.featType;

																var feature = new OpenLayers.Feature.Vector(
																		container.components[0],
																		container.attributes);

																if (!this.singleFeatureType) {
																	feature.type = node.nodeName
																			.split(
																					":")
																			.pop();
																	feature.namespace = node.namespaceURI;
																}

																var fid = node
																		.getAttribute("fid")
																		|| this
																				.getAttributeNS(
																						node,
																						this.namespaces["gml"],
																						"id");
																if (fid) {
																	feature.fid = fid;
																}

																// siirretty
																// ennen
																// internal
																// external
																// transformia,
																// joka
																// tarvittaessa
																// poistaa
																// boundsin, jos
																// transformi
																// tehdï¿½ï¿½n
																// tï¿½mï¿½
																// aiheuttaa
																// hakujen
																// onnistumista,
																// mutta
																// mitï¿½ï¿½n ei
																// nï¿½y
																// virheen,
																// jos
																// tehdï¿½ï¿½n
																// vasta
																// transformin
																// jï¿½lkeen
																if (container.bounds
																		&& feature.geometry) {
																	feature.geometry.bounds = container.bounds;
																}

																if (this.internalProjection
																		&& this.externalProjection
																		&& feature.geometry) {
																	feature.geometry
																			.transform(
																					this.externalProjection,
																					this.internalProjection);
																}

																if (feature.geometry) {
																	var statsKey = "geometry";
																	if (this.stats[statsKey] == null)
																		this.stats[statsKey] = 1;
																	else
																		this.stats[statsKey] += 1;
																}

																obj.features
																		.push(feature);
															},

															"*" : function(
																	node, obj) {

																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																var ns = node.namespaceURI;

																if (ns == this.featureNS) {
																	if (this.stats[local] == null)
																		this.stats[local] = 1;
																	else
																		this.stats[local] += 1;
																}

																if (ns == this.featureNS
																		&& local == this.featureType) {
																	obj.featType = local;
																	obj.featSchema = this.knownFeatureTypes[local];
																	this.readers["feature"]["_feature"]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);

																} else if (ns == this.featureNS
																		&& this.knownFeatureTypes[local] != null) {

																	var statsKey = "HACK_"
																			+ local;
																	if (this.stats[statsKey] == null)
																		this.stats[statsKey] = 1;
																	else
																		this.stats[statsKey] += 1;

																	obj.featType = local;
																	obj.featSchema = this.knownFeatureTypes[local];
																	this.readers["feature"]["_feature"]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);

																} else {
																	// Assume
																	// attribute
																	// elements
																	// have one
																	// child
																	// node and
																	// that the
																	// child
																	// is a text
																	// node.
																	// Otherwise
																	// assume it
																	// is a
																	// geometry
																	// node.
																	if (node.childNodes.length == 0
																			|| (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {

																		if (this.extractAttributes) {
																			var value = this
																					.getChildValue(node);

																			// !=
																			// null
																			// lisï¿½tty
																			// muistaakseni
																			if (obj.attributes != null)
																				obj.attributes[local] = value;
																		}
																	}
																}

																this
																		.readChildNodes(
																				node,
																				obj);
															}

														},
														OpenLayers.Format.GML.Base.prototype.readers["feature"])
									},

									readNode : function(node, obj) {
										if (!obj) {
											obj = {};
										}

										var nsAlias = this.namespaceAlias[node.namespaceURI];
										var group = this.readers[nsAlias];

										var local = node.localName
												|| node.nodeName.split(":")
														.pop();
										if (group) {
											var reader = group[local]
													|| group["*"];
											if (reader) {
												reader.apply(this,
														[ node, obj ]);
											}
										}
										return obj;
									},

									read : function(data) {

										if (typeof data == "string") {
											data = OpenLayers.Format.XML.prototype.read
													.apply(this, [ data ]);
										}
										if (data && data.nodeType == 9) {
											data = data.documentElement;
										}

										this.stats = {};

										var features = [];
										this.readNode(data, {
											features : features
										});
										if (features.length == 0) {
											// look for gml:featureMember
											// elements
											var elements = this
													.getElementsByTagNameNS(
															data,
															this.namespaces.gml,
															"featureMember");
											if (elements.length) {
												for ( var i = 0, len = elements.length; i < len; ++i) {
													this
															.readNode(
																	elements[i],
																	{
																		features : features
																	});
												}
											} else {
												// look for gml:featureMembers
												// elements (this is v3, but
												// does no harm here)
												var elements = this
														.getElementsByTagNameNS(
																data,
																this.namespaces.gml,
																"featureMembers");
												if (elements.length) {
													// there can be only one
													this
															.readNode(
																	elements[0],
																	{
																		features : features
																	});
												}
											}
										}

										return features;
									},

									CLASS_NAME : "NLSFI.OpenLayers.Format.GML.WFSResponse"

								}));
/*
	2009-09 janne.korhonen<at>maanmittauslaitos.fi
	
	\LICENSE
	
	Class:  NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML
	
	Sovellettiin GML2 aikalaisformaatti MappletGML varten oma formaatti,
	jotta sisäkkäiset GML rakenteet ja Java Mappletin kannalta 
		'turhina' poisjätetyt featureMember
	sun muut elementit/elementtien puuttumiset siedetään.
	
 */
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/GML/Base.js
 */

/**
 * Class: NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML Parses Mapplet GML
 * version 2.
 * 
 * 
 * Tän vois opettaa käsittelee Featuret '@name' attribuutin perusteella tai
 * FeatureCollectionin
 * 
 * @typen perusteella
 * 
 * Inherits from: - <OpenLayers.Format.GML.Base>
 */
Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML',
				OpenLayers
						.Class(
								OpenLayers.Format.GML.Base,
								{

									alerted : 0,

									/**
									 * Property: schemaLocation {String} Schema
									 * location for a particular minor version.
									 */
									schemaLocation : "http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",

									/**
									 * Constructor: OpenLayers.Format.GML.v2
									 * Create a parser for GML v2.
									 * 
									 * Parameters: options - {Object} An
									 * optional object whose properties will be
									 * set on this instance.
									 * 
									 * Valid options properties: featureType -
									 * {String} Local (without prefix) feature
									 * typeName (required). featureNS - {String}
									 * Feature namespace (required).
									 * geometryName - {String} Geometry element
									 * name.
									 */
									initialize : function(options) {
										OpenLayers.Format.GML.Base.prototype.initialize
												.apply(this, [ options ]);
										return this;
									},

									/**
									 * Property: readers Contains public
									 * functions, grouped by namespace prefix,
									 * that will be applied when a namespaced
									 * node is found matching the function name.
									 * The function will be applied in the scope
									 * of this parser with two arguments: the
									 * node being read and a context object
									 * passed from the parent.
									 */
									readers : {

										/**
										 * pitää selvitää miksi pitää kopsia
										 * koko setti feature ns:n jotta toimii.
										 * 'VOI' seota siitä, että gml ==
										 * feature ns eli ei ole omaa featureNS.
										 */
										"feature" : OpenLayers.Util
												.applyDefaults(
														{
															"*" : function(
																	node, obj) {
																// The node can
																// either be
																// named like
																// the
																// featureType,
																// or it
																// can be a
																// child of the
																// feature:featureType.
																// Children can
																// be
																// geometry or
																// attributes.
																var name;
																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																if (!this.singleFeatureType
																		&& (OpenLayers.Util
																				.indexOf(
																						this.featureType,
																						local) != -1)) {
																	name = "_typeName";
																} else if (local == this.featureType) {
																	name = "_typeName";
																} else {
																	// Assume
																	// attribute
																	// elements
																	// have one
																	// child
																	// node and
																	// that the
																	// child
																	// is a text
																	// node.
																	// Otherwise
																	// assume it
																	// is a
																	// geometry
																	// node.
																	if (node.childNodes.length == 0
																			|| (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
																		if (this.extractAttributes) {
																			name = "_attribute";
																		}
																	} else {
																		name = "_geometry";
																	}
																}
																if (name) {
																	this.readers.feature[name]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);
																}
															},
															"_typeName" : function(
																	node, obj) {

																// feature:
																// obj.features
																// lisättiin,
																// jotta
																// ymmärtää
																// kiinteistön
																// palstat eli
																// palstat.xml

																var container = {
																	components : [],
																	attributes : {},
																	features : obj.features
																};
																this
																		.readChildNodes(
																				node,
																				container);
																// look for
																// common gml
																// namespaced
																// elements
																if (container.name) {
																	container.attributes.name = container.name;
																}

																// lisäys, jotta
																// saadaan
																// tyyppi
																// tietoon
																var featType = node
																		.getAttribute("name");
																if (featType)
																	container.attributes.featureClassName = featType;

																var feature = new OpenLayers.Feature.Vector(
																		container.components[0],
																		container.attributes);
																if (!this.singleFeatureType) {
																	feature.type = node.nodeName
																			.split(
																					":")
																			.pop();
																	feature.namespace = node.namespaceURI;
																}
																var fid = node
																		.getAttribute("fid")
																		|| this
																				.getAttributeNS(
																						node,
																						this.namespaces["gml"],
																						"id");
																if (fid) {
																	feature.fid = fid;
																}

																if (this.internalProjection
																		&& this.externalProjection
																		&& feature.geometry) {
																	feature.geometry
																			.transform(
																					this.externalProjection,
																					this.internalProjection);
																}
																if (container.bounds) {
																	feature.geometry.bounds = container.bounds;
																}

																if (feature.geometry != null) // skipataan
																								// sijainnittomat
																								// featuret
																	obj.features
																			.push(feature);
															},
															"_geometry" : function(
																	node, obj) {

																this
																		.readChildNodes(
																				node,
																				obj);
															},
															"_attribute" : function(
																	node, obj) {
																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																var value = this
																		.getChildValue(node);

																if (obj != null
																		&& obj.attributes) {
																	obj.attributes[local] = value;
																}

															},
															"LineString" : function(
																	node,
																	container) {

																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																if (!container.components) {
																	container.components = [];
																}
																container.components
																		.push(new OpenLayers.Geometry.LineString(
																				obj.points));
															},
															"coordinates" : function(
																	node, obj) {

																var str = this
																		.getChildValue(
																				node)
																		.replace(
																				this.regExes.trimSpace,
																				"");

																str = str
																		.replace(
																				this.regExes.trimComma,
																				",");
																var pointList = str
																		.split(this.regExes.splitSpace);
																var coords;
																var numPoints = pointList.length;
																var points = new Array(
																		numPoints);
																for ( var i = 0; i < numPoints; ++i) {
																	coords = pointList[i]
																			.split(",");
																	if (this.xy) {
																		points[i] = new OpenLayers.Geometry.Point(
																				coords[0],
																				coords[1],
																				coords[2]);
																	} else {
																		points[i] = new OpenLayers.Geometry.Point(
																				coords[1],
																				coords[0],
																				coords[2]);
																	}
																}

																obj.points = points;
															},

															"outerBoundaryIs" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																container.outer = obj.components[0];
															},
															"innerBoundaryIs" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																container.inner
																		.push(obj.components[0]);
															},
															"Box" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																if (!container.components) {
																	container.components = [];
																}
																var min = obj.points[0];
																var max = obj.points[1];
																container.components
																		.push(new OpenLayers.Bounds(
																				min.x,
																				min.y,
																				max.x,
																				max.y));
															}
														},
														OpenLayers.Format.GML.Base.prototype.readers["gml"]),
										"wfs" : OpenLayers.Format.GML.Base.prototype.readers["wfs"]

									},

									CLASS_NAME : "NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML"

								}));
/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.OpenLayers.Format.GML.KTJkiiAtp
 * 
 * Aineistopalvelun datan esittämiseen tehtiin luokka, joka ymmärtää
 * sijaintityypit, jotka PERIVÄT GML ComplexTypeistä eivätä ole suoraan GML
 * Elementtejä. Näitä eivät oletusclientit varmaan koskaan tule sulattamaan...
 *  // TEMP tän voi varmaan lopulta poistaa koko luokan // GML.v3 OLETUSTOTEUTUS
 * TEKEE OLETUKSIA, jotka estää ATP XML näkymästä // OpenLayersissa, joten tässä
 * pitää vähän fixaa // Tämä EI ole valmis // TEMP muuttuja tämä voi laittaa
 * namespacesiin kohta
 */
var kmltp = "http://ktjkii.nls.fi/aineistopalvelu/aineistosiirto";

Oskari.$('Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiAtp', OpenLayers.Class(
		OpenLayers.Format.GML.v3, {
			alerted : 0,

			namespaces : {
				gml : "http://www.opengis.net/gml",
				xlink : "http://www.w3.org/1999/xlink",
				xsi : "http://www.w3.org/2001/XMLSchema-instance",

				wfs : "http://www.opengis.net/wfs"
			},

			initialize : function(options) {
				if (options == null)
					options = {};

				options = OpenLayers.Util.extend(options, {
					featurePrefix : "kmltp",
					featureNS : kmltp,
					featureType : [ "Kiinteistoraja", "Palsta", "Rajamerkki",
							"Kayttooikeusyksikko" ],
					geometryName : "sijainti"
				});

				OpenLayers.Format.GML.v3.prototype.initialize.apply(this,
						[ options ]);

				this.namespaces["kmltp"] = kmltp;
				this.namespaceAlias[kmltp] = "kmltp";

			},

			readers : {
				"gml" : OpenLayers.Util.applyDefaults( {},
						OpenLayers.Format.GML.v3.prototype.readers["gml"]),

				"kmltp" : OpenLayers.Util.applyDefaults( {
					"TietoaKiinteistorekisterista" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"palstat" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"rajamerkit" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"kiinteistorajat" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"rekisteriyksikot" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"*" : function(node, obj) {
						// The node can either be named like the featureType, or
						// it
					// can be a child of the feature:featureType. Children can
					// be
					// geometry or attributes.
					var name;
					var local = node.localName
							|| node.nodeName.split(":").pop();

					if (!this.singleFeatureType
							&& (OpenLayers.Util
									.indexOf(this.featureType, local) != -1)) {
						name = "_typeName";
					} else if (local == this.featureType) {
						name = "_typeName";
					}

					if (name) {

						if (name == "_typeName")
							// window.alert("FEATURE "+local);

							this.readers["kmltp"][name].apply(this,
									[ node, obj ]);
					} else
						this.readChildNodes(node, obj);

				},
				"_typeName" : function(node, obj) {

					// window.alert("typeName");
					var container = {
						components : [],
						attributes : {}
					};
					this.readChildNodes(node, container);
					// look for common gml namespaced elements
					if (container.name) {
						container.attributes.name = container.name;
					}
					var feature = new OpenLayers.Feature.Vector(
							container.components[0], container.attributes);
					if (!this.singleFeatureType) {
						feature.type = node.nodeName.split(":").pop();
						feature.namespace = node.namespaceURI;
					}
					var fid = node.getAttribute("fid")
							|| this.getAttributeNS(node,
									this.namespaces["gml"], "id");
					if (fid) {
						feature.fid = fid;
					}
					if (this.internalProjection && this.externalProjection
							&& feature.geometry) {
						feature.geometry.transform(this.externalProjection,
								this.internalProjection);
					}
					if (container.bounds) {
						feature.geometry.bounds = container.bounds;
					}
					obj.features.push(feature);
				},
				"sijainti" : function(node, obj) {
					this.readChildNodes(node, obj);
				},

				"Alue" : function(node, obj) {
					this.readers.gml["Polygon"].apply(this, [ node, obj ]);
				},
				"Murtoviiva" : function(node, obj) {
					this.readers.gml["LineString"].apply(this, [ node, obj ]);
				},
				"Piste" : function(node, obj) {
					this.readers.gml["Point"].apply(this, [ node, obj ]);
				}

				}, OpenLayers.Format.GML.Base.prototype.readers["feature"])

			},

			CLASS_NAME : "NLSFI.OpenLayers.Format.GML.KTJkiiAtp"

		}));
/**

        /LICENSE


	WFSCapabilities
	
	lukee namespaces sisältävät WFS GetCapabilityt
	
	Kerätään rakenne, joka mukailee WFS_Capabilities rakennetta
	ja käsitteitä.
	
        Tuetaan taaksepäin yhteensopivasti OpenLayersin
        oletus WFSCapabilities Formaatin palauttamaa rakennetta.

        Tämä lukee myös osan ows formaatista ja ymmärtää nimiavaruudet
        toisin kuin OpenLayers oletustoteutus.
	
	
	Toimii myös IE6,7,8 kun vähennettiin rekursiota XML tulkitsemisessa.
	
	
**/

Oskari
		.$('Oskari.NLSFI.OpenLayers.Format.WFS.WFSCapabilities',OpenLayers.Class(OpenLayers.Format.XML, {
    
    statsFunc: null,
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs", // this is a convenience for reading wfs:FeatureCollection
        ogc: "http://www.opengis.net/ogc",
        xlink: "http://www.w3.org/1999/xlink",
        ows: "http://www.opengis.net/ows"
    },
    
    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "wfs",
    
	 regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    /**
     * Method: getChildValue
     *
     * Parameters:
     * node - {DOMElement}
     * nsuri - {String} Child node namespace uri ("*" for any).
     * name - {String} Child node name.
     * def - {String} Optional string default to return if no child found.
     *
     * Returns:
     * {String} The value of the first child with the given tag name.  Returns
     *     default value or empty string if none found.
     */
    getChildValue: function(node, nsuri, name, def) {
        var value;
        var eles = this.getElementsByTagNameNS(node, nsuri, name);
        if(eles && eles[0] && eles[0].firstChild
            && eles[0].firstChild.nodeValue) {
            value = eles[0].firstChild.nodeValue;
        } else {
            value = (def == undefined) ? "" : def;
        }
        return value;
    },
    
    getChildValueAsString: function(node, def) {
        var value = def || "";
        if(node) {
            for(var child=node.firstChild; child; child=child.nextSibling) {
                switch(child.nodeType) {
                    case 3: // text node
                    case 4: // cdata section
                        value += child.nodeValue;
                }
            }
        }
        return value;
    },
    

    /**
    */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);

        
    },    
  

    /*
     * Method: read
     *
     * Parameters:
     * data - {DOMElement}
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)} An array of features.
     */
    read: function(data) {
    
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var result = {capabilities:null};
        this.readNode(data, result);     
        return result.capabilities;
    },    
    
	readNode: function(node,obj) {
		
        var local = node.localName || node.nodeName.split(":").pop();		
        
		if( this.statsFunc ) 
			this.statsFunc(local);

		// alotta garbaccio 
	    if(!obj) 
            obj = {};

        var group = this.readers[node.namespaceURI ? 
        	this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
        if(!group) 
        	return obj;

		var reader = group[local] || group["*"];
        if(!reader) 
        	return obj;
 		
 		reader.apply(this, [node, obj]);

        return obj;
	
	},
	
	readChildNodes: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var children = node.childNodes;
        var child;
        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType != 1) 
            	continue;

	        var group = this.readers[child.namespaceURI ? 
	        	this.namespaceAlias[child.namespaceURI]: this.defaultPrefix];
	        
		    if(!group) 
		    	continue;
		        
	        var local = child.localName || child.nodeName.split(":").pop();		
        	var reader = group[local] || group["*"];
		    if(!reader) 
		    	continue;

            reader.apply(this, [child, obj]);
        }

        return obj;
    },	
    
       /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
    	"ows": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	    	
        	"*": function(node,obj) {
        		this.readChildNodes(node, obj);
        	},
    	
    		"ServiceProvider": function(node, obj) {    	
    			var providerName = this.getChildValue(node,this.namespaces.ows,"ProviderName",null);
    			var elProviderSite  = this.getChildValue(node,this.namespaces.ows,"ProviderSite",null);  
    			var ProviderSiteHRef = elProviderSite ? 
    				 this.getAttributeNS(elProviderSite, this.namespaces.xlink,"href"): null;
    			var ProviderSiteLinkType = elProviderSite ? 
    				 this.getAttributeNS(elProviderSite, this.namespaces.xlink,"type"): null;
    				
    			if( !obj.ows ) 
    				obj.ows = {};
    				
    			obj.ows['ServiceProvider'] = {    			
    				'ProviderName': providerName,
    				'ProviderSite': { 
	    				linkHref: ProviderSiteHRef,
    					linkType: ProviderSiteLinkType
    				}
    			};
    		},
    		
    		
    		// ServiceIdentification
    		"ServiceIdentification": function(node, obj) {

    			var serviceTitle = this.getChildValue(node,this.namespaces.ows,"Title",null);
    			var serviceAbstract = this.getChildValue(node,this.namespaces.ows,"Abstract",null);  
    				
    			if( !obj.ows ) 
    				obj.ows = {};
    				
    			obj.ows['ServiceIdentification'] = {
    				"Title": serviceTitle,
    				"Abstract": serviceAbstract
				};  			
    		},
    		"OperationsMetadata": function(node,obj) {
    		
    		//	<ows:OperationsMetadata xmlns:ows="http://www.opengis.net/ows">
    		},
    		"Operation": function(node,obj) {
    		},
    		"DCP": function(node,obj) {
    		
    		},
    		"Get": function(node,obj) {
    		},
    		"Post": function(node,obj) {
    		
    		},
    		"Parameter": function(node,obj) {

    		},
    		"Value": function(node,obj) {
    		},
    		"Constraint": function(node,obj) {
    		
    		}
    	},
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "wfs": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	        
        	"*": function(node,obj) {
        		this.readChildNodes(node, obj);
        	},
            "WFS_Capabilities": function(node, obj) {
            	var capabilities = {};
            	
            	// luetaan jotain tietoja
            	var version = node.getAttribute("version");
            	var updateSequence = node.getAttribute("updateSequence");            	
            	
            	capabilities.version = version;
            	capabilities.updateSequence = updateSequence;
            
                this.readChildNodes(node, capabilities);
                
                obj.capabilities = capabilities;
            },
            
            "FeatureTypeList": function(node,obj) {
            	var featureTypeList = {
	            	 featureTypes: []
            	};
            	
                this.readChildNodes(node, featureTypeList);
                
                obj.featureTypeList = featureTypeList;                
            },
            "FeatureType": function(node,obj) {
            
            	var featureTypes = obj.featureTypes;
            	var wfsNs = this.namespaces.wfs;
            	var featureTypeName = this.getChildValue(node,wfsNs,"Name");
            	var featureTypeTitle = this.getChildValue(node,wfsNs,"Title");
            	var featureTypeAbstract = this.getChildValue(node,wfsNs,"Abstract");
            	var defaultSRS = this.getChildValue(node,wfsNs,"DefaultSRS");
            	
            	
            	var parts = featureTypeName.split(":");

				var featureName = parts[1];
                var featurePrefix = parts[0];
                var featureNS = this.lookupNamespaceURI(node,featurePrefix);
           	           	
            	// wfs:otherSRS
            	// ows:KeyWords/ows:Keyword
            	// wfs:outputFormats/wfs:Format

            	var featureType = {

            		// from Schema
            		'Name': featureTypeName,
					'Title': featureTypeTitle,            		            		
					'DefaultSRS': defaultSRS,

					// Backwards compatibility
            		'name': featureTypeName,
            		'title': featureTypeTitle,
            		'abstract': featureTypeAbstract,

            		// Extensions
            		'featureTypeName': featureTypeName,
            		'featureName': featureName,    		
            		'featurePrefix': featurePrefix,            		
            		'featureNS': featureNS         		            		
            	};
            	
            	featureTypes.push(featureType);
            }
            
        },
        "ogc": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	
        	"Id_Capabilities": function(node,obj) {

        	},
        	"Spatial_Capabilities": function(node,obj) {
        		var spatialCapabilities = {};        		
        		this.readChildNodes(node, spatialCapabilities);
        		obj['Spatial_Capabilities'] = spatialCapabilities;
        	},        	
        	"GeometryOperands": function(node,obj) {
				var geometryOperands = {};        		
				// NOP
        		obj['GeometryOperands'] = geometryOperands;        	        	
        	},
        	"SpatialOperator": function(node,obj) {
       	
            	var operatorName = node.getAttribute("name");            
        		// OpenLayers.Filter.Spatial on vähän kehno...
        		// Sieltä puuttuu suurin osa toiminnoista ja
        		// loputkaan ei toimi..., joten pitää miettiä
        		// mitä tässä oikein laitetaan talteen
        		// periaatteessa vois laittaa talteen jonkun luokan
        		// jonka vois instansoida, mutta ei se tuollaisena
        		// toimi nyt
        		obj[operatorName] = operatorName;        		
        	},        	
        	"SpatialOperators": function(node,obj) {
				var spatialOperators = {};        		
        		this.readChildNodes(node, spatialOperators);
        		obj['SpatialOperators'] = spatialOperators;        	
        	
        	},
        	"Filter_Capabilities": function(node,obj) {        	
        		var filterCapabilities = {};      		
        		this.readChildNodes(node, filterCapabilities);       		        		
        		
        		
        		if( !obj.ogc )
        			obj.ogc = {};
        		
        		obj.ogc['Filter_Capabilities'] = filterCapabilities;
        		
                /*  WORK IN PROGRESS
        	
        	<ogc:Filter_Capabilities>
- <ogc:Spatial_Capabilities>
- <ogc:GeometryOperands>
  <ogc:GeometryOperand>gml:Envelope</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:Point</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:LineString</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:Polygon</ogc:GeometryOperand> 
  </ogc:GeometryOperands>
- <ogc:SpatialOperators>
  <ogc:SpatialOperator name="Within" /> 
  <ogc:SpatialOperator name="Intersects" /> 
  <ogc:SpatialOperator name="Overlaps" /> 
  <ogc:SpatialOperator name="BBOX" /> 
  <ogc:SpatialOperator name="DWithin" /> 
  <ogc:SpatialOperator name="Contains" /> 
  <ogc:SpatialOperator name="Equals" /> 
  <ogc:SpatialOperator name="Touches" /> 
  </ogc:SpatialOperators>
  </ogc:Spatial_Capabilities>
- <ogc:Scalar_Capabilities>
- <ogc:ComparisonOperators>
  <ogc:ComparisonOperator>EqualTo</ogc:ComparisonOperator> 
  </ogc:ComparisonOperators>
- <ogc:ArithmeticOperators>
  <ogc:SimpleArithmetic /> 
  </ogc:ArithmeticOperators>
  </ogc:Scalar_Capabilities>
- <ogc:Id_Capabilities>
  <ogc:EID /> 
  <ogc:FID /> 
  </ogc:Id_Capabilities>
  </ogc:Filter_Capabilities>
        	
        	*/
        	
        	
        	
        	
        	},
            "*": function(node, obj) {
                this.readChildNodes(node, obj);
            }
        }
    },
    
    CLASS_NAME: "NLSFI.OpenLayers.Format.WFS.WFSCapabilities"
}));
/**
	2009-09 janne.korhonen<at>maanmittauslaitos.fi
	
	\LICENSE
	
	
	Class: NLSFI.OpenLayers.Filter.LogoFilter
	
	MML logo sijaintirajaus:
	    
	    POLYGON((359805.51580930536 6700903.887126887,359357.49955983716 6700755.88175961,
	    359117.49085477553 6700527.8734911205,358909.48331041145 6700187.861160831,
	    358833.4805538576 6699863.849410737,358885.4824400446 6699471.835194731,
	    359001.4866476218 6699031.819237824,359245.4954978691 6698783.810244012,
	    359569.5072497832 6698583.802990895,359973.5219033377 6698519.800669874,
	    360361.53597649024 6698583.802990854,360737.5496143154 6698843.812419841,
	    360937.5568684308 6699127.822719232,361077.56194628496 6699491.835919925,
	    361085.562236367 6699911.8511514235,360941.5570133014 6700271.86420703,
	    360741.5497590546 6700599.876102138,360349.53554079356 6700803.883500259,
	    359873.5182757365 6700903.8871268835,358885.4824400216 6699579.839111333,
	    359149.49201566214 6699571.838821218,359777.5147938048 6700431.870009586,
	    359781.51493905747 6699599.839836584,359945.5208875227 6699603.839981678,
	    359949.5210326455 6699403.832728575,360625.5455518594 6699419.833308745,
	    359937.52059753076 6698751.809083476,359937.52059757215 6698547.801685277,
	    359933.5204524923 6698535.801250075,361077.5619462582 6699631.84099702,
	    359953.5211776948 6699615.8404168775,359897.51914624905 6700911.887416978,
	    359805.51580930536 6700903.887126887))
	    
	    Vol 2.
	    
	    POLYGON((359941.5207421652 6700959.88915778,359537.5060886213 6700907.887272,
	    359185.49332119426 6700639.877552817,358957.4850514025 6700319.865947829,
	    358857.4814243745 6699831.848250236,358877.48214989353 6699399.832583534,
	    359005.48679269303 6699087.821268725,359213.494337184 6698791.810534116,
	    359557.50681452954 6698563.802265495,359929.5203074105 6698483.799364276,
	    360469.53989376023 6698523.800814855,360793.55164551473 6698695.807052536,
	    361077.5619463554 6699123.822574126,361173.56542825536 6699635.841142121,
	    361101.5628166498 6700183.861015623,360817.5525156445 6700595.875957039,
	    360409.5377170379 6700875.88611146,359985.52233809367 6700943.888577476,
	    358873.48200475454 6699659.8420126345,359209.4941919229 6699639.841287316,
	    359765.5143585737 6700351.867108288,359749.5137783764 6699655.841867488,
	    359945.52088751295 6699651.841722376,359957.52132281434 6699431.833743976,
	    360617.5452616854 6699423.833453846,359957.5213229423 6698799.810824178,
	    359969.5217582603 6698495.799799475,361165.56513808714 6699667.842302621,
	    359977.52204818866 6699663.842157576,359973.52190285333 6700911.887416975,
	    359941.5207421652 6700959.88915778))
	
**/

Oskari
		.$('Oskari.NLSFI.OpenLayers.Filter.LogoFilter', OpenLayers.Class({

	wkt: null,
	   
	format: null,
	    
	feature: null,

	initialize: function() {
		   
		this.wkt = "POLYGON((359805.51580930536 6700903.887126887,359357.49955983716 6700755.88175961,"+
	    "359117.49085477553 6700527.8734911205,358909.48331041145 6700187.861160831,"+
	    "358833.4805538576 6699863.849410737,358885.4824400446 6699471.835194731,"+
	    "359001.4866476218 6699031.819237824,359245.4954978691 6698783.810244012,"+
	    "359569.5072497832 6698583.802990895,359973.5219033377 6698519.800669874,"+
	    "360361.53597649024 6698583.802990854,360737.5496143154 6698843.812419841,"+
	    "360937.5568684308 6699127.822719232,361077.56194628496 6699491.835919925,"+
	    "361085.562236367 6699911.8511514235,360941.5570133014 6700271.86420703,"+
	    "360741.5497590546 6700599.876102138,360349.53554079356 6700803.883500259,"+
	    "359873.5182757365 6700903.8871268835,358885.4824400216 6699579.839111333,"+
	    "359149.49201566214 6699571.838821218,359777.5147938048 6700431.870009586,"+
	    "359781.51493905747 6699599.839836584,359945.5208875227 6699603.839981678,"+
	    "359949.5210326455 6699403.832728575,360625.5455518594 6699419.833308745,"+
	    "359937.52059753076 6698751.809083476,359937.52059757215 6698547.801685277,"+
	    "359933.5204524923 6698535.801250075,361077.5619462582 6699631.84099702,"+
	    "359953.5211776948 6699615.8404168775,359897.51914624905 6700911.887416978,"+
	    "359805.51580930536 6700903.887126887))";
		this.format = new OpenLayers.Format.WKT();
		this.feature = this.format.read(this.wkt);	
	},
	

	CLASS_NAME: "NLSFI.OpenLayers.Filter.LogoFilter"
}));

/**
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * 
 * Class: NLSFI.Worker.Scheduler
 * 
 * Tï¿½mï¿½ luokka kï¿½skyttï¿½ï¿½ Worker luokkia .step() funktion kautta hakemaan lisï¿½ï¿½
 * kamaa.
 * 
 * Tï¿½hï¿½n vois lisï¿½tï¿½ try { } catch( err ) {}, jotta ei jï¿½mï¿½hdï¿½ ekaan
 * levinneeseen. TAI joku systeemi, ettï¿½ kï¿½yttï¿½jï¿½ saisi tiedon ja voisi edetï¿½
 * kuitenkin hommissaan. EI kuitenkaan laiteta alertia ja se pitï¿½isi poistaa
 * myï¿½s Workereistï¿½.
 * 
 * 
 * 
 */

Oskari.clazz.define('Oskari.NLSFI.Worker.Scheduler',function() {
	
	/**
	 * Property: workers
	 * 
	 * Worker .step() rajapinnan toteuttavat luokat, joita opastetaan tekemï¿½ï¿½n
	 * JOTAKIN
	 */
	this.workers = null ;

	/**
	 * 
	 */
	this.workersStats = null;

	/**
	 * Property: t
	 * 
	 * Timer, joka luodaan setInterval() kutsulla
	 */

	this.t = null;

	/**
	 * Property: tquit flag, joka laitetaan lopettamaan steppaus loop
	 */
	this.tquit = false;

	/**
	 * setIntervallin todellinen toistonopeus
	 */
	this.queueInterval = 250;

	/**
	 * step kutsujen todellinen toistovï¿½li
	 */
	this.queueSpeed = 1000;

	/**
	 * lastErrors viimeiset 16 virhettï¿½ on tï¿½ssï¿½ tallessa
	 */

	this.lastErrors = [];
	

},{

	/**
	 * tï¿½tï¿½ kutsutaan, kun hallitsematon virhe step() kutsussa ilmenee
	 */
	errorHandler : function(err) {
		window.alert(err.errorText);
	},

	/**
	 * tï¿½tï¿½ kutsutaan, kun on edetty suorittamisessa
	 */
	stepHandler : function(workersStats) {
	},

	/**
	 * Method: initialize constructor
	 * 
	 */

	

	/**
	 * alustaa workersiin joukon Worker rajapinnan toteuttavia olioita
	 */
	create : function(wrkrs) {
		this.workers = wrkrs;
		this.workersStats = [];

		for ( var n = 0; n < this.workers.length; n++) {
			this.workers[n].errorHandler = this.errorHandler;
			this.workersStats.push(this.workers[n].stats);
		}
	},

	pushWorker : function(w) {
		w.errorHandler = this.errorHandler;
		this.workers.push(w);
		this.workersStats.push(w.stats);
	},

	setQueueSpeed : function(val) {
		this.queueSpeed = val;
	},

	/**
	 * setInterval aiheuttaa kutsun workereistï¿½ virheet laitetaan listaan
	 * talteen ja kutsutaan errorHandler functiota
	 * 
	 */
	callbackFunc : function() {

		for ( var r = 0; r < this.workers.length; r++) {
			var w = this.workers[r];
			if (w != null) {
				try {
					w.step();
				} catch (err) {
					if (this.lastErrors.length > 15)
						this.lastErrors.shift();
					var dte = new Date();
					var errJSON = {
						timestamp : dte,
						errorText : dte.toUTCString() + ": " + err
					};
					this.lastErrors.push(errJSON);
					this.errorHandler(errJSON);
				}
			}
		}
		this.stepHandler(this.workersStats);

	},

	/**
	 * tï¿½llï¿½ kï¿½ynnistetï¿½ï¿½n taustatoiminnot
	 */
	startWorker : function() {
		var mediator = this;
		this.t = setInterval(function() {
			mediator.callbackFunc();
		}, this.queueInterval);
	},
	/**
	 * tï¿½llï¿½ lopetetaan taustatoiminnot
	 */
	stopWorker : function() {
		this.tquit = true;
		if (this.t != null)
			clearInterval(this.t);
	},

	CLASS_NAME : "NLSFI.Worker.Scheduler"
});
/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.Worker.WFSWorker
 * 
 * Tï¿½mï¿½ muodostaa WFS GetFeature pyynnï¿½n ja tulkitsee vastauksen
 * responseFormat mukaisesti.
 * 
 * Kï¿½sittelee jonoon laitettuja palvelupyyntï¿½jï¿½ Schedulerin tahdittamana
 * ja hakee aineistoa layer luokkamuuttujan OpenLayers.Layeriin
 * 
 * Lï¿½hettï¿½ï¿½ WFS pyynnï¿½n POST menettelyllï¿½. KVP pyyntï¿½ï¿½ ei ole
 * toteutettu loppuun.
 * 
 * Sisï¿½ltï¿½ï¿½ 'jonkin verran' WFS protokollan toiminnallisuutta, mutta
 * toisaalta on yhteensopiva jonoutumiskï¿½sittelyn kanssa.
 * 
 * featureType = kohde joita haetaan (ja siihen liittyviï¿½) ns ja nsPrefix on
 * kohteen nimiavaruuden mï¿½ï¿½ritykset geometryName on sijaintikohde, johon
 * sijaintirajaus kohdistuu
 * 
 * job.propertyNames tai featurePropertyNames voi rajata mitï¿½ haetaan
 * 
 * create() metodi varsinaisesti luo tï¿½mï¿½n. initialize() alustaa
 * vajavaisesti.
 * 
 * Tï¿½SSï¿½ ON BUGI, jos dataProj ei ole sama kuin mapProj. Kiertotienï¿½:
 * asetetaan responseFormat.externalProjection ja
 * responseFormat.internalProjection create() kutsun jï¿½lkeen vielï¿½
 * kohdalleen
 * 
 */

Oskari.clazz.define('Oskari.NLSFI.Worker.WFSWorker',function(popts)  {

	var options = popts||{};
	
	var baseProps= {
			description : null,
			stats : null,

			/**
			 * Property: workerCount
			 * 
			 * kï¿½ytetï¿½ï¿½n hakujen toiston hidastamiseen JavaScript ajastus
			 * toistaa intervallia vakioidulla frekvenssillï¿½ ja tï¿½llï¿½
			 * hidastetaan hakujen suoritusta
			 */

			workerCount : 0,

			/**
			 * Property: processedRequests et. al.
			 * 
			 * Kï¿½ytetï¿½ï¿½n tilastojen kerï¿½ï¿½miseen ja visualisointiin
			 * Nollataan vï¿½lillï¿½
			 */

			processedRequests : 0,
			cancelledRequests : 0,
			cancelledPending : 0,
			cancelledOutOfView : 0,
			cancelledExists : 0,
			loadedSnapshot : 0,
			unloadedSnapshot : 0,
			errorsEncountered : 0,
			hasGaugeChanged : true,

			/**
			 * tilastoja varten muutamat perustiedot tï¿½hï¿½n talteen
			 */
			statsDataFeatureCount : 0,
			statsDataErrorCount : 0,
			statsDataProcessTime : 0,

			/**
			 * Property: request
			 * 
			 * HTTP Request, joka on JUST menossa. Vain yksi kerrallaan.
			 * 
			 */
			request : null,

			/**
			 * 
			 * Property: layer
			 * 
			 * Layer, johon tï¿½mï¿½ Worker hakee aineistoa. PITï¿½ISI olla TILE
			 * 
			 */
			layer : null,

			/**
			 * Property: statsFuncs
			 * 
			 */
			statsFuncs : null,

			/**
			 * Property: responseStats
			 * 
			 * Rakenne, johon tallennetaan aikaleimoja
			 */
			responseStats : null,

			/**
			 * Property: requestFormat
			 * 
			 * OpenLayers.Format pohjainen formaatti, jonka mukaisia
			 * pyyntï¿½jï¿½ lï¿½hetetï¿½ï¿½n
			 * 
			 */

			requestFormat : null,

			/**
			 * Property: responseFormat
			 * 
			 * OpenLayers.Format pohjainen formaatti, jonka mukaisia vastauksia
			 * tulkitaan
			 * 
			 */
			responseFormat : null,

			/**
			 * Property: map
			 * 
			 * OpenLayers.Map, joka esittï¿½ï¿½ aineistoa, mutta miksi
			 * tï¿½ï¿½llï¿½ ?
			 * 
			 */
			map : null,

			/**
			 * Property: mapProj
			 * 
			 * Projektio, jossa aineisto esitetï¿½ï¿½n (asetetaan Mappletissa)
			 * 
			 */
			mapProj : null,

			/**
			 * Property: dataProj
			 * 
			 * Projektio, jossa tï¿½mï¿½ LayerWorker hakee aineistoa
			 * 
			 */
			dataProj : null,

			/**
			 * Property: url
			 * 
			 * Palvelun URL osoite
			 * 
			 */
			url : null,

			/**
			 * Property: strategy
			 * 
			 * Kï¿½ytï¿½nnï¿½ssï¿½ aina
			 * NLSFI.OpenLayers.Strategy.QueuedTilesStrategy, joka osaa kasata
			 * TILETYT palvelupyynnï¿½t jonoon
			 */
			strategy : null,

			/**
			 * Property: tileQueue
			 * 
			 * NLSFI.OpenLayers.Strategy.TileQueue, johon kerï¿½tï¿½ï¿½n
			 * palvelupyyntï¿½jï¿½ varten tietoja
			 * NLSFI.OpenLayers.Strategy.QueuedTile -olioina
			 */
			tileQueue : null
	};
	
	var props = {
			/**
			 * 
			 * Kï¿½siteltï¿½vï¿½n nimiavaruuden tiedot
			 * 
			 */

			ns : null,
			nsPrefix : null,

			/**
			 * Property: featureType,
			 * 
			 * mitï¿½ haetaan
			 * 
			 */
			featureType : null,

			/**
			 * Property: geometryName
			 * 
			 * Hakuihin kï¿½ytettï¿½vï¿½n sijaintikentï¿½n nimi
			 * 
			 */
			geometryName : null,

			/**
			 * Property: featurePropertyNames
			 * 
			 * Tï¿½llï¿½ voi rajata haettavia kohteita ILMAN featurePrefix!!
			 * 
			 */

			featurePropertyNames : null

			/**
			 * Method: initialize
			 * 
			 * Alustaa luokan ja kutsuu superclassin constructoria
			 * 
			 */
	};
	
	for( p in baseProps ) this[p] = baseProps[p];
	for( p in props ) this[p] = props[p];
	
	this.stats = {
			queued : 0,
			processed : 0,
			totalt : 0
		};

		this.statsFuncs = {
			queueStatus : function(qv, pv, cancelledRequests, cancelledPending,
					cancelledOutOfView, unloadedSnapshot, loadedSnapshot,
					errorsEncountered, totalt) {
			},
			requestStatus : function(req, requestStr, bbox, geom) {
			},
			responseStatus : function(doc, feats, stats) {
			}
		};

		this.strategy = options.strategy;
		this.tileQueue = this.strategy.tileQueue;


	this.featureType = options.featureType;
	this.description = options.description || options.featureType;

	this.geometryName = options.geometryName;
	this.ns = options.featureNS;
	this.nsPrefix = options.featurePrefix;
	this.responseFormat = options.responseFormat;
	
},{

			

			/**
			 * Method: create
			 * 
			 * create( Layer, Map, mapProj, dataProj, URL )
			 * 
			 * Tï¿½mï¿½ alustaa luokkamuuttujat ja luo requestFormatin sekï¿½
			 * responseFormatin, joilla palvelupyyntï¿½ luodaan ja vastaus
			 * tulkitaan.
			 * 
			 */
			create : function(k, m, mp, dp, wu) {
				this.layer = k;
				this.map = m;
				this.mapProj = mp;
				this.dataProj = dp;
				this.url = wu;

				this.responseStats = {
					requestTS : null,
					responseTS : null,
					processedTS : null
				};

				this.requestFormat = OpenLayers.Format.WFST( {
					version : "1.1.0",
					featureType : this.featureType,
					geometryName : this.nsPrefix + ":" + this.geometryName,
					featurePrefix : this.nsPrefix,
					featureNS : this.ns,
					srsName : this.dataProj.getCode()
				});

				// this.responseFormat = null; // PITï¿½ï¿½ LAITTAA PERITYSSï¿½

			},

			/**
			 * Method: processResponse
			 * 
			 * Tï¿½mï¿½ kï¿½sittelee WFS Responsen Formatin mukaisesti ja
			 * lisï¿½ï¿½ Featuret Layeriin.
			 * 
			 * Tï¿½tï¿½ kutsutaan OpenLayers.Request oliosta 'callback'
			 * menettelyllï¿½
			 * 
			 */

			processResponse : function(request,opts) {

				this.responseStats.responseTS = new Date();

				var doc = request.responseXML;
				if (!doc || !doc.documentElement) {
					doc = request.responseText;
				}

				var feats = this.responseFormat.read(doc);

				this.layer.addFeatures(feats);

				this.responseStats.processedTS = new Date();

				if (feats && feats.length)
					this.statsDataFeatureCount += feats.length;
				var stats = this.responseFormat.stats;
				if (stats) {
					var errs = stats['ERROR_COUNT'] ? stats['ERROR_COUNT'] : 0;
					this.statsDataErrorCount += errs;
				}

				this.statsFuncs.responseStatus(doc, feats, this.responseStats,
						stats); // extension...
				if( opts.callback && opts.scope ) {
					window.console.log("Worker Callback");
					
					OpenLayers.Function.bind(opts.callback,opts.scope)(opts.args,feats,request,opts.request);
					
				} 
				

				
				// let's release request
				this.request = null;
				this.loadedSnapshot++;

				doc = null;
				feats = null;
				
				
				
				
				

			},

			/**
			 * Method: processJob
			 * 
			 * Tï¿½mï¿½ muodostaa palvelupyynnï¿½n ja lï¿½hettï¿½ï¿½ WFS
			 * GetFeature pyynnï¿½n POST menettelyllï¿½.
			 * 
			 */

			processJob : function(job) {

				if (job == null)
					return;

				var feat = job.feature;
				var bbox = job.bounds;

				var wfsFilter = job.filter;

				var reqProps = job.propertyNames || this.featurePropertyNames;

				var wfsProps = null;

				if (bbox == null && feat == null && wfsFilter == null)
					return;
				window.console.log("processJob...BBOX/FEAT/FILTER "+bbox);
				if (bbox != null
						&& (isNaN(bbox.left) || isNaN(bbox.top)
								|| isNaN(bbox.right) || isNaN(bbox.bottom)))
					return;

				var getFeatureObj = null;
				var filterObj = null;

				if (reqProps != null && reqProps.length > 0) {
					wfsProps = [];
					var nsPrefixed = this.nsPrefix + ':';

					var msg = "";

					for ( var n = 0; n < reqProps.length; n++) {
						var propName = nsPrefixed + reqProps[n];
						wfsProps.push(propName);

						msg += propName + "\n";
					}
				}

				var epsgExt = null;
				var epsgFeatGeom = null;

				if (bbox != null) {
					epsgExt = bbox.clone().transform(this.mapProj,
							this.dataProj);

					wfsFilter = new OpenLayers.Filter.Spatial( {
						type : OpenLayers.Filter.Spatial.BBOX,
						value : epsgExt,
						projection : this.dataProj.getCode()
					});

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};

					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);

				} else if (feat != null && feat.geometry != null) {

					var epsgFeatGeom = feat.geometry.clone().transform(
							this.mapProj, this.dataProj);

					var filterType = job.filterType ? job.filterType
							: OpenLayers.Filter.Spatial.INTERSECTS;

					if (filterType == OpenLayers.Filter.Spatial.BBOX)
						epsgFeatGeom = epsgFeatGeom.getBounds();

					wfsFilter = new OpenLayers.Filter.Spatial( {
						type : filterType,
						value : epsgFeatGeom,
						projection : this.dataProj.getCode()
					});

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};
					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);
				} else if (wfsFilter != null) {

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};
					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);

				} else {
					return;
				}

				if (getFeatureObj != null) {
					// document.getElementById('log_request').innerText =
					// getFeatureObj;
				} else {
					window.console.log("getFeatureObj == null");

					return;
				}

				this.statsFuncs.requestStatus(wfsFilter, getFeatureObj,
						epsgExt, epsgFeatGeom);

				// jos ed. pyyntï¿½ menossa perutaan
				if (this.request != null) {
					this.request.abort();
					this.request = null;
					this.cancelledRequests++;
				}

				// aikaleimoja
				this.responseStats.requestTS = new Date();
				this.responseStats.responseTS = null;
				this.responseStats.processedTS = null;

				// lï¿½hetetï¿½ï¿½n pyyntï¿½
				// window.console.log("OpenLayers.Request.POST...");
				
				var url = this.url;
				
				// window.console.log(""+url);

				var mediator = this;
				
				this.request = OpenLayers.Request.POST( {
					url : this.url,
					success : function(r) {
						mediator.processResponse(r,{
							callback: job.callback,
							scope: job.scope,
							args: job.args,
							request: getFeatureObj
						});
					},
					failure : this.processFailure,
					scope : this,
					data : getFeatureObj
				});

				// ja jatketaan processResponsessa tai SUPER.processFailuressa
			},

			CLASS_NAME : "NLSFI.Worker.WFSWorker",
			
			/**
			 * Method: setQueueSpeed
			 * 
			 * Asetetaan jonon purkamisen hidastus
			 */

			setQueueSpeed : function(val) {
				this.queueSpeed = val;
			},

			/**
			 * Method: step
			 * 
			 * Tï¿½tï¿½ Scheduler kutsuu ajaakseen Workeria hakemaan aineistoa
			 * palvelusta
			 * 
			 */

			step : function() {

				if (this.layer.getVisibility() == false) {
					this.stats.queued = 0;
					this.stats.processed = 0;
					this.stats.totalt = 0;

					return;
				}

				
				if (this.queueSpeed == 0)
					return;

				
				this.workerCount += this.queueInterval;
				if (this.workerCount < this.queueSpeed) {
					return;
				}
				this.workerCount = 0;

				
				if (this.request != null)
					return;

				
				var qv = this.tileQueue.getLength();
				var pv = this.processedRequests;
				
				
				var totalt = qv + pv;

				this.stats.queued = qv;
				this.stats.processed = pv;
				this.stats.totalt = totalt;

				this.statsFuncs.queueStatus(qv, pv, this.cancelledRequests,
						this.cancelledPending, this.cancelledOutOfView,
						this.unloadedSnapshot, this.loadedSnapshot,
						this.errorsEncountered, totalt);

				// Tarkistetaanko onko jonoumaa
				var localQLength = qv;
				if (localQLength == 0) {
					this.processedRequests = 0;
					this.cancelledRequests = 0;
					this.cancelledPending = 0;
					this.cancelledOutOfView = 0;
					this.cancelledExists = 0;
					this.unloadedSnapshot = 0;
					this.loadedSnapshot = 0;
					return;
				}
		        window.console.log("Step..."+qv);
				this.popJob();

			},

			errorHandler : function(err) {
				window.alert(this.CLASS_NAME + ":" + err);
			},

			popJob : function() {
				
				var nextJob = this.tileQueue.popJob();
				if (nextJob == null)
					return false;
				var feat = nextJob.tileFeature;
				if (feat != null) {
					this.layer.destroyFeatures( [ feat ]);
					nextJob.tileFeature = null;
				}
				try {
					this.processJob(nextJob);
				} catch (err) {
					window.alert(err);
					this.errorsEncountered++;
				}
				nextJob.bounds = null;
				nextJob = null;

				this.processedRequests++;
				this.hasGaugeChanged = true;

				return true;
			},
			
			processFailure : function(request) {

				this.request = null;

				this.responseStats.requestTS = new Date();
				this.responseStats.processedTS = this.responseStats.requestTS;

				this.errorsEncountered++;

				var errMsg = 'PROTOCOL FAILURE';
				var errJSON = {
					errorText : errMsg
				};
				this.errorHandler(errJSON);
			}

			

		});
 Oskari.clazz.define('Oskari.poc.sade3.service.KTJkiiWFS',
		function(mapplet, url) {
			this.mapplet = mapplet;
			this.url = url;

		}, {

			/**
			 * 
			 */
			KiinteistorajanSijaintitiedot : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "KiinteistorajanSijaintitiedot",
					geometryName : "sijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"KiinteistÃ¶rajat (KTJkii-WFS) Live", true, false,
						featureOpts, ktjkiiWfsUrl);
				wfsLwq.worker.featurePropertyNames = [ 'sijainti' ];
				wfsLwq.layer.previewTile = 'kiinra';

				return wfsLwq;
			},

			/**
			 * 
			 */
			PalstanTunnuspisteenSijaintitiedot : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "PalstanTunnuspisteenSijaintitiedot",
					geometryName : "tunnuspisteSijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#800000',
						label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
					}),
					"tile" : new OpenLayers.Style( {
						strokeColor : "#008080",
						strokeWidth : 5,
						fillColor : "#ffcc66",
						fillOpacity : 0.5
					}),
					"select" : new OpenLayers.Style( {
						fillColor : "#66ccff",
						strokeColor : "#3399ff"
					})
				});
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"Palstan tunnuspisteet (KTJkii-WFS) Live", true, false,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.strategy.minZoom = 10;
				wfsLwq.layer.previewTile = 'pts';

				return wfsLwq;
			},

			/**
			 * 
			 */
			PalstanTietoja : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "PalstanTietoja",
					geometryName : "sijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#800000',
						label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
					}),
					"tile" : new OpenLayers.Style( {
						strokeColor : "#008080",
						strokeWidth : 5,
						fillColor : "#ffcc66",
						fillOpacity : 0.5
					}),
					"select" : new OpenLayers.Style( {
						fillColor : "#66ccff",
						strokeColor : "#3399ff"
					})
				});
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"Palstan Tietoja (KTJkii-WFS) ", false, true,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.strategy.minZoom = 10;
				wfsLwq.layer.previewTile = 'pt';
				wfsLwq.layer.setOpacity(0.7);

				return wfsLwq;
			},

			/**
			 * 
			 */
			RekisteriyksikonTietoja : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "RekisteriyksikonTietoja",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#0000A0',
						// label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
					}),
					"tile" : new OpenLayers.Style( {
						strokeColor : "#008080",
						strokeWidth : 5,
						fillColor : "#ffcc66",
						fillOpacity : 0.5
					}),
					"select" : new OpenLayers.Style( {
						fillColor : "#66ccff",
						strokeColor : "#3399ff"
					})
				});
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"RekisteriyksikonTietoja (KTJkii-WFS)", false, true,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.worker.featurePropertyNames = [ 'kiinteistotunnus',
						'olotila', 'rekisteriyksikkolaji', 'rekisterointipvm',
						'lakkaamispvm', 'nimi', 'maapintaala', 'vesipintaala',
						'rekisteriyksikonPalstanTietoja'

				];

				wfsLwq.strategy.minZoom = 5;
				wfsLwq.layer.previewTile = 'rt';
				wfsLwq.layer.setOpacity(0.7);

				return wfsLwq;
			}

		});Oskari.clazz.define('Oskari.poc.sade3.service.NimistoWFS', function(mapplet, url) {
	this.mapplet = mapplet;
	this.url = url;

}, {

});Oskari.clazz.define('Oskari.poc.sade3.service.RakennustiedotWFS', function(
		mapplet, url) {
	this.mapplet = mapplet;
	this.url = url;

}, {
	/**
	 * 
	 */
	RakennuksenOminaisuustiedot : function(layerName) {
		var mapplet = this.mapplet;
		var featureOpts = {
			featureType : "RakennuksenOminaisuustiedot",
			geometryName : "sijainti",
			featureNS : "http://xml.nls.fi/Rakennustiedot/VTJRaHu/2009/02",
			featurePrefix : "rhr"
		};
		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
				"RakennuksenOminaisuustiedot (Rakennustiedot)", false, true,
				featureOpts, ktjkiiWfsUrl);
		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',
				'kiinteistotunnus', 'postinumero', 'osoite', 'tarkistusmerkki',
				'rakennusnumero', 'tilanNimi',
				'kiinteistoyksikonMaaraalatunnus',
				'syntymahetkenRakennustunnus', 'rakennustunnuksenVoimassaolo',
				'valmistumispaiva', 'rakennuspaikanHallintaperuste',
				'kayttotarkoitus', 'kaytossaolotilanne', 'julkisivumateriaali',
				'kerrosala', 'kerrosluku', 'kokonaisala', 'tilavuus',
				'lammitystapa', 'lammonlahde', 'rakennusmateriaali',
				'rakennustapa', 'sahko', 'kaasu', 'viemari', 'vesijohto',
				'lamminvesi', 'aurinkopaneeli', 'hissi', 'ilmastointi',
				'saunojenLukumaara', 'uimaaltaidenLukumaara',
				'vaestosuojanKoko', 'viemariliittyma', 'vesijohtoliittyma',
				'sahkoliittyma', 'kaasuliittyma', 'kaapeliliittyma',
				'poikkeuslupa', 'perusparannus', 'perusparannuspaiva',
				'sijaintiepavarmuus', 'luontiAika', 'muutosAika'

		];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;
	},
	
	/**
	 * 
	 */
	RakennuksenOsoitepiste : function(layerName) {
		/*
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 */

		var mapplet = this.mapplet;
		var featureOpts = {
			featureType : "Osoitepiste",
			geometryName : "sijainti",
			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",
			featurePrefix : "oso",
			otherFeatureTypes : [ {
				typeName : 'Osoite'
			} ]
		};
		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
				"Osoitepiste (Rakennustiedot)", false, true, featureOpts,
				ktjkiiWfsUrl);
		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',
				'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',
				'kuntatunnus', 'osoite' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;
	},
	
	/**
	 * 
	 */
	RakennuksenOsoitenimi : function(layerName) {
		/*
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 */

		var mapplet = this.mapplet;
		var featureOpts = {
			featureType : "Osoitenimi",
			geometryName : "sijainti",
			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",
			featurePrefix : "oso",
			otherFeatureTypes : [ {
				typeName : 'Osoite'
			} ]
		};
		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
				"Osoitenimi (Rakennustiedot)", false, true, featureOpts,
				ktjkiiWfsUrl);
		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',
				'katunimi', 'katunumero', 'kieli', 'postinumero',
				'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',
				'kuntatunnus' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;
	}

});Oskari.clazz.define('Oskari.poc.sade3.service.MaastoWFS', function(mapplet, url) {
	this.mapplet = mapplet;
	this.url = url;

}, {
	/**
	 * 
	 */
	MaastotietokannanOsoitepiste : function(layerName) {

		/*
		 * 
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * 
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 * 
		 */

		var mapplet = this.mapplet;

		var featureOpts = {

			featureType : "Osoitepiste",

			geometryName : "sijainti",

			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",

			featurePrefix : "oso",

			otherFeatureTypes : [ {

				typeName : 'Osoite'

			} ]

		};

		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,

		"Osoitepiste (Rakennustiedot)", false, true, featureOpts,

		ktjkiiWfsUrl);

		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',

		'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',

		'kuntatunnus', 'osoite' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;

	},

	/**
	 * 
	 */
	MaastotietokannanOsoitenimi : function(layerName) {

		/*
		 * 
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * 
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 * 
		 */

		var mapplet = this.mapplet;

		var featureOpts = {

			featureType : "Osoitenimi",

			geometryName : "sijainti",

			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",

			featurePrefix : "oso",

			otherFeatureTypes : [ {

				typeName : 'Osoite'

			} ]

		};

		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,

		"Osoitenimi (Rakennustiedot)", false, true, featureOpts,

		ktjkiiWfsUrl);

		wfsLwq.worker.featurePropertyNames = [

		'sijainti', 'rakennustunnus',

		'katunimi', 'katunumero',

		'kieli',

		'postinumero',

		'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',

		'kuntatunnus' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;

	}

});
/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * 
 * Class: KTJkiiWFS.Mapplet
 * 
 * Tï¿½nne on koottu joukko metodeja, joilla lisï¿½tï¿½ï¿½n kartalle
 * OpenLayers.Layer.Vectoreihin aineistoja ja alustetaan aineistojen hakua
 * varten NLSFI.Worker.Worker pohjaiset hakutoiminnot.
 * 
 * Sana koottu sen jo kertoo... Pitï¿½ï¿½ toteuttaa siten, ettï¿½ riippuvuudet
 * muodostuvat hallitusti. Nyt pitï¿½ï¿½ ladata kaikki Workerit vaikkei haluaisi
 * mitï¿½ï¿½n!
 * 
 */

Oskari.clazz.define("Oskari.poc.sade3.SADEMapplet",
/**
 * Method: initialize
 * 
 * Alustaa Mappletin perusasetukset: layersAndWorkers ja projXXX luokkamuuttujat
 * .createMapplet() metodi vasta oikeasti rakentaa Mappletin toimintakuntoon
 * 
 */

function(options) {

	this.mapControls = null;
	this.map = null;
	this.layersAndWorkers = null;
	this.mapProj = null;
	this.dataProj = null;
	this.googleProj = null;
	this.vlayer = null,

	this.layersAndWorkers = {};
	this.dataProj = new OpenLayers.Projection("EPSG:3067");
	this.googleProj = new OpenLayers.Projection("EPSG:4326");

	this.urls = options.urls;

	return this;
}, {

	setMap : function(map) {
		this.map = map;
	},

	setLayerManager : function(lm) {
		this.layerManager = lm;
	},

	/**
	 * Method: createWfsLWQ
	 * 
	 * Tï¿½mï¿½ luo OpenLayers.Layerin ja sille NLSFI.Worker menettelyn mukaisen
	 * operaattorin, joka hakee tietoja Layeriin
	 * 
	 * lwqId tason tunniste name tason otsikko isStrategy pï¿½ivitetï¿½ï¿½nkï¿½
	 * dataa Strategyn mukaisesti visibility laitetaanko nï¿½kyvï¿½ksi
	 * featureOpts on oikeasti layerOptions rakenne WFSInspectorilta url on
	 * palvelun WFS palvelun URL pstyles valinnainen StyleMap
	 * 
	 */

	createLayerImpl : function(name, visibility, styles) {

		return this.layerManager.createLayer(name, visibility, styles);

	},

	/* Generic */
	createWfsResponseLWQ : function(lwqId, name, isStrategy, visibility,
			featureOpts, url, pstyles) {

		var lwq = {
			layer : null,
			worker : null,
			queue : null,
			strategy : null,
			lwqId : lwqId,
			layerOptions : featureOpts

		};

		var styles = pstyles ? pstyles : new OpenLayers.StyleMap( {
			"default" : new OpenLayers.Style( {
				pointRadius : 3,
				strokeColor : "red",
				strokeWidth : 2,
				fillColor : '#800000'
			}),
			"tile" : new OpenLayers.Style( {
				strokeColor : "#008080",
				strokeWidth : 5,
				fillColor : "#ffcc66",
				fillOpacity : 0.5
			}),
			"select" : new OpenLayers.Style( {
				fillColor : "#66ccff",
				strokeColor : "#3399ff"
			})
		});

		var tileQueue = Oskari.clazz
				.create('Oskari.NLSFI.OpenLayers.Strategy.TileQueue');

		var strategy = {
			tileQueue : tileQueue
		};
		var layerStrategies = [];

		lwq.queue = tileQueue;

		lwq.strategy = strategy;
		lwq.layer = this.createLayerImpl(lwqId, visibility, styles);

		lwq.worker = Oskari.clazz.create('Oskari.NLSFI.Worker.WFSWorker', {
			strategy : strategy,
			featureType : featureOpts.featureType,
			geometryName : featureOpts.geometryName,
			featureNS : featureOpts.featureNS,
			featurePrefix : featureOpts.featurePrefix,
			responseFormat : featureOpts.responseFormat,
			featureTypeSchema : featureOpts.featureTypeSchema,
			otherFeatureTypes : featureOpts.otherFeatureTypes,
			responseFormat : new (Oskari
					.$('Oskari.NLSFI.OpenLayers.Format.GML.WFSResponse'))( {
				featureNS : featureOpts.featureNS,
				featureType : featureOpts.featureType,
				geometryName : featureOpts.geometryName, // "sijainti",
				featurePrefix : featureOpts.featurePrefix,
				externalProjection : this.dataProj, // NOT SET!!!
				internalProjection : this.mapProj,
				featureTypeSchema : featureOpts.featureTypeSchema,
				otherFeatureTypes : featureOpts.otherFeatureTypes,
				extractAttributes : true
			})
		});

		lwq.worker.description = name;
		lwq.worker
				.create(lwq.layer, this.map, this.mapProj, this.dataProj, url);

		this.layersAndWorkers[lwqId] = lwq;

		return lwq;
	},

	CLASS_NAME : "SADEMapplet"

});/*
 * 
 * OsoitePiste
 * 
 * <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" 
 * xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
 *  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> 
 *  <wfs:Query typeName="oso:Osoitepiste" srsName="EPSG:3067" 
 *  xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
 *   <wfs:PropertyName>oso:rakennustunnus </wfs:PropertyName> 
 *   <wfs:PropertyName>oso:kiinteistotunnus </wfs:PropertyName>
 *    <wfs:PropertyName>oso:kuntanimiFin </wfs:PropertyName>
 *     <wfs:PropertyName>oso:kuntanimiSwe </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:kuntatunnus </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:sijainti </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:osoite </wfs:PropertyName> 
 *     <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
 *      <ogc:Within> <ogc:PropertyName>oso:sijainti </ogc:PropertyName>
 *       <gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:3067">
 *        <gml:exterior> <gml:LinearRing> <gml:posList>359805.5156968306 6700903.887125473 359357.49944485445 6700755.88175822 359117.49073846114 6700527.873489743 358909.48319296294 6700187.861159462 358833.480436035 6699863.8494093735 358885.48232260917 6699471.835193364 359001.48653095367 6699031.819236449 359245.49538265826 6698783.810242622 359569.5071364563 6698583.80298949 359973.5217922854 6698519.800668449 360361.53586756054 6698583.80298941 360737.5495073708 6698843.812418378 360937.55676250154 6699127.822717762 361077.5618410299 6699491.835918447 361085.5621310739 6699911.851149949 360941.5569071728 6700271.86420556 360741.54965178936 6700599.876100678 360349.5354313571 6700803.883498819 359873.51816364296 6700903.887125467 358885.4823225632 6699579.8391099665 359149.49189973436 6699571.83881984 359777.51468126953 6700431.870008174 359781.5148267149 6699599.839835168 359945.52077609545 6699603.839980254 359949.5209212811 6699403.832727152 360625.5454441989 6699419.83330729 359937.52048623154 6698751.809082054 359937.52048631426 6698547.801683853 359933.5203412146 6698535.801248652 361077.56184097624 6699631.840995542 359953.52106630965 6699615.840415455 359897.5190342881 6700911.887415561 359805.5156968306 6700903.887125473 </gml:posList> </gml:LinearRing> </gml:exterior> </gml:Polygon> </ogc:Within>
 *         </ogc:Filter> </wfs:Query> </wfs:GetFeature>
 * 
 * Rakennuksen huoneistotiedot
 * <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 *  <wfs:Query typeName="rhr:RakennuksenHuoneistotiedot" srsName="EPSG:3067" xmlns:rhr="http://xml.nls.fi/Rakennustiedot/VTJRaHu/2009/02">
 *   <wfs:PropertyName>rhr:rakennustunnus </wfs:PropertyName>
 *    <wfs:PropertyName>rhr:kiinteistotunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:tarkistusmerkki </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:rakennusnumero </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:tilanNimi </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:kiinteistoyksikonMaaraalatunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:syntymahetkenRakennustunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:postinumero </wfs:PropertyName>
 *     <wfs:PropertyName>rhr:rakennustunnuksenVoimassaolo </wfs:PropertyName> 
 *     <wfs:PropertyName>rhr:valmistumispaiva </wfs:PropertyName>
 *      <wfs:PropertyName>rhr:rakennuspaikanHallintaperuste </wfs:PropertyName>
 *       <wfs:PropertyName>rhr:kayttotarkoitus </wfs:PropertyName>
 *        <wfs:PropertyName>rhr:kaytossaolotilanne </wfs:PropertyName>
 *         <wfs:PropertyName>rhr:julkisivumateriaali </wfs:PropertyName> 
 *         <wfs:PropertyName>rhr:kerrosala </wfs:PropertyName>
 *          <wfs:PropertyName>rhr:kerrosluku </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:kokonaisala </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:tilavuus </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:lammitystapa </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:lammonlahde </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:rakennusmateriaali </wfs:PropertyName>
 *           <wfs:PropertyName>rhr:rakennustapa </wfs:PropertyName>
 *            <wfs:PropertyName>rhr:sahko </wfs:PropertyName>
 *             <wfs:PropertyName>rhr:kaasu </wfs:PropertyName>
 *              <wfs:PropertyName>rhr:viemari </wfs:PropertyName>
 *               <wfs:PropertyName>rhr:vesijohto </wfs:PropertyName>
 *                <wfs:PropertyName>rhr:lamminvesi </wfs:PropertyName>
 *                 <wfs:PropertyName>rhr:aurinkopaneeli </wfs:PropertyName> 
 *                 <wfs:PropertyName>rhr:hissi </wfs:PropertyName>
 *                  <wfs:PropertyName>rhr:ilmastointi </wfs:PropertyName> 
 *                  <wfs:PropertyName>rhr:saunojenLukumaara </wfs:PropertyName>
 *                   <wfs:PropertyName>rhr:uimaaltaidenLukumaara </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:vaestosuojanKoko </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:viemariliittyma </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:vesijohtoliittyma </wfs:PropertyName>
 *                    <wfs:PropertyName>rhr:sahkoliittyma </wfs:PropertyName> 
 *                    <wfs:PropertyName>rhr:kaasuliittyma </wfs:PropertyName>
 *                     <wfs:PropertyName>rhr:kaapeliliittyma </wfs:PropertyName> 
 *                     <wfs:PropertyName>rhr:poikkeuslupa </wfs:PropertyName>
 *                      <wfs:PropertyName>rhr:perusparannus </wfs:PropertyName>
 *                       <wfs:PropertyName>rhr:perusparannuspaiva </wfs:PropertyName>
 *                        <wfs:PropertyName>rhr:sijainti </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:sijaintiepavarmuus </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:luontiAika </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:muutosAika </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:osoite </wfs:PropertyName>
 *                         <wfs:PropertyName>rhr:huoneisto </wfs:PropertyName>
 *                          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
 *                           <ogc:Within> <ogc:PropertyName>rhr:sijainti </ogc:PropertyName>
 *                            <gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:3067"> 
 *                            <gml:exterior> <gml:LinearRing>
 *                             <gml:posList>360117.5212843064 6701293.84404207 359481.52128079697 6700985.844042104 359797.521282709 6700373.844042087 360421.52128616703 6700353.844042055 360369.5212857458 6701041.844042056 360117.5212843064 6701293.84404207 </gml:posList> </gml:LinearRing> </gml:exterior> </gml:Polygon>
 *                              </ogc:Within> </ogc:Filter>
 *                               </wfs:Query> </wfs:GetFeature>
 */
Oskari.clazz
		.define(
				'Oskari.poc.sade3.SadeWorker',
				function(opts) {
					this.opts = opts || {};
					this.urls = this.opts.urls;
					this.mapplet = Oskari.clazz.create('Oskari.poc.sade3.SADEMapplet',opts);
					this.scheduler = Oskari.clazz.create('Oskari.NLSFI.Worker.Scheduler');
					this.scheduler.queueInterval = 1000;
					this.scheduler.errorHandler = function(errJSON) {
						console.log(errJSON);
					};

					this.scheduler.statsFuncs = {
						queueStatus : function(qv, pv, cancelledRequests,
								cancelledPending, cancelledOutOfView,
								unloadedSnapshot, loadedSnapshot,
								errorsEncountered, totalt) {
							mediator.log("" + qv + "/" + pv);
						},
						requestStatus : function(req, requestStr, bbox, geom) {
							mediator.log("REQUEST " + requestStr);
						},
						responseStatus : function(doc, feats, stats) {
							mediator.log("RESPONSE ");
						}
					};

					this.scheduler.create( []);
					this.workerLayers = {};

					this.services = {};

					this.adapters = {};
				},
				{
					log : function(text) {

					},

					start : function() {
						this.scheduler.queueInterval = 500; // let's not break
															// IE
						this.scheduler.setQueueSpeed(2000);

						this.scheduler.startWorker();
					},

					stop : function() {
						this.scheduler.stopWorker();
					},

					setupMap : function(map) {
						this.mapplet.createAsPorttiKarttaikkuna(map);

						this.mapplet.createSijaintirajausLayer();

						/*
						 * this.mapplet.map.addControl(this.mapplet.createToolbar());
						 * this.mapplet.map.addControl(new
						 * OpenLayers.Control.LayerSwitcher( { 'ascending' :
						 * false }));
						 */
					},

					setAdapter : function(key, adapter) {
						this.adapters[key] = adapter;
					},

					setupWorkers : function() {

						var opts = this.opts;

						var app = this;
						var mapplet = this.mapplet;

						var workedOnlayers = [];

						var ktjkiiwfs = Oskari.clazz.create('Oskari.poc.sade3.service.KTJkiiWFS',mapplet,
								this.urls.KTJkiiWFS);

						this.services['KTJkiiWFS'] = ktjkiiwfs;

						workedOnlayers.push(ktjkiiwfs
								.PalstanTunnuspisteenSijaintitiedot('ktj_pts'));
						workedOnlayers.push(ktjkiiwfs
								.KiinteistorajanSijaintitiedot('ktj_ks'));
						workedOnlayers.push(ktjkiiwfs
								.RekisteriyksikonTietoja('ktj_rt'));
						workedOnlayers.push(ktjkiiwfs.PalstanTietoja('ktj_pt'));

						var rakennustiedotwfs = Oskari.clazz.create('Oskari.poc.sade3.service.RakennustiedotWFS',mapplet,
								this.urls.RakennustiedotWFS);

						this.services['RakennustiedotWFS'] = rakennustiedotwfs;

						workedOnlayers.push(rakennustiedotwfs
								.RakennuksenOsoitepiste('rhr_osoitepiste'));
						workedOnlayers
								.push(rakennustiedotwfs
										.RakennuksenOminaisuustiedot('rhr_rakennuksen_ominaisuustiedot'));
						workedOnlayers.push(rakennustiedotwfs
								.RakennuksenOsoitenimi('rhr_osoitenimi'));

						var maastowfs = Oskari.clazz.create('Oskari.poc.sade3.service.MaastoWFS',mapplet,
								this.urls.MaastoWFS);

						this.services['MaastoWFS'] = maastowfs;

						workedOnlayers
								.push(maastowfs
										.MaastotietokannanOsoitepiste('mtk_osoitepiste'));
						workedOnlayers.push(maastowfs
								.MaastotietokannanOsoitenimi('mtk_osoitenimi'));

						var s = this.scheduler;
						for ( var n = 0; n < workedOnlayers.length; n++) {
							var lwq = workedOnlayers[n];
							this.workerLayers[lwq.lwqId] = lwq;

							s.pushWorker(lwq.worker);
						}

					},

					searchCUByQualifiedIdentifier : function(kiinteistotunnus,
							popts) {
						var opts = popts || {};
						var lwqId = "ktj_rt";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'ktjkiiwfs:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					searchCUUnitByBounds : function(bbox, popts) {
						var opts = popts || {};

						var lwqId = "ktj_pt";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						lwq.queue.pushJob( {
							bounds : bbox,
							callback : this.bboxRequestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					searchCUAddressByQualifiedIdentifier : function(
							kiinteistotunnus, popts) {

						var opts = popts || {};
						var lwqId = "rhr_osoitepiste";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq
							}
						});
					},

					searchCUBuildingsByQualifiedIdentifier : function(
							kiinteistotunnus) {

						var lwqId = "rhr_rakennuksen_ominaisuustiedot";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'rhr:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq
							}
						});
					},

					searchAnyByLonLat : function(lonlat, scale, viewbbox,
							options) {
						var bounds = new OpenLayers.Bounds();
						bounds.extend(new OpenLayers.LonLat(lonlat.lon - 0.5,
								lonlat.lat - 0.5));
						bounds.extend(new OpenLayers.LonLat(lonlat.lon + 0.5,
								lonlat.lat + 0.5));

						// var geom = bounds.toGeometry();
						// alert(bounds.toBBOX());
						this.searchCUUnitByBounds(bounds, options);

					},

					searchAnyByCUQualifiedIdentifier : function(identifier,
							opts) {
						this.searchCUByQualifiedIdentifier(identifier, opts);

						this.searchCUAddressByQualifiedIdentifier(identifier,
								opts);

						this.searchCUBuildingsByQualifiedIdentifier(identifier,
								opts);
					},

					searchCUByBuildingAddress : function(addressRoad,
							addressNo, zip, popts) {

						var opts = popts || {};
						var lwqId = "mtk_osoitenimi";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filterAddr = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:katunimi',
							value : addressRoad
						});
						var filterAddrNo = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:katunumero',
							value : addressNo
						});
						/*
						 * var filterZip = new OpenLayers.Filter.Comparison( {
						 * type : OpenLayers.Filter.Comparison.EQUAL_TO,
						 * property : 'oso:postinumero', value : zip });
						 */

						var filter = new OpenLayers.Filter.Logical( {
							type : OpenLayers.Filter.Logical.AND,
							filters : [ filterAddr, filterAddrNo ]
						// ,filterZip]
								});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					requestProcessedCallback : function(args, feats, request,
							requestXML) {
						var mapplet = this.mapplet;
						var lwq = args.lwq;

						/*
						 * var elReq = document.getElementById('log_request');
						 * if( Ext.isGecko ) { var xmlData = requestXML;
						 * elReq.textContent = xmlData; } else { var xmlData =
						 * requestXML; elReq.innerText = xmlData; } var elRsp =
						 * document.getElementById('log_response'); if(
						 * Ext.isGecko ) { var xmlData = request.responseText ;
						 * elRsp.textContent = xmlData; } else { var xmlData =
						 * request.responseText ; elRsp.innerText = xmlData; }
						 */
						// prettyPrint();
						var adapter = this.adapters[lwq.lwqId];
						if (adapter) {
							adapter(args, feats, request, requestXML);
						}

					},

					bboxRequestProcessedCallback : function(args, feats,
							request, requestXML) {
						var mapplet = this.mapplet;
						var lwq = args.lwq;

						/*
						 * var elReq = document.getElementById('log_request');
						 * if( Ext.isGecko ) { var xmlData = requestXML;
						 * elReq.textContent = xmlData; } else { var xmlData =
						 * requestXML; elReq.innerText = xmlData; } var elRsp =
						 * document.getElementById('log_response'); if(
						 * Ext.isGecko ) { var xmlData = request.responseText ;
						 * elRsp.textContent = xmlData; } else { var xmlData =
						 * request.responseText ; elRsp.innerText = xmlData; }
						 */
						// prettyPrint();
						var adapter = this.adapters[lwq.lwqId];
						if (adapter) {
							adapter(args, feats, request, requestXML);
						}

					},

					clearWorkerLayers : function() {
						for (p in this.workerLayers) {
							var lwq = this.workerLayers[p];

							lwq.layer.destroyFeatures(lwq.layer.features);
						}
					},

					reset : function() {
						this.clearWorkerLayers();
					}

				});Oskari.clazz.define('Oskari.poc.sade3.SadeLocale', function(lang) {
	this.lang = lang;
}, {
	'def' : {},

	/*
	 * 
	 * 
	 * 
	 */

	'getLang' : function() {
		return this.lang;
	},

	'get' : function(context, id) {

		return (this[context][id] || this.def)[this.lang]

		|| (this.context + "_" + id + " " + this.lang + "???");

	},

	'app' : {
		'map' : {

			fi : {
				title : 'Kartta'
			}
		}
	}
});
Oskari.clazz.define('Oskari.poc.sade3.Mediator', function() {

	if (!Ext.ClassManager.get('RakennuksenOminaisuustiedot')) {
		Ext.define('RakennuksenOminaisuustiedot', {
			extend : 'Ext.data.Model',
			fields : [ {
				name : 'rakennustunnus'
			}, {
				name : 'kiinteistotunnus'
			}, {
				name : 'tarkistusmerkki'
			}, {
				name : 'rakennusnumero'
			}, {
				name : 'tilanNimi'
			}, {
				name : 'kiinteistoyksikonMaaraalatunnus'
			}, {
				name : 'syntymahetkenRakennustunnus'
			}, {
				name : 'postinumero'
			}, {
				name : 'rakennustunnuksenVoimassaolo'
			}, {
				name : 'valmistumispaiva'
			}, {
				name : 'rakennuspaikanHallintaperuste'
			}, {
				name : 'kayttotarkoitus'
			}, {
				name : 'kaytossaolotilanne'
			}, {
				name : 'julkisivumateriaali'
			}, {
				name : 'kerrosala'
			}, {
				name : 'kerrosluku'
			}, {
				name : 'kokonaisala'
			}, {
				name : 'tilavuus'
			}, {
				name : 'lammitystapa'
			}, {
				name : 'lammonlahde'
			}, {
				name : 'rakennusmateriaali'
			}, {
				name : 'rakennustapa'
			}, {
				name : 'sahko'
			}, {
				name : 'kaasu'
			}, {
				name : 'viemari'
			}, {
				name : 'vesijohto'
			}, {
				name : 'lamminvesi'
			}, {
				name : 'aurinkopaneeli'
			}, {
				name : 'hissi'
			}, {
				name : 'ilmastointi'
			}, {
				name : 'saunojenLukumaara'
			}, {
				name : 'uimaaltaidenLukumaara'
			}, {
				name : 'vaestosuojanKoko'
			}, {
				name : 'viemariliittyma'
			}, {
				name : 'vesijohtoliittyma'
			}, {
				name : 'sahkoliittyma'
			}, {
				name : 'kaasuliittyma'
			}, {
				name : 'kaapeliliittyma'
			}, {
				name : 'poikkeuslupa'
			}, {
				name : 'perusparannus'
			}, {
				name : 'perusparannuspaiva'
			}, {
				name : 'sijaintiepavarmuus'
			}, {
				name : 'luontiAika'
			}, {
				name : 'muutosAika'
			}

			]
		});
	}

	var store = Ext.create('Ext.data.Store', {
		model : 'RakennuksenOminaisuustiedot',
		autoLoad : false,

		proxy : {
			type : 'memory',
			reader : {

				type : 'json',
				model : 'RakennuksenOminaisuustiedot',
				totalProperty : 'total',
				successProperty : 'success',
				idProperty : 'id',
				root : 'data',
				messageProperty : 'message'

			}
		}
	});

	// Typical Store collecting the Proxy, Reader and Writer together.
		this['RakennuksenOminaisuustiedot'] = store;
	}, {

		getStore : function(n) {
			return this[n];
		},
		reset : function() {
			this.getStore('RakennuksenOminaisuustiedot').removeAll();
		}
	});Oskari.clazz
		.define(
				'Oskari.poc.sade3.SadeFormView',
				function(ui) {

					this.component = null;

					this.ui = ui;

					this.tabs = {};

					this.grids = {};

					this.fields = {};
					
					this.modhost = {};

				},
				{

					samples : [ [ '17842000070103', '17842000070103' ],

					[ '09101700160001', '09101700160001' ] ],

					/**
					 * 
					 */
					createFields : function(ui, loc) {
						var sandbox = ui.getApp().getSandbox();
						

						var listeners = {
			                focus : function(evt) {
			                    sandbox.request("SearchModule", sandbox
			                    .getRequestBuilder('DisableMapKeyboardMovementRequest')());
			                },
			                /** when focus lost */
			                blur : function(evt) {
			                    sandbox.request("SearchModule", sandbox
			                    .getRequestBuilder('EnableMapKeyboardMovementRequest')());
			                }
			            };
					
						this.fields.tf_CU_identifier = Ext
								.create(
										'Ext.form.field.Text',
										{

											xtype : 'textfield',

											fieldLabel : '( 91-17-16-1 )',

											name : 'cuidentifier',

											anchor : '95%',

											allowBlank : false,

											value : '',

											store : this.samples,

											typeAhead : true,

											forceSelection : true,

											triggerAction : 'all',

											emptyText : 'KiinteistÃ¶tunnus...',

											selectOnFocus : true,
											
											listeners : listeners
											

										});

						this.fields.tf_CU_name = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Nimi',

									name : 'cuname',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_registered = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'RekisterÃ¶intipvm',

									name : 'curegistered',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_type = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'RekisteriyksikkÃ¶laji',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_area_land = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Maapinta-ala',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_area_sea = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Vesipinta-ala',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_address = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Katunimi',

									name : 'address',

									allowBlank : false,

									value : '',
									
									listeners : listeners

								});

						this.fields.tf_address_no = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Katunumero',

									name : 'address_no',

									allowBlank : false,

									value : '',
									
									listeners : listeners

								});

						this.fields.tf_postalcode = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Postinumero',

									name : 'zipcode',

									disabled : true,

									value : '',

									allowBlank : false

								});

					},

					/**
					 * 
					 */
					createTab1 : function(ui, loc) {
						var me  = this;
						return Ext.create('Ext.form.Panel', {

							anchor : '100% 15%',

							region : 'center',

							labelAlign : 'top',

							title : 'Perustiedot',

							layout : 'column',


							border : false,

							items : [ {

								columnWidth : .35,

								border : false,

								items : [ Ext.create('Ext.form.field.Text', {

									fieldLabel : 'HenkilÃ¶tunnus',

									allowBlank : false,

									disabled : true

								}), {

									border : false,

									html : '(Ei WFS -palvelua)'

								} ]

							}, {

								columnWidth : .35,

								border : false,

								items : [ Ext.create('Ext.form.field.Text', {

									fieldLabel : 'Nimi',

									disabled : true

								}) ]

							}, {

								columnWidth : .3,

								border : false,

								items : [ {

									xtype : 'button',

									text : 'Tallenna',

									handler : function() {

										alert('OK');

									}

								}, {

									xtype : 'button',

									text : 'TyhjennÃ¶',

									handler : function() {

										me.reset();

										ui.getApp().getWorker().reset();

										ui.getApp().getMediator().reset();

									}
								} ]

							} ]

						});
					},

					/**
					 * 
					 */
					createTab2 : function(ui, loc) {
						var me  = this;
						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						return Ext
								.create(
										'Ext.form.Panel',

										{
											bodyFrame : false,
											bodyCls : 'formpart',

											anchor : '100% 30%',

											region : 'north',
											height: 256,

											labelAlign : 'top',

											title : 'RekisteriyksikÃ¶n tietoja',


											layout : 'column',

											border : false,

											items : [

													{

														columnWidth : .66,

														border : false,

														items : [
																tf_CU_identifier,
																tf_CU_registered,

																tf_CU_type,tf_CU_name,
																tf_CU_area_land,

																tf_CU_area_sea ]

													},

													{

														columnWidth : .33,

														border : false,

														items : [
{

	xtype : 'button',

	text : 'Valitse kartalta',

	handler : function() {
		var mapLayerId  = ui.getApp().getLayerManager().highlightMapLayer();

	}

},

																{

																	xtype : 'button',

																	text : 'Hae sijaintitiedot',

																	handler : function() {

																		ui

																				.getApp()

																				.getWorker()

																				.searchAnyByCUQualifiedIdentifier(

																						tf_CU_identifier

																								.getValue(),

																						{

																							zoomToExtent : true

																						});

																	}

																},

																{

																	xtype : 'button',

																	text : 'Hae kiinteistÃ¶rekisteriote',

																	handler : function() {

																		var identifier = tf_CU_identifier

																				.getValue();

																		if (!identifier

																				|| identifier == '')

																			return;

																		var docresourcesourceurl = 'http://kb109.nls.fi:4021/cocoon-2.1.8/rekisteriotepalvelu/tietovarasto/palvelu/rekisteriote/kiinteistorekisterin_tietoja/tuloste.pdf?kiinteistotunnus=' + identifier;

																		var win = window

																				.open(

																						docresourcesourceurl,

																						'name',

																						'height=640,width=640,resizable=yes');

																		/*
																		 * if
																		 * (window.focus &&
																		 * win.focus) {
																		 * win
																		 * .focus(); }
																		 */

																	}

																},

																{

																	border : false,

																	html : '<a href="http://sosuli.nls.fi/catalogue/ui/index.html?queryType=instancesByCompositionExternalId&cxid=9fa9e554-93dc-4789-bab6-7c7728c10298" target="_blank">KTJkii WFS-palvelun Skeema</a>'

																}

														]

													} ]

										});

					},

					/**
					 * 
					 */
					createTab3 : function(ui, loc) {
						var me  = this;
						
						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						return Ext
								.create(
										'Ext.form.Panel',

										{

											bodyFrame : false,
											bodyCls : 'formpart',
												
											anchor : '100% 40%',

											region : 'center',

											labelAlign : 'top',

											title : 'Rakennuksen Osoitetiedot',

											layout : 'column',

											border : false,

											items : [

													{

														columnWidth : .66,

														border : false,

														items : [ tf_address,
																tf_address_no,
																tf_postalcode
														]

													},

													{

														columnWidth : .33,

														border : false,

														items : [
																{

																	xtype : 'button',

																	text : 'Hae tiedot (WFS)',

																	handler : function() {

																		ui

																				.getApp()

																				.getWorker()

																				.searchCUByBuildingAddress(

																						tf_address

																								.getValue(),

																						tf_address_no
																								.getValue(),

																						tf_postalcode
																								.getValue(),

																						{

																							zoomToExtent : false

																						});

																	}

																},
																{

																	border : false,

																	html : 'Maastotietokannassa ei ole kiinteistÃ¶tunnusta, joten linkitys kiinteistÃ¶rekisteriin sijainnin perusteella'

																/*
																 * // html : '<a //
																 * href="http://jkorhonen.nls.fi/testaus/PORTTI-Luettelopalvelu/index.html?queryType=instancesByCompositionExternalId&cxid=14a4161d-dab2-49d5-8d0a-101c0d4727dd" //
																 * target="_blank">Rakennustietojen<br // /> //
																 * WFS-palvelun
																 * Skeema</a>'
																 */

																} ]

													} ]

										});

					},
					
					
					createModulesHostPanel : function(ui) {
						 return Ext.create('Ext.tab.Panel',{
							 region: 'center',							 
							 items : [] });
					},
					
					getModulesHost: function() {
						return this.modhost;
					},

					/**
					 * 
					 */
					createView : function(ui) {

						var loc = ui.getLocale().get('app', 'map');

						this.createFields(ui);

						this.grids['RakennuksenOminaisuustiedot'] = this
								.createGrid(ui);

						// this.tabs['tab1'] = this.createTab1(ui, loc);
						this.tabs['tab2'] = this.createTab2(ui, loc);
						this.tabs['tab3'] = this.createTab3(ui, loc);

						var me = this;
						
						var modhost = this.createModulesHostPanel(ui);
						this.modhost = modhost;
						
						modhost.add(this.tabs['tab2']);
						

						var extendedInfosLayout =
							 Ext
								.create(
										'Ext.panel.Panel',
										{
											
											title : 'Rakennustiedot',
											region : 'south',
											layout : 'anchor',
											align : 'stretch',
											items: [this.tabs.tab3,
											        this.grids['RakennuksenOminaisuustiedot']]
										});
						
						modhost.add(extendedInfosLayout);
						
						var formLayout =
							 Ext
								.create(
										'Ext.panel.Panel',
										{
											/* title : 'Lomake', */
											region : 'center',
											layout : 'border',
											items : [
											        /* this.tabs.tab2, */
													modhost
											],
											bodyBorder : false,
											border : 0,
											bodyCls : 'webformcontainer'


										})

						this.component = Ext
								.create(
										'Ext.panel.Panel',
										{
											layout : 'border',
											height : 600,
											width : 500,
											bodyBorder : false,
											border : 0,
											bodyCls : 'formpart',

											items : [formLayout ],

											bbar : [ {
												xtype: 'button',
												text: 'LÃ¤hetÃ¤ lomake',
												handler: function() {
												Ext.MessageBox.show( {
													title : 'Tallennetaan',
													msg : '...',
													progressText : '...',
													width : 300,
													progress : true,
													closable : false,
													icon : 'logo',
													modal : false
												});
												window.setTimeout(function() {
													Ext.MessageBox.hide();
												},500);
												}
											},{
												xtype: 'button',
												text: 'Sulje lomake',
												handler: function()  {
													ui.hideUserInterface();
												}
											},
												Ext.create(
													'Ext.ProgressBar', {
														width : 256

													}) ]

										});

						return this.component;

					},

					/**
					 * 
					 */
					reset : function() {

						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						tf_CU_identifier.setValue('');

						tf_CU_name.setValue('');

						tf_CU_registered.setValue('');

						tf_CU_type.setValue('');

						tf_CU_area_land.setValue('');

						tf_CU_area_sea.setValue('');

						tf_address.setValue('');

						tf_address_no.setValue('');

						tf_postalcode.setValue('');
						
						
						this.grids['RakennuksenOminaisuustiedot'].getStore().removeAll();

					},

					/**
					 * 
					 */
					setAddress : function(atts) {

						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						tf_address.setValue(atts.katunimi || '');

						tf_address_no.setValue(atts.katunumero || '')

						tf_postalcode.setValue(atts.postinumero || '');

					},

					/**
					 * 
					 */
					setCU : function(atts) {

						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						tf_CU_identifier.setValue(atts.kiinteistotunnus);

						tf_CU_name.setValue(atts.nimi);

						tf_CU_registered.setValue(atts.rekisterointipvm);

						tf_CU_type.setValue(atts.rekisteriyksikkolaji);

						tf_CU_area_land.setValue(atts.maapintaala);

						tf_CU_area_sea.setValue(atts.vesipintaala);

					},

					/**
					 * 
					 */
					createGrid : function(ui) {

						return Ext.create('Ext.grid.Panel', {
							bodyBorder : false,
							border : 0,
							bodyCls : 'formpart',
							autoScroll : true,

							stripeRows : true,

							anchor : '100% 60%',

							title : 'RekisteriyksikÃ¶n rakennustiedot',

							viewConfig : {

								forceFit : true

							},

							store : ui.getApp().getMediator().getStore(

							'RakennuksenOminaisuustiedot'),

							columns : [ {

								header : 'rakennustunnus',

								dataIndex : 'rakennustunnus'

							}, {

								hidden : true,

								header : 'kiinteistotunnus',

								dataIndex : 'kiinteistotunnus'

							},

							{

								hidden : true,

								header : 'tarkistusmerkki',

								dataIndex : 'tarkistusmerkki'

							}, {

								header : 'rakennusnumero',

								dataIndex : 'rakennusnumero'

							}, {

								header : 'luontiAika',

								dataIndex : 'luontiAika'

							}, {

								header : 'muutosAika',

								dataIndex : 'muutosAika'

							},

							{

								header : 'tilanNimi',

								dataIndex : 'tilanNimi'

							}, {

								hidden : true,

								header : 'kiinteistoyksikonMaaraalatunnus',

								dataIndex : 'kiinteistoyksikonMaaraalatunnus'

							}, {

								hidden : true,

								header : 'syntymahetkenRakennustunnus',

								dataIndex : 'syntymahetkenRakennustunnus'

							}, {

								hidden : true,

								header : 'postinumero',

								dataIndex : 'postinumero'

							},

							{

								hidden : true,

								header : 'rakennustunnuksenVoimassaolo',

								dataIndex : 'rakennustunnuksenVoimassaolo'

							},

							{

								hidden : true,

								header : 'valmistumispaiva',

								dataIndex : 'valmistumispaiva'

							},

							{

								hidden : true,

								header : 'rakennuspaikanHallintaperuste',

								dataIndex : 'rakennuspaikanHallintaperuste'

							}, {

								hidden : true,

								header : 'kayttotarkoitus',

								dataIndex : 'kayttotarkoitus'

							}, {

								hidden : true,

								header : 'kaytossaolotilanne',

								dataIndex : 'kaytossaolotilanne'

							},

							{

								hidden : true,

								header : 'julkisivumateriaali',

								dataIndex : 'julkisivumateriaali'

							},

							{

								hidden : true,

								header : 'kerrosala',

								dataIndex : 'kerrosala'

							}, {

								hidden : true,

								header : 'kerrosluku',

								dataIndex : 'kerrosluku'

							}, {

								hidden : true,

								header : 'kokonaisala',

								dataIndex : 'kokonaisala'

							}, {

								hidden : true,

								header : 'tilavuus',

								dataIndex : 'tilavuus'

							},

							{

								hidden : true,

								header : 'lammitystapa',

								dataIndex : 'lammitystapa'

							}, {

								hidden : true,

								header : 'lammonlahde',

								dataIndex : 'lammonlahde'

							}, {

								hidden : true,

								header : 'rakennusmateriaali',

								dataIndex : 'rakennusmateriaali'

							}, {

								hidden : true,

								header : 'rakennustapa',

								dataIndex : 'rakennustapa'

							}, {

								hidden : true,

								header : 'sahko',

								dataIndex : 'sahko'

							}, {

								hidden : true,

								header : 'kaasu',

								dataIndex : 'kaasu'

							}, {

								hidden : true,

								header : 'viemari',

								dataIndex : 'viemari'

							}, {

								hidden : true,

								header : 'vesijohto',

								dataIndex : 'vesijohto'

							}, {

								hidden : true,

								header : 'lamminvesi',

								dataIndex : 'lamminvesi'

							}, {

								hidden : true,

								header : 'aurinkopaneeli',

								dataIndex : 'aurinkopaneeli'

							}, {

								hidden : true,

								header : 'hissi',

								dataIndex : 'hissi'

							}, {

								hidden : true,

								header : 'ilmastointi',

								dataIndex : 'ilmastointi'

							}, {

								hidden : true,

								header : 'saunojenLukumaara',

								dataIndex : 'saunojenLukumaara'

							}, {

								hidden : true,

								header : 'uimaaltaidenLukumaara',

								dataIndex : 'uimaaltaidenLukumaara'

							}, {

								hidden : true,

								header : 'vaestosuojanKoko',

								dataIndex : 'vaestosuojanKoko'

							}, {

								hidden : true,

								header : 'viemariliittyma',

								dataIndex : 'viemariliittyma'

							}, {

								hidden : true,

								header : 'vesijohtoliittyma',

								dataIndex : 'vesijohtoliittyma'

							}, {

								hidden : true,

								header : 'sahkoliittyma',

								dataIndex : 'sahkoliittyma'

							}, {

								hidden : true,

								header : 'kaasuliittyma',

								dataIndex : 'kaasuliittyma'

							}, {

								hidden : true,

								header : 'kaapeliliittyma',

								dataIndex : 'kaapeliliittyma'

							}, {

								hidden : true,

								header : 'poikkeuslupa',

								dataIndex : 'poikkeuslupa'

							}, {

								hidden : true,

								header : 'perusparannus',

								dataIndex : 'perusparannus'

							}, {

								hidden : true,

								header : 'perusparannuspaiva',

								dataIndex : 'perusparannuspaiva'

							},

							{

								hidden : true,

								header : 'sijaintiepavarmuus',

								dataIndex : 'sijaintiepavarmuus'

							}

							]

						});

					}

				});Oskari.clazz.define('Oskari.poc.sade3.SadeUI', function() {

	this.form = Oskari.clazz.create('Oskari.poc.sade3.SadeFormView');

	this.ui = null;

	this.app = null;

	this.panel = null;

	this.mapAdapter = null;

},

{

	getFormView : function() {
		return this.form;
	},

	getLocale : function() {

		return this.app.getLocale();

	},

	setApp : function(a) {

		this.app = a;

	},

	getApp : function() {

		return this.app;

	},

	setMapAdapter : function(ma) {
		return this.mapAdapter = ma;
	},
	
	getUserInterface: function() {
		return this.ui;
	},
	setUserInterface: function(ui) {
		this.ui = ui;
	},

	createUserInterface : function(listeners) {

		var formPanel = this.form.createView(this);

		this.panel = formPanel;

		/*var ui = Ext.create('Ext.window.Window', {
			shadow : 'sides',
			hideMode : 'offsets',
			frame : false,
			maximizable : true,
			closable: false,

			minimizable: true,
			bodyBorder : false,
			border : 0,
			bodyCls : 'webform',
			x : 40 + 120,
			resizable: false,
			y : 96,
			width : 555,

			height : 666,

			layout : 'fit',

			items : [ formPanel ],
			listeners : listeners

		});
		*/
		var ui = Ext.create('Ext.panel.Panel', {
		hideMode : 'offsets',
		floating : true,
		shadow : 'sides',
		/* modal: true, */
		frame : false,
		autoShow : false,
		preventHeader : true,
		width : 768,
		height : 480,
		x : 40 + 120,
		y : 96,
		closable : false,
		resizable : true,
		resizeHandles : 'se',
		bodyBorder : false,
		layout : 'fit',
		border : 0,
		items : [ formPanel ],
		bodyCls : 'webform',
			items : [ formPanel ],
			listeners : listeners
		});


		this.ui = ui;

	},

	showUserInterface : function() {

		this.ui.show();

	},
	hideUserInterface : function() {

		this.ui.hide();

	},

	setAddress : function(atts) {

		this.form.setAddress(atts);

	},

	setCU : function(atts) {

		this.form.setCU(atts);

	},

	reset : function() {

		this.form.reset();
		this.clearFeaturesFromMap();
	},

	zoomTo : function(lon, lat, scale) {

		if (this.mapAdapter)
			this.mapAdapter.zoomTo(lon, lat, scale);

	},
	clearFeaturesFromMap : function(lid) {

		if (this.mapAdapter)
			this.mapAdapter.clearFeatures(lid);

	}

});Oskari.clazz
		.define(
				'Oskari.poc.sade3.Adapter',
				function(app, ui) {
					var w = app.getWorker();
					w
							.setAdapter(
									'rhr_osoitepiste',
									// 'rhr_rakennuksen_ominaisuustiedot',
									function(args, feats, request, requestXML) {

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {
												var feat = feats[n];
												if (feat.attributes.featType != 'Osoite')
													continue;
												ui.setAddress(feat.attributes);
												break;
											}
										}
									});
					w
							.setAdapter(
									'rhr_rakennuksen_ominaisuustiedot',
									function(args, feats, request, requestXML) {

										var store = app.getMediator().getStore(
												'RakennuksenOminaisuustiedot');
										store.removeAll(true);
										var recId = 0;

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {
												var feat = feats[n];
												if (feat.attributes.featType != 'RakennuksenOminaisuustiedot')
													continue;

												// lisÃ¤tÃ¤Ã¤n rivi taulukkoon
												// feat.attributes pohjalta

												var r = Ext
														.create(
																'RakennuksenOminaisuustiedot',
																feat.attributes);
												r.setId(++recId);
												store.add(r);
											}
										}
									});
					w.setAdapter('ktj_rt', function(args, feats, request,
							requestXML) {

						if (feats && feats.length > 0) {
							var feat = feats[0];

							ui.setCU(feat.attributes);

							/*
							 * if(args.zoomToExtent)
							 * ui.getMap().zoomToExtent(feat.geometry.getBounds().scale(5));
							 */
							var lonlat = feat.geometry.getBounds().getCenterLonLat();
							ui.zoomTo(lonlat.lon,lonlat.lat);

						}
					});

					w
							.setAdapter(
									'ktj_pt',
									function(args, feats, request, requestXML) {

										var cuUniqueIdentifier = null;

										if (feats && feats.length == 1) {
											var feat = feats[0];
											cuUniqueIdentifier = feat.attributes.rekisteriyksikonKiinteistotunnus;
											ui
													.setCU( {
														kiinteistotunnus : cuUniqueIdentifier
													});
											/*
											 * if(args.zoomToExtent)
											 * ui.getMap().zoomToExtent(feat.geometry.getBounds().scale(5));
											 */
											var lonlat = feat.geometry.getBounds().getCenterLonLat();
											ui.zoomTo(lonlat.lon,lonlat.lat);
										}

										if (!cuUniqueIdentifier)
											return;

										w
												.searchAnyByCUQualifiedIdentifier(cuUniqueIdentifier);

									});
					w
							.setAdapter(
									'rhr_osoitenimi',
									function(args, feats, request, requestXML) {

										var cuUniqueIdentifier = null;

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {

												var feat = feats[n];

												ui.setAddress(feat.attributes);
												cuUniqueIdentifier = feat.attributes.kiinteistotunnus;

											}
										}

										if (!cuUniqueIdentifier)
											return;

										w.searchAnyByCUQualifiedIdentifier(
												cuUniqueIdentifier, {
													zoomToExtent : true
												});
									});
					w.setAdapter('mtk_osoitenimi', function(args, feats,
							request, requestXML) {

						var cuUniqueIdentifier = null;

						if (feats && feats.length > 0) {
							for ( var n = 0; n < feats.length; n++) {

								var feat = feats[n];

								ui.setAddress(feat.attributes);
								// cuUniqueIdentifier =
							// feat.attributes.kiinteistotunnus;

							var lonlat = new OpenLayers.LonLat(feat.geometry.x,
									feat.geometry.y);
							w.searchAnyByLonLat(lonlat, null, null, {
								zoomToExtent : true
							});
							break;
						}
					}

				}	);

				}, {});
