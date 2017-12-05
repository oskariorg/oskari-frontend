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
            var me = this,
                content = me.template.clone();
            me.container = container;
            container.append(content);
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
            var me = this,
                listContainer = me.container.find('.viewsList');
            listContainer.empty();
            this.viewData = views;
            var model = this._getGridModel(views),
                grid = this._getGrid(model);
            grid.renderTo(listContainer);
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
         * Shows a confirmation dialog on deleting a view
         *
         * @method _confirmDelete
         * @param {Object} view data object for the view to delete
         * @private
         */
        _confirmDelete: function (view) {
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                sandbox = me.instance.sandbox;

            okBtn.setTitle(me.loc('tabs.publishedmaps.delete'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                me._deleteView(view);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(me.loc('tabs.publishedmaps.button.cancel'));
            dialog.onClose(function () {
                me.popupOpen = false;
            });
            dialog.show(
                me.loc('tabs.publishedmaps.popup.deletetitle'),
                me.loc('tabs.publishedmaps.popup.deletemsg', {name: view.name}),
                [cancelBtn, okBtn]
            );
            me.popupOpen = true;
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

        /**
         * @private @method _getGridModel
         * Wraps backends views object data array to
         * Oskari.userinterface.component.GridModel
         *
         * @param {Object[]} views
         * Array of view data objects as returned by backend
         *
         * @return {Oskari.userinterface.component.GridModel}
         */
        _getGridModel: function (views) {
            var gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel'
                ),
                i,
                view,
                isPublic,
                data;
            gridModel.setIdField('id');
            for (i = 0; i < views.length; i += 1) {
                view = views[i];
                isPublic = (view.isPublic === true);
                data = {
                    'id': view.id,
                    'uuid': view.uuid,
                    'state': view.state,
                    'name': Oskari.util.sanitize(view.name),
                    'url': view.url,
                    'domain': view.pubDomain,
                    'lang': view.lang,
                    'isPublic': isPublic,
                    'show': this.loc('tabs.publishedmaps.show'),
                    'html': this.loc('tabs.publishedmaps.getHTML'),
                    'edit': this.loc('tabs.publishedmaps.edit'),
                    'publish': isPublic ? this.loc('tabs.publishedmaps.unpublish') : this.loc('tabs.publishedmaps.publish'),
                    'delete': this.loc('tabs.publishedmaps.delete')
                };
                gridModel.addData(data);
            }
            return gridModel;
        },

        /**
         * @private @method _getGrid
         * Creates Oskari.userinterface.component.Grid and populates it with
         * given model
         *
         * @param {Oskari.userinterface.component.GridModel}
         * Model to populate the grid with
         *
         * @return {Oskari.userinterface.component.Grid}
         */
        _getGrid: function (model) {
            var me = this,
                instance = this.instance,
                sandbox = instance.getSandbox(),
                visibleFields = [
                    'name',
                    'domain',
                    'publish',
                    'show',
                    'html',
                    'edit',
                    'delete'
                ],
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'
                );
            grid.setDataModel(model);
            grid.setVisibleFields(visibleFields);

            // set up the link from name field
            var nameRenderer = function (name, data) {
                var url = sandbox.createURL(data.url);
                if(!url) {
                    // no url, no link just plain text
                    return name;
                }
                // create link
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        window.open(
                            url,
                            'Published',
                            'location=1,status=1,scrollbars=yes,width=850,height=800'
                        );
                        return false;
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('name', nameRenderer);

            var service = instance.getViewService();
            var setMapState = function (data, forced, confirmCallback) {
                var setStateRequestBuilder = sandbox.getRequestBuilder(
                    'StateHandler.SetStateRequest'
                );
                // error handling: check if the layers referenced in view are
                // loaded
                var resp = service.isViewLayersLoaded(data, sandbox);
                if (resp.status || forced === true) {
                    if (setStateRequestBuilder) {
                        var req = setStateRequestBuilder(data.state);
                        req.setCurrentViewId(data.id);
                        sandbox.request(instance, req);
                        return true;
                    }
                    return false;
                }
                me._confirmSetState(confirmCallback, resp.msg === 'missing');
                return false;
            };

            // set up the link from name field
            var showRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        setMapState(data, false, function () {
                            setMapState(data, true);
                            return false;
                        });
                        return false;
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('show', showRenderer);

            var editRequestSender = function (data) {
                var publishMapEditorRequestBuilder = sandbox.getRequestBuilder(
                    'Publisher.PublishMapEditorRequest'
                );
                if (publishMapEditorRequestBuilder) {
                    var req = publishMapEditorRequestBuilder(data);
                    sandbox.request(instance, req);
                }
                var closeFlyoutRequestBuilder = sandbox.getRequestBuilder(
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
            };

            // show a popup with the iframe code of the embedded map
            var htmlRenderer = function (name, data) {
                var url = sandbox.createURL(data.url);
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    var view = me._getViewById(data.id),
                        size = view.metadata && view.metadata.size ? view.metadata.size : undefined;
                    if (!me.popupOpen) {
                        me._showIframeCodePopup(url, size, view.name);
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('html', htmlRenderer);

            //sending a request to publisher for editing view
            var editRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        var resp = service.isViewLayersLoaded(data, sandbox);
                        if (resp.status) {
                            editRequestSender(data);
                        } else {
                            me._confirmSetState(function() {
                                editRequestSender(data);
                            }, resp.msg === 'missing');
                        }
                        return false;
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('edit', editRenderer);

            // set up the link from delete field
            var deleteRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
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

            // set up the link from publish/unpublish field
            service = instance.getViewService();
            var publishRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    var view = me._getViewById(data.id);
                    if (view && !me.popupOpen) {
                        var newState = !view.isPublic;
                        service.makeViewPublic(
                            data.id,
                            newState,
                            function (isSuccess) {
                                if (isSuccess) {
                                    view.isPublic = newState;
                                    if (view.isPublic) {
                                        data.publish = me.loc('tabs.publishedmaps.unpublish');
                                    } else {
                                        data.publish = me.loc('tabs.publishedmaps.publish');
                                    }
                                    link.html(data.publish);
                                } else if (newState) {
                                    me._showErrorMessage(
                                        me.loc('tabs.publishedmaps.error.makePublic')
                                    );
                                } else {
                                    me._showErrorMessage(
                                        me.loc('tabs.publishedmaps.error.makePrivate')
                                    );
                                }
                            });
                    }
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('publish', publishRenderer);

            // setup localization
            var i,
                key,
                path,
                coluiname;

            for (i = 0; i < visibleFields.length; ++i) {
                key = visibleFields[i];
                path = 'tabs.publishedmaps.grid.' + key;
                coluiname = this.loc(path);
                grid.setColumnUIName(key, coluiname || path);
            }

            return grid;
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
        },

        /**
         * @private @method _showIframeCodePopup
         * Shows a popup with the given url in a textarea
         *
         * @param {String} url
         * @param size
         * @param {String} name
         *
         */
        _showIframeCodePopup: function (url, size, name) {
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = dialog.createCloseButton(this.loc('tabs.publishedmaps.button.ok')),
                iframeCode,
                textarea,
                content,
                width = size ? size.width + 'px' : '100%',
                height = size ? size.height + 'px' : '100%';

            okBtn.addClass('primary');

            iframeCode = '<iframe src="' + url + '" style="border: none;';
            if (width !== null && width !== undefined) {
                iframeCode += ' width: ' + width + ';';
            }
            if (height !== null && height !== undefined) {
                iframeCode += ' height: ' + height + ';';
            }
            iframeCode += '"></iframe>';
            textarea =
                '<textarea rows="3" cols="77">' +
                iframeCode +
                '</textarea>';
            content = this.loc('tabs.publishedmaps.published.desc') + '<br/>' + textarea;

            dialog.makeModal();
            dialog.stopKeydownPropagation();
            dialog.show(name, content, [okBtn]);
            me.popupOpen = true;
            dialog.onClose(function () {
                me.popupOpen = false;
            });
        }
    });
