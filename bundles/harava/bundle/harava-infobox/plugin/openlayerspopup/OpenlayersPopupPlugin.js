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
 * @class Oskari.harava.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin
 * 
 * Provides a customized popup functionality for Openlayers map.
 */
Oskari.clazz.define('Oskari.harava.bundle.haravaInfobox.plugin.mapmodule.OpenlayersPopupPlugin', 

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
    __name : 'HaravaOpenLayersPopupPlugin',

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
    	this._header = jQuery('<div></div>');
    	this._headerWrapper = jQuery('<div class="popupHeader"></div>');
    	this._headerCloseButton = jQuery('<div class="olPopupCloseBox icon-close-white" style="position: absolute; top: 7px;"></div>');
    	this._contentDiv = jQuery('<div class="popupContent"></div>');
    	this._contentWrapper = jQuery('<div class="contentWrapper"></div>');
    	this._actionLink = jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>');
        this._actionButton = jQuery('<span class="infoboxActionLinks"><input type="button" /></span>');
    	this._contentSeparator = jQuery('<div class="infoboxLine">separator</div>');
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
     * @param {Boolean} hidePrevious
     * 		hide previous popups
     * @param {Integer} width
     * 		popup width
     * @param {Integer} height
     * 		popup height
     * @param {Boolean} centerMap
     * 		if true, centers map to selected coordinates
     * 
     * Displays a popup with given title and data in the given coordinates.
     * 
     * contentData format example:
     * [{
	 * 	html: "",
     *  useButtons: true,
     *  primaryButton: "<button label>",
	 *  actions : {
	 * 	   "Tallenna" : callbackFunction,
	 * 	   "Sulje" : callbackFunction
	 * }
	 * }]
     */
    popup : function(id, title, contentData, lonlat, hidePrevious, width, height, centerMap) {
    	var me = this;
    	 
    	var arrow = this._arrow.clone();
    	var header = this._header.clone();
    	var headerWrapper = this._headerWrapper.clone();
    	var contentDiv = this._contentDiv.clone();
    	var closeButton = this._headerCloseButton.clone();
    	    	
    	var size = this._map.getCurrentSize();
        var mapWidth = size.w;
        var mapHeight = size.h;
        
        // Check if map is over than 900 x 400 pixels bigger then we can change also info to bigger
        if(mapWidth>900 && mapHeight>400){
        	if(width<400){
        		width = 400;
        	}
        	if(height<250){
        		height = 250;
        	}
        }
    	
    	header.append(title);
    	headerWrapper.append(header);
    	headerWrapper.append(closeButton);
    	
    	for(var i =0;i < contentData.length;i++) {
    		if(i != 0) {
		  		contentDiv.append(this._contentSeparator.clone());
    		}
		    var html = contentData[i].html;
		  	var contentWrapper = this._contentWrapper.clone();
		  	contentWrapper.append(html);
		  	var action = contentData[i].actions;
            var useButtons = (contentData[i].useButtons == true);
            var primaryButton = contentData[i].primaryButton;
		  	for(var key in action){ 
	            var attrName = key;
	            var attrValue = action[key];
	            var actionLink = null;
	            if(useButtons) {
	               actionLink = this._actionButton.clone();
                   var btn = actionLink.find('input'); 
                   btn.attr('contentdata', i);
                   btn.attr('value', attrName);
                   if(attrName == primaryButton) {
                       btn.addClass('primary');
                   }
	            }
	            else {
                   actionLink = this._actionLink.clone();
                   var link = actionLink.find('a');
                   link.attr('contentdata', i);
                   link.append(attrName);
	            } 
	            contentWrapper.append(actionLink);
        	}
		  	contentDiv.append(contentWrapper);
		}
		
    	var openlayersMap = this.getMapModule().getMap();
    	
    	
    	if(openlayersMap.popups!=null && openlayersMap.popups.length>0 && hidePrevious){
    		for(var i=0;i<openlayersMap.popups.length;i++){
    			var pop = openlayersMap.popups[i];
    			openlayersMap.removePopup(pop);
    		}
    	}
    	var popup = new OpenLayers.Popup(
                id, 
                new OpenLayers.LonLat(lonlat.lon,lonlat.lat),
                new OpenLayers.Size(width,height),
                arrow.outerHTML() +
                headerWrapper.outerHTML()+
                contentDiv.outerHTML(),
                false
            );
    
        popup.moveTo = function(px) {
        	if ((px != null) && (this.div != null)) {
            	this.div.style.left = px.x + "px";
            	var topy = px.y-20;
            	this.div.style.top = topy + "px";
        	}
    	};
                   
		popup.setBackgroundColor('transparent');
		this._popups[id] = {
		    title : title,
		    contentData : contentData,
		    lonlat : lonlat,
		    popup : popup
		}
		jQuery(popup.div).css('overflow','visible');
		jQuery(popup.groupDiv).css('overflow','visible');
		// override
		popup.events.un({
			"click": popup.onclick,
			scope: popup
		});
		
		popup.events.on({
			"click": function(evt) {
				var link = jQuery(evt.target||evt.srcElement);
				if (link.hasClass('olPopupCloseBox')) { // Close button
					me.close(id);
				} else { // Action links
					var i = link.attr('contentdata');
                    //var text = link.html();
					var text = link.attr('value');
					if(!text) {
					    text = link.html();
					}
					if(contentData[i] && contentData[i].actions && contentData[i].actions[text]) {
						contentData[i].actions[text]();
					}
				}
			},
			scope: popup
		});
	
		openlayersMap.addPopup(popup);
		
		// set popup styles
		var arrowWidth =parseInt($('div.popupHeaderArrow').css('borderRightWidth'),10);
		var titleHeight = jQuery('div.popupHeader').height();
		jQuery('div.popupHeader').width(width-arrowWidth);
		jQuery('div.popupContent').height(height-titleHeight-12);
		
		if(centerMap){
			this._centerMapToSelectedCoordinate(lonlat);
		} else {
			this._panMapToShowPopup(lonlat,width,height);
		}
		
    },
    /**
     * @method _centerMapToSelectedCoordinate
     * @private
     * Centers map to popup position
     * @param {OpenLayers.LonLat} lonlat where to show the popup
     */
    _centerMapToSelectedCoordinate: function(lonlat){
        this._map.setCenter(lonlat);
        this.getMapModule()._updateDomain();
    },
    /**
     * @method _panMapToShowPopup
     * @private
     * Pans map to show popup
     * @param {OpenLayers.LonLat} lonlat where to show the popup
     * @param {Integer} popupWidthPx,  popup width in pixels
     * @param {Integer} popupHeightPx, popup height in pixels
     */
    _panMapToShowPopup : function(lonlat, popupWidthPx, popupHeightPx) {
        var pixels = this._map.getViewPortPxFromLonLat(lonlat);
        var size = this._map.getCurrentSize();
        var width = size.w;
        var height = size.h;
        // if infobox would be out of screen 
        // -> move map to make infobox visible on screen
        var panx = 0;
        var pany = 0;
        var popupMarginWidthPx = 15;
        var popupMarginHeightPx = 0;
        var infoboxWidth = popupWidthPx+popupMarginWidthPx;
        var infoboxHeight = popupHeightPx+popupMarginHeightPx; 
        if( pixels.x + infoboxWidth > width) {
            panx = width - (pixels.x + infoboxWidth);
        }
        if( pixels.y + infoboxHeight > height) {
            pany = height - (pixels.y + infoboxHeight);
        }
        // check that we are not "over the top"
        else if(pixels.y < 25) {
            pany = 25;            
        }

        if(panx != 0 || pany != 0) {
            this.getMapModule().panMapByPixels(-panx, -pany);
        }
        this.getMapModule()._updateDomain();
        
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
