/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance
 *
 * Main component and starting point for the "selected layers" functionality.
 * Lists all the layers available in Oskari.mapframework.sandbox.Sandbox.findAllSelectedMapLayers()
 * and updates UI if maplayer related events (#eventHandlers) are received.
 *
 * See Oskari.mapframework.bundle.layerselection2.LayerSelectionBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
	this.ui = null;
	this._requestHandlers = {};
	this.attachedToDefault = false;
}, {
	"templates" : {
		"userguide" : '<div class="oskari-userguide"><span class="oskari-prompt"></span><br /><a target="_blank" href="http://www.google.fi/">Google</a></div>'
	},
	/**
	 * @static
	 * @property __name
	 */
	__name : 'userinterface.UserGuide',
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

		this._localization = Oskari.getLocalization(this.getName());

		var title = this.getLocalization('title');

		var popover = Oskari.clazz.create('Oskari.userinterface.component.Popover', title, '');
		this.ui = popover;
		popover.setContent($(this.templates['userguide']));

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		// request
		this._requestHandlers['userguide.ShowUserGuideRequest'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler', sandbox, this);
		sandbox.addRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		sandbox.request(this, request);

		//sandbox.registerAsStateful(this.mediator.bundleId, this);
		// draw ui
		me.createUi();
	},
	/**
	 * @method init
	 * implements Module protocol init method - does nothing atm
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

		/**
		 * @method userinterface.ExtensionUpdatedEvent
		 */
		'userinterface.ExtensionUpdatedEvent' : function(event) {

			var me = this;

			if(event.getExtension().getName() != me.getName())
				return;

			var doOpen = event.getViewState() != "close";

			me.toggleUserInterface(doOpen);

		}
	},

	/**
	 * @method toggleUserInterface
	 */

	"toggleUserInterface" : function(doOpen, el) {
		var me = this;

		var popover = this.ui;
		if(!doOpen) {
			popover.hide();
		} else {
			if(!me.attachedToDefault) {
				var el = me.plugins['Oskari.userinterface.Tile'].getEl();

				popover.setPlacement('right');
				popover.attachTo(el);
				me.attachedToDefault = true;
				

			}
			popover.show();

		}
	},
	"scheduleShowUserGuide" : function(request) {

		var me = this;
		var popover = me.ui;

		var isToggle = request.isToggle();
		
		if( isToggle && popover.shown ) {
			/*popover.hide();*/
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
			return;
		}
			
		me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'attach']);		
		


		var userGuideContent = jQuery(this.templates['userguide']);

		/* Debug Begin */

		var userGuideData = jQuery('<div />');
		var lang = Oskari.getLang();

		var d = userGuideData.clone();
		d.append("Lang: " + lang);
		userGuideContent.append(d);

		var d = userGuideData.clone();
		d.append("Extension: " + request.getExtension());
		userGuideContent.append(d);

		var d = userGuideData.clone();
		d.append("Context: " + request.getContext());
		userGuideContent.append(d);

		var d = userGuideData.clone();
		d.append("Element: " + (request.getEl() ? "YES": "NO"));
		userGuideContent.append(d);

		/* Debug End */		

		var el = request.getEl() ;
		
		var placement = request.getPlacement();
		
		if( placement )
			popover.setPlacement(placement);

		if(!el) {
			if(!me.attachedToDefault) {
				el = me.plugins['Oskari.userinterface.Tile'].getEl();
				
				popover.attachTo(el);
				me.attachedToDefault = true;
			}
		} else {
			popover.hide();
			me.attachedToDefault = false;
			popover.attachTo(el);
		}
		
		popover.setContent(userGuideContent);

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

		/* request handler cleanup */
		sandbox.removeRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		//this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.layerselection2.Flyout
	 * Oskari.mapframework.bundle.layerselection2.Tile
	 */
	startExtension : function() {
		/*this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.Flyout', this,
		 * this.getLocalization()['flyout']););*/
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.Tile', this, this.getLocalization('tile'));
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		/*this.plugins['Oskari.userinterface.Flyout'] = null;*/
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
	 * (re)creates the UI for "selected layers" functionality
	 */
	createUi : function() {
		var me = this;

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
 * @class Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequest
 * 
 *   
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequest',
                function(conf) {
                	var config = conf || {};
                    this._creator = null;
                    this._el = config.el;
                    this._context = config.context;
                    this._extension = config.extension;
                    this._toggle = config.toggle;
                    this._placement = config.placement;
                }, {
                    __name : "userguide.ShowUserGuideRequest",
                    getName : function() {
                        return this.__name;
                    },

                    getUuid : function() {
                        return this._uuid;
                    },
                    
                    getContext: function() {
                    	return this._context;
                    },

                    getExtension: function() {
                    	return this._extension;
                    },
                    
                    getEl: function() {
                    	return this._el;
                    } ,
                    isToggle: function() {
                    	return this._toggle;
                    },
                    getPlacement: function() {
                    	return this._placement;
                    }
                    
                },
                
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler', function(sandbox, instance) {

	this.sandbox = sandbox;
	
	/** @property instance */
	this.instance = instance;
}, {
	
	/** @method handleRequest dispatches processing to instance */
	handleRequest : function(core, request) {
		this.sandbox.printDebug("[Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler] Show UserGuide: " + request.getUuid());
		this.instance.scheduleShowUserGuide(request);
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
/*
 * @class Oskari.mapframework.bundle.layerselection2.Tile
 *
 * Renders the "selected layers" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, locale) {

	this.instance = instance;
	this.locale = locale;

	this.container = null;
	this.template = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.userguide.Tile';
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
		var status = this.container.children('.oskari-tile-status');
		
	},
	getEl : function() {
		return this.container;
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
		return this.locale['title'];
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the tile
	 */
	getDescription : function() {
		return this.locale['desciption'];
	},
	/**
	 * @method getOptions
	 * Interface method implementation, does nothing atm
	 */
	getOptions : function() {

	},
	
	/**
	 * @method refresh
	 * Creates the UI for a fresh start
	 */
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();

	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
/*
 * Locale for fi
 */
Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "userinterface.UserGuide",
	"value" : {
		"title" : "Ohje",
		"desc" : "",	
		"flyout" : {
			"title" : "Ohje"
			
		},
		"tile" : {
			"title" : "Ohje",
			
		}
	}
});
/*
 * Locale for sv
 */
Oskari.registerLocalization({
	"lang" : "sv",
	"key" : "userinterface.UserGuide",
	"value" : {
		"title" : "Guide",
		"desc" : "",	
		"flyout" : {
			"title" : "Guide"
			
		},
		"tile" : {
			"title" : "Guide",
			
		}
	}
});
/*
 * Locale for en
 */
Oskari.registerLocalization({
	"lang" : "en",
	"key" : "userinterface.UserGuide",
	"value" : {
		"title" : "Guide",
		"desc" : "",	
		"flyout" : {
			"title" : "Guide"
			
		},
		"tile" : {
			"title" : "Guide",
			
		}
	}
});
