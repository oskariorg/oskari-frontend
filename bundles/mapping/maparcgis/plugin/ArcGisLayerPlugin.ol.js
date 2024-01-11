import olLayerTile from 'ol/layer/Tile';
import olSourceTileArcGISRest from 'ol/source/TileArcGISRest';
import olSourceXYZ from 'ol/source/XYZ';
import { getZoomLevelHelper } from '../../mapmodule/util/scale';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

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
        this._log = Oskari.log(this.getName());
    }, {
        __name: 'ArcGisLayerPlugin',
        _clazz: 'Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin',

        layertype: 'arcgis',

        /** @static @property _layerType2 type of layers this plugin handles */
        _layerType2: 'arcgis93',

        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported: function (layer) {
            if (!layer || !this.isLayerSrsSupported(layer)) {
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
            const composingModel = new LayerComposingModel([
                LayerComposingModel.CREDENTIALS,
                LayerComposingModel.SRS,
                LayerComposingModel.URL
            ], ['1.0.0']);
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'arcgislayer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer',
                    composingModel
                );
                mapLayerService.registerLayerModel(
                    'arcgis93layer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGis93Layer',
                    composingModel
                );
            }
        },

        __tuneURLsForModernOL: function (urls = []) {
            const strToFind = '/export';
            const length = strToFind.length;
            return urls.map(url => {
                // Note! endsWith requires a polyfill for IE. One is available in src/polyfills.js
                if (url.endsWith(strToFind)) {
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
            const sandbox = this.getSandbox();
            let openlayer;
            let layerType;

            if (!this.isLayerSupported(layer)) {
                return;
            }

            if (layer.isLayerOfType(this._layerType2)) {
                // ArcGIS REST layer
                openlayer = new olLayerTile({
                    extent: this.getMap().getView().getProjection().getExtent(),
                    source: new olSourceTileArcGISRest({
                        urls: this.__tuneURLsForModernOL(layer.getLayerUrls()),
                        params: {
                            'layers': 'show:' + layer.getLayerName()
                        },
                        crossOrigin: layer.getAttributes('crossOrigin')
                    }),
                    id: layer.getId(),
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });

                layerType = 'ol3 Arcgis REST';
            } else {
                // ArcGIS cached layer.
                // Layer URL is like: http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x} format
                openlayer = new olLayerTile({
                    source: new olSourceXYZ({
                        url: layer.getLayerUrl(),
                        crossOrigin: layer.getAttributes('crossOrigin')
                    }),
                    id: layer.getId(),
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });
                layerType = 'ol3 Arcgis CACHE';
            }

            openlayer.setOpacity(layer.getOpacity() / 100);
            const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
            // Set min max zoom levels that layer should be visible in
            zoomLevelHelper.setOLZoomLimits(openlayer, layer.getMinScale(), layer.getMaxScale());

            this._registerLayerEvents(openlayer, layer);
            this.getMapModule().addLayer(openlayer, !keepLayerOnTop);
            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            this._log.debug(
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
        _registerLayerEvents: function (layer, oskariLayer) {
            const mapModule = this.getMapModule();
            const source = layer.getSource();
            const layerId = oskariLayer.getId();

            source.on('imageloadstart', function () {
                mapModule.loadingState(layerId, true);
            });

            source.on('imageloadend', function () {
                mapModule.loadingState(layerId, false);
            });

            source.on('imageloaderror', function () {
                mapModule.loadingState(layerId, null, true);
            });
        },
        /**
         * Called when layer details are updated (for example by the admin functionality)
         * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
         */
        _updateLayer: function (layer) {
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
            const layersImpls = this.getOLMapLayers(layer.getId()) || [];
            layersImpls.forEach(olLayer => {
                // Update min max Resolutions
                zoomLevelHelper.setOLZoomLimits(olLayer, layer.getMinScale(), layer.getMaxScale());
            });
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
