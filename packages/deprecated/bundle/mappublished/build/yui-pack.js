/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 * Handles modules implementing Stateful protocol to get application state 
 * and uses the registered plugin to handle saving the state.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the bundle
 * 
 */
function() {
    this._localization = null;
    this._pluginInstances = {};
    this._startupState = null;
    
    this._historyPollingInterval = 1500;
    this._historyTimer = null;
    this._historyPrevious = [];
    this._historyEnabled = true;
    this._historyNext = [];

    this._currentViewId = 1;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'StateHandler',
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
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}
		
        // sends a request that adds button described in config
        /*var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'add'));
        }*/

        // TODO: move to some less generic init place (application start) because
        // we only want this for mapfull?
    	var ajaxUrl = "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&";
        var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin', ajaxUrl);
        this.registerPlugin(sessionPlugin);
        this.startPlugin(sessionPlugin);
        
		sandbox.addRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.addRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);

        // only use saved state if we have no controlling querystring params in
        // url (linked location etc)
        // server should return the saved session state on startup
        /*var queryStr = location.search;
        if(!queryStr) {
            this.useState(sessionPlugin.getState());
        }*/
    },
  
    /**
     * @method update
     *
     * implements bundle instance update method
     */
    "update" : function() {

    },
	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
    "stop" : function() {
		var sandbox = this.sandbox();
		sandbox.removeRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.removeRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);
        // sends a request that removes button described in config
        var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'remove'));
        }

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}
		this.sandbox.unregister(this);
		this.started = false;
    },
    
	/**
	 * @method init
	 * implements Module protocol init method
	 */
	"init" : function() {
		var me = this;
        // config for toolbutton that is used to reset state to original
        this.toolbar = {
            config : {
                group : this.getName(),
                toolId : 'statehandler.reset',
                iconCls : 'statehandler_reset_tool',
                tooltip : this.getLocalization('reset'),
                callback : function() {
                    me.resetState();
                }
            }
        };
		var sandbox = Oskari.$("sandbox");
		this.requestHandlers = {
			setStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', sandbox, this),
			saveStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', sandbox, this)
		};
        // headless
		return null;
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
        'AfterMapMoveEvent' : function(event) {
            var me = this;
            if(this._historyEnabled === true) {
                
                // we might get multiple events on one move so give a bit tolerance between moves
                if(this._historyTimer) {
                    clearTimeout(this._historyTimer);
                    this._historyTimer = null;
                }
                this._historyTimer = setTimeout(function() {
                    var mapfull = me.sandbox.getStatefulComponents()['mapfull'];
                    if(mapfull) {
                        var state = mapfull.getState();
                        //this._currentHistoryStep = state;
                        me._historyPrevious.push(state);
                    }
                }, this._historyPollingInterval);
            }
        }
	},
    historyMoveNext : function() {
        if(this._historyNext.length > 0) {
            var state = this._historyNext.pop();
            this._historyPrevious.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
    historyMovePrevious : function() {
        if(this._historyPrevious.length > 0) {
            var state = this._historyPrevious.pop();
            // insert to first
            //this._historyNext.splice(0,0,state);
            this._historyNext.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
	
    /**
     * @method registerPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Registers the plugin to be used with this state handler implementation.
     */
    registerPlugin : function(plugin) {
        plugin.setHandler(this);
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
        this._pluginInstances[pluginName] = plugin;
    },
    /**
     * @method unregisterPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Tears down the registration of the plugin that was previously registered
     * to this state handler implementation.
     */
    unregisterPlugin : function(plugin) {
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
        this._pluginInstances[pluginName] = undefined;
        plugin.setHandler(null);
    },
    /**
     * @method startPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Starts the plugin. Calls plugins startPlugin()-method.
     */
    startPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(this.sandbox);
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Stops the plugin. Calls plugins stopPlugin()-method.
     */
    stopPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(this.sandbox);
    },

    /**
     * @method setCurrentViewId
     * @param {Number} Current view ID
     */
    setCurrentViewId : function(currentViewId) {
	this._currentViewId = currentViewId;
    },
    /**
     * @method getCurrentViewId
     * @return Current view ID
     */
    getCurrentViewId : function() {
	return this._currentViewId;
    }

}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
/**
 * This enchancement adds all preselected layers on map
 *
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement', function() {
}, {
    enhance : function(core) {
        core.printDebug("Checking if map is started with link...");

        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        var mapLayers = core.getRequestParameter('mapLayers');
        var markerVisible = core.getRequestParameter('showMarker');
        var keepLayersOrder = core.getRequestParameter('keepLayersOrder');

        if(keepLayersOrder === null) {
            keepLayersOrder = true;
        } 

        core.getMap().setMarkerVisible(markerVisible == 'true');

        if(coord === null || zoomLevel === null) {
            // not a link
            return;
        }

        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
         */
        if(coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if(longitude === null || latitude === null) {
            core.printDebug("Could not parse link location. Skipping.");
            return;
        }
        core.getMap().moveTo(longitude, latitude, zoomLevel);
        //core.processRequest(core.getRequestBuilder('MapMoveRequest')(longitude,
        // latitude, 0, showMarker));

        core.printDebug("This is startup by link, moving map...");

        if(mapLayers !== null && mapLayers !== "") {
            core.printDebug("Continuing by adding layers...");
            var layerStrings = mapLayers.split(",");

            for(var i = 0; i < layerStrings.length; i++) {
                var splitted = layerStrings[i].split("+");
                var layerId = splitted[0];
                var opacity = splitted[1];
                var style = splitted[2];
                if((layerId.indexOf("_") != -1) && 
                   (layerId.indexOf("base_") == -1) && 
                   (layerId.indexOf("BASE_") == -1)) {
                    var subIds = layerId.split("_");
                    layerId = null;
                    var baseLayer = null;
                    for(var subId in subIds) {
                        if (subId) {
                            baseLayer = 
                                core.findBaselayerBySublayerIdFromAllAvailable(subIds[subId]);
                            if(baseLayer) {
                                layerId = baseLayer.getId();
                                break;
                            }
                        }
                    }
                }
                if(layerId !== null) {
                    var rb = null;
                    var r = null;
                    rb = core.getRequestBuilder('AddMapLayerRequest');
                    r = rb(layerId, keepLayersOrder);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerOpacityRequest');
                    r = rb(layerId, opacity);
                    core.processRequest(r);
                    rb = core.getRequestBuilder('ChangeMapLayerStyleRequest');
                    r = rb(layerId, style);
                    core.processRequest(r);
                } else {
                    core.printWarn("[StartMapWithLinkEnhancement] " + 
                                   "Could not find baselayer for " + 
                                   layerId);
                }
            }
        }
        //core.scheduleMapLayerRearrangeAfterWfsMapTilesAreReady();
    }
}, {
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */
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
/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.SearchPlugin',
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
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.SearchPlugin',

    /**
     * @method getName
     * @return {String} plugin name
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
        return "<div id='basemapButtonsDiv' class='search-div-with-basemap-buttons'></div>";
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
        jQuery("#search-div").remove();
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
    eventHandlers : {/*
        'DummyEvent' : function(event) {
            alert(event.getName());
        }*/
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    
    /**
     * @method _createUI
     * @private
     * Creates UI for search functionality in the 
     * HTML div thats id is passed in #_conf.toolsContainer
     */
    _createUI : function() {
    	var sandbox = this._sandbox;
    	var me = this;
    	
		this._searchBoxMessage = sandbox.getText("rightpanel_search_find_places_textbox_value");
        var buttonSearchMessage = sandbox.getText("rightpanel_search_find_places_button_value");
		var closeSearchMessage = sandbox.getText("rightpanel-searchresults-close_button_value");
		
		var html =  '<div id="search-div">' +
        '<div id="search-textarea-and-button">' +
            '<input id="search-string" value="' + this._searchBoxMessage + '" type="text" name="search-string" />' +
            '<input id="search-button" type="button" value="' + buttonSearchMessage + '" name="search-button" />' +
        '</div>' + 
        '<div id="search-container" class="hidden">' + 
        '<img id="close-search-button" src="' + startup.imageLocation + '/resource/icons/poisto.png" alt="' + closeSearchMessage +'" title="' + closeSearchMessage + '"/>' +
        '<div id="search-results-header">&nbsp;</div>' +
        '<div id="search-results"></div>' +
        '</div>' +
        '</div>';
        
        jQuery(html).appendTo("#" + this._conf.toolsContainer);
        
        // bind events
        var me = this;
        // to text box
        jQuery("#search-string").focus(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
            me._checkForKeywordClear();
	    });
        jQuery("#search-string").blur(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
            me._checkForKeywordInsert();
	    });
	    
        jQuery("#search-string").keypress(function(event){
            me._checkForEnter(event);
	    });
	    // to search button
        jQuery("#search-button").click(function(event){
            me._doSearch();
	    });
	    // to close button
        jQuery("#close-search-button").click(function(event){
            me._hideSearch();
            // TODO: this should also unbind the TR tag click listeners?
	    });
    },
    
    
    /**
     * @method _checkForEnter
     * @private
     * @param {Object} event
     * 		keypress event object from browser
     * Detects if <enter> key was pressed and calls #_doSearch if it was
     */
	_checkForEnter : function(event) {
        var keycode;
        if (window.event) {
            keycode = window.event.keyCode;
        } else if (event) {
            keycode = event.which;
        } 
	  
        if (event.keyCode == 13) {
            this._doSearch();
        }
	},
	
    /**
     * @method _doSearch
     * @private
     * Sends out a Oskari.mapframework.request.common.SearchRequest with results callback #_showResults
     */
    _doSearch : function() {
        if(this._searchInProgess == true) {
            return;
        }

		var me = this;
        this._hideSearch();
        this._searchInProgess = true;
        jQuery("#search-string").addClass("search-loading");
        var searchText = jQuery("#search-string").val();
        
        var searchCallback = function(msg) {
        	me._showResults(msg);
        };
        var onCompletionCallback = function() {
        	me._enableSearch();
        };
        
        var request = this._sandbox.getRequestBuilder('SearchRequest')(encodeURIComponent(searchText), searchCallback, onCompletionCallback);
        this._sandbox.request(this.getName(), request);
    },
    /**
     * @method _showResults
     * @private
     * @param {Object} msg 
     * 			Result JSON returned by search functionality
     * Renders the results of the search or shows an error message if nothing was found.
     * Coordinates and zoom level of the searchresult item is written in data-href 
     * attribute in the tr tag of search result HTML table. Also binds click listeners to <tr> tags.
     * Listener reads the data-href attribute and calls #_resultClicked with it for click handling.
     */
    _showResults : function(msg) {
		// check if there is a problem with search string       
		var errorMsg = msg.error;
		var me = this;
		if (errorMsg != null) {
			jQuery("#search-results").html("<div>" + errorMsg + "</div>");
			jQuery("#search-container").removeClass("hidden");
            return;
		}
		
		// success
		var totalCount = msg.totalCount;
		if (totalCount == 0) {
			jQuery("#search-results").html(this._sandbox.getText('search_published_map_no_results'));
			jQuery("#search-container").removeClass("hidden");
		} else if (totalCount == 1) {
			// only one result, show it immediately
			var lon = msg.locations[0].lon;
			var lat = msg.locations[0].lat;
			var zoom = msg.locations[0].zoomLevel;
			
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
		} else {
			// many results, show all
			var allResults = "<table id='search-result-table'><thead><tr class='search-result-header-row'><th>" + 
				this._sandbox.getText('searchservice_search_result_column_name') + "</th><th>" + 
				this._sandbox.getText('searchservice_search_result_column_village') + "</th><th>" + 
				this._sandbox.getText('searchservice_search_result_column_type') + "</th></tr></thead><tbody>";
				
			for(var i=0; i<totalCount; i++) {
			
				if (i>=100) {
				  allResults += "<tr><td class='search-result-too-many' colspan='3'>" + this._sandbox.getText('search_published_map_too_many_results') + "</td></tr>";
				  break;
				}
				
				var name = msg.locations[i].name;
				var municipality = msg.locations[i].village;
				var type = msg.locations[i].type;
				var lon = msg.locations[i].lon;
				var lat = msg.locations[i].lat;
				var zoom = msg.locations[i].zoomLevel;
				var cssClass = "class='search-result-white-row'";
				if (i % 2 == 1) {
				    cssClass = "class='search-result-dark-row'";
				}
				var row = "<tr " + cssClass + " data-href='" + lon + "---" + lat + "---" + zoom + "'><td nowrap='nowrap'>" + name + "</td><td nowrap='nowrap'>" + municipality + "</td><td nowrap='nowrap'>" + type + "</td></tr>"; 
				
				allResults += row;               
		  }
		  
		  allResults += "</tbody></table>";
		  jQuery("#search-results").html(allResults);
		  jQuery("#search-container").removeClass("hidden");
		  // bind click events to search result table rows
		  // coordinates and zoom level of the searchresult is written in data-href attribute in the tr tag
		  jQuery('#search-result-table tbody tr[data-href]').addClass('clickable').click( 
		  	function() {
				me._resultClicked(jQuery(this).attr('data-href'));
			}).find('a').hover( function() {
				jQuery(this).parents('tr').unbind('click');
			}, function() {
				jQuery(this).parents('tr').click( function() {
					me._resultClicked(jQuery(this).attr('data-href'));
				});
		  }); 
		}
	},
	
    /**
     * @method _resultClicked
     * @private
     * @param {String} paramStr String that has coordinates and zoom level separated with '---'.
     * Click event handler for search result HTML table rows.
     * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
     */
	_resultClicked : function(paramStr) {
			var values = paramStr.split('---');
			var lon = values[0];
			var lat = values[1];
			var zoom = values[2];
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
	},
	
    /**
     * @method _enableSearch
     * @private
	 * Resets the 'search in progress' flag and removes the loading icon
     */
	_enableSearch : function() {
        this._searchInProgess = false;
		jQuery("#search-string").removeClass("search-loading");
	},
	
    /**
     * @method _hideSearch
     * @private
	 * Hides the search result and sends out Oskari.mapframework.request.common.HideMapMarkerRequest
     */
	_hideSearch : function() {
		jQuery("#search-container").addClass("hidden");
		
		/* Send hide marker request */				 
    	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('HideMapMarkerRequest')());
   },
   
	
    /**
     * @method _checkForKeywordClear
     * @private
	 * Clears the search text if the field has the default value (#_searchBoxMessage)
     */
	_checkForKeywordClear : function() {
        if (jQuery("#search-string").val() == this._searchBoxMessage) {
            jQuery("#search-string").val("");
        }
	},

    /**
     * @method _checkForKeywordInsert
     * @private
	 * Sets the search text to default value (#_searchBoxMessage) if the field is empty
     */
    _checkForKeywordInsert : function() {
        if (jQuery("#search-string").val() == "") {
            jQuery("#search-string").val(this._searchBoxMessage);
        }
    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.mappublished.MapInfoPlugin
 * Provides the NLS logo and link to terms of use for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.MapInfoPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 * Config is needed atleast for:
 *  - config.parentContainer  as the HTML div id where to render the UI
 *  - config.termsUrl to create the link to terms of use page
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.MapInfoPlugin',

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
    	jQuery("#finnish-geoportal-logo").unbind('click');
        jQuery("#logo-image").remove();
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
     * @method _createUI
     * @private
     * Creates logo and terms of use links on top of map
     */
    _createUI : function() {
    	
		var sandbox = this._sandbox;
		// create dropdown
		var logoHtml = "<div id='logo-image'><img id='finnish-geoportal-logo' style='cursor: pointer;' src='" + 
        		startup.imageLocation +"/resource/images/logo_pieni.png'/></div>";   
        
        jQuery(logoHtml).appendTo("#" + this._conf.parentContainer);
        
        jQuery("#finnish-geoportal-logo").click(function(){
	    	var url = sandbox.generatePublishedMapLinkToFinnishGeoportalPage();
	    	window.open(url, '_blank');
	    });
	    
		var text = "<span id='terms-of-use-link' class='link-no-hover-gray'><a href='" + this._conf.termsUrl + "'  target='_blank'>" + sandbox.getText("published_map_terms_of_use") + "</a></span>"
    	jQuery(text).appendTo("#logo-image");
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
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
