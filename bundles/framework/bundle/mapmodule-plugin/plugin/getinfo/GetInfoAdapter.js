/* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Click.js
 * @requires OpenLayers/Handler/Hover.js
 * @requires OpenLayers/Request.js
 */

/**
 * @class OpenLayers.Control.GetInfoAdapter
 * Class: OpenLayers.Control.WMSGetFeatureInfo The WMSGetFeatureInfo control
 * uses a WMS query to get information about a point on the map. The information
 * may be in a display-friendly format such as HTML, or a machine-friendly
 * format such as GML, depending on the server's capabilities and the client's
 * configuration. This control handles click or hover events, attempts to parse
 * the results using an OpenLayers.Format, and fires a 'getfeatureinfo' event
 * with the click position, the raw body of the response, and an array of
 * features if it successfully read the response.
 * 
 * Inherits from: - <OpenLayers.Control>
 */
Oskari.$("OpenLayers.Control.GetInfoAdapter",OpenLayers.Class(OpenLayers.Control, {

   /**
	 * APIProperty: hover {Boolean} Send GetFeatureInfo requests when mouse
	 * stops moving. Default is false.
	 */
    hover: false,
    

    /**
	 * APIProperty: drillDown {Boolean} Drill down over all WMS layers in the
	 * map. When using drillDown mode, hover is not possible, and an infoFormat
	 * that returns parseable features is required. Default is false.
	 */
    drillDown: false,

    /**
	 * APIProperty: maxFeatures {Integer} Maximum number of features to return
	 * from a WMS query. This sets the feature_count parameter on WMS
	 * GetFeatureInfo requests.
	 */
    maxFeatures: 10,

    /**
	 * APIProperty: clickCallback {String} The click callback to register in the {<OpenLayers.Handler.Click>}
	 * object created when the hover option is set to false. Default is "click".
	 */
    clickCallback: "click",
    
    /**
	 * APIProperty: handlerOptions {Object} Additional options for the handlers
	 * used by this control, e.g. (start code) { "click": {delay: 100}, "hover":
	 * {delay: 300} } (end)
	 */
    handlerOptions: null,
    
    /**
	 * Property: handler {Object} Reference to the <OpenLayers.Handler> for this
	 * control
	 */
    handler: null,
    
    /**
	 * @property EVENT_TYPES
	 * @static
	 * 
	 * Supported event types (in addition to those from <OpenLayers.Control>):
	 * beforegetfeatureinfo - Triggered before the request is sent. The event
	 * object has an *xy* property with the position of the mouse click or hover
	 * event that triggers the request. nogetfeatureinfo - no queryable layers
	 * were found. getfeatureinfo - Triggered when a GetFeatureInfo response is
	 * received. The event object has a *text* property with the body of the
	 * response (String), a *features* property with an array of the parsed
	 * features, an *xy* property with the position of the mouse click or hover
	 * event that triggered the request, and a *request* property with the
	 * request itself. If drillDown is set to true and multiple requests were
	 * issued to collect feature info from all layers, *text* and *request* will
	 * only contain the response body and request object of the last request.
	 */
    EVENT_TYPES: ["beforegetfeatureinfo", "nogetfeatureinfo", "getfeatureinfo"],

    /**
	 * Constructor: <OpenLayers.Control.WMSGetFeatureInfo>
	 * 
	 * Parameters: options - {Object}
	 */
    initialize: function(options) {
	
	
        // concatenate events specific to vector with those from the base
        this.EVENT_TYPES =
            //OpenLayers.Control.WMSGetFeatureInfo.prototype.EVENT_TYPES.concat(
            OpenLayers.Control.prototype.EVENT_TYPES
        //)
            ;

        options = options || {};
		this.callback = options.callback ;
		this.hoverCallback = options.hoverCallback ;
        
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        
        if(this.drillDown === true) {
            this.hover = false;
        }

        if(this.hover) {
            this.handler = new OpenLayers.Handler.Hover(
                   this, {
                       'move': this.cancelHover,
                       'pause': this.getInfoForHover
                   },
                   OpenLayers.Util.extend(this.handlerOptions.hover || {}, {
                       'delay': 250
                   }));
        } else {
            var callbacks = {};
            callbacks[this.clickCallback] = this.getInfoForClick;
            this.handler = new OpenLayers.Handler.Click(
                this, callbacks, this.handlerOptions.click || {});
        }
    },

    /**
	 * Method: activate Activates the control.
	 * 
	 * Returns: {Boolean} The control was effectively activated.
	 */
    activate: function () {
        if (!this.active) {
            this.handler.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(
            this, arguments
        );
    },

    /**
	 * Method: deactivate Deactivates the control.
	 * 
	 * Returns: {Boolean} The control was effectively deactivated.
	 */
    deactivate: function () {
        return OpenLayers.Control.prototype.deactivate.apply(
            this, arguments
        );
    },
    
    /**
	 * Method: getInfoForClick Called on click
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
    getInfoForClick: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        // Set the cursor to "wait" to tell the user we're working on their
        // click.
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy, {});
    },
   
    /**
	 * Method: getInfoForHover Pause callback for the hover handler
	 * 
	 * Parameters: evt - {Object}
	 */
    getInfoForHover: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        this.request(evt.xy, {hover: true});
    },

    /**
	 * Method: cancelHover Cancel callback for the hover handler
	 */
    cancelHover: function() {
    },

    /**
	 * Method: request Sends a GetFeatureInfo request to the WMS
	 * 
	 * Parameters: clickPosition - {<OpenLayers.Pixel>} The position on the map
	 * where the mouse event occurred. options - {Object} additional options for
	 * this method.
	 * 
	 * Valid options: - *hover* {Boolean} true if we do the request for the
	 * hover handler
	 */
    request: function(clickPosition, options) {
      
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
        
        
        var loc = this.map.getLonLatFromViewPortPx(clickPosition); 
        /*
		 * 
		 */
        if(options.hover&&this.hoverCallback)
        	this.hoverCallback(loc,clickPosition,options);
        else if( this.callback )
        	this.callback(loc,clickPosition,options);
        
    },
    
    

    /**
     * @property {String} CLASS_NAME
     * @static  
     */
    CLASS_NAME: "OpenLayers.Control.GetInfoAdapter"
}));
