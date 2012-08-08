/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 * 
 * The full map window application. Begins building the application on #start() method call.
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
    // TODO: as config parameter?
	this.mapDivId = "mapdiv";
}, {

	/**
	 * @method getMapModule
	 */
	getMapModule : function() {
		return this.mapmodule;
	},
	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method createUi
	 *
	 * Creates the map module and rendes it to #mapdiv
	 */
	createUi : function() {
        var me = this;
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
                jQuery('#' + me.mapDivId).height(jQuery(window).height());
            };
        
            var resizeTimer;
            jQuery(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(adjustMapSize, 100);
            });
            adjustMapSize();
        }
        
		var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main");

		this.mapmodule = module;
		var map = this.sandbox.register(module);
		
        module.start(this.sandbox);

        
		// touch navigation - breaks porttimouse drag handling 
		// should create a plugin for this
		/*
		map.addControl(new OpenLayers.Control.TouchNavigation({
			dragPanOptions : {
				enableKinetic : true
			}
		}));
*/		
		
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
		this.map = map;

	},
	/**
	 * @method implements BundleInstance start method
	 *
	 */
	"start" : function() {

		var me = this;
		var conf = me.conf;
		
		var userInterfaceLanguage = Oskari.getLang();
		var uimanager = me;

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this.core = core;
		var sandbox = core.getSandbox();
		this.sandbox = sandbox;
		
		// create services
		var services = this.createServices(conf);
			
		// create enhancements
		var enhancements = [];
		enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));

		// OpenLayersImagePathEnhancement
	    // OpenLayers.ImgPath = Oskari.$().startup.imageLocation + "/lib/openlayers/img/";
        
		// Init user
		sandbox.setUser(conf.user);
        sandbox.setAjaxUrl(conf.globalMapAjaxUrl);

		core.init(services, enhancements);
		
		// setup initial maplayers
    	var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
	    var initialLayers = conf.layers;
	    if(initialLayers) {
	        for(var i = 0; i < initialLayers.length; i++) {
				var mapLayer = mapLayerService.createMapLayer(initialLayers[i]);
	            mapLayerService.addLayer(mapLayer, true);
			}
	    }
		  
        this.createUi();
		sandbox.registerAsStateful(this.mediator.bundleId, this);
		// TODO: StartMapWithLinkEnhancement should alter the state we give here
		
        /*
        // debug state
        this.state = {
            east : '397898',
            north : '6673381',
            zoom : 9,
            selectedLayers : [{id : 'base_35'}]
        };
        */
        this.setState(this.state);
	},
    /**
     * @method _teardownState
     * @private
     * @param {Oskari.mapframework.module.Module} module 
     *      any registered module so we can just send out requests
     * Tears down previous state so we can set a new one
     */
    _teardownState : function(module) {
        var selectedLayers = this.sandbox.findAllSelectedMapLayers();
        // remove all current
        var rbRemove = this.sandbox.getRequestBuilder('RemoveMapLayerRequest');
        for(var i = 0; i < selectedLayers.length; i++) {
            this.sandbox.request(module.getName(), rbRemove(selectedLayers[i].getId()));
        }
    },
	
    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
	setState : function(state) {
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
                if(layer.hidden) {
                    this.sandbox.request(mapmodule.getName(), visibilityRequestBuilder(layer.id, false));
                }
                if(layer.style) {
                    this.sandbox.request(mapmodule.getName(), styleReqBuilder(layer.id, layer.style));
                }
                if(layer.opacity) {
                    this.sandbox.request(mapmodule.getName(), rbOpacity(layer.id, layer.opacity));
                }
        	}
        }


        if(state.east) {
			this.sandbox.getMap().moveTo( 
				state.east,
				state.north,
				state.zoom);
        }
        // FIXME: this is what start-map-with -enhancements should be doing, they are just doing it in wrong place
		this.sandbox.syncMapState(true);
	},
	
	/**
	 * @method createServices
	 * setup services for this application
	 * @param {Object} conf
	 * 		JSON configuration for the application
	 */
	createServices : function(conf) {
		var me = this;
		/* create services that are available in this application */
		var services = [];
		
		var mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService',
                conf.globalMapAjaxUrl + 'action_route=GetMapLayers' , this.core.getSandbox());
        services.push(mapLayerService);
        
       // Setting up WMTS support
       // We'll register a handler for our type
        mapLayerService.registerLayerModel('wmtslayer','Oskari.mapframework.wmts.domain.WmtsLayer');
        
        var layerModelBuilder = 
        	Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
        
        mapLayerService.registerLayerModelBuilder('wmtslayer',layerModelBuilder);
        
        
		/*
		 // TODO: MOVE TO GFI BUNDLE?
		 services.push(Oskari.clazz.create('Oskari.mapframework.service.GetFeatureInfoService',
				conf.globalMapAjaxUrl));
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService',
				conf.userInterfaceLanguage));
				*/
		
		services.push(Oskari.clazz.create('Oskari.mapframework.service.OgcSearchService',
				conf.ogcSearchServiceEndpoint, this.core));

		
		// DisableDevelopmentModeEnhancement
		if (conf.disableDevelopmentMode == 'true') {
	        core.disableDebug();
            // create sniffer with 2 second interval and '/log' -url
			services.push(Oskari.clazz.create('Oskari.mapframework.service.UsageSnifferService',2, "/log/"));
			core.enableMapMovementLogging();
	    }
		

		return services;
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
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {
	    this.sandbox.unregisterStateful(this.mediator.bundleId);
		alert('Stopped!');
	},
	
	/**
	 * @method getState
	 * @return {Object} bundle state as JSON
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
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.userinterface.Stateful']
});
/**
 * This enchancement adds all preselected layers on map and moves to start
 * position
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',
				function(preSelectedJson, mapConfigurations) {

					this._preSelectedJson = preSelectedJson;

					this._mapConfigurations = mapConfigurations;
				},
				{

					enhance : function(core) {
						var coord = core.getRequestParameter('coord');
						var zoomLevel = core.getRequestParameter('zoomLevel');
						var mapLayers = core.getRequestParameter('mapLayers');

						/*
						 * Check if map is started with link. In this case, we
						 * will honor map layers in request and forget
						 * preselected.
						 */
						if (coord != null && zoomLevel != null && mapLayers != null) {
							core.printDebug("Ahem, we found 'mapLayers, coord and zoomLevel' parameters from url. This is probably a link startup. Skipping preselection.");
							return;
						}

						/* ok, we can proceed */
						core.printDebug("Enhancing application by setting position.");
						
						var x = this._mapConfigurations.east;
						var y = this._mapConfigurations.north;
						var zoom = this._mapConfigurations.scale;
						var marker = false;

						core.getMap().moveTo(x, y, zoom);

						core.printDebug("Enhancing application by preselecting layers.");
						if(!this._preSelectedJson || !this._preSelectedJson.preSelectedLayers) {
							return;
						}
						for ( var i = 0; i < this._preSelectedJson.preSelectedLayers.length; i++) {
							var item = this._preSelectedJson.preSelectedLayers[i];
							core.processRequest(
								core.getRequestBuilder('AddMapLayerRequest')(item.id, false));
						}

					}
				},
				{
					'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
				});

