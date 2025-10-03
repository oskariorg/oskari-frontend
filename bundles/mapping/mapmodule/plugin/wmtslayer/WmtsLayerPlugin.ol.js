import OlLayerTile from 'ol/layer/Tile';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import './WmtsLayer';
import { formatCapabilitiesForOpenLayers } from './CapabilitiesHelper';
import { getZoomLevelHelper } from '../../util/scale';
import { Messaging } from 'oskari-ui/util';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
        this._log = Oskari.log(this.getName());
        this._capabilities = {};
    }, {
        __name: 'WmtsLayerPlugin',
        _clazz: 'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
        layertype: 'wmtslayer',

        getLayerTypeSelector: function () {
            return 'WMTS';
        },

        _initImpl: function () {
            // register domain builder
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');

            if (!mapLayerService) {
                // no map layer service - TODO: signal failure
                return;
            }
            const className = 'Oskari.mapframework.wmts.domain.WmtsLayer';
            const composingModel = new LayerComposingModel([
                LayerComposingModel.CAPABILITIES,
                LayerComposingModel.CAPABILITIES_STYLES,
                LayerComposingModel.CREDENTIALS,
                LayerComposingModel.GFI_CONTENT,
                LayerComposingModel.GFI_TYPE,
                LayerComposingModel.GFI_XSLT,
                LayerComposingModel.SRS,
                LayerComposingModel.URL,
                LayerComposingModel.VERSION
            ], ['1.0.0']);
            mapLayerService.registerLayerModel(this.layertype, className, composingModel);
        },
        _handleDescribeLayerImpl (layer, info) {
            const { capabilities } = info;
            const layerId = layer.getId();
            try {
                this._log.debug(`Running WMTS capabilities parsing for layer id: ${layerId}`, capabilities);
                this._capabilities[layerId] = formatCapabilitiesForOpenLayers(capabilities);
            } catch (err) {
                this._log.warn(`Failed to parse capabilities for WMTS layer id: ${layerId}`, capabilities);
            }
        },
        /**
         * @method _addMapLayerToMap
         * @private
         * Adds a single Wmts layer to this map
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const layerId = layer.getId();
            const caps = this._capabilities[layerId];
            if (!caps) {
                Messaging.warn(Oskari.getMsg('MapModule', 'layerUnsupported.unavailable', { name: layer.getName() }));
                return;
            }
            const mapModule = this.getMapModule();
            const wmtsLayer = this.__createWMTSLayer(layer, caps);
            this._log.debug('created WMTS layer ' + wmtsLayer);
            this._registerLayerEvents(wmtsLayer, layer);

            const zoomLevelHelper = getZoomLevelHelper(mapModule.getScaleArray());
            zoomLevelHelper.setOLZoomLimits(wmtsLayer, layer.getMinScale(), layer.getMaxScale());

            mapModule.addLayer(wmtsLayer, !keepLayerOnTop);
            this.setOLMapLayers(layerId, wmtsLayer);
        },
        __getLayerConfig: function (layer) {
            // default params and options
            // URL is tuned serverside so we need to use the one it gives (might be proxy url)
            return {
                name: 'layer_' + layer.getId(),
                style: layer.getCurrentStyle().getName(),
                layer: layer.getLayerName(),
                buffer: 0,
                crossOrigin: layer.getAttributes('crossOrigin'),
                ...layer.getOptions()
            };
        },
        __createWMTSLayer: function (layer, caps) {
            const config = this.__getLayerConfig(layer);
            const options = optionsFromCapabilities(caps, config);
            // if requestEncoding is set for layer -> use it since proxied are
            //  always KVP and openlayers defaults to REST
            options.requestEncoding = config.requestEncoding || options.requestEncoding;
            if (!options.urls.length) {
                // force KVP if we have no resource urls/possible misconfig
                options.requestEncoding = 'KVP';
            }
            if (options.requestEncoding === 'KVP') {
                // override url to one provided by server since the layer might be proxied
                options.urls = [layer.getLayerUrl()];
            }
            // attach params to URLs (might contain apikey or other params that aren't passed on capabilities etc)
            options.urls = options.urls.map(url => Oskari.urls.buildUrl(url, layer.getParams()));
            // allows layer.options.wrapX to be passed to source.
            // On OL 6.4.3 it's always false from optionsFromCapabilities()
            // On 6.6.1 it appears to be correct and this line could be removed
            options.wrapX = !!config.wrapX;
            const wmtsLayer = new OlLayerTile({
                source: new OlSourceWMTS(options),
                opacity: layer.getOpacity() / 100.0,
                transparent: true,
                visible: layer.isVisibleOnMap()
            });
            return wmtsLayer;
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function (layer, oskariLayer) {
            const me = this;
            const source = layer.getSource();

            source.on('tileloadstart', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), true);
            });

            source.on('tileloadend', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), false);
            });

            source.on('tileloaderror', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), null, true);
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
        extend: ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
