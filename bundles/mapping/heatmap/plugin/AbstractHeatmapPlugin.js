/**
 * @class Oskari.mapframework.heatmap.HeatmapLayerPlugin
 * Provides functionality to draw Heatmap layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.heatmap.AbstractHeatmapPlugin',
    function () {
        var me = this;
        me._clazz = 'Oskari.mapframework.heatmap.HeatmapLayerPlugin';
        me._name = 'HeatmapLayerPlugin';
    }, {
        getLayerTypeSelector: function () {
            return 'HEATMAP';
        },
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

                if ( layer.isLayerOfType( this.getLayerTypeSelector() ) ) {
                    Oskari.log(this._name).debug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
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
            if ( !layer.isLayerOfType( this.getLayerTypeSelector() ) ) {
                // only handle layers of type heatmap
                return
            }
            var oLayers = this.getOLMapLayers(layer),
                subs = layer.getSubLayers(),
                layerList = subs.length ? subs : [layer],
                llen = layerList.length,
                scale = this.getSandbox().getMap().getScale(),
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
            __getSLD: function( layer ) {
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
    }, {
    'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin']

});