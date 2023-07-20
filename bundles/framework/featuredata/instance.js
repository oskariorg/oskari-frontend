/**
 * @class Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata.FeatureDataBundle for bundle definition.
 *
 */

import { FEATUREDATA_BUNDLE_ID } from './view/FeatureDataContainer';
import { DRAW_REQUEST_ID, SelectToolPopupHandler } from './view/SelectToolPopupHandler.js';
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance',
    function () {},
    {
        /**
         * @static
         * @property __name
         */
        __name: 'FeatureData',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            this.requestHandlers = {
                showFeaturedataHandler: Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.request.ShowFeatureDataRequestHandler', this)
            };
        },
        getSandbox: function () {
            return this.sandbox;
        },

        getMapModule: function () {
            return this.mapModule;
        },

        start: function () {
            const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox.register(this);
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));

            this.createUi();

            if ((this.conf && this.conf.selectionTools === true)) {
                this.selectToolPopupHandler = new SelectToolPopupHandler(this);
                const addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
                const btn = {
                    iconCls: 'tool-feature-selection',
                    tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.select.tooltip'),
                    sticky: true,
                    callback: () => this.selectToolPopupHandler.showSelectionTools()
                };
                this.getSandbox().request(this, addBtnRequestBuilder('featuredataSelectionTools', 'selectiontools', btn));
            }
            this.sandbox.requestHandler('Featuredata.ShowFeatureDataRequest', this.requestHandlers.showFeaturedataHandler);
            this.__setupLayerTools();
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.plugin.FeatureDataPlugin', this.conf);
            this.mapModule.registerPlugin(this.plugin);
            this.mapModule.startPlugin(this.plugin);
        },

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function () {
            // add tools for feature data layers
            this.getLayerService().getAllLayers().filter((layer) => layer.hasFeatureData()).forEach((layer) => this.__addTool(layer, true));
            // update all layers at once since we suppressed individual events
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
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
            const label = Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'layer.featureData');

            tool.setName('featureData');
            tool.setIconCls('show-featuredata-tool');
            tool.setTitle(label);
            tool.setTooltip(label);
            tool.setCallback(() => this.sandbox.postRequestByName('Featuredata.ShowFeatureDataRequest', [layer.getId()]));

            this.getLayerService().addToolForLayer(layer, tool, suppressEvent);
        },
        eventHandlers: {
            DrawingEvent: function (evt) {
                if (!evt.getIsFinished() || !this.selectToolPopupHandler) {
                    // only interested in finished drawings
                    return;
                }
                if (DRAW_REQUEST_ID !== evt.getId()) {
                    // event is from some other functionality
                    return;
                }
                const geojson = evt.getGeoJson();
                if (!geojson.features.length) {
                    // no features drawn
                    return;
                }

                this.selectToolPopupHandler.selectWithGeometry(geojson.features[0]);
            },
            MapLayerEvent: function (event) {
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
            }
        }
    });