/* Inheritance */
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
 * This enchancement adds all preselected layers on map
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.enhancement.mapfull.StartMapWithSearchResultEnhancement',
				function() {
				},
				{
					enhance : function(core) {
						core.printDebug("Checking if map is started with search result...");
						var coord = core.getRequestParameter('coord');
						var zoomLevel = core.getRequestParameter('zoomLevel');

						if (coord == null || zoomLevel == null) {
							// not a search result
							return;
						}

						var mapLayers = core.getRequestParameter('mapLayers');
						if (mapLayers != null) {
							core.printDebug("This is probably startup by link, not by search result. Skipping.");
							return;
						}

						/* This seems like a search result start */
						var splittedCoord;

						/*
						 * Coordinates can be splitted either with new "_" or
						 * old "%20"
						 */
						if (coord.indexOf("_") >= 0) {
							splittedCoord = coord.split("_");
						} else {
							splittedCoord = coord.split("%20");
						}

						var longitude = splittedCoord[0];
						var latitude = splittedCoord[1];
						if (longitude == null || latitude == null) {
							core.printDebug("Could not parse link location. Skipping.");
						}

						core.printDebug("This is startup by search result, moving map.");
						/*core.processRequest(core.getRequestBuilder('MapMoveRequest')(
										longitude, latitude, zoomLevel, true));
										*/
										
						core.getMap().moveTo(longitude, latitude, zoomLevel);
						
        				core.getMap().setMarkerVisible(true);
					}
				},
				{
					'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
				});

/* Inheritance */
