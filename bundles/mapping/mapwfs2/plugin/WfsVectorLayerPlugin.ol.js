import { VectorLayerHandler } from './WfsVectorLayerPlugin/impl/VectorLayerHandler.ol';
import { MvtLayerHandler } from './WfsVectorLayerPlugin/impl/MvtLayerHandler.ol';
import { ReqEventHandler } from './WfsVectorLayerPlugin/ReqEventHandler';
import { HoverHandler } from './WfsVectorLayerPlugin/HoverHandler';
import { styleGenerator } from './WfsVectorLayerPlugin/util/style';
import { WFS_ID_KEY, WFS_FTR_ID_KEY, WFS_FTR_ID_LOCALE } from './WfsVectorLayerPlugin/util/props';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, RENDER_MODE_MVT, RENDER_MODE_VECTOR } from '../../mapmodule/domain/constants';
import { UserStyleService } from '../service/UserStyleService';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const VisualizationForm = Oskari.clazz.get('Oskari.userinterface.component.VisualizationForm');
const WFSLayerService = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');

export class WfsVectorLayerPlugin extends AbstractMapLayerPlugin {
    constructor (config) {
        super();
        this._config = config;
        this.__name = 'WfsVectorLayerPlugin';
        this._clazz = 'Oskari.wfs.WfsVectorLayerPlugin';
        this.renderMode = config.renderMode || RENDER_MODE_VECTOR;
        this.visualizationForm = null;
        this.oskariStyleSupport = true;
        this.layertype = 'wfs';
        this.layertypes = new Set([this.layertype]);
        this.hoverHandler = new HoverHandler(WFS_ID_KEY);
        this.vectorLayerHandler = new VectorLayerHandler(this);
        this.mvtLayerHandler = new MvtLayerHandler(this);
        this.layerHandlersByLayerId = {};
        this.userStyleService = new UserStyleService();
        Oskari.getSandbox().registerService(this.userStyleService);
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
        this.mapLayerService.registerLayerModel(layertype, modelClass);
        this.mapLayerService.registerLayerModelBuilder(layertype, modelBuilder);
        this.vectorFeatureService.registerLayerType(layertype, this);
        this._registerEventHandlers(eventHandlers);
    }
    _registerEventHandlers (eventHandlers) {
        if (!eventHandlers) {
            return;
        }
        Object.keys(eventHandlers).forEach(eventName => {
            if (this._eventHandlers.hasOwnProperty(eventName)) {
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
        this.visualizationForm = new VisualizationForm({ name: '' });
        this.WFSLayerService = new WFSLayerService(sandbox);
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
            LayerComposingModel.STYLE,
            LayerComposingModel.STYLES_JSON,
            LayerComposingModel.URL,
            LayerComposingModel.VERSION,
            LayerComposingModel.WFS_RENDER_MODE
        ], ['1.1.0', '2.0.0', '3.0.0']);

        const layerClass = 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer';
        this.mapLayerService.registerLayerModel(this.getLayerTypeSelector(), layerClass, composingModel);
        this.mapLayerService.registerLayerModelBuilder(this.getLayerTypeSelector(), new WfsLayerModelBuilder(sandbox));
        this.vectorFeatureService.registerLayerType(this.layertype, this);
        sandbox.registerService(this.WFSLayerService);
        this._setupMouseOutOfMapHandler();
    }
    _setupMouseOutOfMapHandler () {
        const me = this;
        this.getMapModule().getMap().getViewport().addEventListener('mouseout', (evt) => {
            me.hoverHandler.clearHover();
        }, false);
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
                    if (handlerModule.hasOwnProperty(eventName)) {
                        handlerModule[eventName](event);
                    }
                });
            };
        });
        return handlers;
    }
    _createRequestHandlers () {
        return this.reqEventHandler.createRequestHandlers(this);
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
     * @method getPropertiesForIntersectingGeom
     * To get feature properties as a list. Returns features that intersect with given geometry.
     *
     * @param {String | Object} geoJsonGeom GeoJson format geometry object. Note: NOT feature, but feature's geometry
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {Array} features' properties as a list
     */
    getPropertiesForIntersectingGeom (geoJsonGeom, layer) {
        const handler = this._getLayerHandler(layer);
        if (!handler) {
            return;
        }
        const olLayer = this.getOLMapLayers(layer)[0];
        return handler.getPropertiesForIntersectingGeom(geoJsonGeom, olLayer);
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
        let added = handler.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        if (!added) {
            return;
        }
        if (!Array.isArray(added)) {
            added = [added];
        }
        // Set oskari properties for vector feature service functionalities.
        added.forEach(lyr => {
            const silent = true;
            lyr.set(LAYER_ID, layer.getId(), silent);
            lyr.set(LAYER_TYPE, layer.getLayerType(), silent);
            lyr.set(LAYER_HOVER, layer.getHoverOptions(), silent);
            if (layer.isVisible()) {
                // Only set style if visible as it's an expensive operation
                // assumes style will be set on MapLayerVisibilityChangedEvent when layer is made visible
                lyr.setStyle(this.getCurrentStyleFunction(layer, handler));
            }
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
    /* ----- VectorFeatureService interface functions ----- */

    onMapHover (event, feature, layer) {
        this.hoverHandler.onMapHover(event, feature, layer);
    }
    onLayerRequest (request, layer) {
        this.hoverHandler.onLayerRequest(request, layer);
    }

    /* ---- Impl specific functions ---- */

    /**
     * @method getCustomStyleEditorForm To get editor ui element for custom style.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return VisualizationForm's form element
     */
    getCustomStyleEditorForm (customStyle, styleName) {
        if (!customStyle) {
            this.visualizationForm = new VisualizationForm({ name: '' });
        } else {
            this.visualizationForm.setOskariStyleValues(customStyle, styleName);
        }
        return this.visualizationForm.getForm();
    }
    /**
     * @method applyEditorStyle Applies custom style editor's style to the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    applyEditorStyle (layer, styleId) {
        const style = this.visualizationForm.getOskariStyle();
        style.id = styleId;
        layer.setCustomStyle(style);
        layer.selectStyle(this.visualizationForm.getOskariStyleName());
    }
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
     * @method getCurrentStyleFunction
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/style/Style}
     */
    getCurrentStyleFunction (layer, handler = this._getLayerHandler(layer)) {
        if (!handler) {
            return;
        }
        const factory = this.mapModule.getStyle.bind(this.mapModule);
        const styleFunction = styleGenerator(factory, layer, this.hoverHandler);
        const selectedIds = new Set(this.WFSLayerService.getSelectedFeatureIds(layer.getId()));
        return handler.getStyleFunction(layer, styleFunction, selectedIds);
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
        const style = this.getCurrentStyleFunction(layer);
        olLayers.forEach(lyr => {
            lyr.setStyle(style);
            if (this.renderMode === RENDER_MODE_VECTOR && this.getMapModule().getSupports3D()) {
                // Trigger features changed to synchronize 3D view
                lyr.getSource().getFeatures().forEach(ftr => ftr.changed());
            }
        });
    }
    /**
     * @method updateLayerProperties
     * Notify about changed features in view
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {ol/source/VectorTile} source
     */
    updateLayerProperties (layer, source) {
        const handler = this._getLayerHandler(layer);
        if (handler) {
            return handler.updateLayerProperties(layer, source);
        }
    }
    /**
     * @method setLayerLocales
     * Requests and sets locales for layer's fields.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer wfs layer
     * @param {Array} fields
     */
    setWFSProperties (layer, fields) {
        if (!layer) {
            return;
        }
        const onSuccess = localized => {
            if (Array.isArray(localized) && localized.length) {
                if (localized[0].name !== WFS_FTR_ID_KEY) {
                    localized.unshift({
                        name: WFS_FTR_ID_KEY,
                        locale: WFS_FTR_ID_LOCALE
                    });
                }
                layer.setFields(localized.map(prop => prop.name));
                layer.setLocales(localized.map(prop => prop.locale));
            } else {
                layer.setFields(fields);
                layer.setLocales([]);
            }
            this.updateLayerProperties(layer);
        };
        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            data: {
                id: layer.getId(),
                lang: Oskari.getLang()
            },
            url: Oskari.urls.getRoute('GetLocalizedPropertyNames'),
            success: onSuccess,
            error: () => {
                this._log.warn('Error getting localized property names for wfs layer ' + layer.getId());
            }
        });
    }
    notify (eventName, ...args) {
        var builder = Oskari.eventBuilder(eventName);
        if (!builder) {
            return;
        }
        Oskari.getSandbox().notifyAll(builder.apply(null, args));
    }
    saveUserStyle (layer, styleId) {
        const oskariStyle = this.visualizationForm.getOskariStyle();
        const name = this.visualizationForm.getOskariStyleName();
        oskariStyle.id = styleId;
        const styleWithMetadata = {
            name: name,
            style: oskariStyle
        };
        layer.saveUserStyle(styleWithMetadata);
        this.userStyleService.saveUserStyle(layer.getId(), styleWithMetadata);
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
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
