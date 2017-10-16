/**
 * @class Oskari.mapframework.heatmap.HeatmapLayerPlugin
 * Provides functionality to draw Heatmap layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.heatmap.HeatmapLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.heatmap.HeatmapLayerPlugin';
        me._name = 'HeatmapLayerPlugin';
    },
    {
    	TYPE : 'HEATMAP',
        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('heatmaplayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('heatmaplayer', null);
        },

        _createEventHandlers: function () {
            return {
                MapLayerEvent: function(event) {
                    var op = event.getOperation(),
                        layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                    if (op === 'update' && layer && layer.isLayerOfType(this.TYPE)) {
                        this._updateLayer(layer);
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    this._afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    this._afterChangeMapLayerOpacityEvent(event);
                }
            };
        },

        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }

            var me = this,
            	layerIdPrefix = 'layer_',
            	key;

            // default params and options
            var defaultParams = {
                    LAYERS: layer.getLayerName(),
                    TRANSPARENT: true,
                    id: layer.getId(),
                    STYLES: layer.getCurrentStyle().getName(),
                    FORMAT: 'image/png',
                    SLD_BODY : this.__getSLD(layer),
                },
                defaultOptions = {
                    layerId: layer.getLayerName(),
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    buffer: 0
                },
                layerParams = layer.getParams(),
                layerOptions = layer.getOptions();
            if (layer.getMaxScale() || layer.getMinScale()) {
                // use resolutions instead of scales to minimize chance of transformation errors
                var layerResolutions = this.getMapModule().calculateLayerResolutions(layer.getMaxScale(), layer.getMinScale());
                defaultOptions.resolutions = layerResolutions;
            }
            // override default params and options from layer
            for (key in layerParams) {
                if (layerParams.hasOwnProperty(key)) {
                    defaultParams[key] = layerParams[key];
                }
            }
            for (key in layerOptions) {
                if (layerOptions.hasOwnProperty(key)) {
                    defaultOptions[key] = layerOptions[key];
                }
            }
            var wmsSource = new ol.source.ImageWMS({
                id:layerIdPrefix + layer.getId(),
                url: layer.getLayerUrls()[0],
                params: defaultParams,
                // defaultOptions

            });
            // ol.layer.Tile or ol.layer.Image for wms
            var openlayer = new ol.layer.Image({
                title: layerIdPrefix + layer.getId(),
                source: wmsSource
            });
            openlayer.opacity = layer.getOpacity() / 100;

            var params = openlayer.getSource().getParams();

            this.getMapModule().addLayer(openlayer, false);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );
            //setAt or use setZIndex() for the layer
            if (keepLayerOnTop) {
                // openlayer.setZIndex();
                this.getMap().getLayers().setAt(this.getMap().getLayers().getArray().length, openlayer);
            } else {
                this.getMap().getLayers().setAt(0, openlayer);
            }
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this._removeMapLayerFromMap(layer);
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            var me = this;
            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i += 1) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this.getLayersByName('basemap_' + subtmp.getId());
                        if ( remLayer ) {
                            remLayer.forEach( function  (layer ) {
                                me.getMapModule().removeLayer( layer );
                            });
                        }
                    }
                } else {
                    remLayer = this.getLayersByName('layer_' + layer.getId());
                    remLayer.forEach( function  (layer ) {
                        me.getMapModule().removeLayer( layer );
                    });       
                }
            } else {
                remLayer = this.getLayersByName('layer_' + layer.getId());
                remLayer.forEach( function  (layer ) {
                    me.getMapModule().removeLayer( layer );
                });
            }
        },
        getLayersByName: function (name) {
            var layers = this.getMapModule().getLayers();
            var foundLayers = [];
            for ( var i = 0; i < layers.length; i++ ) {
                if( layers[i].get("title") === name ) {
                    foundLayers.push(layers[i]);
                }
            }
            return foundLayers;
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            var olLayers = [];
            if (!layer.isLayerOfType(this.TYPE)) {
                return null;
            }
            var layers = this.getMapModule().getLayers();

            var layer;
            for( var i = 0; i < layers.length; i++ ) {
                if( layers[i].get("title") === 'layer_'+ layer._id ) {
                    layer = layers[i];
                    olLayers.push(layer);
                }
            }
            return olLayers;
        },
        __getSLD: function(layer) {
			 var SLD = '<?xml version="1.0" ?>' +
			'<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">'+
			'<NamedLayer>'+
			'<Name>'+ layer.getSLDNamedLayer() + '</Name>'+
			'<UserStyle>'+
			'<Title>Heatmap</Title>'+
			'<FeatureTypeStyle>'+
			'<Transformation>'+
			'<ogc:Function name="gs:Heatmap">'+
			'<ogc:Function name="parameter">'+
			'<ogc:Literal>data</ogc:Literal>'+
			'</ogc:Function>';
			if(layer.getWeightedHeatmapProperty()) {
				SLD = SLD +
					'<ogc:Function name="parameter">'+
					'<ogc:Literal>weightAttr</ogc:Literal>'+
					'<ogc:Literal>'+layer.getWeightedHeatmapProperty()+'</ogc:Literal>'+
					'</ogc:Function>';
			}
			SLD = SLD +
				'<ogc:Function name="parameter">'+
				'<ogc:Literal>radiusPixels</ogc:Literal>'+
				'<ogc:Function name="env">'+
				'<ogc:Literal>radius</ogc:Literal>'+
				'<ogc:Literal>'+layer.getRadius()+'</ogc:Literal>'+
				'</ogc:Function>'+
				'</ogc:Function>'+
				'<ogc:Function name="parameter">'+
				'<ogc:Literal>pixelsPerCell</ogc:Literal>'+
				'<ogc:Literal>'+ layer.getPixelsPerCell() +'</ogc:Literal>'+
				'</ogc:Function>'+
				'<ogc:Function name="parameter">'+
				'<ogc:Literal>outputBBOX</ogc:Literal>'+
				'<ogc:Function name="env">'+
				'<ogc:Literal>wms_bbox</ogc:Literal>'+
				'</ogc:Function>'+
				'</ogc:Function>'+
				'<ogc:Function name="parameter">'+
				'<ogc:Literal>outputWidth</ogc:Literal>'+
				'<ogc:Function name="env">'+
				'<ogc:Literal>wms_width</ogc:Literal>'+
				'</ogc:Function>'+
				'</ogc:Function>'+
				'<ogc:Function name="parameter">'+
				'<ogc:Literal>outputHeight</ogc:Literal>'+
				'<ogc:Function name="env">'+
				'<ogc:Literal>wms_height</ogc:Literal>'+
				'</ogc:Function>'+
				'</ogc:Function>'+
				'</ogc:Function>'+
				'</Transformation>'+
				'<Rule>'+
				'<RasterSymbolizer>'+
				'<Geometry>'+
				'<ogc:PropertyName>' + layer.getGeometryProperty() + '</ogc:PropertyName></Geometry>'+
				'<Opacity>1</Opacity>'+
				'<ColorMap type="ramp" >';

			// setup color map
			//'<ColorMapEntry color="#FFFFFF" quantity="0.02" opacity="0"/>';
			var colors = layer.getColorConfig();
			var entryTemplate = _.template('<ColorMapEntry color="${color}" quantity="${quantity}" opacity="${opacity}" />');
			_.each(colors, function(color) {
				SLD = SLD + entryTemplate(color);
			});
			SLD = SLD +
				'</ColorMap>'+
				'</RasterSymbolizer>'+
				'</Rule>'+
				'</FeatureTypeStyle>'+
				'</UserStyle>'+
				'</NamedLayer>'+
				'</StyledLayerDescriptor>';
			return SLD;
        },
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                mapLayer;

            if ( !layer.isLayerOfType( this.TYPE ) ) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' + layer.getOpacity()
            );
            mapLayer = this.getLayersByName('layer_' + layer.getId());
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        /**
         * Updates the OpenLayers and redraws them if scales have changed.
         *
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {undefined}
         */
        _updateLayer: function(layer) {
            
            var oLayers = this.getOLMapLayers(layer),
                subs = layer.getSubLayers(),
                layerList = subs.length ? subs : [layer],
                llen = layerList.length,
                scale = this.getMapModule().getMap().getScale(),
                i,
                newRes,
                isInScale;

            for (i = 0; i < llen; i += 1) {
                newRes = this._calculateResolutions(layerList[i]);
                isInScale = layerList[i].isInScale(scale);
                // Make sure the sub exists before mucking about with it
                if (newRes && isInScale && oLayers && oLayers[i]) {
                    oLayers[i].addOptions({
                        resolutions: newRes
                    });
                    oLayers[i].setVisibility(isInScale);
                    oLayers[i].redraw(true);
                }
            }
        },

        /**
         * Calculates the resolutions based on layer scales.
         *
         * @method _calculateResolutions
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {Array[Number]}
         */
        _calculateResolutions: function(layer) {
            var mm = this.getMapModule(),
                minScale = layer.getMinScale(),
                maxScale = layer.getMaxScale();

            if (minScale || maxScale) {
                // use resolutions instead of scales to minimiz
                // chance of transformation errors
                return mm.calculateLayerResolutions(maxScale, minScale);
            }
        }
    },
    {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);