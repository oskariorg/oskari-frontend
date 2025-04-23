import React from 'react';
import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from './ToolPanelHandler';
import { LAYERLIST_ID } from '../../../mapping/mapmodule/publisher/layers/MapLayerListTool';
import { MapLayers } from '../view/MapLayers/MapLayers';

class UIHandler extends ToolPanelHandler {
    constructor (sandbox, tools) {
        // ToolPanelHandler adds tools to state so we can reference it here
        super(sandbox, tools);
        this.sandbox = sandbox;
        this.setState({
            layers: [],
            baseLayers: [],
            tools: [],
            layerListPluginActive: false
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
        return 'Publisher2.PanelMapLayersHandler';
    }

    init (data) {
        super.init(data);
        this.updateSelectedLayers(true);

        for (const p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                this.sandbox.registerForEventByName(this, p);
            }
        }
    }

    getPanelContent () {
        return <MapLayers {...this.getState()} controller={this.getController()}/>;
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
            const { handler } = tool.getComponent();
            try {
                if (typeof tool.onLayersChanged === 'function') {
                    tool.onLayersChanged();
                } else if (typeof handler?.onLayersChanged === 'function') {
                    handler.onLayersChanged();
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
        const layerListTool = tools.find(tool => tool.getTool().id === LAYERLIST_ID);
        if (!layerListTool || !layerListTool.isEnabled()) {
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
        super.stop();
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
