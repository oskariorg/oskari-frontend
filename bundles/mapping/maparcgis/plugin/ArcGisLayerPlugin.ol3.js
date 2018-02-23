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
            if(!layer || !this.isLayerSrsSupported(layer)) {
                return false;
            }
            return layer.isLayerOfType(this.layerType) || layer.isLayerOfType(this._layerType2);
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
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

        __tuneURLsForOL3 : function(urls) {
            var strToFind = "/export",
                length = strToFind.length;
            return _.map(urls, function(url) {
                // Note! endsWith requires a polyfill. One is available in bundles/bundle.js
                if(url.endsWith(strToFind)) {
                    return url.substring(0, url.length - length);
                }
                return url;
            });
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
                        urls: this.__tuneURLsForOL3(layer.getLayerUrls()),
                        params : {
                            'layers' : 'show:' + layer.getLayerName()
                        },
                        crossOrigin : layer.getAttributes('crossOrigin')
                    }),
                    id: layer.getId(),
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });

                layerType = 'ol3 Arcgis REST';
            } else {
                // ArcGIS cached layer.
                // Layer URL is like: http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x} format
                openlayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: layer.getLayerUrl(),
                        crossOrigin : layer.getAttributes('crossOrigin')
                    }),
                    id: layer.getId(),
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });
                layerType = 'ol3 Arcgis CACHE';
            }

            layer.setQueryable(true);
            openlayer.opacity = layer.getOpacity() / 100;

            me._registerLayerEvents(openlayer, layer);
            me.getMapModule().addLayer(openlayer, !keepLayerOnTop);
            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me.getSandbox().printDebug(
                '#!#! CREATED ' + layerType + ' for ArcGisLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function(layer, oskariLayer){
        var me = this;
        var source = layer.getSource();

        source.on('tileloadstart', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), true);
        });

        source.on('tileloadend', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), false);
        });

        source.on('tileloaderror', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), null, true );

        });

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
