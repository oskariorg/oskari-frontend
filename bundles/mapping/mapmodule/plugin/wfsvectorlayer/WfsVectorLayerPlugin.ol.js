import { VectorLayerHandler } from './WfsVectorLayerPlugin/impl/VectorLayerHandler.ol';
import { MvtLayerHandler } from './WfsVectorLayerPlugin/impl/MvtLayerHandler.ol';
import { ReqEventHandler } from './WfsVectorLayerPlugin/ReqEventHandler';
import { DEFAULT_STYLES, styleGenerator } from './WfsVectorLayerPlugin/util/style';

import './WFSLayer';
import './WfsLayerModelBuilder';
import '../../request/ActivateHighlightRequest';
import '../../event/WFSFeaturesSelectedEvent';
import '../../event/WFSStatusChangedEvent';

import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, RENDER_MODE_MVT, RENDER_MODE_VECTOR } from '../../domain/constants';
const AbstractVectorLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractVectorLayerPlugin');
const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');

export class WfsVectorLayerPlugin extends AbstractVectorLayerPlugin {
    constructor (config) {
        super(config);
        this._config = config;
        this._name = 'WfsVectorLayerPlugin';
        this._clazz = 'Oskari.wfs.WfsVectorLayerPlugin';
        this.renderMode = config.renderMode || RENDER_MODE_VECTOR;
        this.oskariStyleSupport = true;
        this.layertype = 'wfs';
        this.layertypes = new Set([this.layertype]);
        this.vectorLayerHandler = new VectorLayerHandler(this);
        this.mvtLayerHandler = new MvtLayerHandler(this);
        this.layerHandlersByLayerId = {};
    }

    /* ---- AbstractMapModulePlugin functions ---- */

    getLayerTypeSelector () {
        return 'wfslayer';
    }

    /**
     * Registers layer type to be handled by this layer plugin.
     *
     * @param {String} layertype for ex. "MYPLACES"
     * @param {String} modelClass layer model class name
     * @param {Object} modelBuilder layer model builder instance
     * @param {Object} eventHandlers
     */
    registerLayerType (layertype, modelClass, modelBuilder, eventHandlers) {
        if (this.layertypes.has(layertype) || !this.mapLayerService || !this.vectorFeatureService) {
            return;
        }
        this.layertypes.add(layertype);
        this.getMapModule().setLayerPlugin(layertype, this);
        this.getMapModule().registerDefaultFeatureStyle(layertype, DEFAULT_STYLES.style);
        this.vectorFeatureService.registerLayerType(layertype, this);
        this.vectorFeatureService.registerDefaultStyles(layertype, DEFAULT_STYLES);
        this.mapLayerService.registerLayerModel(layertype, modelClass);
        if (modelBuilder) {
            this.mapLayerService.registerLayerModelBuilder(layertype, modelBuilder);
        }
        this._registerEventHandlers(eventHandlers);
    }

    _registerEventHandlers (eventHandlers) {
        if (!eventHandlers) {
            return;
        }
        Object.keys(eventHandlers).forEach(eventName => {
            if (typeof this._eventHandlers[eventName] !== 'undefined') {
                this._log.warn('Wfs plugin tried to register multiple handlers for event: ' + eventName);
                return;
            }
            this._eventHandlers[eventName] = eventHandlers[eventName];
            this.getSandbox().registerForEventByName(this, eventName);
        });
    }

    _initImpl () {
        super._initImpl();
        const sandbox = this.getSandbox();
        if (this.getMapModule().getSupports3D() && this.renderMode !== RENDER_MODE_VECTOR) {
            // 3D mapmodule doesn't support MVT
            this._log.warn('Changing WFS render mode (3d only supports GeoJSON). Configuration was for: ' + this.renderMode);
            this.renderMode = RENDER_MODE_VECTOR;
        }
        this.reqEventHandler = new ReqEventHandler(sandbox);
        this.vectorFeatureService = sandbox.getService('Oskari.mapframework.service.VectorFeatureService');
        this.mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        if (!this.mapLayerService || !this.vectorFeatureService) {
            return;
        }
        const composingModel = new LayerComposingModel([
            LayerComposingModel.CAPABILITIES,
            LayerComposingModel.CLUSTERING_DISTANCE,
            LayerComposingModel.CREDENTIALS,
            LayerComposingModel.HOVER,
            LayerComposingModel.SRS,
            LayerComposingModel.VECTOR_STYLES,
            LayerComposingModel.URL,
            LayerComposingModel.VERSION,
            LayerComposingModel.WFS_LAYER
        ], ['1.1.0', '2.0.0', '3.0.0']);

        const layerClass = 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer';
        this.mapLayerService.registerLayerModel(this.getLayerTypeSelector(), layerClass, composingModel);
        this.mapLayerService.registerLayerModelBuilder(this.getLayerTypeSelector(), new WfsLayerModelBuilder(sandbox, (path) => this.getMsg(path)));
        this.vectorFeatureService.registerLayerType(this.layertype, this);
        this.vectorFeatureService.registerDefaultStyles(this.layertype, DEFAULT_STYLES);
        this.getMapModule().registerDefaultFeatureStyle(this.layertype, DEFAULT_STYLES.style);
    }

