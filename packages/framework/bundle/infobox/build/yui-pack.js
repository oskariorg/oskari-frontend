/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance
 *
 * Main component and starting point for the "infobox" functionality.
 * Provides functionality for other bundles (GFI/WFS featuretype/Search)
 * to display a popup on the map.
 *
 * See Oskari.mapframework.bundle.infobox.InfoBoxBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.mediator = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Infobox',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	update : function() {
	},
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	start : function() {
		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;
		// Should this not come as a param?
		var sandbox = Oskari.$('sandbox');
		sandbox.register(me);
		me.setSandbox(sandbox);

		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.registerForEventByName(me, p);
			}
		}

		// register plugin for map (drawing for my places)
		var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
		mapModule.registerPlugin(this.popupPlugin);
		mapModule.startPlugin(this.popupPlugin);
		sandbox.addRequestHandler('InfoBox.ShowInfoBoxRequest', this.requestHandlers.showInfoHandler);
		sandbox.addRequestHandler('InfoBox.HideInfoBoxRequest', this.requestHandlers.hideInfoHandler);

	},
	/**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	init : function() {
		var me = this;
		// register plugin for map (actual popup implementation handling)
		this.popupPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin');

		this.requestHandlers = {
			showInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler', this.popupPlugin),
			hideInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler', this.popupPlugin)

		};
		return null;
	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {
		var me = this;
		var handler = me.eventHandlers[event.getName()];
		if(!handler) {
			return;
		}

		return handler.apply(this, [event]);
	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		/**
		 * @method MapClickedEvent
		 * FIXME: just for testing - dummy data for demo purposes
		 */
/*		MapClickedEvent : function(e) {
			var me = this;

			var popupId = "" + e.getLonLat().lon + "_" + e.getLonLat().lat;

			var exampleContent = [{
				html : "<h3>Kumpumoreeni</h3>" + "<p>Suomen maanperä 1:10000000 (WFS)</p>",
				actions : {
					"Tallenna" : function() {
						alert('tallennettu');
					},
					"Sulje" : function() {
                        var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(popupId);
                        me.sandbox.request(me.getName(), request);
					}
				}
			}, {
				html : "<h3>Struven ketju/Mustaviiri</h3>" + "<p>Maailmanperintökohteet (N:6682245 E:478060)</p>" + "<p>Struven ketju on kolmioketju, joka kulkee lähelllä itäistä 26 pituuspiiriä Hammerfestistä, Pohjoisen jäämeren rannalta, Mustallemerelle Ukrainan Izmailmaan</p>",
				actions : {
					"Tallenna" : function() {
						alert('tallennettu2');
					},
					"Sulje" : function() {
						var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(popupId);
						me.sandbox.request(me.getName(), request);
					}
				}
			}];

			var request = this.sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(popupId, "Title", exampleContent, e.getLonLat(), true);
			this.sandbox.request(me.getName(), request);

		}
		*/
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	stop : function() {
		var me = this;
		var sandbox = me.sandbox();
		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.unregisterFromEventByName(me, p);
			}
		}
		me.sandbox.unregister(me);
		me.started = false;
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
// Define outerHtml method for jQuery since we need to give openlayers plain html
// http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
// Elements outerHtml property only works on IE and chrome
jQuery.fn.outerHTML = function (arg) {
    var ret;

    // If no items in the collection, return
    if (!this.length)
        return typeof val == "undefined" ? this : null;
    // Getter overload (no argument passed)
    if (!arg) {
        return this[0].outerHTML ||
            (ret = this.wrap('<div>').parent().html(), this.unwrap(), ret);
    }
    // Setter overload
    jQuery.each(this, function (i, el) {
        var fnRet,
            pass = el,
            inOrOut = el.outerHTML ? "outerHTML" : "innerHTML";

        if (!el.outerHTML)
            el = jQuery(el).wrap('<div>').parent()[0];

        if (jQuery.isFunction(arg)) {
            if ((fnRet = arg.call(pass, i, el[inOrOut])) !== false)
                el[inOrOut] = fnRet;
        }
        else
            el[inOrOut] = arg;

        if (!el.outerHTML)
            jQuery(el).children().unwrap();
    });

    return this;
};

