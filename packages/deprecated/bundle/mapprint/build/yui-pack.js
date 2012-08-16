/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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
 * @class Oskari.mapframework.bundle.mapprint.PrintBundleInstance
 * Builds a bundled map instance with minimal setup for a print version of map
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapprint.PrintBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.map = null;
}, {
    /**
     * @method createModulesAndUi
     *
     * implements UserInterfaceManager protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    createModulesAndUi : function(sandbox) {
        var showIndexMap = false;
        var showZoomBar = false;
        var showScaleBar = true;
        var allowMapMovements = true;

        var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Print", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
        var map = sandbox.register(module);

        map.render('map-div');
        this.map = map;

    },
    /**
     * @method
     * implements BundleInstance start methdod
     *
     */
    "start" : function() {

        var me = this;

        var conf = startup;

        Oskari.$("startup", conf);

        var userInterfaceLanguage = conf.userInterfaceLanguage;

        var uimanager = me;

        var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
        this.core = core;

        var enhancements = [];
        enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));

        var services = [];
        services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', userInterfaceLanguage));

        var mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', null, core.getSandbox());
        services.push(mapLayerService);

        // Setting up WMTS support
        mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer');
        // register a handler for our type
        var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
        mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

        services.push(Oskari.clazz.create('Oskari.mapframework.service.OgcSearchService', conf.ogcSearchServiceEndpoint, core));

        core.init(uimanager, services, enhancements, conf.layers, userInterfaceLanguage, null, false);

        if(conf.printBundles) {
            // headless bundles need to be registered after core.init to work
            for(var i = 0; i < conf.printBundles.length; i++) {
                var bundle = conf.printBundles[i];

                var headlessBundle = Oskari.clazz.create(bundle.type, bundle.config);
                core.getSandbox().register(headlessBundle);
                headlessBundle.start(core.getSandbox());
            }
        }
        this._initMapPlugins(core.getSandbox());
    },
    /**
     * @method _initMapPlugins
     * @private
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     * 
     * Initializes map plugins and syncs the map implementation with given initialized data
     */
    _initMapPlugins : function(sandbox) {
        var mapmodule = sandbox.findRegisteredModuleInstance('PrintMapModule');

        var plugins = [];
        //plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
        // needed for wfs
        plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');
        plugins.push('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');

        for(var i = 0; i < plugins.length; i++) {
            var plugin = Oskari.clazz.create(plugins[i]);
            mapmodule.registerPlugin(plugin);
            mapmodule.startPlugin(plugin);
        }
        sandbox.syncMapState(true, mapmodule);
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