import { VectorLayerHandler } from './WfsVectorLayerPlugin/impl/VectorLayerHandler.ol';
import { MvtLayerHandler } from './WfsVectorLayerPlugin/impl/MvtLayerHandler.ol';
import { ReqEventHandler } from './WfsVectorLayerPlugin/ReqEventHandler';
import { HoverHandler } from './WfsVectorLayerPlugin/HoverHandler';
import { styleGenerator } from './WfsVectorLayerPlugin/util/style';
import { WFS_ID_KEY } from './WfsVectorLayerPlugin/util/props';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE } from '../../mapmodule/domain/constants';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');
const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
const RENDER_MODE_MVT = 'mvt';
const RENDER_MODE_VECTOR = 'vector';

export class WfsVectorLayerPlugin extends AbstractMapLayerPlugin {
    constructor (config) {
        super(config);
        this.__name = 'WfsVectorLayerPlugin';
        this._clazz = 'Oskari.wfs.WfsVectorLayerPlugin';
        this.renderMode = config.renderMode || RENDER_MODE_MVT;
        this.visualizationForm = null;
        this.oskariStyleSupport = true;
        this.layertype = 'wfs';
        this.hoverHandler = new HoverHandler(WFS_ID_KEY);
        this.vectorLayerHandler = new VectorLayerHandler(this);
        this.mvtLayerHandler = new MvtLayerHandler(this);
        this.layerHandlersByLayerId = {};
    }

    /* ---- AbstractMapModulePlugin functions ---- */

    _initImpl () {
        super._initImpl();
        const sandbox = this.getSandbox();
        // register domain builder
        const mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel(this.layertype + 'layer', this._getLayerModelClass());
            mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', this._getModelBuilder());
        }
        sandbox.getService('Oskari.mapframework.service.VectorFeatureService').registerLayerType(this.layertype, this);
        this.WFSLayerService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);
        sandbox.registerService(this.WFSLayerService);
        this.reqEventHandler = new ReqEventHandler(sandbox);

        this.visualizationForm = Oskari.clazz.create(
            'Oskari.userinterface.component.VisualizationForm'
        );
    }
    _getLayerModelClass () {
        return 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer';
    }
    _getModelBuilder () {
        return new WfsLayerModelBuilder(this.getSandbox());
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
        return layer.isLayerOfType(this.layertype);
    }
    getRenderMode (layer) {
        let renderMode = this.renderMode;
        if (layer.getOptions()) {
            renderMode = layer.getOptions().renderMode || renderMode;
        }
        return renderMode;
    }
    _isRenderModeSupported (mode) {
        return mode === RENDER_MODE_MVT || mode === RENDER_MODE_VECTOR;
    }
    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const renderMode = this.getRenderMode(layer);
        if (!this._isRenderModeSupported(renderMode)) {
            return;
        }
        const handler = renderMode === RENDER_MODE_MVT ? this.mvtLayerHandler : this.vectorLayerHandler;
        this.layerHandlersByLayerId[layer.getId()] = handler;
        const added = handler.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        if (!added) {
            return;
        }
        // Set oskari properties for vector feature service functionalities.
        const silent = true;
        added.set(LAYER_ID, layer.getId(), silent);
        added.set(LAYER_TYPE, layer.getLayerType(), silent);
        added.set(LAYER_HOVER, layer.getHoverOptions(), silent);
        added.setStyle(this.getCurrentStyleFunction(layer, handler));
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
    getCustomStyleEditorForm (layer) {
        this.visualizationForm.setOskariStyleValues(layer.getCustomStyle());
        return this.visualizationForm.getForm();
    }
    /**
     * @method applyEditorStyle Applies custom style editor's style to the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    applyEditorStyle (layer) {
        const style = this.visualizationForm.getOskariStyle();
        layer.setCustomStyle(style);
        layer.selectStyle('oskari_custom');
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
        const lyr = olLayers[0];
        lyr.setStyle(this.getCurrentStyleFunction(layer));
        if (this.getMapModule().has3DSupport()) {
            // Trigger features changed to synchronize 3D view
            lyr.getSource().getFeatures().forEach(ftr => ftr.changed());
        }
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
     */
    setLayerLocales (layer) {
        if (!layer || layer.getLocales().length === layer.getFields().length) {
            return;
        }
        const onSuccess = localized => {
            if (!localized) {
                return;
            }
            const locales = [];
            // Set locales in the same order as fields
            layer.getFields().forEach(field => locales.push(localized[field] ? localized[field] : field));
            layer.setLocales(locales);
            this.notify('WFSPropertiesEvent', layer, locales, layer.getFields());
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
