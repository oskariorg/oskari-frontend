/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 * 
 * Initializes Oskari core and starts a map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state. 
 * 
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance", 
/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.state = undefined;
    /**
     * @property {String} mapDivId
     * ID of the DOM element the map will be rendered to 
     * Configurable through conf.mapElement
     */
	this.mapDivId = "mapdiv";
}, {
	/**
	 * @method getMapModule
	 * Returns reference to the map module
	 * @return {Oskari.mapframework.ui.module.common.MapModule}
	 */
	getMapModule : function() {
		return this.mapmodule;
	},
    /**
     * @method getSandbox
     * Returns reference to Oskari sandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
	getSandbox : function() {
		return this.sandbox;
	},

	/**
	 * @method _createUi
	 * Creates the map module and rendes it to DOM element that has the id 
	 * specified by #mapDivId. Sets the size of the element if specified in 
	 * config or if isn't specified, sets the height of the element to window height
	 * and starts listening to window resizing.
	 * Initializes and registers map module plugins if specified in bundles config. 
	 * @private
	 */
	_createUi : function() {
        var me = this;

        var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", this.conf.imageLocation, this.conf.mapOptions);

        this.mapmodule = module;
        var map = this.sandbox.register(module);
        // set map size
        // call portlet with ?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&published=true
        // -> uses published.jsp
        if(this.conf.size) {
            jQuery('#' + this.mapDivId).width(this.conf.size.width);
            jQuery('#' + this.mapDivId).height(this.conf.size.height);
        } 
        else {
            // react to window resize with timer so app stays responsive
            function adjustMapSize() {
                // do not resize map if resizeEnabled is false
                if(me.resizeEnabled == null || me.resizeEnabled) {
                    jQuery('#' + me.mapDivId).height(jQuery(window).height());
                    jQuery('#contentMap').height(jQuery(window).height());
                    map.updateSize();
                }
            };
        
            var resizeTimer;
            jQuery(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(adjustMapSize, 100);
            });
            adjustMapSize();
        }
        
		
        module.start(this.sandbox);

		map.render(this.mapDivId);
        // startup plugins
        if(this.conf.plugins) {
            var plugins = this.conf.plugins;
            for(var i = 0; i < plugins.length; i++) {
                plugins[i].instance = Oskari.clazz.create(plugins[i].id, plugins[i].config);
                module.registerPlugin(plugins[i].instance);
                module.startPlugin(plugins[i].instance);
            }
        }
        
        // FOR TESTING PURPOSES ONLY!
        // Should come from config.
        var fullscreenPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.FullScreen');
        module.registerPlugin(fullscreenPlugin);
        module.startPlugin(fullscreenPlugin);  
		
        this.map = map;
	},
    /**
     * @method start
     * Implements BundleInstance protocol start method.
     * Initializes Oskari core and Oskari.mapframework.service.MapLayerService.
     * Creates the map view and moves it to location and zoom
     * level specified by #state.
     * 
     * Also defines Proj4js.defs for "EPSG:3067" and "EPSG:4326".
     */
	"start" : function() {

        Proj4js.defs = {
          "EPSG:3067" : "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs",
          "EPSG:4326" : "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
        };
		var me = this;
		var conf = me.conf;

        if (me.conf.projectionDefs) {
            Proj4js.defs = me.conf.projectionDefs;
        }
		
		var userInterfaceLanguage = Oskari.getLang();

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this.core = core;
		var sandbox = core.getSandbox();
		this.sandbox = sandbox;

		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox';
		Oskari.setSandbox(sandboxName,sandbox);

		// take map div ID from config if available
		if(conf && conf.mapElement) {
		    this.mapDivId = conf.mapElement;
		}
		
        // Init user
        sandbox.setUser(conf.user);
        sandbox.setAjaxUrl(conf.globalMapAjaxUrl);
        
		// create services
		var services = this._createServices(conf);
			
		// create enhancements
		var enhancements = [];
		enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));
        
		core.init(services, enhancements);

        // need to create ui before parsing layers because layerplugins register modelbuilders
        this._createUi();

		// setup initial maplayers
    	var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
	    var initialLayers = conf.layers;
	    if(initialLayers) {
	        for(var i = 0; i < initialLayers.length; i++) {
				var mapLayer = mapLayerService.createMapLayer(initialLayers[i]);
	            mapLayerService.addLayer(mapLayer, true);
			}
	    }
        
		sandbox.registerAsStateful(this.mediator.bundleId, this);
		
		var skipLocation = false;
		if(this.mapmodule.isPluginActivated('GeoLocationPlugin')) {
		    // get plugin
		    var plugin = this.mapmodule.getPluginInstance('GeoLocationPlugin');
		    skipLocation = plugin.hasSetLocation();
		}
		
        this.setState(this.state, skipLocation);

        // create request handlers
        me.mapResizeEnabledRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapfull.request.MapResizeEnabledRequestHandler', me);
        me.mapWindowFullScreenRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapfull.request.MapWindowFullScreenRequestHandler', me);

        // register request handlers
        sandbox.addRequestHandler('MapFull.MapResizeEnabledRequest', me.mapResizeEnabledRequestHandler);
        sandbox.addRequestHandler('MapFull.MapWindowFullScreenRequest', me.mapWindowFullScreenRequestHandler);

	},
    /**
     * @method _teardownState
     * Tears down previous state so we can set a new one.
     * @private
     * @param {Oskari.mapframework.module.Module} module 
     *      any registered module so we can just send out requests
     */
    _teardownState : function(module) {
        var selectedLayers = this.sandbox.findAllSelectedMapLayers();
        // remove all current layers
        var rbRemove = this.sandbox.getRequestBuilder('RemoveMapLayerRequest');
        for(var i = 0; i < selectedLayers.length; i++) {
            this.sandbox.request(module.getName(), rbRemove(selectedLayers[i].getId()));
        }
    },
	
	/**
	 * @method _createServices
	 * Setup services for this application. 
	 * Mainly Oskari.mapframework.service.MapLayerService, but also hacks in WMTS support
	 * and if conf.disableDevelopmentMode == 'true' -> disables debug messaging and 
	 * initializes Oskari.mapframework.service.UsageSnifferService to provide 
	 * feedback to server about map usage.

	 * @param {Object} conf
	 * 		JSON configuration for the application
	 * @private
	 */
	_createServices : function(conf) {
		var me = this;
		/* create services that are available in this application */
		var services = [];
		
		var mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService',
                conf.globalMapAjaxUrl + 'action_route=GetMapLayers&lang='+Oskari.getLang() , this.core.getSandbox());
        services.push(mapLayerService);
        
		// DisableDevelopmentModeEnhancement
		if (conf.disableDevelopmentMode == 'true') {
	        core.disableDebug();
	    }
		return services;
	},
	
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
	"update" : function() {

	},
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
	"stop" : function() {
	    this.sandbox.unregisterStateful(this.mediator.bundleId);
		alert('Stopped!');
	},
	
    /**
     * @method setState
     * Sets the map state to one specified in the parameter. State is bundle specific, check the
     * bundle documentation for details.
     * @param {Object} state bundle state as JSON
     * @param {Boolean} ignoreLocation true to NOT set map location based on state
     */
    setState : function(state, ignoreLocation) {
        var mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this._teardownState(mapmodule);
        
        // setting state
        if(state.selectedLayers) {
            var rbAdd = this.sandbox.getRequestBuilder('AddMapLayerRequest');
            var rbOpacity = this.sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
            var visibilityRequestBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
            var styleReqBuilder = this.sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
            var len = state.selectedLayers.length;
            for(var i = 0; i < len; ++i ) {
                var layer = state.selectedLayers[i];
                this.sandbox.request(mapmodule.getName(), rbAdd(layer.id, true));
                this.sandbox.request(mapmodule.getName(), visibilityRequestBuilder(layer.id, layer.hidden !== true));
                if(layer.style) {
                    this.sandbox.request(mapmodule.getName(), styleReqBuilder(layer.id, layer.style));
                }
                if(layer.opacity) {
                    this.sandbox.request(mapmodule.getName(), rbOpacity(layer.id, layer.opacity));
                }
            }
        }


        if(state.east && ignoreLocation !== true) {
            this.sandbox.getMap().moveTo( 
                state.east,
                state.north,
                state.zoom);
        }

        this.sandbox.syncMapState(true);
    },
	/**
	 * @method getState
	 * Returns bundle state as JSON. State is bundle specific, check the
     * bundle documentation for details.
	 * @return {Object} 
	 */
	getState : function() {
        // get applications current state
        var map = this.sandbox.getMap();
        var selectedLayers = this.sandbox.findAllSelectedMapLayers();
        var zoom = map.getZoom();
        var lat = map.getX();
        var lon = map.getY();

        var state = {
            north : lon,
            east : lat,
            zoom : map.getZoom(),
            srs : map.getSrsName(),
            selectedLayers : []
        };
        
        for(var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var layerJson = {
                id : layer.getId(),
                opacity : layer.getOpacity()
            };
            if(!layer.isVisible()) {
                layerJson.hidden = true;
            }
            // check if we have a style selected and doesn't have THE magic string
            if(layer.getCurrentStyle && 
                layer.getCurrentStyle() && 
                layer.getCurrentStyle().getName() &&
                layer.getCurrentStyle().getName() != "!default!") {
                layerJson.style = layer.getCurrentStyle().getName();
            }
            state.selectedLayers.push(layerJson);
        }
		
		return state;
	},

    /**
    * @method toggleFullScreen
    * Toggles normal/full screen view of the map window.
    */
    toggleFullScreen: function() {
        jQuery('#contentMap').toggleClass('oskari-map-window-fullscreen');
        this.mapmodule.getMap().updateSize();
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.userinterface.Stateful']
});
