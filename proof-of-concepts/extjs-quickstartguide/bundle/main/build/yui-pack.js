/* This is a unpacked Oskari bundle (bundle script version Tue Mar 20 2012 10:08:41 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.poc.bundle.jQueryUIBundleInstance
 */
Oskari.clazz.define("Oskari.poc.extjsqsg.bundle.MainBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
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

		this.mapmodule = module;

		var map = sandbox.register(module);

		/*
		 * plugins
		 */
		var plugins = [];
		plugins.push('Oskari.mapframework.mapmodule.LayersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
		plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');


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
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {

		var me = this;
		var layers = Oskari.clazz.create('Oskari.mapframework.complexbundle.NlsFiLayerConfig');
		this.layers = layers;
		var conf = layers.create();
		var startup = conf;

		Oskari.$("startup", conf);

		var userInterfaceLanguage = "fi";

		var services = [];
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', userInterfaceLanguage));
		services.push(Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', null));

		var enhancements = [];

		var uimanager = me;

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this.core = core;
		var sandbox = core.getSandbox();
		this.sandbox = sandbox;

		core.init(uimanager, services, enhancements, conf.layers, userInterfaceLanguage, null, false);

		Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement').enhance(core);

		/* core.processRequest(core.getRequestBuilder('AddMapLayerRequest')('base_35',true,true)); */
		var mapObj = sandbox.getMap();

		core.processRequest(core.getRequestBuilder('MapMoveRequest')(mapObj.getX(), mapObj.getY(), mapObj.getZoom(), false));
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
