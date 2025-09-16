import React from 'react';
import { Message } from 'oskari-ui';

import './Flyout';
import './Tile';
import './plugin/MapLegendPlugin';
import './publisher/MapLegendTool';
import './resources/scss/style.scss';

/**
 * @class Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance
 *
 * Main component and starting point for the "map legend" functionality.
 * Lists legends of maplayers that are currently on the map.
 * Note! Not all layers have legends.
 *
 * See Oskari.mapframework.bundle.maplegend.MapLegendBundle for bundle definition.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.MapLegendBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.plugin = null;
        this.loc = Oskari.getMsg.bind(null, this.getName());
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'maplegend',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
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
         * implements BundleInstance protocol start method
         */
        start: function (sandbox) {
            if (this.started) {
                return;
            }
            this.started = true;
            this.sandbox = sandbox;
            sandbox.register(this);
            Object.keys(this.eventHandlers).forEach(event => sandbox.registerForEventByName(this, event));

            if (this.isEmbedded()) {
                this.createPlugin();
            } else {
                // Let's extend UI
                const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
                sandbox.request(this, request);
                // draw ui
                this.createUi();
            }
            this._setupLayerTools();
            this._registerForGuidedTour();
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
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
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            AfterMapLayerRemoveEvent: function () {
                this.refreshUI();
            },
            AfterMapLayerAddEvent: function () {
                this.refreshUI();
            },
            AfterChangeMapLayerStyleEvent: function () {
                this.refreshUI();
            },
            AfterRearrangeSelectedMapLayerEvent: function () {
                this.refreshUI();
            },
            MapLayerEvent: function (event) {
                // do refresh ui in any case so we get the metadata - icon in case it was missing
                this.refreshUI();

                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }

                if (event.getLayerId()) {
                    this._addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this._setupLayerTools();
                }
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.sandbox;
            Object.keys(this.eventHandlers).forEach(event => sandbox.unregisterFromEventByName(this, event));

            const request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.stopPlugin();
            sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.maplegend.Flyout
         * Oskari.mapframework.bundle.maplegend.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.Tile', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        getPlugin: function () {
            return this.plugin;
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
        isEmbedded: function () {
            return Oskari.dom.isEmbedded();
        },
        refreshUI: function () {
            const uicomponent = this.isEmbedded() ? this.plugin : this.plugins['Oskari.userinterface.Flyout'];
            if (uicomponent) {
                uicomponent.refresh();
            }
        },
        /**
         * @method createUi
         * (re)creates the UI for "all layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            this.plugins['Oskari.userinterface.Tile'].refresh();
        },
        createPlugin: function () {
            if (this.plugin) {
                return;
            }
            const plugin = Oskari.clazz.create('Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin', this.conf);
            const mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.registerPlugin(plugin);
            mapmodule.startPlugin(plugin);
            this.plugin = plugin;
        },
        stopPlugin: function () {
            if (!this.plugin) {
                return;
            }
            const mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.unregisterPlugin(this.plugin);
            mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
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
        _setupLayerTools: function () {
            // add tools for feature data layers
            const layers = this.getLayerService().getAllLayers();
            layers.forEach(layer => this._addTool(layer, true));
            // update all layers at once since we suppressed individual events
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.sandbox.notifyAll(event);
        },
        /**
         * Adds the maplegend tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        _addTool: function (layer, suppressEvent) {
            const service = this.getLayerService();
            if (typeof layer !== 'object') {
                // detect layerId and replace with the corresponding layer
                layer = service.findMapLayer(layer);
            }
            if (!layer || !layer.getLegendImage()) {
                return;
            }

            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('show-layer-legend-tool');
            tool.setIconCls('show-layer-legend-tool');
            tool.setTitle(this.loc('title'));
            tool.setTooltip(this.loc('tooltip'));
            tool.setCallback(() => this.toggleFlyout(true));

            service.addToolForLayer(layer, tool, suppressEvent);
        },

        toggleFlyout: function (show) {
            const request = show ? 'attach' : 'close';
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, request, this.getName()]);
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 60,
            show: function () {
                this.toggleFlyout(true);
            },
            hide: function () {
                this.toggleFlyout(false);
            },
            getTitle: function () {
                return this.loc('guidedTour.title');
            },
            getContent: function () {
                return <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />;
            },
            getLinks: function () {
                return [
                    {
                        title: this.loc('guidedTour.openLink'),
                        onClick: () => this.toggleFlyout(true),
                        visible: false
                    },
                    {
                        title: this.loc('guidedTour.closeLink'),
                        onClick: () => this.toggleFlyout(false),
                        visible: true
                    }
                ];
            }
        },
        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function () {
            const me = this;
            function sendRegister () {
                const requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder && me.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                    const delegate = {
                        bundleName: me.getName()
                    };
                    for (const prop in me.__guidedTourDelegateTemplate) {
                        if (typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler (msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            const tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
