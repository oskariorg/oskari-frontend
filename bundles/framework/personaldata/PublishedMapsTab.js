import React from 'react';
import ReactDOM from 'react-dom';
import { PublishedMapsList } from './PublishedMapsList';

/**
 * @class Oskari.mapframework.bundle.personaldata.PublishedMapsTab
 * Renders the "personal data/published map" tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.PublishedMapsTab',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
     * Reference to component that created the tab
     *
     */
    function (instance) {
        this.instance = instance;
        this.template = jQuery('<div class="viewsList volatile"></div>');
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
        this.loc = Oskari.getMsg.bind(null, 'PersonalData');
        this.container = null;
        this.popupControls = null;
        this.popupCleanup = () => {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        };
    }, {
        /**
         * @method getName
         * Returns module name. Needed because we fake to be module for
         * listening to events (getName and onEvent methods are needed for this)
         *
         *
         * @return {string}
         */
        getName: function () {
            return 'PersonalData.PublishedMapsTab';
        },

        /**
         * @method getTitle
         * Returns tab title
         *
         *
         * @return {string}
         */
        getTitle: function () {
            return this.loc('tabs.publishedmaps.title');
        },

        /**
         * @method addTabContent
         * Writes the tab content to the given container
         *
         * @param {jQuery} container reference to a container
         * where the tab should be added
         *
         */
        addTabContent: function (container) {
            var me = this;
            me.container = container;

            me._refreshViewsList();
        },

        /**
         * @private @method _renderViewsList
         * Renders given views list. Removes previous listing.
         *
         * @param {Object[]} views object array as returned by backend service
         *
         */
        _renderViewsList: function (views) {
            if (!views) {
                views = [];
            }
            var me = this;

            this.viewData = views;
            ReactDOM.render(
                <PublishedMapsList
                    views={views}
                    handleEdit={(data) => me.editView(data)}
                    handleDelete={(data) => me.deleteView(data)}
                    handlePublish={(data) => me.setPublished(data)}
                    showOnMap={(data) => me.showOnMap(data)}
                    openMap={(data) => me.openMap(data)}
                    setPopup={(controls) => { this.popupControls = controls; }}
                    closePopup={this.popupCleanup}
                />
                ,
                me.container
            );
        },

        /**
         * @private @method _refreshViewsList
         * Fetches views from backend and renders the response.
         * Shows an error message on failure
         *
         *
         */
        _refreshViewsList: function () {
            var me = this,
                service = me.instance.getViewService();
            service.loadViews('PUBLISHED', function (isSuccess, response) {
                if (isSuccess) {
                    me._renderViewsList(response.views);
                } else {
                    me._showErrorMessage(me.loc('tabs.publishedmaps.error.loadfailed'));
                }
            });
        },

        /**
         * @private @method _getViewById
         * Finds view object matching given id.
         * Shows an error message if no matches found.
         *
         * @param {Number} id view id
         *
         * @return {Object} matching view object or undefined if not found
         */
        _getViewById: function (id) {
            var me = this,
                i;
            for (i = 0; i < me.viewData.length; i += 1) {
                if (me.viewData[i].id === id) {
                    // found what we were looking for
                    return me.viewData[i];
                }
            }
            // couldn't find view -> show an error
            me._showErrorMessage(me.loc('tabs.publishedmaps.error.generic'));
        },

        /**
         * @private @method _confirmSetState
         * Shows a confirmation dialog for opening a problematic view
         *
         * @param {Function} cb
         * Callback function for ok button
         * @param {Boolean}  blnMissing
         * True if we have determined that the layer is no longer available,
         * false if layer might not be loaded yet.
         *
         */
        _confirmSetState: function (cb, blnMissing) {
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );
            okBtn.setTitle(me.loc('tabs.publishedmaps.button.ok'));
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                dialog.close();
                if (cb && blnMissing) {
                    cb();
                }
            });
            var cancelBtn = dialog.createCloseButton(me.loc('tabs.publishedmaps.button.cancel'));
            if (blnMissing) {
                dialog.show(
                    me.loc('tabs.publishedmaps.popup.showErrorTitle'),
                    me.loc('tabs.publishedmaps.popup.showConfirmMissing'), [cancelBtn, okBtn]
                );
            } else {
                dialog.show(
                    me.loc('tabs.publishedmaps.popup.showErrorTitle'),
                    me.loc('tabs.publishedmaps.popup.showConfirmNotLoaded'), [cancelBtn]
                );
            }
            dialog.makeModal();
        },

        /**
         * @private @method _deleteView
         * Calls backend to delete the given view. Reloads the view listing on
         * success and shows an error message on fail
         *
         * @param {Object} view data object
         *
         */
        _deleteView: function (view) {
            var me = this,
                service = me.instance.getViewService();
            service.deleteView(view, function (isSuccess) {
                if (isSuccess) {
                    me._refreshViewsList();
                } else {
                    me._showErrorMessage(me.loc('tabs.publishedmaps.error.notdeleted'));
                }
            });
        },

        /**
         * @private @method _showErrorMessage
         * Shows an error dialog to the user with given message
         *
         * @param {String} msg message to show on popup
         *
         */
        _showErrorMessage: function (msg) {
            var dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            // delete failed
            var button = dialog.createCloseButton(this.loc('tabs.publishedmaps.button.ok'));
            button.addClass('primary');
            dialog.show(this.loc('tabs.publishedmaps.error.title'), msg, [button]);
        },

        _isCurrentProjectionSupportedForView: function (data) {
            var currentProjection = Oskari.getSandbox().getMap().getSrsName();
            var viewProjection = data.state.mapfull.state.srs;
            return viewProjection === currentProjection;
        },
        /**
         * @method constructUrlWithUuid
         * @param {string} srs Srs name to find corresponding default view uuid
         * @param {string} editUuid Uuid specifying which view should be opened in the publisher (optional)
         * @param {object} viewData Data containing config for the geoportal view (optional)
         *
         * Constructs an url to open one of system's default views with parameters.
         *
         * @return {string} url
         */
        constructUrlWithUuid: function (srs, editUuid, viewData) {
            var sandbox = this.instance.getSandbox();
            var uuid;
            var views = Oskari.app.getSystemDefaultViews();
            views.forEach(function (view) {
                if (view.srsName === srs) {
                    uuid = view.uuid;
                }
            });
            var url = sandbox.createURL('/?uuid=' + uuid, false);
            if (viewData) {
                url += this._getMapStateParameters(viewData);
            }
            if (editUuid) {
                url += '&editPublished=' + editUuid;
            }
            return url;
        },
        /**
         * @method _getMapStateParameters
         * @param {object} view data containing config for the view.
         * @private
         *
         * To get view's url parameters for map link.
         *
         * @return {string} url parameters
         */
        _getMapStateParameters: function (view) {
            var mapStateParams = '';
            if (view && view.state && view.state.mapfull && view.state.mapfull.state) {
                var state = view.state.mapfull.state;
                // Set zoom and location
                mapStateParams += '&zoomLevel=' + state.zoom + '&coord=' + state.east + '_' + state.north;
                // Set layer parameters
                if (state.selectedLayers) {
                    var layerParams = '&mapLayers=';
                    state.selectedLayers.forEach(function (layer) {
                        if (layerParams !== '') {
                            layerParams += ',';
                        }
                        layerParams += layer.id + '+' + layer.opacity;
                        if (layer.style) {
                            layerParams += '+' + layer.style;
                        } else {
                            layerParams += '+';
                        }
                    });
                    mapStateParams += layerParams;
                }
            }
            return mapStateParams;
        },
        /**
         * @method createProjectionChangeDialog
         * Creates Oskari.userinterface.component.Popup for infoing about projection mismatch between map / published view
         *
         * @param function cb - callback to call when clicking ok button
          */
        createProjectionChangeDialog: function (cb) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var btn = dialog.createCloseButton(this.loc('projectionError').ok);
            var cancel = dialog.createCloseButton(this.loc('projectionError').cancel);
            cancel.setHandler(function () {
                dialog.close(true);
            });
            btn.addClass('primary');
            btn.setHandler(function () {
                cb();
                dialog.close(true);
            });
            dialog.show(this.loc('projectionError').title, this.loc('projectionError').msg, [cancel, btn]);
            dialog.makeDraggable();
        },

        deleteView: function (data) {
            var me = this;
            var view = me._getViewById(data.id);
            if (view && !me.popupOpen) {
                me._deleteView(data);
            }
            return false;
        },

        editView: function (data) {
            var me = this;
            var service = me.instance.getViewService();
            var sandbox = me.instance.getSandbox();
            var srs = data.state.mapfull.state.srs;
            var embeddedMapUuid = data.uuid;
            var supported = me._isCurrentProjectionSupportedForView(data);
            if (!supported) {
                me.createProjectionChangeDialog(function () {
                    window.location.href = me.constructUrlWithUuid(srs, embeddedMapUuid, data);
                });
                return false;
            }

            if (!me.popupOpen) {
                var resp = service.isViewLayersLoaded(data, sandbox);
                if (resp.status) {
                    me.editRequestSender(data);
                } else {
                    me._confirmSetState(function () {
                        me.editRequestSender(data);
                    }, resp.msg === 'missing');
                }
                return false;
            }
        },

        setPublished: function (data) {
            var me = this;
            var service = me.instance.getViewService();
            var view = me._getViewById(data.id);
            if (view && !me.popupOpen) {
                var newState = !view.isPublic;
                service.makeViewPublic(
                    data.id,
                    newState,
                    function (isSuccess) {
                        if (isSuccess) {
                            me._refreshViewsList();
                        } else {
                            me._showErrorMessage(
                                me.loc('tabs.publishedmaps.error.makePrivate')
                            );
                        }
                    });
            }
        },

        openMap: function (data) {
            var me = this;
            var url = me.instance.getSandbox().createURL(data.url);
            if (!me.popupOpen) {
                window.open(
                    url,
                    'Published',
                    'location=1,status=1,scrollbars=yes,width=850,height=800'
                );
            }
        },

        showOnMap: function (data) {
            var me = this;
            var srs = data.state.mapfull.state.srs;
            var supported = me._isCurrentProjectionSupportedForView(data);
            if (!supported) {
                me.createProjectionChangeDialog(function () {
                    window.location.href = me.constructUrlWithUuid(srs, null, data);
                });
                return false;
            }

            if (!me.popupOpen) {
                me.setMapState(data, false, function () {
                    me.setMapState(data, true);
                    return false;
                });
                return false;
            }
        },

        editRequestSender: function (data) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var publishMapEditorRequestBuilder = Oskari.requestBuilder(
                'Publisher.PublishMapEditorRequest'
            );
            if (publishMapEditorRequestBuilder) {
                var req = publishMapEditorRequestBuilder(data);
                sandbox.request(me.instance, req);
            }
            var closeFlyoutRequestBuilder = Oskari.requestBuilder(
                'userinterface.UpdateExtensionRequest'
            );
            if (closeFlyoutRequestBuilder) {
                var closeFlyoutRequest = closeFlyoutRequestBuilder(
                    me.instance,
                    'close',
                    me.instance.getName()
                );
                sandbox.request(me.instance.getName(), closeFlyoutRequest);
            }
        },

        setMapState: function (data, forced, confirmCallback) {
            var me = this;
            var service = me.instance.getViewService();
            var sandbox = me.instance.getSandbox();
            var setStateRequestBuilder = Oskari.requestBuilder(
                'StateHandler.SetStateRequest'
            );
            // error handling: check if the layers referenced in view are
            // loaded
            var resp = service.isViewLayersLoaded(data, sandbox);
            if (resp.status || forced === true) {
                if (setStateRequestBuilder) {
                    var req = setStateRequestBuilder(data.state);
                    req.setCurrentViewId(data.id);
                    sandbox.request(me.instance, req);
                    return true;
                }
                return false;
            }
            me._confirmSetState(confirmCallback, resp.msg === 'missing');
            return false;
        },

        showHtml: function (data) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var view = me._getViewById(data.id);
            var url = sandbox.createURL(data.url);
            var size = view.metadata && view.metadata.size ? view.metadata.size : undefined;
            if (!me.popupOpen) {
                me._showIframeCodePopup(url, size, view.name);
            }
        },

        /**
         * @method bindEvents
         * Register tab as eventlistener
         *
         *
         */
        bindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },

        /**
         * @method unbindEvents
         * Unregister tab as eventlistener
         *
         *
         */
        unbindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
        },

        /**
         * @static @property {Object} eventHandlers
         */
        eventHandlers: {
            /**
             * @method Publisher.MapPublishedEvent
             */
            'Publisher.MapPublishedEvent': function (event) {
                this._refreshViewsList();
            }
        },

        /**
         * @method onEvent
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        }
    });
