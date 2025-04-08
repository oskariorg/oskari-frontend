import React from 'react';
import { Message } from 'oskari-ui';
import { PublisherService } from './service/PublisherService';

import './Flyout';
import './view/PublisherSidebar';
import './tools/AbstractPluginTool';
import '../../mapping/mapmodule/publisher/tools';
import './service/PublisherService';
import './event/MapPublishedEvent';
import './event/ToolEnabledChangedEvent';
// FIXME: remove/ColourSchemeChangedEvent isn't sent anymore after theming support
import './event/ColourSchemeChangedEvent';
import './event/LayerToolsEditModeEvent';
import './request/PublishMapEditorRequest';
import './request/PublishMapEditorRequestHandler';
import './resources/scss/style.scss';

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
        var conf = this.getConfiguration();
        conf.name = 'Publisher2';
        conf.flyoutClazz = 'Oskari.mapframework.bundle.publisher2.Flyout';
        this.defaultConf = conf;
        this.publisher = null;
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
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        init: function () {
            var tileElem = jQuery(this.getConfiguration().tileElement);
            if (tileElem.length && tileElem.length !== 0) {
                this.customTileRef = this.getConfiguration().tileElement;
                this.conf.tileClazz = null;
                this.customElementClickHandler(tileElem);
            }
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
                var me = this;
                let iframeCode = event.getUrl() + '" allow="geolocation" style="border: none;';
                var width = event.getWidth();
                var height = event.getHeight();

                if (width !== null && width !== undefined) {
                    iframeCode += ' width: ' + width + ';';
                }

                if (height !== null && height !== undefined) {
                    iframeCode += ' height: ' + height + ';';
                }

                const textCode = '<iframe src="' + iframeCode + '"></iframe>';
                const codeSnippet = '<div class="codesnippet"><code>&lt;iframe src="' + iframeCode + '"&gt;&lt;/iframe&gt;</code></div>';

                var content = me.loc('published.desc') + '<br/><br/>' + codeSnippet;

                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var closeBtn = dialog.createCloseButton();
                closeBtn.addClass('primary');
                const copyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                copyBtn.setTitle(me.loc('published.copy'));
                copyBtn.setHandler(() => {
                    const el = dialog.getElement().find('.codesnippet');
                    Oskari.util.copyTextToClipboard(textCode, el);
                });
                const title = me.loc('published.title');
                dialog.show(title, content, [copyBtn, closeBtn]);
                me.setPublishMode(false);
            }
        },
        /**
         * @method afterStart
         */
        afterStart: function () {
            var me = this;
            var sandbox = this.getSandbox();
            var loc = this.getLocalization();

            this.__service = new PublisherService(sandbox);

            // Let's add publishable filter to layerlist if user is logged in
            if (Oskari.user().isLoggedIn()) {
                var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
                mapLayerService.registerLayerFilter('publishable', function (layer) {
                    return layer.hasPermission('publish');
                });

                // Add layerlist filter button
                var layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
                if (layerlistService) {
                    layerlistService.registerLayerlistFilterButton(
                        loc.layerFilter.buttons.publishable,
                        loc.layerFilter.tooltips.publishable,
                        {
                            active: 'layer-publishable',
                            deactive: 'layer-publishable-disabled'
                        },
                        'publishable');
                }
            }

            var infoDialog;
            var openingOnAppStart = false;
            // check from url parameters if publisher should be opened to edit some specific view.
            var uuid = Oskari.util.getRequestParam('editPublished');
            if (uuid) {
                // Create an info popup. Opening publisher might take a while since we have to wait for the map layers to load.
                infoDialog = me._showOpeningPublisherMsg();
                // Create edit request handler callback
                openingOnAppStart = true;
                // Send request on app start
                Oskari.on('app.start', function () {
                    if (Oskari.user().isLoggedIn()) {
                        me._sendEditRequest(uuid);
                    } else {
                        infoDialog.close();
                        me._showOpeningPublisherErrorMsg('login');
                    }
                });
            }
            // create and register request handler
            var reqHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
                me._openPublisherForEditingCbFactory(infoDialog, openingOnAppStart)
            );
            sandbox.requestHandler('Publisher.PublishMapEditorRequest', reqHandler);

            this._registerForGuidedTour();
        },
        /**
         * @private @method _openPublisherForEditingCbFactory
         * Factory function to create a callback function for PublishMapEditorRequestHandler.
         * Callback function waits for required layers to load and opens the publisher.
         * @return {Oskari.userinterface.component.Popup} infoDialog for closing when callback finishes (optional)
         * @return {Boolean} openingOnAppStart (optional)
         * @return {function} callback function for PublishMapEditorRequestHandler
         */
        _openPublisherForEditingCbFactory: function (infoDialog, openingOnAppStart) {
            const me = this;
            let layerCheckDone = false;
            return function (data) {
                if (!openingOnAppStart || layerCheckDone) {
                    // open publisher
                    me.setPublishMode(true, data);
                    return;
                }
                // Opening on startup
                // Check that the data contains selected layers configuration
                const selectedLayers = data?.configuration?.mapfull?.state?.selectedLayers || [];
                // Perform layer check only once when opening the publisher on startup.
                layerCheckDone = true;

                if (!selectedLayers.length) {
                    if (infoDialog) {
                        infoDialog.fadeout();
                    }
                    me._showOpeningPublisherErrorMsg();
                    return;
                }
                const mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                const timeoutInMillis = 1000; // one second;
                const maxTries = 30;
                let numTries = 0;

                // Interval checks if layers have been loaded.
                const intervalId = setInterval(function () {
                    const layerIds = selectedLayers.map(function (l) { return l.id; });
                    const layersFound = mapLayerService.hasLayers(layerIds);

                    // try until we get the layers...
                    if (layersFound) {
                        if (infoDialog) {
                            infoDialog.close();
                        }
                        clearInterval(intervalId);
                        me.setPublishMode(true, data);
                        return;
                    }
                    numTries++;

                    // ...or the max try count is reached
                    if (numTries === maxTries) {
                        clearInterval(intervalId);
                        if (infoDialog) {
                            infoDialog.fadeout();
                        }
                        me._showOpeningPublisherErrorMsg();
                    }
                }, timeoutInMillis);
            };
        },
        /**
         * @private @method _sendEditRequest
         * Sends Publisher.PublishMapEditorRequest with given uuid.
         *
         * @param uuid {String} Uuid for the view to edit.
         */
        _sendEditRequest: function (uuid) {
            var requestBuilder = Oskari.requestBuilder('Publisher.PublishMapEditorRequest');
            this.sandbox.request(this, requestBuilder({
                uuid: uuid
            }));
        },
        /**
         * @return {Oskari.mapframework.bundle.publisher2.PublisherService} service for state holding
         */
        getService: function () {
            return this.__service;
        },
        /**
         * @return {String} reference to element-id to use instead of tile as bundle ui-element, returns null if isn't set in conf
         */
        getCustomTileRef: function () {
            return this.customTileRef;
        },
        /**
         * @method customElementClickHandler
         * @param {jQuery} tileElement
         */
        customElementClickHandler: function (tileElement) {
            var me = this;
            tileElement.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest', [me, 'toggle']
                );
            });
        },
        /**
         * @method setPublishMode
         * Transform the map view to publisher mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {Object} data View data that is used to prepopulate publisher (optional)
         * @param {Layer[]} deniedLayers layers that the user can't publish (optional)
         */
        setPublishMode: function (blnEnabled, data, deniedLayers) {
            const me = this;
            const root = jQuery(Oskari.dom.getRootEl());
            const navigation = root.find('nav');
            navigation.css('display', blnEnabled ? 'none' : 'block');
            const mapContainer = Oskari.dom.getMapContainerEl();
            const extraClasses = ['mapPublishMode', Oskari.dom.APP_EMBEDDED_CLASS];
            if (this.getCustomTileRef()) {
                blnEnabled ? jQuery(this.getCustomTileRef()).addClass('activePublish') : jQuery(this.getCustomTileRef()).removeClass('activePublish');
            }
            if (blnEnabled) {
                if (me.publisher) return;
                data = data || this.getDefaultData();
                me.getService().setIsActive(true);

                if (data?.configuration && Object.keys(data.configuration)?.length > 0) {
                    // if there exists some configuration we're calling set state, which is calling UIChangeEvent under the hood.
                    const stateRB = Oskari.requestBuilder('StateHandler.SetStateRequest');
                    this.getSandbox().request(this, stateRB(data.configuration));
                } else {
                    // Otherwise there's no need to update the state and we can just notify everybody of ui change.
                    const eventBuilder = Oskari.eventBuilder('UIChangeEvent');
                    this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
                }

                if (data?.uuid) {
                    this._showEditNotification();
                }

                me.getService().setNonPublisherLayers(deniedLayers || this.getNonPublisherLayers());
                me.getService().removeLayers();
                me.oskariLang = Oskari.getLang();
                extraClasses.forEach(cssClass => mapContainer.classList.add(cssClass));

                // hide flyout
                me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'hide']);

                me.publisher = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
                    me,
                    me.getLocalization('BasicView'),
                    data
                );

                // call set enabled before rendering the panels (avoid duplicate "normal map plugins")
                me.publisher.setEnabled(true);
                const publisherDiv = jQuery('<div/>');
                root.prepend(publisherDiv);
                me.publisher.render(publisherDiv);
            } else {
                Oskari.setLang(me.oskariLang);
                if (me.publisher) {
                    // reset tile status
                    me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'close']);
                    me.publisher.setEnabled(false);
                    me.publisher.destroy();
                    me.publisher = null;
                }
                // first return all needed plugins before adding the layers back
                extraClasses.forEach(cssClass => mapContainer.classList.remove(cssClass));
                me.getService().setIsActive(false);
                // return the layers that were removed for publishing.
                me.getService().addLayers();
                me.getFlyout().close();
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
                },
                featuredata2: {
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
            return { configuration: jQuery.extend(true, config, state) };
        },
        /**
         * @method _showEditNotification
         * Shows notification that the user starts editing an existing published map
         * @private
         */
        _showEditNotification: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(this.loc('edit.popup.title'), this.loc('edit.popup.msg'));
            dialog.fadeout();
        },
        /**
         * @private @method _showOpeningPublisherMsg
         * Notify user that we are getting ready to open his map view for editing.
         * @return {Oskari.userinterface.component.Popup} The popup dialog for closing it later on.
         */
        _showOpeningPublisherMsg: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(this.loc('edit.popup.title'), this.loc('edit.popup.published.msg'));
            dialog.makeModal();
            return dialog;
        },
        /**
         * @private @method _showOpeningPublisherErrorMsg
         * Notify user that editing url specified view failed.
         * @param {String} errorKey Localization key for the error message (optional)
         */
        _showOpeningPublisherErrorMsg: function (errorKey) {
            errorKey = 'edit.popup.published.error.' + (errorKey || 'common');
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(this.loc('edit.popup.published.error.title'), this.loc(errorKey));
            setTimeout(function () { dialog.fadeout(); }, 3000);
        },

        /**
         * @method getNonPublisherLayers
         * Checks currently selected layers and returns a subset of the list
         * that has the layers that can't be published. If all selected
         * layers can be published, returns an empty list.
         * @return
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         * list of layers that can't be published.
         */
        getNonPublisherLayers: function () {
            var selectedLayers = this.sandbox.getMap().getLayers();
            var service = this.getService();
            var deniedLayers = selectedLayers.filter((layer) => {
                return !service.hasPublishRight(layer) || !this.sandbox.getMap().isLayerSupported(layer);
            });
            return deniedLayers;
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
                return this.getLocalization().guidedTour.title;
            },
            getContent: function () {
                return <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />;
            },
            getLinks: function () {
                var me = this;
                var loc = this.getLocalization().guidedTour;
                return [
                    {
                        title: loc.openLink,
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'Publisher2']),
                        visible: false
                    },
                    {
                        title: loc.closeLink,
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
            var me = this;
            function sendRegister () {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder && me.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for (var prop in me.__guidedTourDelegateTemplate) {
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

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
