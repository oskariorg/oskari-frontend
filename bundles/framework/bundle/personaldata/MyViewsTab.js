/**
 * @class Oskari.mapframework.bundle.personaldata.MyViewsTab
 * Renders the "personal data/my views" tab.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.personaldata.MyViewsTab',

	    /**
	     * @method create called automatically on construction
	     * @static
	     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
	     * 		reference to component that created the tab
	     */
	    function(instance, localization) {
		this.instance = instance;
		this.template = 
		    jQuery('<div><a href="JavaScript: void(0);"></a></div> ' + 
			   '<div style="border: 1px solid; margin: 20px; ' + 
			   'padding: 25px;" class="response"></div>' + 
			   '<div class="viewsList"></div>');
		this.templateViewRow = 
		    jQuery('<div class="view">' + 
			   '<div class="name"><a href="JavaScript:void(0);">' +
			   '</a></div></div>');
		this.templateViewTools = 
		    jQuery('<div class="tools">' +
			   '<div class="edit">' +
			   '<a href="JavaScript:void(0);">' +
			   '</a></div>' +
			   '<div class="publish">' + 
			   '<a href="JavaScript:void(0);">' + 
			   '</a></div>' + 
			   '<div class="delete">' + 
			   '<a href="JavaScript:void(0);">' + 
			   '</a></div></div>');
		this.loc = localization;
		this.container = null;
		this.debugCounter = 0;
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
		    content.find('a').html('> Tallenna näkymä <');
		    container.append(content);

		    var instance = me.instance;
		    var sandbox = instance.getSandbox();
		    content.find('a').bind('click', function() {
			var rb = 
			    sandbox.getRequestBuilder('StateHandler' + 
						      '.SaveStateRequest');
			if(rb) {
			    sandbox.request(instance, rb());
			}
		    });
		    me._refreshViewsList();
		},
		/**
		 * @method _refreshViewsList
		 * Refreshes the tab contents
		 */
		_refreshViewsList : function() {
		    var me = this;
		    var listContainer = me.container.find('.viewsList');
		    jQuery.ajax({
			url : '/web/fi/kartta' + 
			    '?p_p_id=Portti2Map_WAR_portti2mapportlet' + 
			    '&p_p_lifecycle=1' + 
			    '&p_p_state=exclusive' + 
			    '&p_p_mode=view' + 
			    '&p_p_col_id=column-1' + 
			    '&p_p_col_count=1' + 
			    '&_Portti2Map_WAR_portti2mapportlet_fi' + 
			    '.mml.baseportlet.CMD=ajax.jsp&' + 
			    'action_route=GetViews',
			type : 'POST',
			dataType : 'json',
			beforeSend: function(x) {
			    if(x && x.overrideMimeType) {
				x.overrideMimeType("application/j-son;charset=UTF-8");
			    }
			},
			success : function(response) {
			    listContainer.html('');
			    if (response.views &&
				response.views.length > 0) {
//				alert(JSON.stringify(response.views, null, 4));
				me.viewData = response.views;
				for(var i = 0; i < me.viewData.length; i++) {
				    var datum = me.viewData[i];
				    var vc = me.createViewContainer(datum);
				    listContainer.append(vc);
				}
				listContainer.find('div.view:odd')
				    .addClass('odd');
				listContainer.find('div.view:even')
				    .removeClass('odd');
				var tile = 
				    me.instance
				    .plugins['Oskari.userinterface.Tile'];
				var ctr = 
				    tile.container;
				var ts = 
				    jQuery(ctr).find('.oskari-tile-status');
				ts.empty();
				ts.append('(' + response.views.length + ')');
			    }
			},
			error : function() {
			    alert(me.loc['efailtogetmyviews']);
			}
		    });
		},
		/**
		 * @method editView
		 */
		editView : function(view) {
		    var me = this;
		    var sandbox = this.instance.getSandbox();
		    var title = 
			this.loc.edit ? 
			this.loc.edit : 
			'Muokkaa näkymää';
		    var msg =
			'<div class="e_noname" ' + 
			'style="display: inline-block; ' + 
			'color: red; display: none;">' + 
			(this.loc.error_noname ? 
			 this.loc.error_noname : 
			 'Nimi ei voi olla tyhjä!') +
			'<br />' +
			'</div>' +
			'<div class="e_illegal" ' + 
			'style="display: inline-block; ' + 
			'color: red; display: none;">' + 
			'<br />' +
			(this.loc.error_illegalchars ?
			 this.loc.error_illegalchars :
			 'Nimessä on virheellisiä merkkejä') +
			'<br />' +
			'</div>' +
			(this.loc.msg ? 
			 this.loc.msg.view_name : 
			 'Näkymän nimi') + ": " +
			'<input name="viewName" value="' + view.name + '" ' + 
			'type="text" class="viewName" />';		   
		    var save = {
			name : 'button_save',
			text : (this.loc.button ? 
				this.loc.button.save : 
				'Tallenna'),
			close : false,
			onclick : function(e) {
			    var viewName = 
				jQuery('div.modalmessage ' + 
				       'input.viewName').val();
			    if (viewName) {
				if (viewName.indexOf('<') >= 0) {
				    jQuery('div.modalmessage ' + 
					   'div.e_illegal').show();
				} else {
				    $.modal.close();
				    jQuery.ajax({
					url : '/web/fi/kartta' + 
					    '?p_p_id=Portti2Map_WAR_' + 
					    'portti2mapportlet' + 
					    '&p_p_lifecycle=1' + 
					    '&p_p_state=exclusive' + 
					    '&p_p_mode=view' + 
					    '&p_p_col_id=column-1' + 
					    '&p_p_col_count=1' + 
					    '&_Portti2Map_WAR_' + 
					    'portti2mapportlet_' + 
					    'fi.mml.baseportlet.CMD=' + 
					    'ajax.jsp' + 
					    '&action_route=RenameView',
					type : 'POST',
					data : 'id=' + view.id +
					    '&newName=' + viewName,
					dataType : 'json',
					beforeSend: function(x) {
					    if(x && x.overrideMimeType) {
						x.overrideMimeType("application/j-son;charset=UTF-8");
					    }
					},
					success : function(response) {
					    me._refreshViewsList();
					},
					error : function() {
					    alert(me.loc.e_fail);
					}
				    });
				}
			    } else {
				jQuery('div.modalmessage div.e_noname').show();
			    }
			}	
		    };
		    var cancel = {
			name : 'button_cancel',
			text : (this.loc.button ? 
				this.loc.button.cancel : 
				'Peruuta'),
			close : true
		    };		   
		    var reqName = 'userinterface.ModalDialogRequest';
		    var reqBuilder = sandbox.getRequestBuilder(reqName);
		    var req = reqBuilder(title, msg, [ save, cancel ]);
		    sandbox.request(this.instance, req);
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
			var rb = 
			    sandbox.getRequestBuilder('StateHandler' + 
						      '.SetStateRequest');
			if(rb) {
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
		    if(viewData.isPublic) {
			publishTool.append(this.loc['unpublish']);
		    } else {
			publishTool.append(this.loc['publish']);
		    }
		    publishTool.bind('click', function() {
			var viewContainer = jQuery(this).closest('div.view');
			var id = viewContainer.attr('view_id');
			var view = me.getViewById(id);
			if(!view) {
			    return;
			}
			view.isPublic = !view.isPublic;
			if(view.isPublic) {
			    publishTool.html(me.loc['unpublish']);
			} else {
			    publishTool.html(me.loc['publish']);
			}
			jQuery.ajax({
			    url : '/web/fi/kartta' + 
				'?p_p_id=Portti2Map_WAR_portti2mapportlet' + 
				'&p_p_lifecycle=1' + 
				'&p_p_state=exclusive' + 
				'&p_p_mode=view' + 
				'&p_p_col_id=column-1' + 
				'&p_p_col_count=1' + 
				'&_Portti2Map_WAR_portti2mapportlet_fi' + 
				'.mml.baseportlet.CMD=ajax.jsp' + 
				'&action_route=AdjustViewAccess' + 
				'&id=' + id + 
				'&isPublic=' + view.isPublic,
			    type : 'POST',
			    dataType : 'json',
			    beforeSend: function(x) {
				if(x && x.overrideMimeType) {
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
			    ok.text = 
				me.loc.button ? 
				me.loc.button.yes : 
				"Kyllä";
			    ok.onclick = function() {
				jQuery.ajax({
				    url : '/web/fi/kartta' + 
					'?p_p_id=Portti2Map_WAR' + 
					'_portti2mapportlet' + 
					'&p_p_lifecycle=1' + 
					'&p_p_state=exclusive' + 
					'&p_p_mode=view' + 
					'&p_p_col_id=column-1' + 
					'&p_p_col_count=1' + 
					'&_Portti2Map_WAR_' + 
					'portti2mapportlet_fi' + 
					'.mml.baseportlet.CMD=ajax.jsp' + 
					'&action_route=DeleteView' + 
					'&id=' + id,
				    type : 'POST',
				    dataType : 'json',
				    beforeSend: function(x) {
					if(x && x.overrideMimeType) {
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
			    cancel.text = 
				me.loc.button ?
				me.loc.button.no : 
				"Ei";
			    cancel.close = true;

			    var rb = 
				sandbox
				.getRequestBuilder('userinterface' + 
						   '.ModalDialogRequest');
			    var title = 
				me.loc.msg ?
				me.loc.msg.confirm_delete :
				"Poiston varmistus";
			    var msg = 
				me.loc.msg ?				
				me.loc.msg.delete_view :
				"Poistetaanko näkymä";
			    msg += " '" + view.name + "'?";
			    var req = rb(title, msg, [ ok, cancel ]);
			    sandbox.request(me.instance, req);
			} else {
			    return;
			}
		    });
		    return container;
		},
		getViewById : function(id) {
		    for(var i = 0; i < this.viewData.length; ++i) {
			// found what we were looking for
			if(this.viewData[i].id == id) {
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
		    for(p in this.eventHandlers) {
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
		    for(p in this.eventHandlers) {
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
			this.container.find('div.response')
			    .html('Tallennettu tila: <hr/>' + 
				  this.serializeJSON(event.getState()));
			this.debugCounter++;
			this._refreshViewsList();
		    }
		},
		// TODO: move to some util
		serializeJSON : function(obj) {
		    var me = this;
		    var t = typeof (obj);
		    if(t != "object" || obj === null) {
			// simple data type
			if(t == "string")
			    obj = '"' + obj + '"';
			return String(obj);
		    } else {
			// array or object
			var json = [], arr = (obj && obj.constructor == Array);

			jQuery.each(obj, function(k, v) {
			    t = typeof (v);
			    if(t == "string") {
				v = '"' + v + '"';
			    } else if(t == "object" & v !== null) {
				v = me.serializeJSON(v)
			    }
			    json.push(( arr ? "" : '"' + k + '":') + String(v));
			});
			return ( arr ? "[" : "{") + String(json) + ( arr ? "]" : "}");
		    }
		},
		/**
		 * @method onEvent
		 * @param {Oskari.mapframework.event.Event} event a Oskari event object
		 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
		 */
		onEvent : function(event) {

		    var handler = this.eventHandlers[event.getName()];
		    if(!handler)
			return;

		    return handler.apply(this, [event]);

		}
	    });
