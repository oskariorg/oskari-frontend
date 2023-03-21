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
            externalOptions: []
        });
        this.eventHandlers = this.createEventHandlers();
        // this.addStateListener(consumer);
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

        if (this.plugin) {
            const isBaseLayer = (layer) => this.tool.getPlugin().getConfig().baseLayers.some(id => '' + id === '' + layer.getId());
            baseLayers = layers.filter(isBaseLayer);
        }

        this.updateState({
            layers: layers,
            baseLayers: baseLayers
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


    createEventHandlers () {
        const handlers = {
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerAddEvent: function (event) {
                this.updateSelectedLayers();
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerRemoveEvent: function (event) {
                this.updateSelectedLayers();
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Updates the layerlist
             */
            AfterRearrangeSelectedMapLayerEvent: function (event) {
                if (event._fromPosition !== event._toPosition) {
                    this.updateSelectedLayers();
                }
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Calls flyouts handlePanelUpdate() and handleDrawLayerSelectionChanged() functions
             */
            'MapLayerEvent': function (event) {
                if (event.getOperation() === 'update') {
                    this.updateSelectedLayers();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
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
