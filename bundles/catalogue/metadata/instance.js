import { showMetadataFlyout } from './view/MetadataFlyout';
import { MetadataHandler } from './handler/MetadataHandler';

Oskari.clazz.define('Oskari.catalogue.bundle.metadata.MetadataBundleInstance',
    function () {
        this.sandbox = null;
        this.started = false;
        this.requestHandler = null;
        this.flyoutControls = null;
        this.layerService = null;
        this.loc = Oskari.getMsg.bind(null, this.getName());
        this.handler = new MetadataHandler(this);
        this.handler.addStateListener(state => this.onStateUpdate(state));
    }, {
        __name: 'catalogue.metadata',

        getName: function () {
            return this.__name;
        },

        getSandbox: function () {
            return this.sandbox;
        },

        start: function (sandbox) {
            if (this.started) {
                return;
            }
            this.started = true;

            this.sandbox = sandbox || Oskari.getSandbox(this.conf.sandbox || 'sandbox');
            this.mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

            this.sandbox.register(this);

            this.requestHandler = Oskari.clazz.create('Oskari.catalogue.bundle.metadata.request.ShowMetadataRequestHandler', this);
            this.sandbox.requestHandler('catalogue.ShowMetadataRequest', this.requestHandler);

            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));

            this._setupLayerTools();
            const { current } = this.state || {};
            if (current) {
                const metadata = Array.isArray(current) ? current[0] : current;
                this.showMetadata(metadata);
            }
            this.sandbox.registerAsStateful(this.mediator.bundleId, this);
        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            if (!this.layerService) {
                this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            }
            return this.layerService;
        },

        /**
         * Adds tools for all layers
         */
        _setupLayerTools: function () {
            // add tools for feature data layers
            this.getLayerService()?.getAllLayers().forEach(layer => this._addTool(layer, true));
            // update all layers at once since we suppressed individual events
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
        },

        /**
         * Adds the metadata tool for layer
         * @method  @private _addTool
         * @param  {Object} layer Oskari layer of any type to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        _addTool: function (layer, suppressEvent) {
            const uuid = layer?.getMetadataIdentifier();
            if (!uuid) {
                return;
            }
            const service = this.getLayerService();
            const layerId = layer.getId();
            // add feature data tool for layer
            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('metadata');
            tool.setIconCls('show-metadata-tool');
            tool.setTooltip(this.loc('layerTool'));
            tool.setCallback(() => this.sandbox.postRequestByName('catalogue.ShowMetadataRequest', [{ layerId, uuid }]));
            service.addToolForLayer(layer, tool, suppressEvent);
        },

        init: function () {
            return null;
        },

        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

        onMapLayerEvent: function (event) {
            if (!this.flyoutControls || Oskari.dom.isEmbedded()) {
                // handle events only when flyout is opened
                // action tab isn't shown in embedded map, no need to update state
                return;
            }
            this.handler.onMapLayerEvent(event.getMapLayer());
        },

        eventHandlers: {
            MapLayerEvent: function (event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                const layerId = event.getLayerId();
                if (layerId) {
                    const layer = this.getLayerService()?.findMapLayer(layerId);
                    this._addTool(layer);
                } else {
                    // ajax call for all layers
                    this._setupLayerTools();
                }
            },
            AfterMapLayerAddEvent: function (event) {
                this.onMapLayerEvent(event);
            },
            AfterMapLayerRemoveEvent: function (event) {
                this.onMapLayerEvent(event);
            },
            MapLayerVisibilityChangedEvent: function (event) {
                this.onMapLayerEvent(event);
            }
        },
        stop: function () {
            this.sandbox.removeRequestHandler('catalogue.ShowMetadataRequest', this.requestHandler);
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));
            this.sandbox.unregister(this);
            this.started = false;
        },
        showMetadata: function (data) {
            if (!data.layerId && !data.uuid) {
                return;
            }
            this.handler.fetchMetadata(data);
            if (this.flyoutControls) {
                // already opened, fetch triggers state update
                return;
            }
            const state = this.handler.getState();
            const controller = this.handler.getController();
            const onClose = () => this.closeMetadata();
            this.flyoutControls = showMetadataFlyout(state, this.conf, controller, onClose);
        },
        closeMetadata: function () {
            if (this.flyoutControls) {
                this.flyoutControls.close();
            }
            this.handler.onFlyoutClose();
            this.flyoutControls = null;
        },
        onStateUpdate: function (state) {
            if (this.flyoutControls) {
                this.flyoutControls.update(state);
            }
        },
        getState: function () {
            const { current } = this.handler.getState();
            if (!current) {
                return {};
            }
            return { current: [current] };
        },
        getStateParameters: function () {
            const { uuid } = this.handler.getState().current || {};
            if (!uuid) {
                return '';
            }
            return `metadata=${uuid}`;
        }
    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
