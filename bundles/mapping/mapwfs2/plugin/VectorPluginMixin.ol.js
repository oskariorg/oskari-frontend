import ReqEventHandler from './components/ReqEventHandler';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');

export default (mapPluginSuperClass) => class extends mapPluginSuperClass {
    constructor (config) {
        super(config);
        this._visualizationForm = null;
        this.oskariStyleSupport = true;
    }

    /*
     * Override AbstractMapModulePlugin methods.
     */

    isLayerSupported (layer) {
        if (!layer) {
            return false;
        }
        return layer.isLayerOfType(this.layertype);
    }
    _initImpl () {
        super._initImpl();
        const sandbox = this.getSandbox();
        // register domain builder
        const mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel(this.layertype + 'layer', this._getLayerModelClass());
            mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', this._getModelBuilder());
        }
        this.WFSLayerService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);
        sandbox.registerService(this.WFSLayerService);
        this.reqEventHandler = new ReqEventHandler(sandbox);

        this._visualizationForm = Oskari.clazz.create(
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
            ...super._createPluginEventHandlers(),
            ...this.reqEventHandler.createEventHandlers(this)
        };
        return handlers;
    }
    _createRequestHandlers () {
        return this.reqEventHandler.createRequestHandlers(this);
    }

    /*
     * Common wfs layer plugin methods
     */

    /**
     * @method getCustomStyleEditorForm To get editor ui element for custom style.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return VisualizationForm's form element
     */
    getCustomStyleEditorForm (layer) {
        this._visualizationForm.setOskariStyleValues(layer.getCustomStyle());
        return this._visualizationForm.getForm();
    }
    /**
     * @method applyEditorStyle Applies custom style editor's style to the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    applyEditorStyle (layer) {
        const style = this._visualizationForm.getOskariStyle();
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
};
