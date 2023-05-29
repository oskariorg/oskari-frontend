import './Tile';
import './Flyout';
import './service/layerlist';
import './service/LayerListToolingService';
import './request/ShowFilteredLayerListRequest';
import './request/ShowFilteredLayerListRequestHandler';
import './request/AddLayerListFilterRequest';
import './request/AddLayerListFilterRequestHandler';
import React from 'react';
import { Message } from 'oskari-ui';

const FILTER_NEWEST_COUNT = 20;

/**
 * @class Oskari.mapframework.bundle.layerlist.LayerListBundleInstance
 *
 * Main component and starting point for the "all layers" functionality.
 * Lists all the layers available in Oskari.mapframework.service.MapLayerService and updates
 * UI if Oskari.mapframework.event.common.MapLayerEvent is received.
 *
 * See Oskari.mapframework.bundle.layerlist.LayerListBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerlist.LayerListBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'LayerList',
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
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *     JSON object for complete data depending on localization
         *     structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            const conf = this.conf;
            const sandboxName = conf ? conf.sandbox : 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);

            if (this.started) {
                return;
            }

            this.started = true;
            this.sandbox = sandbox;

            sandbox.register(this);

            const layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService');
            sandbox.registerService(layerlistService);

            const toolingService = Oskari.clazz.create('Oskari.mapframework.service.LayerListToolingService');
            sandbox.registerService(toolingService);

            Object.keys(this.eventHandlers)
                .forEach(eventName => sandbox.registerForEventByName(this, eventName));

            this._registerFilterButtons(layerlistService);

            // Let's extend UI
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // create and register request handlers
            const reqHandler = Oskari.clazz.create('Oskari.mapframework.bundle.layerlist.request.ShowFilteredLayerListRequestHandler', sandbox, this);
            sandbox.requestHandler('ShowFilteredLayerListRequest', reqHandler);

            const reqHandlerAddLayerListFilter = Oskari.clazz.create('Oskari.mapframework.bundle.layerlist.request.AddLayerListFilterRequestHandler', sandbox, this);
            sandbox.requestHandler('AddLayerListFilterRequest', reqHandlerAddLayerListFilter);

            this._registerForGuidedTour();
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) { return; }

            // Skip events, if internally linked layer
            if (typeof event.getMapLayer === 'function' && event.getMapLayer().isLinkedLayer()) {
                this.plugins['Oskari.userinterface.Tile'].refresh();
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            AfterMapLayerRemoveEvent: function (event) {
                this.plugins['Oskari.userinterface.Tile'].refresh();
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            AfterMapLayerAddEvent: function (event) {
                this.plugins['Oskari.userinterface.Tile'].refresh();
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Rearranges layers
             */
            AfterRearrangeSelectedMapLayerEvent: function (event) {
                if (event._creator !== this.getName()) {
                    // Layer order has been changed by someone else, resort layers
                    this.plugins['Oskari.userinterface.Tile'].refresh();
                }
            },
            UIChangeEvent: function () {
                this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
            }
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
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.sandbox();

            const request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerlist.Flyout
         * Oskari.mapframework.bundle.layerlist.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerlist.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerlist.Tile', this, this.getLocalization());
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
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "all layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Tile'].refresh();
        },

        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 20,
            show: function () {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', this.getName()]);
            },
            hide: function () {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', this.getName()]);
            },
            getTitle: function () {
                return this.getLocalization('guidedTour').title;
            },
            getContent: function () {
                return <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />;
            },
            getLinks: function () {
                const me = this;
                const loc = this.getLocalization('guidedTour');
                return [
                    {
                        title: loc.openLink,
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', me.getName()]),
                        visible: false
                    },
                    {
                        title: loc.closeLink,
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', me.getName()]),
                        visible: true
                    }
                ];
            }
        },
        _registerFilterButtons: function (service) {
            // Add newest layers filter
            const loc = this.getLocalization('filter');
            service.registerLayerlistFilterButton(
                loc.newest.title,
                loc.newest.tooltip.replace('##', FILTER_NEWEST_COUNT),
                {},
                'newest');
            // Add raster layers filter
            service.registerLayerlistFilterButton(
                loc.raster.title,
                loc.raster.tooltip,
                {},
                'raster');
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
                    for (let prop in me.__guidedTourDelegateTemplate) {
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
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);
