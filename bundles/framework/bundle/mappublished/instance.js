/**
 * @class Oskari.mapframework.bundle.mappublished.PublishedBundleInstance
 * Builds a bundled map instance with minimal setup for a published map, similar to
 * Oskari.mapframework.bundle.mapprint.PrintBundleInstance 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mappublished.PublishedBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the bundle
 * 
 * Creates plugins config for Oskari.mapframework.bundle.mappublished.BaseMapPlugin,
 * Oskari.mapframework.bundle.mappublished.SearchPlugin and
 * Oskari.mapframework.bundle.mappublished.MapInfoPlugin if plugins are not defined in
 * config.plugins (array).
 */
function(config) {
    this.map = null;
    this._config = config;
    this._plugins = [];
    if(config) {
		// toolsContainer is HTML div id where tools should be rendered 
 		// htmlDivId/parentContainer is the HTML div id where the map is rendered
	    this.htmlDivId = config.container;
		this.toolsContainer = config.toolsContainer;
		if(config.plugins) {
	        for(var i = 0; i < config.plugins.length; i++) {
	        	this._plugins.push(config.plugins[i]);
			}
		}
    }
    else {
    	// setup default values
	    this.htmlDivId = 'map-div';
		this.toolsContainer = 'publishedmap-tools';
    }
    
    // setup default plugins if plugins config is missing
    if(!config || !config.plugins) {
		this._plugins.push({
					type : 'Oskari.mapframework.bundle.mappublished.BaseMapPlugin',
					config : {
						parentContainer : this.htmlDivId,
						toolsContainer : this.toolsContainer,
						baseMaps : startup.baseLayers
					} 
		});
		this._plugins.push({
					type : 'Oskari.mapframework.bundle.mappublished.SearchPlugin',
					config : {
						parentContainer : this.htmlDivId,
						toolsContainer : this.toolsContainer
					} 
		});
		this._plugins.push({
					type : 'Oskari.mapframework.bundle.mappublished.MapInfoPlugin',
					config : {
						parentContainer : this.htmlDivId,
						toolsContainer : this.toolsContainer,
						termsUrl : startup.termsOfUsePublishedMapLink
					} 
		});
		this._plugins.push({
					type : 'Oskari.mapframework.bundle.mappublished.GetFeatureInfoPlugin',
					config : {
						parentContainer : this.htmlDivId,
						toolsContainer : this.toolsContainer,
						gfiLayer : startup.queryableLayers
					} 
		});
		
		
    }
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

        var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Published", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
        var map = sandbox.register(module);
        
        if(this._mapConfigurations) {
	        jQuery('#' + this.htmlDivId).width(this._mapConfigurations.width);
	        jQuery('#' + this.htmlDivId).height(this._mapConfigurations.height);
        }
        map.render(this.htmlDivId);
        jQuery("<div id='"+ this.toolsContainer + "'></div>").appendTo("#" + this.htmlDivId);
        
        this.map = map;
    },
    
    /**
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

        var me = this;

        var conf = startup;
        this._mapConfigurations = conf.mapConfigurations;

        Oskari.$("startup", conf);

        var userInterfaceLanguage = conf.userInterfaceLanguage;

        var uimanager = me;

        var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
        this.core = core;

        var enhancements = [];
        enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',conf.preSelectedLayers, conf.mapConfigurations));
		
		/* Openlayers image position must be set before core is initialized */
		var openlayersImagePath = Oskari.clazz.create('Oskari.mapframework.enhancement.common.OpenLayersImagePathEnhancement');
		openlayersImagePath.enhance(core);
		
        var services = [];
        services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', userInterfaceLanguage));
        
		services.push(Oskari.clazz.create('Oskari.mapframework.service.SearchService',
				conf.globalMapAjaxUrl, conf.globalPortletNameSpace));

        var mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', null, core.getSandbox());

        services.push(mapLayerService);

		//Setting up WMTS support
        mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer');
		// We'll register a handler for our type
        var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
        mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

        services.push(Oskari.clazz.create('Oskari.mapframework.service.OgcSearchService', conf.ogcSearchServiceEndpoint, core));

        core.init(uimanager, services, enhancements, conf.layers, userInterfaceLanguage, null, false);

        var mapmodule = core.getSandbox().findRegisteredModuleInstance('PublishedMapModule');

        for(var i = 0; i < this._plugins.length; i++) {
            var pluginConf = this._plugins[i];

            var plugin = Oskari.clazz.create(pluginConf.type, pluginConf.config);
	        mapmodule.registerPlugin(plugin);
	        mapmodule.startPlugin(plugin);
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
        var mapmodule = sandbox.findRegisteredModuleInstance('PublishedMapModule');

        var plugins = [];
        //plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');
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
