
import React from 'react';
import { Message } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';
import { showTooManyLayersPopup } from './view/TooManyLayersPopup';
import { PrintoutHandler } from './PrintoutHandler';
import { PrintoutPanel } from './view/PrintoutPanel';

/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.PrintoutBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = undefined;
        this.started = false;
        this.buttonGroup = 'viewtools';
        this.printMapRequestHandler = undefined;
        this.printService = undefined;
        this.popupControls = null;
        this.handler = null;
        this._log = Oskari.log(this.getName());
        this.mapModule = undefined;
        this.scaleOptions = [];
        this.loc = Oskari.getMsg.bind(null, this.getName());
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Printout',
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
        popupCleanup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        },
        /**
         * @method start
         * Implements BundleInstance protocol start method
         */
        start: function () {
            if (this.started) {
                return;
            }
            this.started = true;
            const sandboxName = this.conf?.sandbox || 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;

            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            this.scaleOptions = this.conf?.scales || this.mapModule?.getScaleArray()?.slice().reverse();

            sandbox.register(this);

            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => sandbox.registerForEventByName(this, p));

            // requesthandler
            this.printMapRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', sandbox, () => this.setPublishMode(true));
            sandbox.requestHandler('printout.PrintMapRequest', this.printMapRequestHandler);

            // state handler
            this.handler = new PrintoutHandler(() => this.updatePanel(), this);

            // request toolbar to add buttons
            const addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            const buttonConf = {
                iconCls: 'tool-print',
                tooltip: this.loc('btnTooltip'),
                sticky: false,
                callback: () => this.continueToPrint()
            };
            sandbox.request(this, addToolButtonBuilder('print', this.buttonGroup, buttonConf));

            // create the PrintService for handling ajax calls
            // and common functionality.
            this.printService = Oskari.clazz.create('Oskari.mapframework.bundle.printout.service.PrintService', this);
            sandbox.registerService(this.printService);

            // Let's extend UI
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);
        },
        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },
        getService: function () {
            return this.printService;
        },
        getProps: function () {
            return {
                controller: this.handler.getController(),
                state: this.handler.getState(),
                scaleSelection: this.conf.scaleSelection,
                scaleOptions: this.scaleOptions,
                onClose: () => this.setPublishMode(false)
            };
        },
        showPanel: function () {
            const props = this.getProps();
            this.handler.showPanel(
                <Message bundleKey='Printout' messageKey='BasicView.title' />,
                <PrintoutPanel { ...props } />,
                props.onClose
            );
        },
        updatePanel: function () {
            this.handler.updatePanel(
                <Message bundleKey='Printout' messageKey='BasicView.title' />,
                <PrintoutPanel { ...this.getProps() } />
            );
        },
        closePanel: function () {
            this.handler?.closePanel();
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
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
            'Printout.PrintableContentEvent': function (event) {
                this._log.deprecated('Printout.PrintableContentEvent');
            },
            'Printout.PrintWithoutUIEvent': function (event) {
                this._log.deprecated('Printout.PrintWithoutUIEvent');
            }
        },

        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        stop: function () {
            this.closePanel();

            const sandbox = this.getSandbox();
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => sandbox.unregisterFromEventByName(this, p));

            sandbox.removeRequestHandler('printout.PrintMapRequest', this.printMapRequestHandler);
            this.printMapRequestHandler = null;
            const request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.sandbox.unregister(this);
            this.started = false;
        },
        continueToPrint: function () {
            if (this._isTooManyLayers()) {
                if (!this.popupControls) {
                    this.popupControls = showTooManyLayersPopup(() => this.popupCleanup());
                }
                return;
            }

            if (this._isManyLayers()) {
                Messaging.info({
                    content: Oskari.getMsg('Printout', 'StartView.info.printoutProcessingTime'),
                    duration: 8
                });
            }
            this.setPublishMode(true);
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return {};
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
        startExtension: function () {

        },
        stopExtension: function () {

        },
        /**
         * @method setPublishMode
         * Transform the map view to printout mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled
         */
        setPublishMode: function (blnEnabled) {
            // trigger an event letting other bundles know we require the whole UI
            const eventBuilder = Oskari.eventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
            if (blnEnabled) {
                this.showPanel();

                // reset and disable map rotation
                this.sandbox.postRequestByName('rotate.map', []);
                this.sandbox.postRequestByName('DisableMapMouseMovementRequest', [['rotate']]);
            } else {
                this.closePanel();

                // enable map controls
                this.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['rotate']]);
                if (this.conf.scaleSelection) {
                    this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest', [['zoom']]);
                    this.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['zoom']]);
                }
                // select default tool
                const builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
                this.sandbox.request(this, builder());
            }
        },
        _isTooManyLayers: function () {
            const layerCount = this._getVisibleLayersCount();
            const isMaxLayersExceeded = layerCount > 8;
            return isMaxLayersExceeded;
        },
        _isManyLayers: function () {
            const layerCount = this._getVisibleLayersCount();
            const isManyLayersExceeded = layerCount > 3;
            return isManyLayersExceeded;
        },
        _getVisibleLayersCount: function () {
            const layers = this.getSandbox().findAllSelectedMapLayers();
            return layers.filter(layer => layer.isVisible()).length;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
