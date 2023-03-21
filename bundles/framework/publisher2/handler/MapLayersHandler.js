import { StateHandler, controllerMixin } from 'oskari-ui/util';

const TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
class UIHandler extends StateHandler {
    constructor (tools, sandbox, consumer) {
        super();
        this.sandbox = sandbox;
        this.tools = tools;
        this.setState({
            layers: [],
            layerTools: []
        });
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(consumer);
    };

    getName () {
        return 'MapLayersHandler';
    }

    init (data) {
        this.data = data;
        const layerTools = [];
        this.tools.forEach(tool => {
            try {
                tool.init(data);
            } catch (e) {
                Oskari.log('publisher2.MapLayersHandler')
                    .error('Error initializing publisher tool:', tool.getTool().id);
            }
            const toolComponent = tool.getComponent();
            toolComponent.handler.addStateListener(() => this.notify());
            layerTools.push({
                component: toolComponent.component,
                handler: toolComponent.handler,
                tool: tool
            });
        });
        this.updateState({
            layerTools
        });
        this.updateSelectedLayers();
        return this.tools.some(tool => tool.isDisplayed());
    }

    updateSelectedLayers () {
        const layers = [...this.sandbox.findAllSelectedMapLayers()].reverse();
        this.updateState({
            layers: layers
        });
        this.notifyTools();
    }

    notifyTools () {
        this.tools.forEach(tool => tool.handler.onLayersChanged());
    }

    openLayerList () {
        this.sandbox.postRequestByName(
            'ShowFilteredLayerListRequest',
            ['publishable', true]
        );
    }

    openSelectedLayerList () {
        this.sandbox.postRequestByName(
            'ShowFilteredLayerListRequest',
            ['publishable', true, true]
        );
    }

    addBaseLayer (layer) {
        this.plugin.addBaseLayer(layer);
        this.updateSelectedLayers();
    }

    removeBaseLayer (layer) {
        this.plugin.removeBaseLayer(layer);
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
                this.updateSelectedLayers();
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
    'openLayerList',
    'openSelectedLayerList',
    'addBaseLayer',
    'removeBaseLayer'
]);

export { wrapped as MapLayersHandler };
