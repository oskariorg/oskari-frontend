/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance
 *
 * Main component and starting point for the personal data functionality.
 * 
 * See Oskari.mapframework.bundle.personaldata.PersonalDataBundle for bundle definition. 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.core = null;
	this.sandbox = null;
	this.started = false;
	this.template = null;
	this.plugins = {};
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'PersonalData',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		// draw ui
		me.createUi();
		
        // add save view button to toolbar if we get the statehandler request
        var rbState = sandbox.getRequestBuilder('StateHandler.SaveStateRequest');
        if (rbState) {
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            sandbox.request(me, reqBuilder('save_view', 'viewtools', {
                iconCls : 'tool-save-view',
                tooltip: 'Tallenna näkymä',
                sticky: false,
                callback : function() {
                    sandbox.request(me, rbState());
                }
            }));
        }
        // disable button for non logged in users
        
        if(!sandbox.getUser().isLoggedIn()) {
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(me, reqBuilder('save_view', 'viewtools', false));
        }
	},
	/**
	 * @method init
	 * implements Module protocol init methdod - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

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

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.personaldata.Flyout
	 * Oskari.mapframework.bundle.personaldata.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the component 
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the component 
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "personal data" functionality
	 */
	createUi : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.mapframework.bundle.personaldata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    
    this.templateNotLoggedIn = null;
	this.template = null;
	this.templateTabHeader = null;
    this.templateTabContent = null;
	this.tabsData = [];
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName : function() {
        return 'Oskari.mapframework.bundle.personaldata.Flyout';
    },
	/**
	 * @method setEl
	 * @param {Object} el 
	 * 		reference to the container in browser
	 * @param {Number} width 
	 * 		container size(?) - not used
	 * @param {Number} height 
	 * 		container size(?) - not used 
	 * 
	 * Interface method implementation
	 */
    setEl : function(el, width, height) {
        this.container = el[0];
		if(!jQuery(this.container).hasClass('personaldata')) {
			jQuery(this.container).addClass('personaldata');
		}
    },
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
    startPlugin : function() {
		var me = this;
        this.templateNotLoggedIn = jQuery('<p>' + this.instance.getLocalization('notLoggedIn') + '</p>');
        
		
		this.template = jQuery('<div class="oskariTabs"><ul></ul></div><br clear="all"/>' +
				'<div class="oskariTabsWrapper"></div>');
		this.templateTabHeader = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
        this.templateTabContent = jQuery('<div class="tab-content"></div>'); 
		
		
        var tabsLocalization = this.instance.getLocalization('tabs');
		this.tabsData = {
			"myPlaces" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyPlacesTab', this.instance, tabsLocalization.myplaces),
			"myViews" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', this.instance, tabsLocalization.myviews),
			"publishedMaps" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', this.instance, tabsLocalization.publishedmaps),
			"account" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.AccountTab', this.instance, tabsLocalization.account)
		};
    },
	/**
	 * @method stopPlugin 
	 * 
	 * Interface method implementation, does nothing atm 
	 */
	stopPlugin : function() {

	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the flyout 
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the flyout 
	 */
	getDescription : function() {
		return this.instance.getLocalization('desc');
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions : function() {

	},
	/**
	 * @method setState 
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	
	/**
	 * @method createUi
	 * Creates the UI for a fresh start
	 */
    createUi : function() {
        var me = this;
        var sandbox = me.instance.getSandbox();
        
		// clear container
		var cel = jQuery(this.container);
		cel.empty();
        /*
        if(!sandbox.getUser().isLoggedIn()) {
            jQuery(me.container).append(me.templateNotLoggedIn.clone());
        	return;
        }
        */
		// now we can presume user is logged in
        var content = this.template.clone();
        cel.append(content);
        
        // create tab headers
		var headerContainer = cel.find('div.oskariTabs ul');
		this._createTabHeaders(headerContainer);

		// create tabs
		var contentContainer = cel.find('div.oskariTabsWrapper');
		var firstTab = true;
		for(var tabId in this.tabsData) {
			var tab = this.tabsData[tabId];
        	var tabContainer = this.templateTabContent.clone();
        	// hide all but the first
        	if(!firstTab) {
	        	tabContainer.css('display', 'none');
	    	}
	    	contentContainer.append(tabContainer);
	    	tab.addTabContent(tabContainer);
	    	// binds tab to events
	    	if(tab.bindEvents) {
	    		tab.bindEvents();
	    	}
    		firstTab = false;
        }
		// bind tab changing
        jQuery(headerContainer).find('li a').bind('click', function() {
        	var li = jQuery(this).parent();
            var tabIndex = li.index();
	    	cel.find('.tab-content').hide();
	        cel.find('.tab-content:eq(' + tabIndex + ')').show();
            // remove active from all tabs
			li.closest('ul').find('li').removeClass('active');
    		// mark clicked as active
        	li.addClass('active');
           // me.refreshTab(tabIndex);
        });
    },
    _createTabHeaders : function(headerContainer) {
		var firstTab = true;
		for(var tabId in this.tabsData) {
			var tab = this.tabsData[tabId];
        	var header = this.templateTabHeader.clone();
        	// set the first one active
	    	if(firstTab) {
	        	header.addClass('active');
    			firstTab = false;
	    	}
	    	header.find('a').html(tab.getTitle());
	        headerContainer.append(header);
        }
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ['Oskari.userinterface.Flyout']
});
/**
 * @class Oskari.mapframework.bundle.personaldata.Tile
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.personaldata.Tile';
	},
	/**
	 * @method setEl
	 * @param {Object} el 
	 * 		reference to the container in browser
	 * @param {Number} width 
	 * 		container size(?) - not used
	 * @param {Number} height 
	 * 		container size(?) - not used 
	 * 
	 * Interface method implementation
	 */
	setEl : function(el, width, height) {
		this.container = jQuery(el);
	},
	/**
	 * @method startPlugin
	 * Interface method implementation, calls #refresh() 
	 */
	startPlugin : function() {
		this.refresh();
	},
	/**
	 * @method stopPlugin 
	 * Interface method implementation, clears the container 
	 */
	stopPlugin : function() {
		this.container.empty();
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the tile 
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the tile 
	 */
	getDescription : function() {
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions : function() {

	},
	/**
	 * @method setState 
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	/**
	 * @method refresh
	 * Creates the UI for a fresh start
	 */
	refresh : function() {
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
/**
 * @class Oskari.mapframework.bundle.personaldata.MyPlacesTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.MyPlacesTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery("<p>omat templateMyPlacesTab content</p>");
	this.loc = localization;
	this.dummy = false;
}, {
	getTitle : function() {
		return this.loc.title;
	},
	addTabContent : function(container) {
	    var me = this;
		var content = this.template.clone();
		container.append(content);
		var link = jQuery('<div>Add measure area</div>');
		link.bind('click', function(evt) {
		    var sandbox = me.instance.getSandbox();
		    
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            sandbox.request(me.instance, reqBuilder('measurearea', 'measuretools', {
                iconCls : 'tool-measure-area',
                tooltip: 'Measure area',
                sticky: true,
                callback : function() {
                    sandbox.request(me.instance, sandbox.getRequestBuilder('ToolSelectionRequest')('map_control_measure_area_tool'));
                }
            }));
		});
		content.append(link);
		
        content.append('<hr/>');
        
        var link2 = jQuery('<div>Disable/enable measure area</div>');
        link2.bind('click', function(evt) {
            var sandbox = me.instance.getSandbox();
            
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(me.instance, reqBuilder('measurearea', 'measuretools', me.dummy));
            me.dummy = !me.dummy;
        });
        content.append(link2);
        
        content.append('<hr/>');
        
        var link3 = jQuery('<div>Remove measure area</div>');
        link3.bind('click', function(evt) {
            var sandbox = me.instance.getSandbox();
            
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
            sandbox.request(me.instance, reqBuilder('measurearea', 'measuretools'));
        });
        content.append(link3);
        
        var link4 = jQuery('<div>Disable/enable all measuretools</div>');
        link4.bind('click', function(evt) {
            var sandbox = me.instance.getSandbox();
            
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(me.instance, reqBuilder(undefined, 'measuretools', me.dummy));
            me.dummy = !me.dummy;
        });
        content.append(link4);
        
        content.append('<hr/>');
	}
});
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
			    var mfst = (typeof viewData.state.mapfull.state);
			    // TODO: Why is this needed?
			    if (mfst == "string") {
				viewData.state.mapfull.state =
				    JSON.parse(viewData.state.mapfull.state);
			    }
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
/**
 * @class Oskari.mapframework.bundle.personaldata.PublishedMapsTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.PublishedMapsTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery("<p>omat templatePublishedMapsTab content</p>");
	this.loc = localization;
}, {
	getTitle : function() {
		return this.loc.title;
	},
	addTabContent : function(container) {
		var content = this.template.clone();
		container.append(content);
	}
});
/**
 * @class Oskari.mapframework.bundle.personaldata.AccountTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.AccountTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery('<div class="account"><div class="info"></div><div class="bottomlinks"></div></div>');
	this.loc = localization;
}, {
	getTitle : function() {
		return this.loc.title;
	},
	addTabContent : function(container) {
		var content = this.template.clone();
		container.append(content);
		this._createAccount(container);
		
		
		/*
                jQuery.ajax({
                    type : 'POST',
                    url : 'http://demo.paikkatietoikkuna.fi/web/fi/kartta' 
                        + '?p_p_id=Portti2Map_WAR_portti2mapportlet' 
                        + '&p_p_lifecycle=1' 
                        + '&p_p_state=exclusive' 
                        + '&p_p_mode=view' 
                        + '&p_p_col_id=column-1' 
                        + '&p_p_col_count=1' 
                        + '&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp' 
                        + '&action_route=GetUserData',
                    success : function(responseText) {
                        var resp = eval('(' + responseText + ')');
                        jQuery(me.personalDataTab).find(".personaldata_first").text(resp.firstName);
                        jQuery(me.personalDataTab).find(".personaldata_last").text(resp.lastName);
                        jQuery(me.personalDataTab).find(".personaldata_login").text(resp.loginName);
                        jQuery(me.personalDataTab).find(".personaldata_nick").text(resp.nickName);
                    }
                });
                */
	},
	
    _createAccount : function(container) {
        var me = this;
        var sandbox = me.instance.getSandbox();
        var fieldTemplate = jQuery('<div class="dataField"><div class="label"></div><div class="value"></div><br clear="all" /></div>');
        
        var user = sandbox.getUser();
        var localization = this.loc;
        var accountData = [
        {
        	label : localization.firstName,
        	value : user.getFirstName()
        },
        {
        	label : localization.lastName,
        	value : user.getLastName()
        },
        {
        	label : localization.nickName,
        	value : user.getNickName()
        },
        {
        	label : localization.email,
        	value : user.getLoginName()
        }
        ];
        var infoContainer = container.find('div.info');
        for(var i = 0; i < accountData.length; ++i) {
        	var data = accountData[i];
        	var fieldContainer = fieldTemplate.clone();
	    	fieldContainer.find('.label').html(data.label);
	    	fieldContainer.find('.value').html(data.value);
	        infoContainer.append(fieldContainer);
        }
        var bottomLinks = [
        {
        	label : localization.changeInfo,
        	href : 'JavaScript:void(0);'
        },
        {
        	label : localization.changePassword,
        	href : 'JavaScript:void(0);'
        },
        {
        	label : localization.removeAccount,
        	href : 'JavaScript:void(0);'
        }
        ];
        var bottomLinksContainer = container.find('div.bottomlinks');
        for(var i = 0; i < bottomLinks.length; ++i) {
        	var data = bottomLinks[i];
        	var link = jQuery('<a href="' + data.href + '">' + data.label + '</a>&nbsp; ');
	        bottomLinksContainer.append(link);
        }
        
    }
});
