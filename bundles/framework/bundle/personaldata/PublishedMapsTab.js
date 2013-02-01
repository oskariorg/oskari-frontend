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
     * @method getName
     * @return {String} name of the component
     * (needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this))
     */
    getName : function() {
        return 'PersonalData.MyViews';
    },
    /**
     * @method getTitle
     * @return {String} title for tab
     */
    getTitle : function() {
        return this.loc.title;
    },
    /**
     * @method addTabContent
     * @param {jQuery} container reference to the content
     * part of the tab
     * Writes the tab content to the given container
     */
    addTabContent : function(container) {
        var me = this;
        var content = me.template.clone();
        me.container = container;
        container.append(content);
        me._refreshViewsList();
    },
    /**
     * @method _renderViewsList
     * Refreshes the tab contents
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
     * @method _refreshViewsList
     * Refreshes the tab contents
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


    getViewById : function(id) {
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
     * @method bindEvents
     * Register tab as eventlistener
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method _confirmDelete
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
     * @method _showEditNotification
     * Shows notification about edit publish map data
     */
    _showEditNotification : function(view) {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(me.loc.popup.edit_title, me.loc.popup.editmsg);
        dialog.fadeout();
    },

    /**
     * @method _deleteView
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
     * @method _showErrorMessage
     */
    _showErrorMessage : function(msg) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        // delete failed
        var button = dialog.createCloseButton(this.loc.button.ok);
        button.addClass('primary');
        dialog.show(this.loc['error'].title, msg, [button]);
    },
    /**
     * @method unbindEvents
     * Unregister tab as eventlistener
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.unregisterForEventByName(this, p);
        }
    },

    /**
     * @method _getGridModel
     * Wraps views to Oskari.userinterface.component.GridModel
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
     * @method _getGrid
     * Creates Oskari.userinterface.component.Grid and populates it with given model
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

        var setMapState = function(data) {
            var rb = sandbox.getRequestBuilder('StateHandler.SetStateRequest');
            if (rb) {
                var req = rb(data.state);
                req.setCurrentViewId(data.id);
                sandbox.request(instance, req);
            }
            return false;
        };

        // set up the link from name field
        var showRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                setMapState(data);
            });
            return link;
        };
        grid.setColumnValueRenderer('show', showRenderer);

        //sending a request to map publish mode
        var editRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                setMapState(data);
                var rb = sandbox.getRequestBuilder('Publisher.PublishMapEditorRequest');
                if(rb) {
                    var req = rb(data);
                    me._showEditNotification(req);
                    sandbox.request(instance, req);
                }
                return false; 
            });
            return link;
        };        
        grid.setColumnValueRenderer('edit', editRenderer);

        // set up the link from show field
        var deleteRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                var view = me.getViewById(data.id);
                if(view) {
                    me._confirmDelete(view);
                }
                return false;
            });
            return link;
        };       
        grid.setColumnValueRenderer('delete', deleteRenderer);

        // set up the link from delete field
        var service = instance.getViewService();
        var publishRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.html(name);
            link.bind('click', function() {
                var view = me.getViewById(data.id);
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