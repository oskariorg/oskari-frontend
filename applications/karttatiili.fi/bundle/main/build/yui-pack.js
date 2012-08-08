/* This is a unpacked Oskari bundle (bundle script version Tue Mar 20 2012 12:55:23 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.karttatiili.bundle.MainBundleInstance
 */
Oskari.clazz.define("Oskari.karttatiili.bundle.MainBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.wmtsService = null;
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
	getWMTSService : function() {
		return this.wmtsService;
	},
	/**
	 * @method createModulesAndUi
	 *
	 * implements UserInterfaceManager protocol
	 */
	createModulesAndUi : function(sandbox) {

		var showIndexMap = false;
		var showZoomBar = true;
		var showScaleBar = true;
		var allowMapMovements = true;

		var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);

		/**
		 * Hack resolutions
		 */
		module.createMap = function() {

			var sandbox = this._sandbox;

			var lonlat = new OpenLayers.LonLat(sandbox.getMap().getX(), sandbox.getMap().getY());
			this._map = new OpenLayers.Map({
				projection : this._projectionCode,
				center : lonlat,
				zoom : sandbox.getMap().getZoom(),
				units : "m",
				controls : [new OpenLayers.Control()],
				resolutions : [

				// PTI mukaiset
				2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25

				// JHS mukaiset
				// 4096, 2048, 1024, 512, 256, 128, 64,
				// 32,
				// 16, 8, 4, 2, 1, 0.5, 0.25
				],
				/*maxExtent : new OpenLayers.Bounds(-548576, 6291456, 1548576, 8388608),*/
				maxExtent : new OpenLayers.Bounds(0, 0, 10000000, 10000000),
				theme : null
			});

			return this._map;
		};

		this.mapmodule = module;

		var map = sandbox.register(module);

		/*
		 * plugins
		 */
		var plugins = [];
		plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
		plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
		plugins.push('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');

		for(var i = 0; i < plugins.length; i++) {
			var plugin = Oskari.clazz.create(plugins[i]);
			module.registerPlugin(plugin);
		}
		/**
		 * should create a plugin for this
		 */
		map.addControl(new OpenLayers.Control.TouchNavigation({
			dragPanOptions : {
				enableKinetic : true
			}
		}));

		map.render('mapdiv');
		this.map = map;

	},
	/**
	 * @method enhance
	 *
	 * enhance
	 */
	"enhance" : function() {
		var me = this;
		var sandbox = me.getSandbox();

		sandbox.printDebug("Checking if map is started with link...");

		var coord = sandbox.getRequestParameter('coord');
		var zoomLevel = sandbox.getRequestParameter('zoomLevel');

		var mapLayers = sandbox.getRequestParameter('mapLayers');
		var markerVisible = sandbox.getRequestParameter('showMarker');
		var keepLayersOrder = sandbox.getRequestParameter('keepLayersOrder');

		if(keepLayersOrder === null) {
			keepLayersOrder = true;
		}

		sandbox.getMap().setMarkerVisible(markerVisible == 'true');

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
			sandbox.printDebug("Could not parse link location. Skipping.");
			return;
		}
		sandbox.getMap().moveTo(longitude, latitude, zoomLevel);

		sandbox.request(me.getMapModule(),sandbox.getRequestBuilder('MapMoveRequest')(longitude, latitude, zoomLevel, false));

		sandbox.printDebug("This is startup by link, moving map...");

		if(mapLayers !== null && mapLayers !== "") {
			sandbox.printDebug("Continuing by adding layers...");
			var layerStrings = mapLayers.split(",");

			for(var i = 0; i < layerStrings.length; i++) {
				var splitted = layerStrings[i].split("+");
				var layerId = splitted[0];
				var opacity = splitted[1];
				var style = splitted[2];

				/* we do not use base layer hacks */
				/*if((layerId.indexOf("_") != -1) &&
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
				 }*/
				if(layerId !== null) {
					var rb = null;
					var r = null;
					rb = sandbox.getRequestBuilder('AddMapLayerRequest');
					r = rb(layerId, keepLayersOrder);
					sandbox.request(me.getMapModule(), r);
					rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
					r = rb(layerId, opacity);
					sandbox.request(me.getMapModule(), r);
					rb = sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
					r = rb(layerId, style);
					sandbox.request(me.getMapModule(), r);
				} else {
					sandbox.printWarn("[StartMapWithLinkEnhancement] " + "Could not find baselayer for " + layerId);
				}
			}
		}
	},
	/**
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {

		var me = this;
		var layers = Oskari.clazz.create('Oskari.karttatiili.bundle.layers.KarttatiiliFiLayerConfig');
		this.layers = layers;
		var conf = layers.create();
		var startup = conf;

		Oskari.$("startup", conf);

		var userInterfaceLanguage = "fi";

		var services = [];

		var enhancements = [];

		var uimanager = me;

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this.core = core;

		var sandbox = core.getSandbox();
		this.sandbox = sandbox;

		/*
		 *
		 */
		var mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', '', sandbox);
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', userInterfaceLanguage));
		services.push(mapLayerService);

		/**
		 *
		 */
		/**
		 * We'll need WMTSLayerService
		 */
		var wmtsService = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', mapLayerService);
		this.wmtsService = wmtsService;

		/*
		 * We'll register a handler for our type
		 */
		mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer')

		var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');

		mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

		/**
		 *
		 */

		/**
		 *
		 */
		core.init(uimanager, services, enhancements, conf.layers, userInterfaceLanguage, null, false);

		/* core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_35',true,true)); */
		var mapObj = sandbox.getMap();

		/*core.processRequest(core.getRequestBuilder('MapMoveRequest')(mapObj.getX(), mapObj.getY(), mapObj.getZoom(), false));*/
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
		alert('Stopped!');
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance"]
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
