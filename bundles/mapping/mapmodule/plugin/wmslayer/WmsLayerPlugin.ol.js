import olLayerTile from 'ol/layer/Tile';
import olLayerImage from 'ol/layer/Image';
import olProjProjection from 'ol/proj/Projection';
import * as olProj from 'ol/proj';

import { OskariImageWMS } from './OskariImageWMS';
import { OskariTileWMS } from './OskariTileWMS';
import { getZoomLevelHelper } from '../../util/scale';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

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
        this._log = Oskari.log(this.getName());
    },
    {
        __name: 'WmsLayerPlugin',
        _clazz: 'Oskari.mapframework.mapmodule.WmsLayerPlugin',
        layertype: 'wmslayer',

        getLayerTypeSelector: function () {
            return 'WMS';
        },

        _initImpl () {
            const mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            const layerClass = 'Oskari.mapframework.domain.WmsLayer';
            const composingModel = new LayerComposingModel([
                LayerComposingModel.CAPABILITIES,
                LayerComposingModel.CAPABILITIES_STYLES,
                LayerComposingModel.CREDENTIALS,
                LayerComposingModel.GFI_CONTENT,
                LayerComposingModel.GFI_TYPE,
                LayerComposingModel.GFI_XSLT,
                LayerComposingModel.REALTIME,
                LayerComposingModel.REFRESH_RATE,
                LayerComposingModel.SINGLE_TILE,
                LayerComposingModel.SELECTED_TIME,
                LayerComposingModel.SRS,
                LayerComposingModel.URL,
                LayerComposingModel.VERSION
            ], ['1.1.1', '1.3.0']);
            const type = this.getLayerTypeSelector().toLowerCase() + 'layer';
            mapLayerService.registerLayerModel(type, layerClass, composingModel);
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
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());

            var layers = [],
                olLayers = [];
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap === true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
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
                        'VERSION': _layer.getVersion() || '1.3.0'
                    },
                    layerParams = _layer.getParams() || {},
                    layerOptions = _layer.getOptions() || {},
                    layerAttributes = _layer.getAttributes() || undefined;

                if (!layerOptions.hasOwnProperty('singleTile') && layerAttributes && layerAttributes.times) {
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

                var reverseProjection;
                if (layerAttributes && layerAttributes.reverseXY && (typeof layerAttributes.reverseXY === 'object')) {
                    var projectionCode = this.getMapModule().getProjection();
                    // use reverse coordinate order for this layer!
                    if (layerAttributes.reverseXY[projectionCode]) {
                        reverseProjection = this._createReverseProjection(projectionCode);
                    }
                }
                var sourceImpl = null;
                var sourceOpts = {
                    url: _layer.getLayerUrl(),
                    params: defaultParams,
                    crossOrigin: _layer.getAttributes('crossOrigin'),
                    projection: reverseProjection || undefined
                };
                if (layerOptions.singleTile === true) {
                    sourceImpl = new OskariImageWMS(sourceOpts);
                    layerImpl = new olLayerImage({
                        source: sourceImpl,
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                    this._registerLayerEvents(layerImpl, _layer, 'image');
                } else {
                    sourceImpl = new OskariTileWMS(sourceOpts);
                    layerImpl = new olLayerTile({
                        source: sourceImpl,
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                    this._registerLayerEvents(layerImpl, _layer, 'tile');
                }
                // Set min max zoom levels that layer should be visible in
                zoomLevelHelper.setOLZoomLimits(layerImpl, _layer.getMinScale(), _layer.getMaxScale());
                this.mapModule.addLayer(layerImpl, !keepLayerOnTop);
                // gather references to layers
                olLayers.push(layerImpl);

                this._log.debug('#!#! CREATED ol/layer/TileLayer for ' + _layer.getId());
            }
            // store reference to layers
            this.setOLMapLayers(layer.getId(), olLayers);
        },

        _registerLayerEvents: function (layer, oskariLayer, prefix) {
            var me = this;
            var source = layer.getSource();

            source.on(prefix + 'loadstart', function () {
                me.getMapModule().loadingState(oskariLayer._id, true);
            });

            source.on(prefix + 'loadend', function () {
                me.getMapModule().loadingState(oskariLayer._id, false);
            });

            source.on(prefix + 'loaderror', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), null, true);
            });
        },
        /**
         *
         * @method @private _createReverseProjection Create a clone of the projection object with axis order neu
         *
         */
        _createReverseProjection: function (projectionCode) {
            var originalProjection = olProj.get(projectionCode);

            if (!originalProjection) {
                return null;
            }

            var reverseProjection = new olProjProjection({
                'code': projectionCode,
                'units': originalProjection.getUnits(),
                'extent': originalProjection.getExtent(),
                'axisOrientation': 'neu',
                'global': originalProjection.isGlobal(),
                'metersPerUnit': originalProjection.getMetersPerUnit(),
                'worldExtent': originalProjection.getWorldExtent(),
                'getPointResolution': originalProjection.getPointResolution
            });
            return reverseProjection;
        },

        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer();
            var layerList = this.getOLMapLayers(layer);
            if (!layerList) {
                return;
            }
            layerList.forEach(function (openlayer) {
                openlayer.getSource().updateParams({
                    styles: layer.getCurrentStyle().getName()
                });
            });
        },
        updateLayerParams: function (layer, forced, params) {
            if (!this.isLayerSupported(layer) || !params) {
                return;
            }
            var me = this;
            var olLayerList = this.mapModule.getOLMapLayers(layer.getId()) || [];
            const proxyUrl = Oskari.urls.getRoute('GetLayerTile', { id: layer.getId() });

            olLayerList.forEach(olLayer => {
                var layerSource = olLayer.getSource();
                // TileWMS -> original is olSourceTileWMS.getTileLoadFunction
                if (typeof layerSource.getTileLoadFunction === 'function') {
                    var originalTileLoadFunction = new OskariTileWMS().getTileLoadFunction();
                    layerSource.setTileLoadFunction(function (image, src) {
                        if (src.length >= 2048) {
                            me._imagePostFunction(image, src, proxyUrl);
                        } else {
                            originalTileLoadFunction.apply(this, arguments);
                        }
                    });
                }
                // ImageWMS -> original is olSourceImageWMS.getImageLoadFunction
                else if (typeof layerSource.getImageLoadFunction === 'function') {
                    var originalImageLoadFunction = new OskariImageWMS().getImageLoadFunction();
                    layerSource.setImageLoadFunction(function (image, src) {
                        if (src.length >= 2048) {
                            me._imagePostFunction(image, src, proxyUrl);
                        } else {
                            originalImageLoadFunction.apply(this, arguments);
                        }
                    });
                }
                olLayer.getSource().updateParams(params);
            });
        },
        /**
         * @method @private _imagePostFunction
         * Issue a POST request to load a tile's source
         *
         * http://gis.stackexchange.com/questions/175057/openlayers-3-wms-styling-using-sld-body-and-post-request
         */
        _imagePostFunction: function (image, src, proxyUrl) {
            var img = image.getImage();
            if (typeof window.btoa !== 'function') {
                img.src = src;
                return;
            }
            var xhr = new XMLHttpRequest();
            // GET ALL THE PARAMETERS OUT OF THE SOURCE URL**
            var dataEntries = src.split('&');
            var params = '';
            // i === 0 -> the actual url, skip. Everything after that is params.
            for (var i = 1; i < dataEntries.length; i++) {
                params = params + '&' + dataEntries[i];
            }
            xhr.open('POST', proxyUrl, true);

            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
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
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(params);
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
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin']
    }
);
