/**
 * @class Oskari.poc.oskari.mappublisher.Flyout
 */

Oskari.clazz.define('Oskari.poc.oskari.mappublisher.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.state = null;
	this.mapmodule = null;
	this.map = null;
}, {
	getName : function() {
		return 'Oskari.poc.oskari.mappublisher.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		var me = this;
		this.template = $('<div style="border:2pt dashed grey; margin:0; padding:0; height:400px;width:540px;" class="mappublisher">' + '<div style="position:relative;border:2pt solid black;left: 10px; top:10px; height:95%;width:95%;" class="map"></div>' + '</div>');

		var sandbox = me.instance.getSandbox();

		this.createMapModule();

		var mapmodule = this.mapmodule;
		var map = this.map;

		/* hackson */
		var mapdomain = sandbox.getMap();
		map.setCenter(new OpenLayers.LonLat(mapdomain.getX(), mapdomain.getY()), mapdomain.getZoom(), false);
		this.refresh();

		mapmodule.start(sandbox);

		mapmodule.updateCurrentState();

	},
	stopPlugin : function() {
		var me = this;
		var mapmodule = this.mapmodule;
		var sandbox = me.instance.getSandbox();
		mapmodule.stop(sandbox);
		sandbox.unregister(me.mapmodule);
		this.container.empty();
	},
	getTitle : function() {
		return "Valitut karttatasot";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	refresh : function() {

		var cel = this.container;

		var tpl = this.template;

		var div = tpl.clone();

		div.appendTo(cel);

		var mapdiv = div.children('.map');

		var map = this.map;

		map.render(mapdiv[0]);

		RightJS.$(div[0]).makeResizable();

	},
	/**
	 * @method createModulesAndUi
	 *
	 * implements UserInterfaceManager protocol
	 */
	createMapModule : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();
		var showIndexMap = false;
		var showZoomBar = false;
		var showScaleBar = false;
		var allowMapMovements = true;

		var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "MapPubslizer", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
		module.setStealth(true);

		this.mapmodule = module;

		var map = sandbox.register(module);

		/*
		 * plugins
		 */
		var plugins = [];
		plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');

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

		this.map = map;

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
