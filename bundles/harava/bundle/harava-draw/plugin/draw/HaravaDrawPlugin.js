/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaDrawPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaDrawPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(locale, conf) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._show = true;
    this._conf=conf;
    /*
    this._searchLayer = null;
    this._oldSearchLayer = null;
    */
    this.currentSearchMode = null;
    this._locale = locale;
    
    this.featureStyle = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(
            {
                pointRadius: 8,
                strokeColor: "#1C7372",
                fillColor: "#1C7372",
                fillOpacity: 0.3,
                strokeOpacity: 0.4,
                strokeWidth: 3
        })
    });
}, {
    /** @static @property __name plugin name */
    __name : 'HaravaDrawPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * Toggle visibility of plugin
     * @param visible
     */
    toggleVisibility: function(visible){
    	var me = this;
    	if(visible){
    		jQuery('#harava-add-geometry-tools').show();
    		me._sandbox.postRequestByName('StartGeometrySearchRequest', ['pan']);
    		me._show=true;
    	}else{
    		jQuery('#harava-add-geometry-tools').hide();
    		me._hide=false;
    	}
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        this._sandbox = sandbox;
        this._sandbox.printDebug("[HaravaDrawPlugin] init");
        /*
    	me._searchLayer = new OpenLayers.Layer.Vector("Harava search geometry layer", {
    		eventListeners : {
                "featuresadded" : function(layer) {
                	// send an event that the drawing has been completed
                    me.finishedDrawing();
                }
            },
            styleMap: this.featureStyle
    	});
    	me._oldSearchLayer = new OpenLayers.Layer.Vector("Harava old search geometry layer", {
    		styleMap: this.featureStyle
    	});
    	me._map.addLayers([me._searchLayer,me._oldSearchLayer]);
    	
    	this.searchControls = {
            point: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Path),
            regularPolygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                                OpenLayers.Handler.RegularPolygon),
            polygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Polygon),
        };
    	
    	this.searchControls.regularPolygon.handler.setOptions({irregular: true});
    	*/
        
        var html='<div id="harava-add-geometry-tools"></div>';
        jQuery('#'+me._map.div.id).append('<div id="harava-add-geometry"></div>');
        jQuery('#harava-add-geometry').append(html);

        var tool0 = '<div id="harava-add-geometry-tool-point" class="harava-add-geometry-tool harava-add-geometry-tool-point harava-add-geometry-top-tooltopmargin"></div>';
        var tool1 = '<div id="harava-add-geometry-tool-line" class="harava-add-geometry-tool harava-add-geometry-tool-line"></div>';
        var tool2 = '<div id="harava-add-geometry-tool-area" class="harava-add-geometry-tool harava-add-geometry-tool-area"></div>';
        var tool3 = '<div id="harava-add-geometry-tool-delete" class="harava-add-geometry-tool harava-add-geometry-tool-delete"></div>';


        jQuery('#harava-add-geometry-tools').append(tool0);
        jQuery('#harava-add-geometry-tools').append(tool1);
        jQuery('#harava-add-geometry-tools').append(tool2);
        jQuery('#harava-add-geometry-tools').append(tool3);
        
        jQuery('.harava-add-geometry-tool').live('click', function(){
        	me._sandbox.postRequestByName('StartGeometrySearchRequest', ['pan']);
    		var id = this.id;
    		if(id!='harava-add-geometry-tool-delete'){
    			jQuery('.harava-add-geometry-tool').removeClass('active');
    			jQuery(this).addClass('active');
    		}
    		
    		switch(id){
				case 'harava-add-geometry-tool-point':
					//me.toggleControl('point');
					break;
				case 'harava-add-geometry-tool-line':
					//me.toggleControl('line'); 
					break;
				case 'harava-add-geometry-tool-area':
					//me.toggleControl('polygon');
					break;
				case 'harava-add-geometry-tool-delete':
					jQuery('#harava-add-geometry-tool-delete').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#harava-add-geometry-tool-delete').removeClass('active');
			    	},200);
					break;
    		}
    		
    	});
        
        // Do default tool selection
    	jQuery('#harava-add-geometry-tool-point').trigger('click');
    	
    	if(me._conf!=null && me._conf.visibility!=null){
    		me.toggleVisibility(me._conf.visibility);
    	}
    	

        /*
    	jQuery('#searchbygeom').append('<div class="search-by-geometry">'
    			+ '<div id="searchbygeom-pan" class="searchbygeom-tool searchbygeom-pan" title="'+this._locale.tooltips.panMap+'"></div>'
    			+ '<div id="searchbygeom-point" class="searchbygeom-tool searchbygeom-point" title="'+this._locale.tooltips.searchByPoint+'"></div>'
    			//+ '<div id="searchbygeom-line" class="searchbygeom-tool searchbygeom-line" title="'+this._locale.tooltips.searchByLine+'"></div>'
    			+ '<div id="searchbygeom-mapextent" class="searchbygeom-tool searchbygeom-mapextent" title="'+this._locale.tooltips.searchByMapExtent+'"></div>'
    			+ '<div id="searchbygeom-regular-polygon" class="searchbygeom-tool searchbygeom-regular-polygon" title="'+this._locale.tooltips.searchByRegularPolygon+'"></div>'
    			+ '<div id="searchbygeom-polygon" class="searchbygeom-tool searchbygeom-polygon" title="'+this._locale.tooltips.searchByPolygon+'"></div></div>');    	
    	
    	jQuery('.searchbygeom-tool').live('click', function(){
    		var id = this.id;
    		if(id!='searchbygeom-mapextent'){
    			jQuery('.searchbygeom-tool').removeClass('active');
    			jQuery(this).addClass('active');
    		}
    		
    		switch(id){
    			case 'searchbygeom-point':
    				me.toggleControl('point');
    				break;
    			case 'searchbygeom-mapextent':
    	        	var mapExtent = me._map.getExtent();
    	        	var mapExtentPolygon = 'POLYGON(('+mapExtent.left+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.top + '))';
    	        	me._handleSearchByGeom(mapExtentPolygon,'mapextent');
    	        	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	jQuery('#searchbygeom-mapextent').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#searchbygeom-mapextent').removeClass('active');
			    	},200);
			    	
    				break;
    			case 'searchbygeom-polygon':
    				me.toggleControl('polygon'); 
    				break;
    			case 'searchbygeom-regular-polygon':
    				me.toggleControl('regularPolygon');
    				break;
    			case 'searchbygeom-pan':
    				me.toggleControl('pan');
    				break;
    		}
    	});
    	
    	
    	for(var key in me.searchControls) {
    		me._map.addControl(me.searchControls[key]);
        }
    	
    	// Do default tool selection
    	$('#searchbygeom-pan').trigger('click');
    	*/
    },
    /**
     * @method finishedDrawing
     * Finish drawing
     */
    finishedDrawing : function(){
    	var me = this;
    },
    /**
     * Enables the given search control
     * Disables all the other search controls
     * @param searchMode search control to activate (if undefined, disables all
     * controls)
     * @method
     */
    toggleControl : function(searchMode) {
    	this.currentSearchMode = searchMode;
    	var me = this;
        for(var key in this.searchControls) {
            var control = this.searchControls[key];
            if(searchMode == key) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._map = this.getMapModule().getMap();

        this._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        var me = this;
                
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        
        
        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    	
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        /*var me = this;
        return this.eventHandlers[event.getName()].apply(this, [event]);
        */
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
