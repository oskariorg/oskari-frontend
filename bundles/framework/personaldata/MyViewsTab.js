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

        var sandbox = instance.sandbox,
            me = this;
        // add save view button to toolbar if we get the statehandler request
        var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest'),
            reqBuilder;
        if (rbState) {
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            sandbox.request(instance, reqBuilder('save_view', 'viewtools', {
                iconCls: 'tool-save-view',
                tooltip: this.loc('tabs.myviews.button.toolbarsave') || '',
                sticky: false,
                // disable button for non logged in users
                enabled : Oskari.user().isLoggedIn(),
                prepend: true,
                callback: function () {
                    me._promptForView(function (name, description, isDefault) {
                        var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
                        sandbox.request(instance, rbState(name, description, isDefault));
                    });
                }
            }));
        }
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

            var sandbox = this.instance.sandbox;
            okBtn.setHandler(function () {
                me._promptForView(function (name, description, isDefault) {
                    var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
                    sandbox.request(me.instance, rbState(name, description, isDefault));
                });
            });

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

            views.forEach(function(view) {
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
         * Prompts for view name and calls backend
         *
         * @method _editView
         * @private
         */
        _editView: function (view) {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var service = me.instance.getViewService();

            var successCallback = function (newName, newDescription, newDefault) {
                service.updateView(view.id, newName, newDescription, newDefault, function (isSuccess) {
                    me._editViewSuccessNotify(isSuccess);
                });
            };

            this._promptForView(successCallback, view.name, view.description, view.isDefault);
        },
        /**
         * Called after receiving a response from backend after editing the view. Notifies user of success or failure.
         *
         * @method _editViewSuccessNotify
         * @private
         */
        _editViewSuccessNotify: function(isSuccess) {
            if (isSuccess) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(this.loc('tabs.myviews.popup.title'), this.loc('tabs.myviews.save.success'));
                dialog.fadeout();
                this._refreshViewsList();
            } else {
                this._showErrorMessage(this.loc('tabs.myviews.error.notsaved'));
            }
        },

        /**
         * Prompts the user for view name/description
         *
         * @method _promptForView
         * @param {Function} successCallback function to call when user has given valid name/description and clicks ok button
         * @param {String} viewName to prepopulate form (optional)
         * @param {String} viewDescription to prepopulate form (optional)
         * @param {bool} isDefault to prepopulate form (optional)
         * @private
         */
        _promptForView: function (successCallback, viewName, viewDescription, isDefault) {
            var me = this;

            if (me.dialog) {
                return;
            }

            var form = Oskari.clazz.create('Oskari.userinterface.component.Form');
            var nameInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'name');
            nameInput.setPlaceholder(this.loc('tabs.myviews.popup.name_placeholder'));
            var title = this.loc('tabs.myviews.popup.title');
            if (viewName) {
                title = this.loc('tabs.myviews.popup.edit');
                nameInput.setValue(viewName);
            }
            nameInput.setRequired(true, me.loc('tabs.myviews.save.error_noname'));
            nameInput.setContentCheck(true, me.loc('tabs.myviews.save.error_illegalchars'));
            form.addField(nameInput);

            var template = form.getForm();
            template.append(me.templateDesc.clone());

            if (viewDescription) {
                template.find('textarea').val(viewDescription);
            }

            var defaultViewTemplate = me.templateDefaultView.clone();
            defaultViewTemplate.find('label').html(me.loc('tabs.myviews.popup.default'));
            isDefault = isDefault ? isDefault : false;
            defaultViewTemplate.find("#defaultview").prop('checked', isDefault);
            template.append(defaultViewTemplate);

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('tabs.myviews.button.save'));
            okBtn.addClass('primary');

            var sandbox = this.instance.sandbox;
            okBtn.setHandler(function () {
                var errors = form.validate();
                if (errors.length === 0) {
                    successCallback(nameInput.getValue(), template.find('textarea').val(), template.find("#defaultview").prop('checked'));
                    dialog.close();
                    me.dialog = null;
                } else {
                    form.showErrors();
                }
            });
            var cancelBtn = dialog.createCloseButton(this.loc('tabs.myviews.button.cancel'));
            cancelBtn.setHandler(function() {
                dialog.close(true);
                me.dialog = null;
            });
            dialog.onClose(function () {
                me.popupOpen = false;
            });
            dialog.show(title, template, [cancelBtn, okBtn]);
            me.popupOpen = true;
            // we dont want key events to bubble up...
            dialog.dialog.on('keyup', function (e) {
                e.stopPropagation();
            });
            dialog.dialog.on('keydown', function (e) {
                e.stopPropagation();
            });

            me.dialog = dialog;
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
                data;
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
            var visibleFields = ['default','name', 'description', /*'publish',*/ 'edit', 'delete'];
            var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            grid.setDataModel(model);
            grid.setVisibleFields(visibleFields);

            // set up the link from edit field
            var defaultViewRenderer = function (name, data) {
                var input = me.templateDefaultGridView.clone();
                input.prop('checked',data.isDefault);
                input.bind('click', function () {
                    var view = me._getViewById(data.id);
                    var service = me.instance.getViewService();

                    if (!view) {
                        return;
                    }

                    var wasChecked = this.checked;
                    var checkboxes = jQuery(grid.table).find('input[name=isDefault]');
                    _.each(checkboxes, function(checkbox) {
                        //uncheck other checkboxes,
                        //disable all isDefault checkboxes
                       checkbox.checked = false;
                       checkbox.disabled = 'disabled';
                    });
                    this.checked = wasChecked;
                    //start spinner
                    me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest',[true]);
                    service.updateView(view.id, view.name, view.description, this.checked, function (isSuccess) {
                        me.instance.sandbox.postRequestByName('ShowProgressSpinnerRequest',[false]);
                        me._editViewSuccessNotify(isSuccess);
                    });
                });
                return input;
            };
            grid.setColumnValueRenderer('default', defaultViewRenderer);



            // set up the link from name field
            var nameRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.append(name);
                link.bind('click', function () {
                    var view = me._getViewById(data.id);
                    if(view.srsName !== sandbox.getMap().getSrsName()) {
                        window.location.href = view.url;
                        return;
                    }
                    var rb = sandbox.getRequestBuilder('StateHandler.SetStateRequest');
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
                link.bind('click', function () {
                    var view = me._getViewById(data.id);
                    if (view && !me.popupOpen) {
                        me._editView(view);
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
                link.bind('click', function () {
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
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('tabs.myviews.delete'));
            okBtn.addClass('primary');

            var sandbox = this.instance.sandbox;
            okBtn.setHandler(function () {
                me._deleteView(view);
                dialog.close();
            });
            dialog.onClose(function () {
                me.popupOpen = false;
            });
            var cancelBtn = dialog.createCloseButton(this.loc('tabs.myviews.button.cancel'));
            dialog.show(me.loc('tabs.myviews.popup.deletetitle'), me.loc('tabs.myviews.popup.deletemsg', {name: view.name}), [cancelBtn, okBtn]);
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
            var me = this,
                service = me.instance.getViewService();
            service.deleteView(view, function (isSuccess) {
                if (isSuccess) {
                    me._refreshViewsList();
                } else {
                    me._showErrorMessage(me.loc('tabs.myviews.error.notdeleted'));
                }
            });
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
            'StateSavedEvent': function (event) {
                if (event.isError()) {
                    // save failed
                    this._showErrorMessage(this.loc('tabs.myviews.error.notsaved'));
                    return;
                }

                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(this.loc('tabs.myviews.popup.title'), this.loc('tabs.myviews.save.success'));
                dialog.fadeout();
                // reload views on success
                this._refreshViewsList();
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
