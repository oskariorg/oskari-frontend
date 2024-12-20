import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from './ToolPanelHandler';
import { LAYERLIST_ID } from '../../../mapping/mapmodule/publisher/layers/MapLayerListTool';
class UIHandler extends ToolPanelHandler {
    constructor (tools, sandbox) {
        // ToolPanelHandler adds tools to state so we can reference it here
        super(tools);
        this.sandbox = sandbox;
        this.updateState({
            layers: [],
            tools: []
        });

        this.eventHandlers = {
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerAddEvent: function () {
                this.updateSelectedLayers();
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Updates the layerlist
             */
            AfterMapLayerRemoveEvent: function () {
                this.updateSelectedLayers();
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Updates the layerlist
             */
            AfterRearrangeSelectedMapLayerEvent: function () {
                this.updateSelectedLayers();
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Calls flyouts handlePanelUpdate() and handleDrawLayerSelectionChanged() functions
             */
            MapLayerEvent: function (event) {
                if (event.getOperation() === 'update') {
                    this.updateSelectedLayers();
                }
            },

            /**
             * @method MapLayerVisibilityChangedEvent
             */
            MapLayerVisibilityChangedEvent: function () {
                this.updateSelectedLayers();
            }
        };
    }

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    getName () {
        return 'Oskari.mapframework.bundle.publisher2.view.PanelMapLayers';
    }

    init (data) {
        const hasTools = super.init(data);
        this.updateSelectedLayers(true);

        for (const p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                this.sandbox.registerForEventByName(this, p);
            }
        }

        return hasTools;
    }

    updateSelectedLayers (silent) {
        let layers = [...this.sandbox.findAllSelectedMapLayers()];
        let baseLayers = [];
        const layerListTool = this.getLayerListPlugin();
        // divide layers into two lists IF we have the layerlist plugin selected
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

    setToolEnabled (tool, enabled) {
        tool.setEnabled(enabled);
        // trigger re-render with check if layerlist was enabled/disabled
        this.updateSelectedLayers(true);
    }

    notifyTools () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                if (typeof tool.publisherTool.onLayersChanged === 'function') {
                    tool.publisherTool.onLayersChanged();
                } else if (typeof tool.handler?.onLayersChanged === 'function') {
                    tool.handler.onLayersChanged();
                }
            } catch (e) {
                Oskari.log('Publisher.PanelMapLayersHandler').warn('Error notifying tools about layer changes:', e);
            }
        });
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
        const { tools } = this.getState();
        const layerListTool = tools.find(tool => tool.publisherTool.getTool().id === LAYERLIST_ID);
        if (!layerListTool || !layerListTool.publisherTool.isEnabled()) {
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

    stop () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                tool.publisherTool.stop();
            } catch (e) {
                Oskari.log('Publisher.PanelMapLayersHandler')
                    .error('Error stopping publisher tool:', tool.getTool().id);
            }
        });

        for (const p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                this.sandbox.unregisterFromEventByName(this, p);
            }
        }
    }
}

const wrapped = controllerMixin(UIHandler, [
    'openLayerList',
    'openSelectedLayerList',
    'addBaseLayer',
    'removeBaseLayer',
    'setToolEnabled'
]);

export { wrapped as PanelMapLayersHandler };
