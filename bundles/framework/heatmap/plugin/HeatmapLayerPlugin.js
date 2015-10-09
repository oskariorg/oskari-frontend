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
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.WmsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType(this.TYPE)) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

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
                    layers: layer.getLayerName(),
                    transparent: true,
                    id: layer.getId(),
                    styles: layer.getCurrentStyle().getName(),
                    format: 'image/png',
                    SLD_BODY : this.__getSLD(layer)
                },
                defaultOptions = {
                    singleTile : true,
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

            var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + layer.getId(), layer.getLayerUrls(), defaultParams, defaultOptions);
            openLayer.opacity = layer.getOpacity() / 100;

            // hackish way of hooking into layers redraw calls
            var original = openLayer.redraw;
            openLayer.redraw = function() {
            	// mergeNewParams triggers a new redraw so we need to use
            	// a flag variable to detect if we should redraw or calculate new SLD
            	if(this.____oskariFlagSLD === true) {
            		this.____oskariFlagSLD = false;
            		return original.apply(this, arguments);
            	}
        		this.____oskariFlagSLD = true;
                openLayer.mergeNewParams({
                    SLD_BODY : me.__getSLD(layer)
                });
            }
            // /hack

            this.getMap().addLayer(openLayer);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(openLayer, this.getMap().layers.length);
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
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

            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i += 1) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this.getMap().getLayersByName('basemap_' + subtmp.getId());
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            remLayer[0].destroy();
                        }
                    }
                } else {
                    remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                    remLayer[0].destroy();
                }
            } else {
                remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                /* This should free all memory */
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType(this.TYPE)) {
                return null;
            }

            return this.getMap().getLayersByName('layer_' + layer.getId());
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

            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' + layer.getOpacity()
            );
            mapLayer = this.getMap().getLayersByName('layer_' + layer.getId());
            if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
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