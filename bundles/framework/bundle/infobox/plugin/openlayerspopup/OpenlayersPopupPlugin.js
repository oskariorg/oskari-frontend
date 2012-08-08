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
		this._popups[id] = {
		    title : title,
		    contentData : contentData,
		    lonlat : lonlat,
		    popup : popup
		}
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
            for(var pid in this._popups) {
    			this._popups[pid].popup.destroy();
    			delete this._popups[pid];
            }
            return;
        }
        // id specified, delete only single popup
        if(this._popups[id]) {
            if(this._popups[id].popup) {
                this._popups[id].popup.destroy();
            }
            delete this._popups[id];
        }
        // else notify popup not found?
    },
    /**
     * @method getPopups
     * Returns references to popups that are currently open
     * @return {Object} 
     */
    getPopups : function() {
        return this._popups;
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
