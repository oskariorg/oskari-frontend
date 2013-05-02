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
 * 		reference to component that created the tab
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
    this.template = jQuery('<div class="viewsList volatile"></div>');
    this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
    this.templateDesc = jQuery('<div class="oskarifield"><label for="description"></label>' +
            '<textarea id="view_description" name="description" placeholder="' + this.loc.popup.description_placeholder + '"></textarea></div>')
    this.container = null;
    
    var sandbox = instance.sandbox;
    var me = this;
    // add save view button to toolbar if we get the statehandler request
    var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
    if (rbState) {
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        var tbstt = 'localization.button.toolbarsave';
        if (localization && 
            localization.button && 
            localization.button.toolbarsave) {
            tbstt = localization.button.toolbarsave;
        }
        sandbox.request(instance, reqBuilder('save_view', 'viewtools', {
            iconCls : 'tool-save-view',
            tooltip: tbstt,
            sticky: false,
            prepend: true,
            callback : function() {
				me._promptForView(function(name, description) {
				    var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
				    sandbox.request(instance, rbState(name, description));	
				});
            }
        }));
    }
    // disable button for non logged in users
    if(!sandbox.getUser().isLoggedIn()) {
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
        sandbox.request(instance, reqBuilder('save_view', 'viewtools', false));
    }
}, {
    /**
     * Returns module name. Needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this)
     *
     * @method getName
     * @return {String}
     */
    getName : function() {
        return 'PersonalData.MyViews';
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
        service.loadViews('USER', function(isSuccess, response) {
            if (isSuccess) {
                me._renderViewsList(response.views);
            } else {
                me._showErrorMessage(me.loc['error'].loadfailed);
            }
        });
    },

    /**
     * Prompts for view name and calls backend 
     *
     * @method _editView
     * @private
     */
    _editView : function(view) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var service = me.instance.getViewService();
        
        var successCallback = function(newName, newDescription) {
            service.updateView(view.id, newName, newDescription, function(isSuccess) {
                if(isSuccess) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(me.loc['popup'].title, me.loc['save'].success);
                    dialog.fadeout();
                    me._refreshViewsList();
                }
                else {
                    me._showErrorMessage(me.loc['error'].notsaved);
                }
            })
        };

        this._promptForView(successCallback, view.name, view.description);
    },

    /**
     * Prompts the user for view name/description
     * 
     * @method _promptForView
     * @param {Function} successCallback function to call when user has given valid name/description and clicks ok button
     * @param {String} viewName to prepopulate form (optional)
     * @param {String} viewDescription to prepopulate form (optional)
     * @private
     */
    _promptForView : function(successCallback,viewName,viewDescription) {
        var me = this;
        
        var form = Oskari.clazz.create('Oskari.userinterface.component.Form');
        var nameInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'name');
        nameInput.setPlaceholder(this.loc.popup.name_placeholder);
        var title = this.loc.popup.title;
        if(viewName) {
            title = this.loc.popup.edit;
            nameInput.setValue(viewName);
        }
        nameInput.setRequired(true, me.loc.save.error_noname);
        nameInput.setContentCheck(true, me.loc.save.error_illegalchars);
        form.addField(nameInput);

        var template = form.getForm();
        template.append(me.templateDesc.clone());
        
        if(viewDescription) {
            template.find("textarea").val(viewDescription); 
        }

        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(this.loc.button.save);
        okBtn.addClass('primary');
        
        var sandbox = this.instance.sandbox;
        okBtn.setHandler(function() {
            var errors = form.validate();
            if (errors.length == 0) {
                successCallback(nameInput.getValue(), template.find("textarea").val());
                dialog.close();
            } else {
                form.showErrors();
            }
        });
        var cancelBtn = dialog.createCloseButton(this.loc.button.cancel);
        dialog.show(title, template, [cancelBtn, okBtn]);
        // we dont want key events to bubble up...
        dialog.dialog.on("keyup", function(e) {
            e.stopPropagation();
        });
        dialog.dialog.on("keydown", function(e) {
            e.stopPropagation();
        });
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
                'description' : view.description,
                'isPublic' : isPublic,
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
        var visibleFields = ['name', 'description', /*'publish',*/ 'edit', 'delete'];
        var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        grid.setDataModel(model);
        grid.setVisibleFields(visibleFields);
        // set up the link from name field
        var nameRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                var rb = sandbox.getRequestBuilder('StateHandler.SetStateRequest');
                if (rb) {
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
        var editRenderer = function(name, data) {
            var link = me.templateLink.clone();
            link.append(name);
            link.bind('click', function() {
                var view = me._getViewById(data.id);
                if(view) {
                    me._editView(view);
                }
                return false;
            });
            return link;
        };
        grid.setColumnValueRenderer('edit', editRenderer);
        // set up the link from edit field
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
        
        // set up the link from edit field
        /*
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
            });
            return link;
        };
        grid.setColumnValueRenderer('publish', publishRenderer);
        */
        
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
     * Register tab as eventlistener
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
         * @method StateSavedEvent
         */
        'StateSavedEvent' : function(event) {
        	if(event.isError()) {
        		// save failed
        		this._showErrorMessage(this.loc['error'].notsaved);
        		return;
        	}
        	
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	    	dialog.show(this.loc['popup'].title, this.loc['save'].success);
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
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        return handler.apply(this, [event]);

    }
});
