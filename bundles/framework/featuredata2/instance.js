/**
 * @class Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata2" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata2.FeatureDataBundle for bundle definition.
 *
 */
import { FilterSelector } from './FilterSelector';
import './publisher/FeaturedataTool';

Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.mapModule = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.loc = Oskari.getMsg.bind(null, this.getName());
        this.popupHandler = null;
        this.selectionPlugin = null;
        this.conf = {};
        this.__loadingStatus = {};
        this._featureSelectionService = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'FeatureData2',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },

        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            if (this.started) {
                return;
            }
            this.started = true;

            const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox.register(this);
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            // Let's extend UI
            var requestBuilder = Oskari.requestBuilder('userinterface.AddExtensionRequest');
            if (requestBuilder) {
                var request = requestBuilder(this);
                this.sandbox.request(this, request);
            }

            // draw ui
            this.createUi();

            // sends request via config to add tool selection button
            if (this.conf && this.conf.selectionTools === true) {
                this.popupHandler = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.PopupHandler', this);
                const addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
                const btn = {
                    iconCls: 'tool-feature-selection',
                    tooltip: this.loc('selectionTools.tools.select.tooltip'),
                    sticky: true,
                    callback: () => this.popupHandler.showSelectionTools()
                };
                this.sandbox.request(this, addBtnRequestBuilder('dialog', 'selectiontools', btn));

                this.selectionPlugin = this.sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');

                if (!this.selectionPlugin) {
                    var config = {
                        id: this.getName()
                    };
                    this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config, this.sandbox);
                    this.mapModule.registerPlugin(this.selectionPlugin);
                    this.mapModule.startPlugin(this.selectionPlugin);
                }
            }

            // check if preselected layers included wfs layers -> act if they are added now
            const selectedLayers = this.sandbox.findAllSelectedMapLayers().filter(l => l.hasFeatureData());
            if (selectedLayers.length) {
                this.plugin.refresh();
            }

            this.sandbox.requestHandler('ShowFeatureDataRequest', this.requestHandlers.showFeatureHandler);
            this.__setupLayerTools();
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            this.requestHandlers = {
                showFeatureHandler: Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler', this)
            };
            return null;
        },

        /**
         * @method getSelectionPlugin
         * @return {Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin}
         **/
        getSelectionPlugin: function () {
            return this.selectionPlugin;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },
        getSelectionService: function () {
            if (!this._featureSelectionService) {
                this._featureSelectionService = this.sandbox.getService('Oskari.mapframework.service.VectorFeatureSelectionService');
            }
            return this._featureSelectionService;
        },
        getFilterSelector: function () {
            if (!this._selectionHelper) {
                const featureQueryFn = (geojson, opts) => this.mapModule.getVectorFeatures(geojson, opts);
                this._selectionHelper = new FilterSelector(featureQueryFn, this.getSelectionService());
            }
            return this._selectionHelper;
        },
        removeAllFeatureSelections: function () {
            const service = this.getSelectionService();
            if (!service) {
                return;
            }
            service.removeSelection();
        },

        setFeatureSelections: function (layerId, featureIds, useToggle) {
            const service = this.getSelectionService();
            if (!service) {
                return;
            }
            if (useToggle) {
                featureIds.forEach(id => service.toggleFeatureSelection(layerId, id));
            } else {
                service.setSelectedFeatureIds(layerId, featureIds);
            }
        },
        /**
         * Adds the Feature data tool for layer
         * @param  {Object} layer layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function (layer, suppressEvent) {
            if (!layer || !layer.hasFeatureData()) {
                return;
            }
            // add feature data tool for layer
            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            const label = this.loc('layer.object-data');
            tool.setName('objectData');
            tool.setIconCls('show-featuredata-tool');
            tool.setTitle(label);
            tool.setTooltip(label);
            tool.setCallback(() => this.sandbox.postRequestByName('ShowFeatureDataRequest', [layer.getId()]));

            this.getLayerService().addToolForLayer(layer, tool, suppressEvent);
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function () {
            // add tools for feature data layers
            this.getLayerService().getAllLayers().forEach(layer => this.__addTool(layer, true));
            // update all layers at once since we suppressed individual events
            var event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
        },
        getLayerLoadingStatus: function (layerId) {
            return this.__loadingStatus[layerId];
        },
        __refreshLoadingStatus: function () {
            const status = {
                loading: [],
                error: []
            };
            Object.entries(this.__loadingStatus).forEach(([key, value]) => status[value].push(key));
            if (status.loading.length === 0) {
                // no layers in loading state
                this.plugin.showLoadingIndicator(false);
            }
            // setup error indicator based on error statuses
            this.plugin.showErrorIndicator(status.error.length > 0);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'WFSStatusChangedEvent': function (event) {
                if (event.getLayerId() === undefined) {
                    return;
                }
                if (!this.__loadingStatus) {
                    this.__loadingStatus = {};
                }
                if (event.getStatus() === event.status.loading) {
                    this.__loadingStatus['' + event.getLayerId()] = 'loading';
                    this.plugin.showLoadingIndicator(true);
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), true);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), false);
                }

                if (event.getStatus() === event.status.complete) {
                    delete this.__loadingStatus['' + event.getLayerId()];
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), false);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), false);
                }
                if (event.getStatus() === event.status.error) {
                    if (this.__loadingStatus.hasOwnProperty('' + event.getLayerId())) {
                        this.__loadingStatus['' + event.getLayerId()] = 'error';
                    }
                    this.plugins['Oskari.userinterface.Flyout'].showLoadingIndicator(event.getLayerId(), false);
                    this.plugins['Oskari.userinterface.Flyout'].showErrorIndicator(event.getLayerId(), true);
                }
                this.__refreshLoadingStatus();
            },
            'MapLayerEvent': function (event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                const id = event.getLayerId();
                if (id) {
                    const layer = this.getLayerService().findMapLayer(id);
                    this.__addTool(layer);
                } else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }
            },
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Calls flyouts layerRemoved() method
             */
            'AfterMapLayerRemoveEvent': function (event) {
                if (event.getMapLayer().hasFeatureData()) {
                    delete this.__loadingStatus['' + event.getMapLayer().getId()];
                    this.__refreshLoadingStatus();
                }
            },

            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Disable grid updates on close, otherwise enable updates
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                // ExtensionUpdateEvents are fired a lot, only let featuredata2 extension event to be handled when enabled
                if (event.getExtension().getName() !== this.getName()) {
                    // wasn't me -> do nothing
                    return;
                }
                const flyout = this.plugins['Oskari.userinterface.Flyout'];
                if (event.getViewState() === 'close') {
                    flyout.setEnabled(false);
                    if (this.plugin) {
                        this.plugin.handleCloseFlyout();
                    }
                } else {
                    flyout.setEnabled(true);
                }
            },

            'DrawingEvent': function (evt) {
                if (!evt.getIsFinished() || !this.selectionPlugin) {
                    // only interested in finished drawings
                    return;
                }
                if (this.selectionPlugin.DRAW_REQUEST_ID !== evt.getId()) {
                    // event is from some other functionality
                    return;
                }
                var geojson = evt.getGeoJson();
                if (!geojson.features.length) {
                    // no features drawn
                    return;
                }
                const helper = this.getFilterSelector();
                const layers = helper.getLayersToQuery(
                    this.getSandbox().findAllSelectedMapLayers(),
                    this.selectionPlugin.isSelectFromAllLayers());
                helper.selectWithGeometry(geojson.features[0], layers);
                this.selectionPlugin.stopDrawing();
                this.popupHandler.removeButtonSelection();
            },
            'AfterMapMoveEvent': function () {
                this.plugin.mapStatusChanged();
            },
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getGroupId() === 'selectiontools' || event.getToolId() === 'dialog') {
                    return;
                }
                if (!event.getSticky()) {
                    return;
                }
                if (this.popupHandler) {
                    this.popupHandler.close();
                }
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));

            const request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            this.sandbox.request(this, request);

            this.sandbox.unregister(this);
            this.started = false;
        },

        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.featuredata2.Flyout
         * Oskari.mapframework.bundle.featuredata2.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.Flyout', this);
        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
        },

        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.loc('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.loc('desc');
        },
        getConfiguration: function () {
            return this.conf || {};
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin', this.conf);
            this.mapModule.registerPlugin(this.plugin);
            this.mapModule.startPlugin(this.plugin);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
