/**
 * @class Oskari.mapframework.bundle.mappublished.GetFeatureInfoPlugin
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.GetFeatureInfoPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this._gfiLayers = [];
    // if qtip offers a built-in functionality for this, refactor to use that instead
    this._toolTipVisible = false;
    //this._loadingHtml = '<div style="width: 100%; height: 100%;"><img style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;" src="' + startup.imageLocation + '/resource/images/map-loading.gif"/></div>';
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.GetFeatureInfoPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        this._activateGFI();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        this._deactivateGFI();
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
	/** 
	 * @property {Object} eventHandlers 
	 * @static 
	 */
    eventHandlers : {
    	
        'AfterGetFeatureInfoEvent' : function(event) {
            this._afterGetFeatureInfoEvent(event);
        },
        'AfterAppendFeatureInfoEvent' : function(event) {
            this._afterAppendFeatureInfoEvent(event);
        },
        'MapClickedEvent' : function(event) {
        	this._handleMapClick(event.getMouseX(), event.getMouseY(), event.getLonLat());
        }
    },

	/** 
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    
    /**
     * @method _activateGFI
     * @private
     * Builds internal data for sending out Oskari.mapframework.request.common.GetFeatureInfoRequest
     * based on any layers in #_conf.gfiLayer.id 
     */
    _activateGFI : function() {
    	if(!this._conf || !this._conf.gfiLayer || !this._conf.gfiLayer.id || this._conf.gfiLayer.id.length === 0) {
    		return;
    	}
    	
    	// only do stuff if activated
		var sandbox = this._sandbox;
		
        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
		
        // startup.queryableLayers = {id: ["15"]};
        for(var i = 0; i < this._conf.gfiLayer.id.length; i++) {
        	var layer = sandbox.findMapLayerFromAllAvailable(this._conf.gfiLayer.id[i]);
        	if(layer) {
        		this._gfiLayers.push(layer);
        	}
        }
        
        this._initializeFeatureInfoPopup(sandbox);
        
        // make the initial GFI if showGetFeatureInfo url parameter is true
		var showGetFeatureInfo = sandbox.getRequestParameter("showGetFeatureInfo");
		if(showGetFeatureInfo == "true"){
			var lon = sandbox.getMap().getX();
			var lat = sandbox.getMap().getY();
			var lonlat = new OpenLayers.LonLat(lon,lat);
			var mousePix = this._map.getPixelFromLonLat(lonlat);
			
	        /*rb = sandbox.getRequestBuilder('GetFeatureInfoRequest');
	        r = rb(sandbox.findAllHighlightedLayers(), lon, lat,mousePix.x, mousePix.y);
	        sandbox.request(this.getName(), r);*/
	        this._handleMapClick(mousePix.x, mousePix.y, lonlat);
		}
    },
    
    /**
     * @method _deactivateGFI
     * @private
     * Deactivates GetFeatureInfo functionality if any selected in 
     * #_conf.gfiLayer. 
     */
    _deactivateGFI : function() {
    	if(!this._conf && !this._conf.gfiLayer) {
    		return;
    	}
		var sandbox = this._sandbox;
		// remove layers
		this._gfiLayers = [];
        
        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    
    
    _afterGetFeatureInfoEvent : function(event) {
        /* GetFeatureInfo Request is now in progeress.
         * This is the place where you can do something before request are received.
         * Currently there is no need for such action */
        //jQuery("div.qtip-content").html(this._loadingHtml);
    },
    /**
     * @method _afterAppendFeatureInfoEvent
     * Append additional get feature info results
     *
     * @param {Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent}
     *            msg result object
     */
    
    _afterAppendFeatureInfoEvent : function(event) {
   
        var tooltipComponent = jQuery("div.qtip-content");
        var appendedText = tooltipComponent.html();
        // remove "loading screen" if exists
        /*if(appendedText.startsWith('<div')) {
        	appendedText = "";
        }
        else
        */ 
        if (appendedText != "") {
            appendedText += "<hr/>";
        }
        
        
        var msg = event.getMessage();
        // decode from string to json
        if(msg.startsWith('{parsed: {')) {
	        var jsonObj = jQuery.parseJSON(msg);
	        if(jsonObj && jsonObj.parsed) {
	        	// got transformed json
	        	msg = this._formatJsonGFI(jsonObj.parsed);
	        }	
        }
        //else treat as html
        
        msg = '<div style="padding: 5px; font: 11px Tahoma, Arial, Helvetica, sans-serif;">' + msg + '</div>';
        
        appendedText += "<h3>" + event.getHeader() + "</h3>" + msg;
        jQuery("div.qtip-content").html(appendedText);
    },
    
    /**
     * @method _formatJsonGFI
     * @private
     * Formats a parsed GFI response from server to html
     * NOTE: Code copied from searchservice-plugins metadata-module
     *
     * @param {Object}
     *            jsonData json data object
     * @return {String} formatted html
     */
    _formatJsonGFI : function(jsonData) {
    	var html = '<br/><table>';
    	var even = false;
    	for(attr in jsonData) {
    		var value = jsonData[attr];
    		if(value.startsWith('http://')) {
    			value = '<a href="'+ value + '" target="_blank">' + value + '</a>';
    		}
    		html = html + '<tr style="padding: 5px;';
    		if(!even) {
    			html = html + ' background-color: #EEEEEE';
    		}
    		even = !even;
    		html = html + '"><td style="padding: 2px">' + attr + '</td><td style="padding: 2px">' + value + '</td></tr>';
    	}
    	return html + '</table>';
    },
    
    /**
     * @method _handleMapClick
     * @private
     * @param {Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent} event
     * 
     * additional actions on map clicked:
     * -move map to clicked position with some adjustment so tooltip is not 
     * shown ON the spot, but beside it (spot remains visible to user).
     * Sends out Oskari.mapframework.request.common.GetFeatureInfoRequest
     */
    _handleMapClick : function(mouseX, mouseY, lonLat) {
        
        var divId = "#" + this._conf.parentContainer;
        var api = jQuery(divId).qtip("api");

    	if(this._toolTipVisible === true) {
		    // it's visible, do something
		    api.hide();
        	this._toolTipVisible = false;
		}
		else {
			
		    jQuery("div.qtip-content").html('');
			/*var lon = sandbox.getMap().getX();
			var lat = sandbox.getMap().getY();
			var mousePix = this._map.getPixelFromLonLat(new OpenLayers.LonLat(lon,lat));
			*/
	        var rb = this._sandbox.getRequestBuilder('GetFeatureInfoRequest');
	        r = rb(this._gfiLayers, lonLat.lon, lonLat.lat, mouseX, mouseY);
	        this._sandbox.request(this.getName(), r);

		    api.show();
        	this._toolTipVisible = true;
	    	this.mapModule.centerMapByPixels(mouseX + 100, mouseY - 100, true);
		}
	},
    /**
     * Initializes GetFeatureInfo tooltip to given div
     */
    _initializeFeatureInfoPopup : function(sandbox) {
        
        var divId = "#" + this._conf.parentContainer;
       
        // First create tooltip component and bind that to map-div
        
        jQuery(divId).qtip({
            content: '',
            //show: 'click',
            show : {
			    when : false 
			},
            //hide: 'click',      
            hide: {
			    when : false 
			},      
            position: {
                corner: {
                    target: 'center',
                    tooltip: 'bottomLeft'
                },
                adjust: {
                    x: -100,
                    y: 100
                }
            },
            style: { 
                width: 200,
                height: 200,
                padding: 5,
                background: '#FFFFFF',
                color: 'black',
                textAlign: 'center',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                border: {
                   width: 1,
                   radius: 4,
                   color: '#F5AF3C'
                },
                tip: 'bottomLeft',
                name: 'dark' // Inherit the rest of the attributes from the preset dark style
             }
              
        });
                
        var me = this;
                
        /* Finally attach before show callback to tooltip. This will ensure
         * that we actually have GetFeatureInfo button selected and
         * that map has not been moved since mouse down */
        /*
        var api = jQuery(divId).qtip("api");
        
		var bindDiv = this._bindToDiv;
		var sandbox = this._sandbox;
		
		// don't hide if clicked on terms of use link or logo
		
		api.beforeHide = function(e){
			// Safety checks 
            if(e.target.id == "terms-of-use-link" ||  
               e.target.id == "finnish-geoportal-logo"){
                return false;
            }
		};
		*/
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
