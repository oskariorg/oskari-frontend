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
		plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
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

		var userInterfaceLanguage = Oskari.getLang();

		var services = [];
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', userInterfaceLanguage));
		services.push(Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', null));

		var enhancements = [];

		var uimanager = me;

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this.core = core;
		var sandbox = core.getSandbox();
		this.sandbox = sandbox;

		core.init( services, enhancements );
		me.createModulesAndUi(sandbox);

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
