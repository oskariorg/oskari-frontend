import { StateHandler, controllerMixin } from 'oskari-ui/util';

const TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            layers: [],
            baseLayers: [],
            defaultBaseLayer: null,
            showLayerSelection: false,
            showMetadata: false,
            allowStyleChange: false,            
            isDisabledMetadata: !this.layersHaveMetadata(),
            isDisabledStyleChange: !this.layersHaveMultipleStyles()
        });
    };

    getName () {
        return 'MapLayerListHandler';
    }

    setShowLayerSelection (value) {
        this.updateState({
            showLayerSelection: value
        });
        this.tool.setEnabled(value);
    }
    onLayersChanged () {
        this.updateSelectedLayers();
    }
    handlerLayersChanged () {
        // TODO: is this needed?
        this.updateState({
            isDisabledMetadata: !this.layersHaveMetadata(),
            isDisabledStyleChange: !this.layersHaveMultipleStyles()
        });
    }

    layersHaveMetadata () {
        return this.sandbox.findAllSelectedMapLayers().some(l => l.getMetadataIdentifier() !== null);
    }
    layersHaveMultipleStyles () {
        return this.sandbox.findAllSelectedMapLayers().some(l => l.getStyles().length > 1);
    }

    setShowMetadata (value) {
        this.updateState({
            showMetadata: value
        });
        this.tool.getPlugin().setShowMetadata(value);
    }

    setAllowStyleChange (value) {
        this.updateState({
            allowStyleChange: value
        });
        this.tool.getPlugin().setStyleSelectable(value);
    }

    updateSelectedLayers () {
        let baseLayers = [];
        const layers = [...this.sandbox.findAllSelectedMapLayers()].reverse();

        if (this.tool.isEnabled()) {
            const isBaseLayer = (layer) => this.tool.getPlugin().getConfig().baseLayers.some(id => '' + id === '' + layer.getId());
            baseLayers = layers.filter(isBaseLayer);
        }

        this.updateState({
            layers: layers,
            baseLayers: baseLayers,
            isDisabledMetadata: !this.layersHaveMetadata(),
            isDisabledStyleChange: !this.layersHaveMultipleStyles()
        });
    }

    addBaseLayer (layer) {
        this.tool.getPlugin().addBaseLayer(layer);
        this.updateSelectedLayers();
    }

    removeBaseLayer (layer) {
        this.tool.getPlugin().removeBaseLayer(layer);
        this.updateSelectedLayers();
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
