import { StateHandler, controllerMixin } from 'oskari-ui/util';

const TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
class UIHandler extends StateHandler {
    constructor (sandbox, mapModule, data, consumer) {
        super();
        this.data = data;
        this.sandbox = sandbox;
        this.pluginConf = this.getToolPluginMapfullConf();
        this.plugin = null;
        this.mapModule = mapModule;
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
        this.addStateListener(consumer);
        this.init();
    };

    getName () {
        return 'MapLayersHandler';
    }

    init () {
        if (this.pluginConf) {
            this.plugin = this.startPlugin();
            this.updateState({
                defaultBaseLayer: this.pluginConf.config.defaultBaseLayer,
                showLayerSelection: true,
                showMetadata: this.pluginConf.config.showMetadata,
                allowStyleChange: this.pluginConf.config.isStyleSelectable
            });
        }

        const externalTools = Oskari.clazz.protocol('Oskari.mapframework.publisher.LayerTool');
        externalTools.forEach(t => {
            const tool = Oskari.clazz.create(t, this.sandbox);
            tool.init(this.data);
            const toolComponent = tool.getComponent();
            toolComponent.handler.addStateListener(() => this.notify());
            this.updateState({
                externalOptions: [
                    ...this.state.externalOptions,
                    {
                        component: toolComponent.component,
                        handler: toolComponent.handler,
                        tool: tool
                    }
                ]
            });
        });
        this.updateSelectedLayers();
    }

    setShowLayerSelection (value) {
        this.updateState({
            showLayerSelection: value
        });
        if (value === true) {
            this.plugin = this.startPlugin();
        } else {
            this.stopPlugin();
            this.plugin = null;
        }
    }

    setShowMetadata (value) {
        this.updateState({
            showMetadata: value
        });
        this.plugin.setShowMetadata(value);
    }

    setAllowStyleChange (value) {
        this.updateState({
            allowStyleChange: value
        });
        this.plugin.setStyleSelectable(value);
    }

    updateSelectedLayers () {
        let baseLayers = [];
        const layers = [...this.sandbox.findAllSelectedMapLayers()].reverse();

        if (this.plugin) {
            const isBaseLayer = (layer) => this.plugin.getConfig().baseLayers.some(id => '' + id === '' + layer.getId());
            baseLayers = layers.filter(isBaseLayer);
        }

        this.updateState({
            layers: layers,
            baseLayers: baseLayers
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

    addBaseLayer (layer) {
        this.plugin.addBaseLayer(layer);
        this.updateSelectedLayers();
    }

    removeBaseLayer (layer) {
        this.plugin.removeBaseLayer(layer);
        this.updateSelectedLayers();
    }

    /**
     * @private @method _getToolPluginMapfullConf
     * Get map view cofiguration (from mapfull) for this tool
     * @return {Object / null} config or null if not found
     */
    getToolPluginMapfullConf () {
        const { configuration } = this.data || {};
        if (!configuration) {
            return null;
        }
        const { mapfull = {} } = configuration;
        const { conf = {} } = mapfull;
        const { plugins = [] } = conf;
        // data.configuration.mapfull.conf.plugins
        return plugins.find(plug => plug.id === TOOL_ID);
    }

    startPlugin () {
        const config = {
            baseLayers: this.pluginConf?.config?.baseLayers || [],
            defaultBaseLayer: this.pluginConf?.config?.defaultBaseLayer || (this.pluginConf?.config?.baseLayers && this.pluginConf?.config?.baseLayers.length > 0) ? this.pluginConf?.config?.baseLayers[0] : null,
            showMetadata: this.pluginConf?.config?.showMetadata || false,
            isStyleSelectable: this.pluginConf?.config?.isStyleSelectable || false
        };

        const plugin = Oskari.clazz.create(TOOL_ID, config);
        this.mapModule.registerPlugin(plugin);

        plugin.startPlugin(this.sandbox);
        return plugin;
    }

    stopPlugin () {
        if (this.plugin) {
            this.setShowMetadata(false);
            if (this.sandbox) {
                this.plugin.stopPlugin(this.sandbox);
            }
            this.mapModule.unregisterPlugin(this.plugin);
        }
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
    'openLayerList',
    'openSelectedLayerList',
    'addBaseLayer',
    'removeBaseLayer'
]);

export { wrapped as MapLayersHandler };
