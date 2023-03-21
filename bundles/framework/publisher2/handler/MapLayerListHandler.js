import { StateHandler, controllerMixin } from 'oskari-ui/util';

const layersHaveMetadata = (layers = []) => layers.some(l => l.getMetadataIdentifier() !== null);
const layersHaveMultipleStyles = (layers = []) => layers.some(l => l.getStyles().length > 1);

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        const layers = this.sandbox.findAllSelectedMapLayers();
        this.setState({
            baseLayers: [],
            defaultBaseLayer: null,
            showLayerSelection: false,
            showMetadata: false,
            allowStyleChange: false,
            isDisabledMetadata: !layersHaveMetadata(layers),
            isDisabledStyleChange: !layersHaveMultipleStyles(layers)
        });
    };

    getName () {
        return 'MapLayerListHandler';
    }
    clearState () {
        // plugin is created again on startup, so it's state doesn't need to be cleare
        const layers = this.sandbox.findAllSelectedMapLayers();
        this.setState({
            baseLayers: [],
            defaultBaseLayer: null,
            showLayerSelection: false,
            showMetadata: false,
            allowStyleChange: false,            
            isDisabledMetadata: !layersHaveMetadata(layers),
            isDisabledStyleChange: !layersHaveMultipleStyles(layers)
        });
    }

    setShowLayerSelection (value) {
        // enable tool first so when state update triggers UI update, the plugin is enabled
        this.tool.setEnabled(value);
        const newConfig = this.tool?.getPlugin()?.getConfig() || {};
        this.updateState({
            showLayerSelection: value,
            ...newConfig
        });
    }

    onLayersChanged () {
        const layers = this.sandbox.findAllSelectedMapLayers();
        // update state with checks if layers now/still have metadata/multiple styles
        this.updateState({
            isDisabledMetadata: !layersHaveMetadata(layers),
            isDisabledStyleChange: !layersHaveMultipleStyles(layers)
        });
    }

    setShowMetadata (value) {
        this.tool.getPlugin().setShowMetadata(value);
        this.updateConfig2State();
    }

    setAllowStyleChange (value) {
        this.tool.getPlugin().setStyleSelectable(value);
        this.updateConfig2State();
    }

    addBaseLayer (layer) {
        this.tool.getPlugin().addBaseLayer(layer);
        this.updateConfig2State();
    }

    removeBaseLayer (layer) {
        this.tool.getPlugin().removeBaseLayer(layer);
        this.updateConfig2State();
    }

    updateConfig2State () {
        const newConfig = this.tool?.getPlugin()?.getConfig() || {};
        this.updateState({
            ...newConfig
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setShowMetadata',
    'setShowLayerSelection',
    'setAllowStyleChange',
    'addBaseLayer',
    'removeBaseLayer'
]);

export { wrapped as MapLayerListHandler };
