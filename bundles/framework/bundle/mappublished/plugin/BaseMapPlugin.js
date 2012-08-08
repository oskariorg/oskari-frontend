/**
 * @class Oskari.mapframework.bundle.mappublished.BaseMapPlugin
 * Provides the functionality to change between selected base maplayers
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.BaseMapPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 * Needs atleast toolsContainer in config as the HTML div id where to render the UI
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    
    this._conf = config;
    this._layers = [];
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.BaseMapPlugin',

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
        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._buildLayersList(this._conf);
        this._createUI();
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

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
        
        // TODO: check if added?
        // unbind change listener on dropdown and remove ui
    	jQuery("#baseMapSelection").unbind('change');
        jQuery("#basemap-div").remove();
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
    	/*
        'DummyEvent' : function(event) {
            alert(event.getName());
        }*/
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
     * @method _buildLayersList
     * @private
     * Contructs an internal list of layers to show in dropdown
     *
     * @param {Object} conf
     * 			map published bundles configuration
     */
    _buildLayersList : function(conf) {
    	if(!conf  || !conf.baseMaps) {
    		return;
    	}
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var baseLayers = conf.baseMaps;
        // loop and create base layer list
    	for(var j = 0; j < baseLayers.length; j++) {
        	var layer = mapLayerService.findMapLayer(baseLayers[j]);
        	if(layer) {
        		this._layers.push(layer);
        	}
        }
    },
    	
    /**
     * @method _createUI
     * @private
     * Creates the dropdown to show in UI
     */
    _createUI : function() {
    	
        if(this._layers.length < 2 || !this._conf.toolsContainer) {
            // 0-1 maplayers or tools container not defined, no need/can't to do anything
            return;
        }
		var sandbox = this._sandbox;
		// create dropdown
    
        jQuery("<div id='basemap-div'><select id='baseMapSelection'></select></div>").appendTo("#" + this._conf.toolsContainer);

		// add options to dropdown
		var firstBaseLayerId = '';
        for(var i = 0; i < this._layers.length; i++) {

            var id = this._layers[i].getId();

            jQuery("<option id='BasemapButton-" + id + "' value='" + id + 
            		"' class='basemapButton'>" + this._layers[i].getName() + 
            		"</option>").appendTo("#baseMapSelection");
            if(firstBaseLayerId == '') {
                firstBaseLayerId = id;
            }
        }
        
        // bind change event
        var me = this;
        jQuery("#baseMapSelection").change(function(){
    	    me._changeBaseLayer(jQuery(this).val());
	    });
    },
    /**
     * @method _changeBaseLayer
     * @private
     * 
     * Sends out Oskari.mapframework.request.common.RemoveMapLayerRequest
     * to remove currently visible base layer and 
     * Oskari.mapframework.request.common.AddMapLayerRequest to add
     * one matching the selection 
     * 
     * @param {String} layerId
     * 			map layer id that we want to show
     */
    _changeBaseLayer : function(layerId) {

        var sandbox = this._sandbox;

		// find and remove old base layer       
        for(var i = 0; i < this._layers.length; i++) {
        	try {
				var selectedLayer = sandbox.findMapLayerFromSelectedMapLayers(this._layers[i].getId());
				if(selectedLayer) {
					// if we get this far -> layer selected -> remove it
			        var rb = sandbox.getRequestBuilder('RemoveMapLayerRequest');
			        var r = rb(selectedLayer.getId());
			        sandbox.request(this.getName(), r);
	        	}
        	} catch(ignored) {
        		// couldn't find layer in selected, no problemos
        	}
        	
		}
		
        // add requested layer to map
        var rb = sandbox.getRequestBuilder('AddMapLayerRequest');
        var r = rb(layerId, false, true);
        sandbox.request(this.getName(), r);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
