/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.WmsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
    },
    {
        __name : 'WmsLayerPlugin',
        _clazz : 'Oskari.mapframework.mapmodule.WmsLayerPlugin',
        layertype : 'wmslayer',

        getLayerTypeSelector : function() {
            return 'WMS';
        },

        _createPluginEventHandlers: function () {
            return {
                AfterChangeMapLayerStyleEvent: function (event) {
                    this._afterChangeMapLayerStyleEvent(event);
                }
            };
        },
        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
            if (!this.isLayerSupported(layer)) {
                return;
            }

            var layers = [],
                olLayers = [],
                layerIdPrefix = 'layer_';
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap === true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            // loop all layers and add these on the map
            for (var i = 0, ilen = layers.length; i < ilen; i++) {
                var _layer = layers[i];
                var defaultParams = {
                        'LAYERS': _layer.getLayerName(),
                        'TRANSPARENT': true,
                        'ID': _layer.getId(),
                        'STYLES': _layer.getCurrentStyle().getName(),
                        'FORMAT': 'image/png',
                        'VERSION' : _layer.getVersion() || '1.3.0'
                    },
                    layerParams = _layer.getParams() || {},
                    layerOptions = _layer.getOptions() || {},
                    layerAttributes = _layer.getAttributes() || undefined;
                
                if(!layerOptions.hasOwnProperty('singleTile') && layerAttributes && layerAttributes.times) {
                    layerOptions.singleTile = true;
                }

                if (_layer.isRealtime()) {
                    var date = new Date();
                    defaultParams['TIME'] = date.toISOString();
                }
                // override default params and options from layer
                for (var key in layerParams) {
                    if (layerParams.hasOwnProperty(key)) {
                        defaultParams[key.toUpperCase()] = layerParams[key];
                    }
                }
                var layerImpl = null;


                var projection = this.getMapModule().getProjection(),
                    reverseProjection;
                if (layerAttributes && layerAttributes.reverseXY && (typeof layerAttributes.reverseXY === 'object')) {
                    var projectionCode = this.getMapModule().getProjection();
                    //use reverse coordinate order for this layer!
                    if (layerAttributes.reverseXY[projectionCode]) {
                        reverseProjection = this._createReverseProjection(projectionCode);
                    }
                }
                if(layerOptions.singleTile === true) {
                    layerImpl = new ol.layer.Image({
                        source: new ol.source.OskariImageWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams,
                            crossOrigin : _layer.getAttributes('crossOrigin'),
                            projection: reverseProjection ? reverseProjection : undefined
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                    this._registerLayerEvents(layerImpl, _layer, 'image');
                } else {
                    layerImpl = new ol.layer.Tile({
                        source : new ol.source.OskariTileWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams,
                            crossOrigin : _layer.getAttributes('crossOrigin'),
                            projection: reverseProjection ? reverseProjection : undefined
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });

                    this._registerLayerEvents(layerImpl, _layer, 'tile');
                }
                // Set min max Resolutions
                if (_layer.getMaxScale() && _layer.getMaxScale() !== -1 ) {
                    layerImpl.setMinResolution(this.getMapModule().getResolutionForScale(_layer.getMaxScale()));
                }
                // No definition, if scale is greater than max resolution scale
                if (_layer.getMinScale()  && _layer.getMinScale() !== -1 && (_layer.getMinScale() < this.getMapModule().getScaleArray()[0] )) {
                    layerImpl.setMaxResolution(this.getMapModule().getResolutionForScale(_layer.getMinScale()));
                }
                this.mapModule.addLayer(layerImpl,!keepLayerOnTop);
                // gather references to layers
                olLayers.push(layerImpl);

                this.getSandbox().printDebug("#!#! CREATED ol.layer.TileLayer for " + _layer.getId());
            }
            // store reference to layers
            this.setOLMapLayers(layer.getId(), olLayers);

        },
        _registerLayerEvents: function(layer, oskariLayer, prefix){
          var me = this;
          var source = layer.getSource();

          source.on(prefix + 'loadstart', function() {
            me.getMapModule().loadingState( oskariLayer._id, true);
          });

          source.on(prefix + 'loadend', function() {
            me.getMapModule().loadingState( oskariLayer._id, false);
          });

          source.on(prefix + 'loaderror', function() {
            me.getMapModule().loadingState( oskariLayer.getId(), null, true );
          });

        },
        /**
         *
         * @method @private _createReverseProjection Create a clone of the projection object with axis order neu
         *
         */
        _createReverseProjection: function(projectionCode) {
            var originalProjection = ol.proj.get(projectionCode);

            if (!originalProjection) {
                return null;
            }

            reverseProjection = new ol.proj.Projection({
                "code": projectionCode,
                "units": originalProjection.getUnits(),
                "extent": originalProjection.getExtent(),
                "axisOrientation": "neu",
                "global": originalProjection.isGlobal(),
                "metersPerUnit": originalProjection.getMetersPerUnit(),
                "worldExtent": originalProjection.getWorldExtent(),
                "getPointResolution": originalProjection.getPointResolution
            });
            return reverseProjection;
        },

        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent : function(event) {
            var layer = event.getMapLayer();
            var layerList = this.getOLMapLayers(layer);
            if(!layerList) {
                return;
            }
            layerList.forEach(function(openlayer) {
                openlayer.getSource().updateParams({
                    styles : layer.getCurrentStyle().getName()
                });
            });
        },
        updateLayerParams: function(layer, forced, params) {
            var me = this,
            	sandbox = this.getSandbox(),
            	i,
            	olLayerList,
                count,
                usePostMethod = false,
                count = 0,
                proxyUrl = null;
            if (!layer) {
                return;
            }

            if (params && layer.isLayerOfType("WMS")) {
                olLayerList = this.mapModule.getOLMapLayers(layer.getId());

                if (olLayerList) {
                    count = olLayerList.length;
                    for (i = 0; i < count; i++) {
                    		var layerSource = olLayerList[i].getSource();
                    		//TileWMS -> original is ol.source.TileWMS.getTileLoadFunction
                    		if (layerSource.getTileLoadFunction && typeof(layerSource.getTileLoadFunction) === 'function') {
                    			var originalTileLoadFunction = new ol.source.OskariTileWMS().getTileLoadFunction();
								layerSource.setTileLoadFunction(function(image, src) {
									if (src.length >= 2048) {
										proxyUrl = sandbox.getAjaxUrl()+"id="+layer.getId()+"&action_route=GetLayerTile";
										me._imagePostFunction(image, src, proxyUrl);
									} else {
										originalTileLoadFunction.apply(this, arguments);
									}
								});
                    		}
                    		//ImageWMS -> original is ol.source.ImageWMS.getImageLoadFunction
                    		else if (layerSource.getImageLoadFunction && typeof(layerSource.getImageLoadFunction) === 'function') {
                    			var originalImageLoadFunction = new ol.source.OskariImageWMS().getImageLoadFunction();
								layerSource.setImageLoadFunction(function(image, src) {
									if (src.length >= 2048) {
										proxyUrl = sandbox.getAjaxUrl()+"id="+layer.getId()+"&action_route=GetLayerTile";
										me._imagePostFunction(image, src, proxyUrl);
									} else {
										originalImageLoadFunction.apply(this, arguments);
									}
								});
                    		}
                        olLayerList[i].getSource().updateParams(params);
                    }
                }
            }
        },
        /**
         * @method @private _imagePostFunction
         * Issue a POST request to load a tile's source
         *
         * http://gis.stackexchange.com/questions/175057/openlayers-3-wms-styling-using-sld-body-and-post-request
         */
		_imagePostFunction: function(image, src, proxyUrl) {
			var img = image.getImage();
			if (typeof window.btoa === 'function') {
				var xhr = new XMLHttpRequest();
			  	//GET ALL THE PARAMETERS OUT OF THE SOURCE URL**
			  	var dataEntries = src.split("&");
			  	var params = "";
			  	//i === 0 -> the actual url, skip. Everything after that is params.
			  	for (var i = 1 ; i< dataEntries.length ; i++){
			    	params = params + "&"+dataEntries[i];
			  	}
			 	xhr.open('POST', proxyUrl, true);

			  	xhr.responseType = 'arraybuffer';
			  	xhr.onload = function(e) {
		    		if (this.status === 200) {
						var uInt8Array = new Uint8Array(this.response);
						var i = uInt8Array.length;
						var binaryString = new Array(i);
						while (i--) {
							binaryString[i] = String.fromCharCode(uInt8Array[i]);
						}
						var data = binaryString.join('');
						var type = xhr.getResponseHeader('content-type');
						if (type.indexOf('image') === 0) {
							img.src = 'data:' + type + ';base64,' + window.btoa(data);
						}
					}
				};
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(params);
			} else {
			  img.src = src;
			}
		}
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"]
    }
);
