import React from 'react';
import { Message } from 'oskari-ui';
import { showInfoPopup } from './view/dialog/InfoPopup';
import { showSnippetPopup } from './view/dialog/SnippetPopup';
import { PublisherService } from './service/PublisherService';
import { PublisherSidebar } from './view/PublisherSidebar';
import { hasPublishRight } from './util/util';

import './Flyout';
import './event/MapPublishedEvent';
import './event/ToolEnabledChangedEvent';
import './event/LayerToolsEditModeEvent';
import './request/PublishMapEditorRequest';
import './request/PublishMapEditorRequestHandler';
import '../../mapping/mapmodule/publisher/tools';

/**
 * @class Oskari.mapframework.bundle.publisher2.PublisherBundleInstance
 *
 * Main component and starting point for the "map publisher" functionality. Publisher
 * is a wizardish tool to configure a subset of map functionality. It uses the map
 * plugin functionality to start and stop plugins when the map is running. Also it
 * changes plugin language and map size.
 *
 * See Oskari.mapframework.bundle.publisher2.PublisherBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.PublisherBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        // override defaults
        const conf = this.getConfiguration();
        conf.name = 'Publisher2';
        conf.flyoutClazz = 'Oskari.mapframework.bundle.publisher2.Flyout';
        this.defaultConf = conf;
        this.publisher = null;
        this.service = null;
        this.customTileRef = null;
        this.loc = Oskari.getMsg.bind(null, 'Publisher2');
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Publisher2',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
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
        init: function () {
            const { tileElement } = this.getConfiguration();
            if (!tileElement) {
                return;
            }
            const tileRef = document.querySelector(tileElement);
            if (!tileRef) {
                return;
            }
            tileRef.addEventListener('click', () => this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'toggle']));
            // remove default tile
            this.conf.tileClazz = null;
            this.customTileRef = tileRef;
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method Publisher.MapPublishedEvent
             * @param {Oskari.mapframework.bundle.publisher.event.MapPublishedEvent} event
             */
            'Publisher.MapPublishedEvent': function (event) {
                const view = {
                    published: true,
                    url: event.getUrl(),
                    metadata: {
                        size: {
                            width: event.getWidth(),
                            height: event.getHeight()
                        }
                    }
                };
                const onClose = () => {
                    this.snippet?.close();
                    this.snippet = null;
                };
                this.snippet = showSnippetPopup(view, onClose);
                this.setPublishMode(false);
            }
        },
        /**
         * @method afterStart
         */
        afterStart: function () {
            const sandbox = this.getSandbox();
            this.service = new PublisherService(this);

            // Let's add publishable filter to layerlist if user is logged in
            if (Oskari.user().isLoggedIn()) {
                const mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
                mapLayerService.registerLayerFilter('publishable', hasPublishRight);

                // Add layerlist filter button
                const layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
                if (layerlistService) {
                    layerlistService.registerLayerlistFilterButton(
                        this.loc('layerFilter.buttons.publishable'),
                        this.loc('layerFilter.tooltips.publishable'),
                        {
                            active: 'layer-publishable',
                            deactive: 'layer-publishable-disabled'
                        },
                        'publishable');
                }
            }

            // check from url parameters if publisher should be opened to edit some specific view.
            const uuid = Oskari.util.getRequestParam('editPublished');
            if (uuid) {
                // Create an info popup. Opening publisher might take a while since we have to wait for the map layers to load.
                const infoDialogControls = this._showOpeningPublisherMsg();
                // Send request on app start
                Oskari.on('app.start', () => {
                    if (Oskari.user().isLoggedIn()) {
                        const cb = data => this._openPublisherOnStart(infoDialogControls, data);
                        this.getService().fetchAppSetup(uuid, cb);
                    } else {
                        infoDialogControls?.close();
                        this._showOpeningPublisherErrorMsg('login');
                    }
                });
            }
            // create and register request handler
            const reqHandler = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler', this);
            sandbox.requestHandler('Publisher.PublishMapEditorRequest', reqHandler);

            this._registerForGuidedTour();
        },
        /**
         * @private @method _openPublisherOnStart
         * Function waits for required layers to load and opens the publisher.
         * @param {Object} infoDialogControls
         * @param {Object} data to edit
         */
        _openPublisherOnStart: function (infoDialogControls, data) {
            // Opening on startup
            // Check that the data contains selected layers configuration
            const selectedLayers = data?.configuration?.mapfull?.state?.selectedLayers || [];
            const layerIds = selectedLayers.map(l => l.id);

            if (!layerIds.length) {
                infoDialogControls?.close();
                this._showOpeningPublisherErrorMsg();
                return;
            }
            const mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            const timeoutInMillis = 1000; // one second;
            const maxTries = 30;
            let numTries = 0;

            // Interval checks if layers have been loaded.
            const intervalId = setInterval(() => {
                // try until we get the layers...
                if (mapLayerService.hasLayers(layerIds)) {
                    infoDialogControls?.close();
                    clearInterval(intervalId);
                    this.setPublishMode(true, data);
                    return;
                }
                numTries++;

                // ...or the max try count is reached
                if (numTries === maxTries) {
                    clearInterval(intervalId);
                    infoDialogControls?.close();
                    this._showOpeningPublisherErrorMsg();
                }
            }, timeoutInMillis);
        },
        /**
         * @return {Oskari.mapframework.bundle.publisher2.PublisherService} service for state holding
         */
        getService: function () {
            return this.service;
        },
        /**
         * @return {String} reference to element-id to use instead of tile as bundle ui-element, returns null if isn't set in conf
         */
        getCustomTileRef: function () {
            return this.customTileRef;
        },
        /**
         * @method setPublishMode
         * Transform the map view to publisher mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {Object} optData View data that is used to prepopulate publisher (optional)
         */
        setPublishMode: function (blnEnabled, optData) {
            if (blnEnabled === this.getService().getIsActive()) {
                return;
            }

            if (blnEnabled) {
                const data = optData || this.getDefaultData();
                if (data.configuration && Object.keys(data.configuration)?.length > 0) {
                    // if there exists some configuration we're calling set state, which is calling UIChangeEvent under the hood.
                    const stateRB = Oskari.requestBuilder('StateHandler.SetStateRequest');
                    this.getSandbox().request(this, stateRB(data.configuration));
                } else {
                    // Otherwise there's no need to update the state and we can just notify everybody of ui change.
                    const eventBuilder = Oskari.eventBuilder('UIChangeEvent');
                    this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
                }
                if (data.uuid) {
                    this._showEditNotification();
                }
                // stop & store plugins before creating publisher handlers
                this.getService().setPublishModeImpl(true, data);
                this.publisher = new PublisherSidebar(this);
                this.publisher.setPublishModeImpl(true, data);
            } else {
                // stop publisher handlers before resuming removed plugins
                this.publisher?.setPublishModeImpl(false);
                this.publisher = null;
                this.getService().setPublishModeImpl(false);
            }
            this.toggleClasses(blnEnabled);
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
        },

        // own function for editing classes because it looks little hacky
        toggleClasses: function (publishEnabled) {
            const mapClasses = ['mapPublishMode', Oskari.dom.APP_EMBEDDED_CLASS];
            const tileClass = 'activePublish';

            const mapContainer = Oskari.dom.getMapContainerEl();
            const customTile = this.getCustomTileRef();

            if (publishEnabled) {
                mapClasses.forEach(cssClass => mapContainer.classList.add(cssClass));
                customTile?.classList.add(tileClass);
            } else {
                mapClasses.forEach(cssClass => mapContainer.classList.remove(cssClass));
                customTile?.classList.remove(tileClass);
            }
        },
        /**
         * Initial data for publisher to preselect certain tools by default and assume current map state as starting point
         * @return {Object}
         */
        getDefaultData: function () {
            const config = {
                mapfull: {
                    conf: {
                        plugins: [
                            { id: 'Oskari.mapframework.mapmodule.ControlsPlugin' },
                            { id: 'Oskari.mapframework.mapmodule.GetInfoPlugin' }
                        ]
                    }
                },
                featuredata: {
                    conf: {}
                }
            };
            if (!this.getSandbox().getMap().getSupports3D()) {
                config.mapfull.conf.plugins.push(
                    { id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin' }
                );
            }
            // setup current mapstate so layers are not removed
            const state = this.getSandbox().getCurrentState();
            // merge state to initial config
            const configuration = Oskari.util.deepClone(config, state);
            return { configuration };
        },
        getAppSetupToPublish: function (validate) {
            const { handler } = this.publisher || {};
            if (validate && handler?.validate().length) {
                return null;
            }
            return handler?.getAppSetupToPublish() || null;
        },
        /**
         * @method _showEditNotification
         * Shows notification that the user starts editing an existing published map
         * @private
         */
        _showEditNotification: function () {
            return showInfoPopup('edit.popup.title', 'edit.popup.msg', { fadeout: true });
        },
        /**
         * @private @method _showOpeningPublisherMsg
         * Notify user that we are getting ready to open his map view for editing.
         * @return {function} callback for closing popup later on.
         */
        _showOpeningPublisherMsg: function () {
            return showInfoPopup('edit.popup.title', 'edit.popup.published.msg', { modal: true });
        },
        /**
         * @private @method _showOpeningPublisherErrorMsg
         * Notify user that editing url specified view failed.
         * @param {String} errorKey Localization key for the error message (optional)
         */
        _showOpeningPublisherErrorMsg: function (errorKey) {
            const message = 'edit.popup.published.error.' + (errorKey || 'common');
            return showInfoPopup('edit.popup.published.error.title', message, { fadeout: true });
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 50,
            show: function () {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'Publisher2']);
            },
            hide: function () {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'Publisher2']);
            },
            getTitle: function () {
                return this.loc('guidedTour.title');
            },
            getContent: function () {
                return <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />;
            },
            getLinks: function () {
                const me = this;
                return [
                    {
                        title: this.loc('guidedTour.openLink'),
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'Publisher2']),
                        visible: false
                    },
                    {
                        title: this.loc('guidedTour.closeLink'),
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'Publisher2']),
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
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
