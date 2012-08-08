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
