/**
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.mapmodule.WmtsPocPlugin',
				function(opts) {
					this.mapModule = null;
					this.pluginName = null;
					this._sandbox = null;
					this._map = null;
					this._supportedFormats = {};
					this._capsPath = opts.capsPath ;
				},

				{
					__name : 'WmtsPocPlugin',

					getName : function() {
						return this.pluginName;
					},
					
					getMap: function() {
						return this._map;
					},

					getMapModule : function() {
						return this.mapModule;
					},
					setMapModule : function(mapModule) {
						this.mapModule = mapModule;
						this.pluginName = mapModule.getName() + this.__name;
					},

					register : function() {
						this.getMapModule().setLayerPlugin('WmtsPoc', this);
					},
					unregister : function() {
						this.getMapModule().setLayerPlugin('WmtsPoc', null);
					},

					init : function(sandbox) {
					},

					startPlugin : function(sandbox) {
						this._sandbox = sandbox;
						this._map = this.getMapModule().getMap();

						sandbox.register(this);
						for (p in this.eventHandlers) {
							sandbox.registerForEventByName(this, p);
						}
						
						var matrixSetId	 = "EPSG_3067_PTI";
						this.createPtiWMTSLayersFromCaps(matrixSetId,this.ptiWmsLayerSpecs,
								"pti_geoname");
						/*var matrixSetId	 = "EPSG_3067_NLSFI";
						this.createPtiWMTSLayersFromCaps(matrixSetId,this.jhsWmsLayerSpecs,
								"geoname");*/
						
					},
					stopPlugin : function(sandbox) {

						for (p in this.eventHandlers) {
							sandbox.unregisterFromEventByName(this, p);
						}

						sandbox.unregister(this);

						this._map = null;
						this._sandbox = null;
					},
					/*
					 * @method start called from sandbox
					 */
					start : function(sandbox) {
					},
					/**
					 * @method stop called from sandbox
					 * 
					 */
					stop : function(sandbox) {
					},

					eventHandlers : {
						

					},

					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/**
					 * 
					 */
					preselectLayers : function(layers) {

					

					},
					

					/**
					 * default nls.fi layer specs
					 */
					ptiWmsLayerSpecs : {
						'pti_taustakartta_10k' : {
							minScale : 20000,
							maxScale : 1.0,
							format : "image/png",
							opacity : 0.4

						},
						'pti_taustakartta_20k' : {
							minScale : 54000,
							maxScale : 21000,
							format : "image/png",
							opacity : 0.45

						},
						'pti_taustakartta_40k' : {
							minScale : 133000,
							maxScale : 55000,
							format : "image/png",
							opacity : 0.50

						},
						/*'taustakartta_80k' : {
							minScale : 200000,
							maxScale : 133000,
							format : "image/png",
							opacity : 0.55

						},*/
						'pti_taustakartta_160k' : {
							minScale : 250000,
							maxScale : 133000,
							format : "image/png",
							opacity : 0.60

						},
						'pti_taustakartta_320k' : {
							minScale : 350000,
							maxScale : 251000,
							format : "image/png",
							opacity : 0.65

						},
						/*'pti_taustakartta_800k' : {
							minScale : 800000,
							maxScale : 351000,
							format : "image/png",
							opacity : 0.70
						},*/
						'pti_taustakartta_2m' : {
							minScale : 2000000,
							maxScale : 801000,
							format : "image/png",
							opacity : 0.75

						},
						'pti_taustakartta_4m' : {
							minScale : 4000000,
							maxScale : 2000001,
							format : "image/png",
							opacity : 0.80

						},
						'pti_taustakartta_8m' : {
							minScale : 15000000,
							maxScale : 4000001,
							format : "image/png",
							opacity : 0.85

						}
					/*
					 * ,
					 * 
					 * 'peruskartta' : { minScale : 25000.0, maxScale : 1.0,
					 * format : "image/png" }, 'maastokartta_50k' : { minScale :
					 * 54000.0, maxScale : 26000.0, format : "image/png" },
					 * 'maastokartta_100k' : { minScale : 130000.0, maxScale :
					 * 55000.0, format : "image/png" }, 'maastokartta_250k' : {
					 * minScale : 245000.0, maxScale : 135000.0, format :
					 * "image/png" }, 'maastokartta_500k' : { minScale :
					 * 550000.0, maxScale : 280000.0, format : "image/png" },
					 * 'yleiskartta_1m' : { minScale : 1350000.0, maxScale :
					 * 560000.0, format : "image/png" }, 'yleiskartta_2m' : {
					 * minScale : 2500000.0, maxScale : 1380000.0, format :
					 * "image/png" }, 'yleiskartta_4m' : { minScale : 5000000.0,
					 * maxScale : 2600000.0, format : "image/png" },
					 * 'yleiskartta_8m' : { minScale : 1.0E7, maxScale :
					 * 5100000.0, format : "image/png" }
					 */
					},

					
					/**
					 * default nls.fi layer specs
					 */
					jhsWmsLayerSpecs : {
						'taustakartta_10k' : {
							minScale : 20000,
							maxScale : 1.0,
							format : "image/png",
							opacity : 0.4

						},
						'taustakartta_20k' : {
							minScale : 54000,
							maxScale : 21000,
							format : "image/png",
							opacity : 0.45

						},
						'taustakartta_40k' : {
							minScale : 133000,
							maxScale : 55000,
							format : "image/png",
							opacity : 0.50

						},
						/*'taustakartta_80k' : {
							minScale : 200000,
							maxScale : 133000,
							format : "image/png",
							opacity : 0.55

						},*/
						'taustakartta_160k' : {
							minScale : 250000,
							maxScale : 200000,
							format : "image/png",
							opacity : 0.60

						},
						'taustakartta_320k' : {
							minScale : 350000,
							maxScale : 251000,
							format : "image/png",
							opacity : 0.65

						},
						'taustakartta_800k' : {
							minScale : 800000,
							maxScale : 351000,
							format : "image/png",
							opacity : 0.70
						},
						'taustakartta_2m' : {
							minScale : 2000000,
							maxScale : 801000,
							format : "image/png",
							opacity : 0.75

						},
						'taustakartta_4m' : {
							minScale : 4000000,
							maxScale : 2000001,
							format : "image/png",
							opacity : 0.80

						},
						'taustakartta_8m' : {
							minScale : 15000000,
							maxScale : 4000001,
							format : "image/png",
							opacity : 0.85

						}
					/*
					 * ,
					 * 
					 * 'peruskartta' : { minScale : 25000.0, maxScale : 1.0,
					 * format : "image/png" }, 'maastokartta_50k' : { minScale :
					 * 54000.0, maxScale : 26000.0, format : "image/png" },
					 * 'maastokartta_100k' : { minScale : 130000.0, maxScale :
					 * 55000.0, format : "image/png" }, 'maastokartta_250k' : {
					 * minScale : 245000.0, maxScale : 135000.0, format :
					 * "image/png" }, 'maastokartta_500k' : { minScale :
					 * 550000.0, maxScale : 280000.0, format : "image/png" },
					 * 'yleiskartta_1m' : { minScale : 1350000.0, maxScale :
					 * 560000.0, format : "image/png" }, 'yleiskartta_2m' : {
					 * minScale : 2500000.0, maxScale : 1380000.0, format :
					 * "image/png" }, 'yleiskartta_4m' : { minScale : 5000000.0,
					 * maxScale : 2600000.0, format : "image/png" },
					 * 'yleiskartta_8m' : { minScale : 1.0E7, maxScale :
					 * 5100000.0, format : "image/png" }
					 */
					},

					
					/*
					 * @method createWMTSLayersFromCaps
					 * 
					 * creates WMTS layer with supporting sample WMTS
					 * Capabilities
					 */
					createPtiWMTSLayersFromCaps : function(matrixSetId,wmsLayerSpecs,geonameLayer) {
						
						var me = this;
						var sandbox = me._sandbox;
						var map = me.getMap();
						var format = new OpenLayers.Format.WMTSCapabilities();

						
						/*
						 * temp / bundle man should provide this info
						 */
						var capsPath = this._capsPath;
						OpenLayers.Request
								.GET( {
									url : capsPath,
									params : {
										SERVICE : "WMTS",
										VERSION : "1.0.0",
										REQUEST : "GetCapabilities"
									},
									success : function(request) {
										var doc = request.responseXML;
										if (!doc || !doc.documentElement) {
											doc = request.responseText;
										}
										var capabilities = format.read(doc);
										
										window.caps = capabilities;
										
										for (ld in wmsLayerSpecs) {
											var layerSpec = wmsLayerSpecs[ld];
											var wmsName = ld;
											var layer = format
													.createLayer(
															capabilities,
															{
																layer : wmsName,
																matrixSet : matrixSetId,
																format : layerSpec.format,
																opacity : layerSpec.opacity || 0.5,
																isBaseLayer : false,
																buffer : 0,
																minScale : layerSpec.minScale,
																maxScale : layerSpec.maxScale
															});
											
											
											/*
											 * 
											 */
											layer.getMatrix = function() {
										        var matrix;
										        if (!this.matrixIds || this.matrixIds.length === 0) {
										            matrix = {identifier: this.map.getZoom() + this.zoomOffset};
										            sandbox.printDebug("getMatrix based on ZOOM");
										        } else {
										            // get appropriate matrix given the map scale if possible
										            if ("scaleDenominator" in this.matrixIds[0]) {
										            	sandbox.printDebug("getMatrix based on scaleDenominator");
										            	sandbox.printDebug("- resolution "+this.map.getResolution());
										                // scale denominator calculation based on WMTS spec
										                var denom = 
										                    OpenLayers.METERS_PER_INCH * 
										                    OpenLayers.INCHES_PER_UNIT[this.units] * 
										                    this.map.getResolution() / 0.28E-3;
										                sandbox.printDebug("- denom "+denom);
										                var diff = Number.POSITIVE_INFINITY;
										                var delta;
										                for (var i=0, ii=this.matrixIds.length; i<ii; ++i) {
										                	
										                	var matrixIdsi = this.matrixIds[i];
										                	sandbox.printDebug(" checking #"+i+" -> "+this.matrixIds[i].scaleDenominator);
										                	
										                    delta = Math.abs(1 - (this.matrixIds[i].scaleDenominator / denom));
										                    sandbox.printDebug("  --> delta "+delta);
										                    if (delta < diff) {
										                    	sandbox.printDebug("  --> assigning #"+i +" as matrix (smaller than previous "+diff+")");
										                        diff = delta;
										                        matrix = this.matrixIds[i];
										                        
										                    }
										                }
										            } else {
										            	sandbox.printDebug("getMatrix based on ZOOM FALLBACK" );
										                // fall back on zoom as index
										                matrix = this.matrixIds[this.map.getZoom() + this.zoomOffset];
										            }
										            
										            sandbox.printDebug("getMatrix returns " + matrix.scaleDenominator);
										        }
										        return matrix;
										    };
											
											var contents = capabilities.contents;
									        var matrixSet = contents.tileMatrixSets[matrixSetId];
									        var matrixIds = matrixSet.matrixIds;
									        
									        sandbox.printDebug(wmsName + " "+matrixIds[0].scaleDenominator);
											map.addLayer(layer);
										}

										/*var layer_geoname = format
												.createLayer(
														capabilities,
														{
															layer : geonameLayer,
															matrixSet : matrixSetId,
															format : "image/png",
															opacity : 0.7,
															isBaseLayer : false
														});
										map.addLayer(layer_geoname);*/
									},
									failure : function() {
										alert("Trouble getting capabilities doc");
										OpenLayers.Console.error.apply(
												OpenLayers.Console, arguments);
									}
								})

					},

					/**
					 * @method createWMTSLayers
					 * 
					 * creates WMTS layer manually
					 */
					createWMTSLayers : function() {
						
						/*
						 * 
						 */

						
						var me = this;
						var map = me.getMap();
						var wmts = new OpenLayers.Layer.WMTS(
								{
									visibility : true,
									name : "WMTS Layer",
									url : "http://jkorhonen.nls.fi:8888/geowebcache/service/wmts?",
									layer : "geoname",
									style : "default",
									matrixSet : "EPSG_3067_NLSFI",
									format : "image/png",
									// tileSize: new OpenLayers.Size(256,256),
									tileOrigin : new OpenLayers.LonLat(-548576,
											8388608),
									tileFullExtent : new OpenLayers.Bounds(
											-548576, 6291456, 1548576, 8388608),
									matrixIds : [ "EPSG_3067_NLSFI:0",
											"EPSG_3067_NLSFI:1",
											"EPSG_3067_NLSFI:2",
											"EPSG_3067_NLSFI:3",
											"EPSG_3067_NLSFI:4",
											"EPSG_3067_NLSFI:5",
											"EPSG_3067_NLSFI:6",
											"EPSG_3067_NLSFI:7",
											"EPSG_3067_NLSFI:8",
											"EPSG_3067_NLSFI:9",
											"EPSG_3067_NLSFI:10",
											"EPSG_3067_NLSFI:11",
											"EPSG_3067_NLSFI:12",
											"EPSG_3067_NLSFI:13",
											"EPSG_3067_NLSFI:14",
											"EPSG_3067_NLSFI:15",
											"EPSG_3067_NLSFI:16",
											"EPSG_3067_NLSFI:17",
											"EPSG_3067_NLSFI:18",
											"EPSG_3067_NLSFI:19",
											"EPSG_3067_NLSFI:20",
											"EPSG_3067_NLSFI:21",
											"EPSG_3067_NLSFI:22",
											"EPSG_3067_NLSFI:23" ]
								});

						map.addLayers( [ wmts ]);

						return map;
					}


				},
				{
					'protocol' : [ "Oskari.mapframework.module.Module",
							"Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
				});
