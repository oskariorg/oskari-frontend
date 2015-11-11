/**
 * @class Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
    }, {
        __name : 'ArcGisLayerPlugin',
        _clazz : 'Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin',

        layertype : 'arcgis',

        /** @static @property _layerType2 type of layers this plugin handles */
        _layerType2: 'arcgis93',

        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported 
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer 
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported : function(layer) {
            if(!layer) {
                return false;
            }
            return layer.isLayerOfType(this.layerType) || layer.isLayerOfType(this._layerType2);
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'arcgislayer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer'
                );
                mapLayerService.registerLayerModel(
                    'arcgis93layer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGis93Layer'
                );
            }
        },

        /**
         * Adds a single ArcGis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.arcgis.domain.ArcGisLayer} layer
         * @param {Boolean} keepLayerOnTop
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
            var me = this,
                openlayer,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                layerType;

            if (!layer.isLayerOfType(me._layerType) && !layer.isLayerOfType(me._layerType2)) {
                return;
            }

            if (layer.isLayerOfType(me._layerType2)) {
                //ArcGIS REST layer
                openlayer = new ol.layer.Tile({
                    extent: me.getMap().getView().getProjection().getExtent(),
                    source: new ol.source.TileArcGISRest({
                        url: layer.getLayerUrls()[0]
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });

                layerType = 'ol3 Arcgis REST';
            } else {
                // ArcGIS cached layer.
                // Layer URL is like: http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x} format
                openlayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                         url: layer.getLayerUrls()[0]
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });
                layerType = 'ol3 Arcgis CACHE';
            }

            layer.setQueryable(true);
            openlayer.opacity = layer.getOpacity() / 100;

            me.getMap().addLayer(openlayer);
            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            if (keepLayerOnTop) {
                me.getMapModule().setLayerIndex(openlayer, me.getMap().getLayers().getArray().length);
            } else {
                me.getMapModule().setLayerIndex(openlayer, 0);
            }

            me.getSandbox().printDebug(
                '#!#! CREATED ' + layerType + ' for ArcGisLayer ' +
                layer.getId()
            );
        }
    }, {
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });