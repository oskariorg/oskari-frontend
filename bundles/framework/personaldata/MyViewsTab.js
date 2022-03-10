import { showViewForm } from './view/ViewForm/ViewForm';
import { Messaging } from 'oskari-ui/util';

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
        this.template = jQuery('<div class="viewsList volatile"></div>');
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
        this.templateDefaultGridView = jQuery('<input type="checkbox" name="isDefault"/>');
        this.templateDesc = jQuery('<div class="oskarifield"><label for="description"></label>' +
            '<textarea id="view_description" name="description" placeholder="' + this.loc('tabs.myviews.popup.description_placeholder') + '"></textarea></div>');
        this.templateDefaultView = jQuery('<div class="oskarifield"><input type="checkbox" id="defaultview"/><label for="defaultview"></label></div>');
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
            var content = me.template.clone();
            me.container = container;

            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('tabs.myviews.button.saveCurrent'));
            okBtn.addClass('primary');

            var okBtnContainer = jQuery("<div class='myViewsTabButtonContainer'/>");

            okBtn.setHandler(() => this._promptForView());

            okBtn.insertTo(okBtnContainer);
            container.append(okBtnContainer);

            container.append(content);
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
            var listContainer = me.container.find('.viewsList');
            listContainer.empty();

            views.forEach(function (view) {
                view.name = Oskari.util.sanitize(view.name);
                view.description = Oskari.util.sanitize(view.description);
            });

            this.viewData = views;

            var model = this._getGridModel(views);
            var grid = this._getGrid(model);

            grid.renderTo(listContainer);
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
         * Wraps backends views object data array to Oskari.userinterface.component.GridModel
         *
         * @method _getGridModel
         * @param {Object[]} views array of view data objects as returned by backend
         * @return {Oskari.userinterface.component.GridModel}
         * @private
         */
        _getGridModel: function (views) {
            var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel'),
                i,
                view,
                isPublic,
                data,
                isDefault;
            gridModel.setIdField('id');
            for (i = 0; i < views.length; ++i) {
                view = views[i];
                isPublic = (view.isPublic === true);
                isDefault = view.isDefault;
                data = {
                    'id': view.id,
                    'state': view.state,
                    'name': view.name,
                    'description': view.description,
                    'isPublic': isPublic,
                    'isDefault': isDefault,
                    'edit': this.loc('tabs.myviews.edit'),
                    'publish': isPublic ? this.loc('tabs.myviews.unpublish') : this.loc('tabs.myviews.publish'),
                    'delete': this.loc('tabs.myviews.delete'),
                    'default': this.loc('tabs.myviews.default')
                };
                gridModel.addData(data);
            }
            return gridModel;
        },
        /**
         * Creates Oskari.userinterface.component.Grid and populates it with given model
         *
         * @method _getGrid
         * @param {Oskari.userinterface.component.GridModel} model to populate the grid with
         * @return {Oskari.userinterface.component.Grid}
         * @private
         */
        _getGrid: function (model) {
            var me = this;
            var instance = this.instance;
            var sandbox = instance.getSandbox();
            var visibleFields = ['default', 'name', 'description', /* 'publish', */ 'edit', 'delete'];
            var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            grid.setDataModel(model);
            grid.setVisibleFields(visibleFields);

            // set up the link from edit field
            var defaultViewRenderer = function (name, data) {
                var input = me.templateDefaultGridView.clone();
                input.prop('checked', data.isDefault);
                input.on('click', function () {
                    var view = me._getViewById(data.id);
                    var service = me.instance.getViewService();

                    if (!view) {
                        return;
                    }

                    var wasChecked = this.checked;
                    var checkboxes = jQuery(grid.table).find('input[name=isDefault]');
                    _.each(checkboxes, function (checkbox) {
                        // uncheck other checkboxes,
                        // disable all isDefault checkboxes
                        checkbox.checked = false;
                        checkbox.disabled = 'disabled';
                    });
                    this.checked = wasChecked;
                    // start spinner
                    me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest', [true]);
                    service.updateView(view.id, view.name, view.description, this.checked, function (isSuccess) {
                        me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
                        me._handleSaveViewResponse(isSuccess);
                    });
                });
                return input;
            };
            grid.setColumnValueRenderer('default', defaultViewRenderer);

            // set up the link from name field
            var nameRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.append(name);
                link.on('click', function () {
                    var view = me._getViewById(data.id);
                    if (view.srsName !== sandbox.getMap().getSrsName()) {
                        window.location.href = view.url;
                        return;
                    }
                    var rb = Oskari.requestBuilder('StateHandler.SetStateRequest');
                    if (rb && !me.popupOpen) {
                        var req = rb(data.state);
                        req.setCurrentViewId(data.id);
                        sandbox.request(instance, req);
                    }
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('name', nameRenderer);
            // set up the link from edit field
            var editRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.append(name);
                link.on('click', function () {
                    var view = me._getViewById(data.id);
                    if (view) {
                        me._promptForView(view);
                    }
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('edit', editRenderer);
            // set up the link from edit field
            var deleteRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.append(name);
                link.on('click', function () {
                    var view = me._getViewById(data.id);
                    if (view && !me.popupOpen) {
                        me._confirmDelete(view);
                    }
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('delete', deleteRenderer);

            var i,
                key,
                path,
                coluiname;
            // setup localization
            for (i = 0; i < visibleFields.length; ++i) {
                key = visibleFields[i];
                path = 'tabs.myviews.grid.' + key;
                coluiname = this.loc(path);
                grid.setColumnUIName(key, coluiname || path);
            }

            return grid;
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
         * Shows a confirmation dialog on deleting a view
         *
         * @method _confirmDelete
         * @param {Object} view data object for the view to delete
         * @private
         */
        _confirmDelete: function (view) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('tabs.myviews.delete'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                me._deleteView(view);
                dialog.close();
            });
            dialog.onClose(function () {
                me.popupOpen = false;
            });
            var cancelBtn = dialog.createCloseButton(this.loc('tabs.myviews.button.cancel'));
            dialog.show(me.loc('tabs.myviews.popup.deletetitle'), me.loc('tabs.myviews.popup.deletemsg', { name: view.name }), [cancelBtn, okBtn]);
            me.popupOpen = true;
            dialog.makeModal();
        },
        /**
         * Calls backend to delete the given view. Reloads the view listing on success and
         * shows an error message on fail
         *
         * @method _deleteView
         * @param {Object} view data object
         * @private
         */
        _deleteView: function (view) {
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
