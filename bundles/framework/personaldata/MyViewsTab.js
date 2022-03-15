import React from 'react';
import ReactDOM from 'react-dom';
import { showViewForm } from './view/ViewForm/ViewForm';
import { Messaging } from 'oskari-ui/util';
import { MyViewsList } from './MyViewsList';

/**
 * @class Oskari.mapframework.bundle.personaldata.MyViewsTab
 * Renders the "personal data/my views" tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.MyViewsTab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
     * instance
     *      reference to component that created the tab
     */

    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'PersonalData');
        this.container = null;
        this.popupControls = null;
        this.popupCleanup = () => {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        };
        this.registerTool();
    }, {
        /**
         * Returns module name. Needed because we fake to be module for listening to
         * events (getName and onEvent methods are needed for this)
         *
         * @method getName
         * @return {String}
         */
        getName: function () {
            return 'PersonalData.MyViews';
        },
        /**
         * Returns tab title
         *
         * @method getTitle
         * @return {String}
         */
        getTitle: function () {
            return this.loc('tabs.myviews.title');
        },
        registerTool: function () {
            if (!Oskari.requestBuilder('StateHandler.SaveStateRequest')) {
                return;
            }
            const loggedIn = Oskari.user().isLoggedIn();
            const tool = {
                iconCls: 'tool-save-view',
                sticky: false,
                disabled: !loggedIn,
                tooltip: this.loc('tabs.myviews.button.toolbarsave'),
                prepend: true,
                callback: () => {
                    if (loggedIn) {
                        this._promptForView();
                    }
                }
            };
            this.instance.getSandbox().postRequestByName('Toolbar.AddToolButtonRequest', ['save_view', 'viewtools', tool]);
        },
        /**
         * Writes the tab content to the given container
         *
         * @method addTabContent
         * @param {jQuery} container reference to a container
         * where the tab should be added
         */
        addTabContent: function (container) {
            var me = this;
            me.container = container;
            me._refreshViewsList();
        },
        /**
         * Renders given views list. Removes previous listing.
         *
         * @method _renderViewsList
         * @param {Object[]} views object array as returned by backend service
         * @private
         */
        _renderViewsList: function (views) {
            if (!views) {
                views = [];
            }
            var me = this;

            views.forEach(function (view) {
                view.name = Oskari.util.sanitize(view.name);
                view.description = Oskari.util.sanitize(view.description);
            });

            this.viewData = views;
            ReactDOM.render(
                <MyViewsList
                    data={views}
                    openView={(item) => me.openView(item)}
                    setDefault={(item) => me.setDefaultView(item)}
                    handleEdit={(item) => me.editView(item)}
                    handleDelete={(item) => me.deleteView(item)}
                    saveCurrent={() => me.saveCurrent()}
                />
                ,
                me.container
            );
        },

        /**
         * Fetches views from backend and renders the response.
         * Shows an error message on failure
         *
         * @method _refreshViewsList
         * @private
         */
        _refreshViewsList: function () {
            var me = this;
            var service = me.instance.getViewService();
            service.loadViews('USER', function (isSuccess, response) {
                if (isSuccess) {
                    me._renderViewsList(response.views);
                } else {
                    me._showErrorMessage(me.loc('tabs.myviews.error.loadfailed'));
                }
            });
        },
        /**
         * Called after receiving a response from backend after adding/editing the view. Notifies user of success or failure.
         *
         * @method _handleSaveViewResponse
         * @private
         */
        _handleSaveViewResponse: function (isSuccess) {
            if (isSuccess) {
                Messaging.success(this.loc('tabs.myviews.save.success'));
                this._refreshViewsList();
            } else {
                Messaging.error(this.loc('tabs.myviews.error.notsaved'));
            }
            this.popupCleanup();
        },

        /**
         * Prompts the user for view name/description
         *
         * @method _promptForView
         * @param {Object} view function to call when user has given valid name/description and clicks ok button
         * @param {String} viewName to prepopulate form (optional)
         * @private
         */
        _promptForView: function (view) {
            const { id } = view || {};
            if (this.popupControls) {
                if (this.popupControls.id === id) {
                    this.popupControls.bringToTop();
                    return;
                }
                this.popupCleanup();
            }
            const editCb = success => this._handleSaveViewResponse(success);
            const onSave = values => this.instance.getSandbox().postRequestByName('StateHandler.SaveStateRequest', [values.name, values.description, values.isDefault]);
            const onEdit = values => this.instance.getViewService().updateView(id, values.name, values.description, values.isDefault, editCb);
            const onOk = id ? onEdit : onSave;
            // create popup
            this.popupControls = showViewForm(view, onOk, this.popupCleanup);
        },

        /**
         * Finds view object matching given id.
         * Shows an error message if no matches found.
         *
         * @method _getViewById
         * @param {Number} id view id
         * @return {Object} matching view object or undefined if not found
         * @private
         */
        _getViewById: function (id) {
            var i;
            for (i = 0; i < this.viewData.length; ++i) {
                // found what we were looking for
                // FIXME find out if these are always the same type and remove + ''
                if (this.viewData[i].id + '' === id + '') {
                    return this.viewData[i];
                }
            }
            // couldn't find view -> show an error
            this._showErrorMessage(this.loc('tabs.myviews.error.generic'));
        },
        /**
         * Calls backend to delete the given view. Reloads the view listing on success and
         * shows an error message on fail
         *
         * @method _deleteView
         * @param {Object} view data object
         * @private
         */
        deleteView: function (view) {
            var me = this;
            var service = me.instance.getViewService();
            service.deleteView(view, function (isSuccess) {
                if (isSuccess) {
                    if (Oskari.app.getUuid() === view.uuid) {
                        // Deleting the current map view. Load default view but don't lose user's layers.
                        window.location.href = me._getDefaultViewUrlWithCurrentMapParams(view.srsName);
                    } else {
                        me._refreshViewsList();
                    }
                } else {
                    me._showErrorMessage(me.loc('tabs.myviews.error.notdeleted'));
                }
            });
        },
        editView: function (data) {
            var me = this;
            var view = me._getViewById(data.id);
            if (view) {
                me._promptForView(view);
            }
        },
        setDefaultView: function (data) {
            var me = this;
            var view = me._getViewById(data.id);
            var service = me.instance.getViewService();

            if (!view) {
                return;
            }

            // start spinner
            me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest', [true]);
            service.updateView(view.id, view.name, view.description, !data.isDefault, function (isSuccess) {
                me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
                me._handleSaveViewResponse(isSuccess);
            });
        },
        openView: function (data) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var view = me._getViewById(data.id);
            if (view.srsName !== sandbox.getMap().getSrsName()) {
                window.location.href = view.url;
                return;
            }
            var rb = Oskari.requestBuilder('StateHandler.SetStateRequest');
            if (rb && !me.popupOpen) {
                var req = rb(data.state);
                req.setCurrentViewId(data.id);
                sandbox.request(me.instance, req);
            }
        },
        saveCurrent: function () {
            this._promptForView();
        },
        /**
         * To get url for system's default view and maintaining user's layers and location.
         *
         * @method _getDefaultViewUrlWithCurrentMapParams
         * @param {string} srsName EPSG code to specify which default view should be loaded.
         * @private
         *
         * @return {string} url
         */
        _getDefaultViewUrlWithCurrentMapParams: function (srsName) {
            var sandbox = this.instance.getSandbox();
            var uuid;
            var defaultViews = Oskari.app.getSystemDefaultViews();
            defaultViews.forEach(function (defaultView) {
                if (defaultView.srsName === srsName) {
                    uuid = defaultView.uuid;
                }
            });
            var url = sandbox.createURL('/?uuid=' + uuid, true);
            url += sandbox.generateMapLinkParameters();
            return url;
        },
        /**
         * Shows an error dialog to the user with given message
         *
         * @method _showErrorMessage
         * @param {String} msg message to show on popup
         * @private
         */
        _showErrorMessage: function (msg) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            // delete failed
            var button = dialog.createCloseButton(this.loc('tabs.myviews.button.ok'));
            button.addClass('primary');
            dialog.show(this.loc('tabs.myviews.error.title'), msg, [button]);
        },

        /**
         * Register tab as eventlistener
         * @method bindEvents
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
         * Unregister tab as eventlistener
         * @method unbindEvents
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
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method StateSavedEvent
             */
            StateSavedEvent: function (event) {
                this._handleSaveViewResponse(!event.isError());
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        }
    });
