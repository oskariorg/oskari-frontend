/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:28:45 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance
 */
Oskari.clazz.define("Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.plugins = {};
}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {
		if(this.started)
			return;

		this.started = true;

		var sandbox = Oskari.$("sandbox");

		this.sandbox = sandbox;

		sandbox.register(this);

		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}

		/**
		 * Let's extend UI
		 */
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

	},
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {

		},
		/**
		 * @method AfterChangeMapLayerOpacityEvent
		 */
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			if(this.sandbox.getObjectCreator(event) != this.getName()) {
				/* someone changed opacity */
				this.plugins['Oskari.userinterface.Flyout'].updateLayer(event.getMapLayer());
			}
		}
	},

	/**
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #layerselection This
	 */
	refresh : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	},
	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {

		var sandbox = this.sandbox;
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.kendoui.layerselection.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.kendoui.layerselection.Tile', this);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	getTitle : function() {
		return "Layer Selection";
	},
	getDescription : function() {
		return "Sample";
	},
	getPlugins : function() {
		return this.plugins;
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.kendoui.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.kendoui.layerselection.Flyout',

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
	this.layercontrols = {};
}, {
	getName : function() {
		return 'Oskari.poc.kendoui.layerselection.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.template = $('<div class="layer"><p></p><div class="slider"></div></div>');
		this.refresh();
	},
	stopPlugin : function() {
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
	updateLayer : function(layer) {

		var lc = this.layercontrols[layer.getId()];
		if(!lc)
			return;

		var slider = lc.slider.data('kendoSlider');

		var opacity = layer.getOpacity();

		slider.value(opacity);
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
		var layers = sandbox.findAllSelectedMapLayers();

		cel.empty();
		me.layercontrols = {};

		$(layers).each(function(index) {
			var el = $(tpl).clone();
			var layer = this;
			var layerId = layer.getId();
			var value = layer.getOpacity();
			var sliderEl = $(el).children('.slider');

			me.layercontrols[layerId] = {
				slider : sliderEl
			};

			$(el).children('p').append(layer.getName());
			$(el).appendTo(cel);
			sliderEl.kendoSlider({
				min : 0,
				max : 100,
				value : value,
				slide : function(evnt) {
					var newValue = evnt.value;
					sandbox.request(instance.getName(), opacityRequestBuilder(layerId, newValue));
				}
			});

		});
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/**
 * @class Oskari.poc.kendoui.layerselection.Tile
 */
Oskari.clazz.define('Oskari.poc.kendoui.layerselection.Tile',

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
}, {
	getName : function() {
		return 'Oskari.poc.kendoui.layerselection.Tile';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.refresh();
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return "Valitut tasot";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var layers = sandbox.findAllSelectedMapLayers();

		var status = cel.children('.oskari-tile-status');
		status.empty();

		status.append('(' + layers.length + ')');

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