    _createPluginEventHandlers () {
        const vectorHandlers = this.vectorLayerHandler.createEventHandlers(this);
        const mvtHandlers = this.mvtLayerHandler.createEventHandlers(this);
        const commonHandlers = this.reqEventHandler.createEventHandlers(this);
        const eventKeys = [...new Set([
            ...Object.keys(vectorHandlers),
            ...Object.keys(mvtHandlers),
            ...Object.keys(commonHandlers)
        ])];
        const handlers = {};
        // Call event handlers in all modules
        eventKeys.forEach(eventName => {
            handlers[eventName] = event => {
                [vectorHandlers, mvtHandlers, commonHandlers].forEach(handlerModule => {
                    if (typeof handlerModule[eventName] === 'function') {
                        handlerModule[eventName](event);
                    }
                });
            };
        });
        return handlers;
    }

    _createRequestHandlers () {
        return this.reqEventHandler.createRequestHandlers();
    }

    isLayerSupported (layer) {
        if (!layer) {
            return false;
        }
        if (layer.isLayerOfType(this.getLayerTypeSelector())) {
            return true;
        }
        return this.layertypes.has(layer.getLayerType());
    }

    getRenderMode (layer) {
        let renderMode = this.renderMode;
        if (layer.getOptions()) {
            renderMode = layer.getOptions().renderMode || renderMode;
        }
        return renderMode;
    }

    isRenderModeSupported (mode) {
        return mode === RENDER_MODE_MVT || mode === RENDER_MODE_VECTOR;
    }

    /**
     * @method updateLayerParams
     * Force updating features on layer
     */
    updateLayerParams (layer, forced, params) {
        const handler = this._getLayerHandler(layer);
        if (handler) {
            handler.refreshLayer(layer);
        }
    }

    getLayerFeaturePropertiesInViewport (layerId) {
        const result = this.getFeatures(null, {
            layers: [layerId]
        });
        const { features = [] } = result[layerId];
        return features.map(f => f.properties);
    }

