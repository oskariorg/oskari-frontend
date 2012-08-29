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
    this.template = jQuery('<div class="viewsList volatile"></div>');
    this.templateViewRow = jQuery('<div class="view">' + '<div class="name"><a href="JavaScript:void(0);">' + '</a></div></div>');
    this.templateViewTools = jQuery('<div class="tools">' + '<div class="edit">' + '<a href="JavaScript:void(0);">' + '</a></div>' + '<div class="publish">' + '<a href="JavaScript:void(0);">' + '</a></div>' + '<div class="delete">' + '<a href="JavaScript:void(0);">' + '</a></div></div>');
    this.loc = localization;
    this.container = null;
    
    var sandbox = instance.sandbox;
    var me = this;
    // add save view button to toolbar if we get the statehandler request
    var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
    if (rbState) {
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        sandbox.request(instance, reqBuilder('save_view', 'viewtools', {
            iconCls : 'tool-save-view',
            tooltip: localization.button.toolbarsave,
            sticky: false,
            callback : function() {
				me._promptForViewName(function(name) {
				    var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
				    sandbox.request(instance, rbState(name));	
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
     * @method _promptForViewName
     * @private
     */
    _promptForViewName : function(successCallback,viewName) {
    	var me = this;
    	
    	var form = Oskari.clazz.create('Oskari.userinterface.component.Form');
    	var nameInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'name');
    	//nameInput.setLabel(this.loc.popup.label);
    	nameInput.setPlaceholder(this.loc.popup.placeholder);
    	var title = this.loc.popup.title;
    	if(viewName) {
    		title = this.loc.popup.edit;
    		nameInput.setValue(viewName);
    	}
    	nameInput.setValidator(function(inputField)  {
    		var value = inputField.getValue();
    		var name = inputField.getName();
    		var errors = [];
            if (!value) {
            	errors.push({
        			"field": name, 
        			"error" :  me.loc.save.error_noname
    			});
            	return errors;
           	}
            if (value.indexOf('<') >= 0) {
            	errors.push({
        			"field": name, 
        			"error" :  me.loc.save.error_illegalchars
    			});
            } 
            return errors;
    	});
    	form.addField(nameInput);
    	
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(this.loc.button.save);
    	okBtn.addClass('primary');
    	
    	var sandbox = this.instance.sandbox;
    	okBtn.setHandler(function() {
            var errors = form.validate();
            if (errors.length == 0) {
            	successCallback(nameInput.getValue());
    			dialog.close();
            } else {
            	form.showErrors();
            }
    	});
    	var cancelBtn = dialog.createCloseButton(this.loc.button.cancel);
    	dialog.show(this.loc.popup.title, form.getForm(), [cancelBtn, okBtn]);
    },
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
        listContainer.html('');
        this.viewData = views;
        for (var i = 0; i < me.viewData.length; i++) {
            var datum = me.viewData[i];
            var vc = me.createViewContainer(datum);
            listContainer.append(vc);
        }
        listContainer.find('div.view:odd').addClass('odd');
        listContainer.find('div.view:even').removeClass('odd');
        /*
        // TODO: preferrably call some this.instance.updateTile() so we can calculate my places etc to tile number as well
        var tile = me.instance.plugins['Oskari.userinterface.Tile'];
        var ctr = tile.container;
        var ts = jQuery(ctr).find('.oskari-tile-status');
        ts.empty();
        ts.append('(' + views.length + ')');
        */
    },

    /**
     * @method _refreshViewsList
     * Refreshes the tab contents
     */
    _refreshViewsList : function() {
        var me = this; 
        jQuery.ajax({
            url : me.instance.sandbox.getAjaxUrl() + 'action_route=GetViews',
            type : 'POST',
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
            	me._renderViewsList(response.views);
            },
            error : function() {
    			var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		    	var button = dialog.createCloseButton(me.loc.button.ok);
				button.addClass('primary');
		    	dialog.show(me.loc['error'].title, me.loc['error'].loadfailed, [button]);
            }
        });
    },
    /**
     * @method editView
     */
    editView : function(view) {
        var me = this;
        var sandbox = this.instance.getSandbox();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        
        var successCallback = function(newName) {
            jQuery.ajax({
                url : me.instance.sandbox.getAjaxUrl() + '&action_route=RenameView',
                type : 'POST',
                data : 'id=' + view.id + '&newName=' + newName,
                dataType : 'json',
                beforeSend : function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success : function(response) {
			    	dialog.show(me.loc['popup'].title, me.loc['save'].success);
			    	dialog.fadeout();
                    me._refreshViewsList();
                },
                error : function() {
			    	var button = dialog.createCloseButton(me.loc.button.ok);
    				button.addClass('primary');
			    	dialog.show(me.loc['error'].title, me.loc['error'].notsaved, [button]);
                }
            });
        };

        this._promptForViewName(successCallback, view.name);
    },

    /**
     * @method getViewContainer
     * @return {jQuery} returns jQuery object representing a row
     * in the views listing
     */
    createViewContainer : function(viewData) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var container = this.templateViewRow.clone();
        var tools = this.templateViewTools.clone();
        var viewName = container.find('div.name a');
        viewName.append(viewData.name);
        viewName.bind('click', function() {
            var rb = sandbox.getRequestBuilder('StateHandler.SetStateRequest');
            if (rb) {
                var req = rb(viewData.state);
                /*
                 var mfst = (typeof viewData.state.mapfull.state);
                 // TODO: Why is this needed?
                 if (mfst == "string") {
                 viewData.state.mapfull.state =
                 JSON.parse(viewData.state.mapfull.state);
                 }
                 */
                req.setCurrentViewId(viewData.id);
                sandbox.request(me.instance, req);
            }
        });
        container.attr('view_id', viewData.id);

        container.append(tools);
        var editTool = tools.find('div.edit a');
        editTool.append(this.loc['edit']);
        editTool.bind('click', function() {
            var viewContainer = jQuery(this).closest('div.view');
            var id = viewContainer.attr('view_id');
            var view = me.getViewById(id);
            me.editView(view);
        });
        var publishTool = tools.find('div.publish a');
        if (viewData.isPublic) {
            publishTool.append(this.loc['unpublish']);
        } else {
            publishTool.append(this.loc['publish']);
        }
        publishTool.bind('click', function() {
            var viewContainer = jQuery(this).closest('div.view');
            var id = viewContainer.attr('view_id');
            var view = me.getViewById(id);
            if (!view) {
                return;
            }
            view.isPublic = !view.isPublic;
            if (view.isPublic) {
                publishTool.html(me.loc['unpublish']);
            } else {
                publishTool.html(me.loc['publish']);
            }
            // '/web/fi/kartta' + '?p_p_id=Portti2Map_WAR_portti2mapportlet' + '&p_p_lifecycle=1' + '&p_p_state=exclusive' + '&p_p_mode=view' + '&p_p_col_id=column-1' + '&p_p_col_count=1' + '&_Portti2Map_WAR_portti2mapportlet_fi' + '.mml.baseportlet.CMD=ajax.jsp' + 
            jQuery.ajax({
                url : me.instance.sandbox.getAjaxUrl() + '&action_route=AdjustViewAccess' + '&id=' + id + '&isPublic=' + view.isPublic,
                type : 'POST',
                dataType : 'json',
                beforeSend : function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success : function(response) {
                    me._refreshViewsList();
                },
                error : function() {
                    alert(loc['efailtoremovemyview']);
                }
            });
        });
        var deleteTool = tools.find('div.delete a');
        deleteTool.append(this.loc['delete']);

        deleteTool.bind('click', function() {
            var viewContainer = jQuery(this).closest('div.view');
            var id = viewContainer.attr('view_id');
            var view = me.getViewById(id);

            if (view) {
                var ok = {};
                ok.name = "delete_ok";
                ok.text = me.loc.button ? me.loc.button.yes : "Kyllä";
                ok.onclick = function() {
                	// '/web/fi/kartta' + '?p_p_id=Portti2Map_WAR' + '_portti2mapportlet' + '&p_p_lifecycle=1' + '&p_p_state=exclusive' + '&p_p_mode=view' + '&p_p_col_id=column-1' + '&p_p_col_count=1' + '&_Portti2Map_WAR_' + 'portti2mapportlet_fi' + '.mml.baseportlet.CMD=ajax.jsp' + 
                    jQuery.ajax({
                        url : me.instance.sandbox.getAjaxUrl() + '&action_route=DeleteView' + '&id=' + id,
                        type : 'POST',
                        dataType : 'json',
                        beforeSend : function(x) {
                            if (x && x.overrideMimeType) {
                                x.overrideMimeType("application/j-son;charset=UTF-8");
                            }
                        },
                        success : function(response) {
                            viewContainer.remove();
                            me._refreshViewsList();
                        },
                        error : function() {
                            alert(loc['efailtoremovemyview']);
                        }
                    });
                };

                var cancel = {};
                cancel.name = "delete_cancel";
                cancel.text = me.loc.button ? me.loc.button.no : "Ei";
                cancel.close = true;

                var rb = sandbox.getRequestBuilder('userinterface' + '.ModalDialogRequest');
                var title = me.loc.msg ? me.loc.msg.confirm_delete : "Poiston varmistus";
                var msg = me.loc.msg ? me.loc.msg.delete_view : "Poistetaanko näkymä";
                msg += " '" + view.name + "'?";
                var req = rb(title, msg, [ok, cancel]);
                sandbox.request(me.instance, req);
            } else {
                return;
            }
        });
        return container;
    },
    getViewById : function(id) {
        for (var i = 0; i < this.viewData.length; ++i) {
            // found what we were looking for
            if (this.viewData[i].id == id) {
                return this.viewData[i];
            }
        }
        // TODO: error handling?
        alert('Couldnt find view for id: ' + id);
        return null;
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
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method StateSavedEvent
         * TODO: reload views list here
         */
        'StateSavedEvent' : function(event) {
	    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        	if(event.isError()) {
        		// tallennus epäonnistui
		    	var button = dialog.createCloseButton(this.loc.button.ok);
				button.addClass('primary');
		    	dialog.show(this.loc['error'].title, this.loc['error'].notsaved, [button]);
        		return;
        	}
	    	dialog.show(this.loc['popup'].title, this.loc['save'].success);
	    	dialog.fadeout();
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
