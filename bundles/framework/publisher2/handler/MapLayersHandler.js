import { StateHandler, controllerMixin } from 'oskari-ui/util';

const LAYERLIST_TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
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
            toolComponent.handler.addStateListener(() => this.updateSelectedLayers(true));
            layerTools.push({
                component: toolComponent.component,
                handler: toolComponent.handler,
                tool: tool
            });
        });
        this.updateState({
            layerTools
        });
        this.updateSelectedLayers(true);
        return this.tools.some(tool => tool.isDisplayed());
    }

    updateSelectedLayers (silent) {
        let layers = [...this.sandbox.findAllSelectedMapLayers()];
        let baseLayers = [];
        const layerListTool = this.getLayerListPlugin();

        if (layerListTool) {
            const listState = layerListTool.handler.getState() || {};
            const baseLayerIds = listState?.baseLayers || [];
            // get full layers to baseLayers instead of just ids
            baseLayers = layers.filter(l => baseLayerIds.some(bl => bl === l.getId()));
            layers = layers.filter(l => !baseLayerIds.some(bl => bl === l.getId()));
        }

        this.updateState({
            layers: layers.reverse(),
            baseLayers: baseLayers.reverse(),
            layerListPluginActive: !!layerListTool
        });
        if (!silent) {
            this.notifyTools();
        }
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

    getLayerListPlugin () {
        const { layerTools } = this.getState();
        const layerListTool = layerTools.find(tool => tool.tool.getTool().id === LAYERLIST_TOOL_ID);
        if (!layerListTool || !layerListTool.tool.isEnabled()) {
            return null;
        }
        return layerListTool;
    }

    addBaseLayer (layer) {
        this.getLayerListPlugin()?.handler?.addBaseLayer(layer);
        this.updateSelectedLayers();
    }

    removeBaseLayer (layer) {
        this.getLayerListPlugin()?.handler?.removeBaseLayer(layer);
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
