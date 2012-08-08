/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 13:08:29 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.mapframework.bundle.Candy1BundleInstance", function() {
	this.map = null;
}, {
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

		var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Candy1", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
		this.mapmodule = module;

		var map = sandbox.register(module);

		map.render('map-div');

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
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {

		var me = this;
		var conf = me.conf;

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		var sandbox = core.getSandbox();
		this.sandbox = sandbox;

		var services = [];
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', Oskari.getLang()));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', sandbox));

		var enhancements = [];

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

		this.createModulesAndUi(core.getSandbox());

		sandbox.registerAsStateful(this.mediator.bundleId, this);

		this.setState(this.state);

	},
	getSandbox : function() {
		return this.sandbox;
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
	 * @method setState
	 * @param {Object} state bundle state as JSON
	 */
	setState : function(state) {
		var mapmodule = this.mapmodule;
		/*this._teardownState(mapmodule);*/

		// setting state
		if(state.selectedLayers) {
			var rbAdd = this.sandbox.getRequestBuilder('AddMapLayerRequest');
			var rbOpacity = this.sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
			var visibilityRequestBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
			var styleReqBuilder = this.sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
			var len = state.selectedLayers.length;
			for(var i = 0; i < len; ++i) {
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
			this.sandbox.getMap().moveTo(state.east, state.north, state.zoom);
		}
		// FIXME: this is what start-map-with -enhancements should be doing, they are just doing it in wrong place
		this.sandbox.syncMapState(true);
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
			if(layer.getCurrentStyle && layer.getCurrentStyle() && layer.getCurrentStyle().getName() && layer.getCurrentStyle().getName() != "!default!") {
				layerJson.style = layer.getCurrentStyle().getName();
			}
			state.selectedLayers.push(layerJson);
		}

		return state;
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.userinterface.Stateful']
});
