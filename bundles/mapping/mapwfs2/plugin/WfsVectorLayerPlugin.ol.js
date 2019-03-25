import { VectorLayerHandler } from './WfsVectorLayerPlugin/impl/VectorLayerHandler.ol';
import { MvtLayerHandler } from './WfsVectorLayerPlugin/impl/MvtLayerHandler.ol';
import { ReqEventHandler } from './WfsVectorLayerPlugin/ReqEventHandler';
import { HoverHandler } from './WfsVectorLayerPlugin/HoverHandler';
import { styleGenerator } from './WfsVectorLayerPlugin/util/style';
import { WFS_ID_KEY } from './WfsVectorLayerPlugin/util/props';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE } from '../../mapmodule/domain/constants';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');
const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');

export class WfsVectorLayerPlugin extends AbstractMapLayerPlugin {
    constructor (config) {
        super(config);
        this.__name = 'WfsVectorLayerPlugin';
        this._clazz = 'Oskari.wfs.WfsVectorLayerPlugin';
        this.renderMode = config.renderMode || 'mvt';
        this.visualizationForm = null;
        this.oskariStyleSupport = true;
        this.layertype = 'vector';
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
        const handlers = {
            // ...this.reqEventHandler.createEventHandlers(this),
            ...this.vectorLayerHandler.createEventHandlers(this),
            ...this.mvtLayerHandler.createEventHandlers(this)
        };
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
    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const handler = this.renderMode === 'mvt' ? this.mvtLayerHandler
            : this.renderMode === 'vector' ? this.vectorLayerHandler : null;
        if (!handler) {
            return;
        }
        const added = handler.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        if (!added) {
            return;
        }
        this.layerHandlersByLayerId[added.getId()] = handler;
        // Set oskari properties for vector feature service functionalities.
        const silent = true;
        added.set(LAYER_ID, layer.getId(), silent);
        added.set(LAYER_TYPE, layer.getLayerType(), silent);
        added.set(LAYER_HOVER, layer.getHoverOptions(), silent);

        added.setStyle(handler.getCurrentStyleFunction(layer));
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
    getCurrentStyleFunction (layer) {
        const handler = this._getLayerHandler(layer);
        if (!handler) {
            return;
        }
        const factory = this.mapModule.getStyle.bind(this.mapModule);
        const styleFunction = styleGenerator(factory, layer, this.hoverHandler);
        return handler.getStyleFunction(layer, styleFunction);
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