    /**
     * Override in actual plugins to returns features.
     *
     * Returns features that are currently on map filtered by given geometry and/or properties
     * {
     *   "[layer id]": {
     *      accuracy: 'extent',
     *      runtime: true,
     *      features: [{ geometry: {...}, properties: {...}}, ...]
     *   },
     *   ...
     * }
     * Runtime flag is true for features pushed with AddFeaturesToMapRequest etc and false/missing for features from WFS/OGC API sources.
     * For features that are queried from MVT-tiles we might not be able to get the whole geometry and since it's not accurate they will
     *  only get the extent of the feature. This is marked with accuracy: 'extent' and it might not even be the whole extent if the
     *  feature continues on unloaded tiles.
     * @param {Object} geojson an object with geometry and/or properties as filter for features. Geometry defaults to current viewport.
     * @param {Object} opts additional options to narrow feature collection
     * @returns {Object} an object with layer ids as keys with an object value with key "features" for the features on that layer and optional runtime-flag
     */
    getFeatures (geojson = {}, opts = {}) {
        let { layers } = opts;
        if (!layers || !layers.length) {
            layers = this.getSandbox().getMap().getLayers().map(l => l.getId());
        }
        const result = {};
        layers.forEach(layerId => {
            const layer = this.getSandbox().getMap().getSelectedLayer(layerId);
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const err = this.detectErrorOnFeatureQuery(layer);
            if (err) {
                result[layerId] = {
                    error: err,
                    features: []
                };
                return;
            }

            const handler = this._getLayerHandler(layerId);
            if (!handler) {
                return;
            }
            const features = handler.getFeaturesWithFilter(layerId, geojson);
            if (features) {
                result[layerId] = {
                    features
                };
            }
        });
        return result;
    }

    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const renderMode = this.getRenderMode(layer);
        if (!this.isRenderModeSupported(renderMode)) {
            return;
        }
        const handler = renderMode === RENDER_MODE_MVT ? this.mvtLayerHandler : this.vectorLayerHandler;
        this.layerHandlersByLayerId[layer.getId()] = handler;
        const added = handler.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        // Set oskari properties for vector feature service functionalities.
        added.forEach(lyr => {
            handler.applyZoomBounds(layer, lyr);
            const silent = true;
            lyr.set(LAYER_ID, layer.getId(), silent);
            lyr.set(LAYER_TYPE, layer.getLayerType(), silent);
            // don't add style for hover layer
            if (layer.isVisible() && !lyr.get(LAYER_HOVER)) {
                // Only set style if visible as it's an expensive operation
                // assumes style will be set on MapLayerVisibilityChangedEvent when layer is made visible
                lyr.setStyle(this.getCurrentOlStyle(layer));
            }
            this.getMapModule().addLayer(lyr, !keepLayerOnTop);
        });
    }

    /**
     * @method refreshLayersOfType
     * @param {String} layerType
     */
    refreshLayersOfType (layerType) {
        if (!layerType) {
            return;
        }
        this.getSandbox().getMap().getLayers()
            .filter(layer => layer.getLayerType() === layerType)
            .forEach(layer => {
                const handler = this._getLayerHandler(layer);
                if (handler) {
                    handler.refreshLayer(layer);
                }
            });
    }

    /* ---- Impl specific functions ---- */

    /**
     * @method findLayerByOLLayer
     * @param {ol/layer/Layer} olLayer OpenLayers layer impl
     * @return {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer}
     */
    findLayerByOLLayer (olLayer) {
        const layerId = Object.keys(this._layerImplRefs).find(layerId => olLayer === this._layerImplRefs[layerId]);
        return this.getSandbox().getMap().getSelectedLayer(layerId);
    }

    /**
     * @method getAllLayerIds
     * @return {String[]} All layer ids handled by plugin and selected on map
     */
    getAllLayerIds () {
        return Object.keys(this._layerImplRefs);
    }

    /**
     * Helper to access the correct layer handler impl for a layer.
     * @param {AbstractLayer | string | number} layer layer object or id
     */
    _getLayerHandler (layer) {
        if (!layer) {
            return;
        }
        const id = typeof layer === 'object' ? layer.getId() : layer;
        return this.layerHandlersByLayerId[id];
    }

    /**
     * @method getCurrentOlStyle
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/style/Style | StyleLike}
     */
    getCurrentOlStyle (layer) {
        return styleGenerator(this.mapModule, layer);
    }

    /**
     * @method updateLayerStyle
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    updateLayerStyle (layer) {
        if (!this.isLayerSupported(layer)) {
            return;
        }
        const olLayers = this.getOLMapLayers(layer);
        if (!olLayers || olLayers.length === 0) {
            return;
        }
        const style = this.getCurrentOlStyle(layer);
        olLayers.forEach(lyr => {
            if (lyr.get(LAYER_HOVER)) {
                // don't add style for hover layer
                return;
            }
            lyr.setStyle(style);
            if (this.renderMode === RENDER_MODE_VECTOR && this.getMapModule().getSupports3D()) {
                // Trigger features changed to synchronize 3D view
                lyr.getSource().getFeatures().forEach(ftr => ftr.changed());
            }
        });
    }

    notify (eventName, ...args) {
        const builder = Oskari.eventBuilder(eventName);
        if (!builder) {
            return;
        }
        Oskari.getSandbox().notifyAll(builder.apply(null, args));
    }

    /**
     * Called when layer details are updated (for example by the admin functionality)
     * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
     */
    _updateLayer (layer) {
        if (!this.isLayerSupported(layer)) {
            return;
        }
        const handler = this._getLayerHandler(layer);
        if (!handler) {
            return;
        }
        const layersImpls = this.getOLMapLayers(layer.getId()) || [];
        layersImpls.forEach(olLayer => {
            handler.applyZoomBounds(layer, olLayer);
        });
    }
};
Oskari.clazz.defineES('Oskari.wfsvector.WfsVectorLayerPlugin', WfsVectorLayerPlugin,
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