/**
 * @class Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin
 * 
 * Extends jquery by defining outerHtml() method for it. (TODO: check if we really want to do it here).
 * Provides a customized popup functionality for Openlayers map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._popups ={};
}, {
	/**
	 * @static
	 * @property __name
	 */
    __name : 'OpenLayersPopupPlugin',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
	/**
	 * @method init
	 * implements Module protocol init method - declares popup templates
	 */
    init : function() {
        var me = this;
			
		// templates
		this._arrow =  jQuery('<div class="popupHeaderArrow"></div>');
    	this._header = jQuery('<div class="popupHeader"></div>');
    	this._contentDiv = jQuery('<div class="popupContent"></div>');
    	this._contentWrapper = jQuery('<div class="contentWrapper"></div>');
    	this._actionLink = jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>');
    	this._contentSeparator = jQuery('<hr class="infoboxLine">');
    },
    
    /**
     * @method popup
     * @param {String} id
     * 		id for popup so we can use additional requests to control it
     * @param {String} title
     * 		popup title
     * @param {Object[]} contentData
     * 		JSON presentation for the popup data
     * @param {OpenLayers.LonLat} lonlat
     * 		coordinates where to show the popup
     * 
     * Displays a popup with given title and data in the given coordinates.
     * 
     * contentData format example:
     * [{
	 * 	html: "",
	 *  actions : {
	 * 	   "Tallenna" : callbackFunction,
	 * 	   "Sulje" : callbackFunction
	 * }
	 * }]
     */
    popup : function(id, title, contentData, lonlat) {
    	var me = this;
    	 
    	var arrow = this._arrow.clone();
    	var header = this._header.clone();
    	var contentDiv = this._contentDiv.clone();
    	
    	header.append(title);
    	
    	for(var i =0;i < contentData.length;i++) {
    		if(i != 0) {
		  		contentDiv.append(this._contentSeparator.clone());
    		}
		    var html = contentData[i].html;
		  	var contentWrapper = this._contentWrapper.clone();
		  	contentWrapper.append(html);
		  	var action = contentData[i].actions;
		  	for(var key in action){
	            var attrName = key;
	            var attrValue = action[key];
	            var actionLink = this._actionLink.clone();
	            var link = actionLink.find('a'); 
	            link.attr('contentdata', i);
	            link.append(attrName);
	            contentWrapper.append(actionLink);
        	}
		  	contentDiv.append(contentWrapper);
		}
		
    	var openlayersMap = this.getMapModule().getMap();
    	var popup = new OpenLayers.Popup(id,
                   new OpenLayers.LonLat(lonlat.lon,lonlat.lat),
                   new OpenLayers.Size(400,200),
                   arrow.outerHTML() +
                   header.outerHTML()+
                   contentDiv.outerHTML(),
                   false);
                   
		popup.setBackgroundColor('transparent');
		this._popups[id] = popup;
		jQuery(popup.div).css('overflow','');
		jQuery(popup.groupDiv).css('overflow','');
		// override
		popup.events.un({
			"click": popup.onclick,
			scope: popup
		});
		
		popup.events.on({
			"click": function(evt) {
				var link = jQuery(evt.originalTarget);
				var i = link.attr('contentdata');
				var text = link.html();
				if(contentData[i] && contentData[i].actions && contentData[i].actions[text]) {
					contentData[i].actions[text]();
				}
			},
			scope: popup
		});
		
		openlayersMap.addPopup(popup);
    },
    /**
     * @method close
     * @param {String} id
     * 		id for popup that we want to close (optional - if not given, closes all popups)
     */
    close : function(id) {
    	// destroys all if id not given
    	// deletes reference to the same id will work next time also
        if(!id) {
            for(var popup in this._popups) {
    			this._popups[popup].destroy();
    			delete this._popups[popup];
            }
            return;
        }
    	this._popups[id].destroy();
		delete this._popups[id];
    },
    
    /**
     * @method register
     * mapmodule.Plugin protocol method - does nothing atm
     */
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },
    /**
     * @method startPlugin
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);

    },
    /**
     * @method stopPlugin
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox
     */
    stopPlugin : function(sandbox) {

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    stop : function(sandbox) {
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest
 * Requests a map popup/infobox to be shown
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String} id
 * 		id for popup so we can use additional requests to control it
 * @param {String} title
 * 		popup title
 * @param {Object[]} contentData
 * 		JSON presentation for the popup data
 * @param {OpenLayers.LonLat} lonlat
 * 		coordinates where to show the popup
 * @param {Boolean} hidePrevious
 * 		if true, hides any previous popups when showing this, defaults to false
 * 
 * contentData format example:
 * [{
 * 	html: "",
 *  actions : {
 * 	   "Tallenna" : callbackFunction,
 * 	   "Sulje" : callbackFunction
 * }
 * }]
 */
function(id,title, content, position, hidePrevious) {
	this._creator = null;
	this._id = id;
	this._title = title;
	this._content = content;
	this._position = position;
	this._hidePrevious = (hidePrevious == true);
}, {
    /** @static @property __name request name */
	__name : "InfoBox.ShowInfoBoxRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	},
    /**
     * @method getId
     * @return {String} popup/infobox id
     */
	getId : function() {
		return this._id;
	},
    /**
     * @method getTitle
     * @return {String} popup/infobox title
     */
	getTitle : function() {
		return this._title;
	},
    /**
     * @method getContent
     * @return {Object[]} popup/infobox title
	 * contentData format example:
	 * [{
	 * 	html: "",
	 *  actions : {
	 * 	   "Tallenna" : callbackFunction,
	 * 	   "Sulje" : callbackFunction
	 * }
	 * }]
     */
	getContent : function() {
		return this._content;
	},
    /**
     * @method getPosition
     * @return {OpenLayers.LonLat} coordinates where to show the popup
     */
	getPosition : function() {
		return this._position;
	},
    /**
     * @method getHidePrevious
     * @return {Boolean} if true, hides any previous popups when showing this
     */
	getHidePrevious : function() {
		return this._hidePrevious;
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler
 * Handles Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest to show an info box/popup.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
 *          reference to plugin that handles the popups
 */
function(popupPlugin) {
    this.popupPlugin = popupPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Shows an infobox/popup with requested properties
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	
    	if(request.getHidePrevious()) {
        	this.popupPlugin.close();
    	}
        this.popupPlugin.popup(request.getId(),request.getTitle(),request.getContent(), request.getPosition());
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest
 * Requests a map popup/infobox to be hidden, if id for popup is not given -> Hides all popups
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id for popup/infobox (optional)
 */
function(id) {
	this._creator = null;
	this._id = id;
}, {
    /** @static @property __name request name */
	__name : "InfoBox.HideInfoBoxRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	},
    /**
     * @method getId
     * @return {String} popup/infobox id
     */
	getId : function() {
		return this._id;
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler
 * Handles Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest to hide info box.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
 * 			reference to plugin that handles the popups
 */
function(popupPlugin) {
    this.popupPlugin = popupPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Hides the requested infobox/popup
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.popupPlugin.close(request.getId());
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
