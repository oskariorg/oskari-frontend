import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from './ToolPanelHandler';

const LAYERLIST_TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';

class UIHandler extends ToolPanelHandler {
    constructor (tools, sandbox, consumer) {
        super(tools, consumer);
        this.sandbox = sandbox;
        this.updateState({
            layers: [],
            layerTools: []
        });
    };

    init (data) {
        const hasTools = super.init(data);
        this.updateSelectedLayers(true);
        return hasTools;
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
        this.tools.forEach(tool => {
            if (typeof tool.onLayersChanged === 'function') {
                tool.onLayersChanged();
            } else if (typeof tool.handler?.onLayersChanged === 'function') {
                tool.handler.onLayersChanged();
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

    stop () {
        this.tools.forEach(tool => {
            try {
                tool.stop();
            } catch (e) {
                Oskari.log('publisher2.view.MapLayersHandler')
                    .error('Error stopping publisher tool:', tool.getTool().id);
            }
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'openLayerList',
    'openSelectedLayerList',
    'addBaseLayer',
    'removeBaseLayer',
    'setToolEnabled'
]);

export { wrapped as MapLayersHandler };
