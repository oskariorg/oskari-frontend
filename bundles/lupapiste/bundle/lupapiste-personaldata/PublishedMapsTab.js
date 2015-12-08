/**
 * @class Oskari.mapframework.bundle.personaldata.PublishedMapsTab
 * Renders the "personal data/published map" tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.PublishedMapsTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
 * instance
 *      reference to component that created the tab
 */
function(instance, localization) {
    this.instance = instance;
    this.template = jQuery('<div class="viewsList volatile"></div>');
    this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
    this.loc = localization;
    this.container = null;
}, {
    /**
     * Returns module name. Needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this)
     *
     * @method getName
     * @return {String}
     */
    getName : function() {
        return 'PersonalData.PublishedMapsTab';
    },
    /**
     * Returns tab title
     *
     * @method getTitle
     * @return {String}
     */
    getTitle : function() {
        return this.loc.title;
    },
    /**
     * Writes the tab content to the given container
     *
     * @method addTabContent
     * @param {jQuery} container reference to a container 
     * where the tab should be added
     */
    addTabContent : function(container) {
        var me = this;
        var content = me.template.clone();
        me.container = container;
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
    _renderViewsList : function(views) {

        if (!views) {
            views = [];
        }
        var me = this;
        var listContainer = me.container.find('.viewsList');
        listContainer.empty();
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
    _refreshViewsList : function() {
        var me = this;
        var service = me.instance.getViewService();
        service.loadViews('PUBLISHED', function(isSuccess, response) {
            if (isSuccess) {
                me._renderViewsList(response.views);
            } else {
                me._showErrorMessage(me.loc['error'].loadfailed);
            }
        });
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
    _getViewById : function(id) {
        for (var i = 0; i < this.viewData.length; ++i) {
            // found what we were looking for
            if (this.viewData[i].id == id) {
                return this.viewData[i];
            }
        }
        // couldn't find view -> show an error
        this._showErrorMessage(me.loc['error'].generic);
    },
    /**
     * Shows a confirmation dialog for opening a problematic view
     *
     * @method _confirmSetState
     * @param {Function} callback function for ok button
     * @param {Boolean} blnMissing, true if we have determined that the layer is no longer available,
     *  false if layer might not be loaded yet.
     * @private
     */
    _confirmSetState : function(cb, blnMissing) {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(this.loc.button['ok']);
        okBtn.addClass('primary');
        
        okBtn.setHandler(function() {
            dialog.close();
            if(cb && blnMissing) {
                cb();
            }
        });
        var cancelBtn = dialog.createCloseButton(this.loc.button.cancel);
        if(blnMissing) {
            dialog.show(me.loc.popup.showErrorTitle, me.loc.popup.showConfirmMissing, [cancelBtn, okBtn]);
        }
        else {
            dialog.show(me.loc.popup.showErrorTitle, me.loc.popup.showConfirmNotLoaded, [cancelBtn]);
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
    _confirmDelete : function(view) {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(this.loc['delete']);
        okBtn.addClass('primary');
        
        var sandbox = this.instance.sandbox;
        okBtn.setHandler(function() {
            me._deleteView(view);
            dialog.close();
        });
        var cancelBtn = dialog.createCloseButton(this.loc.button.cancel);
        dialog.show(me.loc.popup.deletetitle, me.loc.popup.deletemsg, [cancelBtn, okBtn]);
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
    _deleteView : function(view) {
        var me = this;
        var service = me.instance.getViewService();
        service.deleteView(view, function(isSuccess) {
            if(isSuccess) {
                me._refreshViewsList();
            }
            else {
                me._showErrorMessage(me.loc['error'].notdeleted);
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
    _showErrorMessage : function(msg) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        // delete failed
        var button = dialog.createCloseButton(this.loc.button.ok);
        button.addClass('primary');
        dialog.show(this.loc['error'].title, msg, [button]);
    },

    /**
     * Wraps backends views object data array to Oskari.userinterface.component.GridModel
     *
     * @method _getGridModel
     * @param {Object[]} views array of view data objects as returned by backend
     * @return {Oskari.userinterface.component.GridModel} 
     * @private
     */
    _getGridModel : function(views) {

        var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        gridModel.setIdField('id');
        for(var i = 0; i < views.length; ++i) {
            var view = views[i];
            var isPublic = (view.isPublic === true);
            var data = {
                'id': view.id,
                'state' : view.state,
                'name' : view.name,
                'domain' : view.pubDomain,
                'lang' : view.lang,
                'isPublic' : isPublic,
                'show' : this.loc.show,
                'edit' : this.loc.edit,
                'publish' : isPublic ? this.loc.unpublish : this.loc.publish,
                'delete' : this.loc['delete']
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
    _getGrid : function(model) {
        var me = this;
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        var visibleFields = ['name', 'domain', 'publish', 'show', 'edit', 'delete'];
        var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        grid.setDataModel(model);
        grid.setVisibleFields(visibleFields);

        // set up the link from name field
        var nameRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                // FIXME: debugging code - open published map in a new window
                window.open ('/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&published=true&viewId=' + data.id,
                    "Published", "location=1,status=1,scrollbars=yes,width=850,height=800");
                return false;
            });
            return link;
        };
        grid.setColumnValueRenderer('name', nameRenderer);

        var setStateRequestBuilder = sandbox.getRequestBuilder('StateHandler.SetStateRequest');
        var service = instance.getViewService();
        var setMapState = function(data, forced, confirmCallback) {
            // error handling: check if the layers referenced in view are loaded 
            var resp = service.isViewLayersLoaded(data, sandbox);
            if(resp.status || forced === true) {
                if (setStateRequestBuilder) {
                    var req = setStateRequestBuilder(data.state);
                    req.setCurrentViewId(data.id);
                    sandbox.request(instance, req);
                    return true;
                }               
                return false; 
            }
            me._confirmSetState(confirmCallback, resp.msg == 'missing');
            return false;
        };

        // set up the link from name field
        var showRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                setMapState(data, false, function() {
                    setMapState(data, true);
                    return false;
                });
                return false; 
            });
            return link;
        };
        grid.setColumnValueRenderer('show', showRenderer);
        
        var publishMapEditorRequestBuilder = sandbox.getRequestBuilder('Publisher.PublishMapEditorRequest');
        var editRequestSender = function(data) {
            if(publishMapEditorRequestBuilder) {
                var req = publishMapEditorRequestBuilder(data);
                sandbox.request(instance, req);
            }
        }
        
        //sending a request to publisher for editing view
        var editRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                if(setMapState(data, false, function() {
                    setMapState(data, true);
                    editRequestSender(data);
                })) {
                    editRequestSender(data);
                }
                return false; 
            });
            return link;
        };        
        grid.setColumnValueRenderer('edit', editRenderer);

        // set up the link from delete field
        var deleteRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                var view = me._getViewById(data.id);
                if(view) {
                    me._confirmDelete(view);
                }
                return false;
            });
            return link;
        };       
        grid.setColumnValueRenderer('delete', deleteRenderer);

        // set up the link from publish/unpublish field
        var service = instance.getViewService();
        var publishRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.html(name);
            link.bind('click', function() {
                var view = me._getViewById(data.id);
                if(view) {
                    var newState = !view.isPublic;
                    service.makeViewPublic(data.id, newState, function(isSuccess) {
                        if(isSuccess) {
                            view.isPublic = newState;
                            if (view.isPublic) {
                                data.publish = me.loc['unpublish'];
                            } else {
                                data.publish = me.loc['publish'];
                            }
                            link.html(data.publish);
                        }
                        else if(newState) {
                            me._showErrorMessage(me.loc['error'].makePublic);
                        }
                        else {
                            me._showErrorMessage(me.loc['error'].makePrivate);
                        }
                    });
                }
                return false;
            });
            return link;
        };
        grid.setColumnValueRenderer('publish', publishRenderer);
        
        // setup localization
        for(var i=0; i < visibleFields.length; ++i) {
            var key = visibleFields[i];
            var coluiname = 'grid.' + key;
            if (this.loc &&
                this.loc.grid &&
                this.loc.grid[key]) {
                coluiname = this.loc.grid[key];
            }
            grid.setColumnUIName(key, coluiname);
        }
        
        
        return grid;
    },

    /**
     * Register tab as eventlistener
     * 
     * @method bindEvents
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (var p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * Unregister tab as eventlistener
     * @method unbindEvents
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (var p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method Publisher.MapPublishedEvent
         */
        'Publisher.MapPublishedEvent' : function(event) {
            this._refreshViewsList();
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        return handler.apply(this, [event]);

    }
});