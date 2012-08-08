/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:02:04 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.dojo.bundle.LayerSelectionBundleInstance
 *
 * http://dojotoolkit.org/documentation/tutorials/1.7/dom_functions/
 *
 *
 *
 */
Oskari.clazz.define("Oskari.poc.dojo.bundle.LayerSelectionBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.template = null;
	this.plugins = {};

	/**
	 * @property injected dojo property (by bundle)
	 */
	this.dojo = null;

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'DojoLayerSelection',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 *
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod
	 *
	 * Note this is async as DOJO requires are resolved and
	 * notified by callback
	 *
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		/**
		 * Let's extend UI
		 */
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/**
		 * let's dojo me
		 */
		me.mediator.bundle.require(function(dojo) {

			me.dojo = dojo;

			me.refresh();
		});
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
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
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
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.dojo.layerselection.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.dojo.layerselection.Tile', this);
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
	},
	/**
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #layerselection This
	 */
	refresh : function() {
		var me = this;
		if(!me.dojo) {

			return;
		}

		this.plugins['Oskari.userinterface.Flyout'].setDojo(me.dojo);
		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].setDojo(me.dojo);
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.dojo.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.dojo.layerselection.Flyout',

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
	this.dojo = null;
	this.layercontrols = {};
}, {
	setDojo : function(dojo) {
		this.dojo = dojo;
		var conn = this.dojo['dojo'];
	  	//Disable the key events Ctrl and Shift == disable copying
	    conn.extend( this.dojo['dojo/dnd/Source'], { copyState: function( keyPressed, self ){ 
	        return false; }}
	    );
	},
	getName : function() {
		return 'Oskari.poc.dojo.layerselection.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = el[0];
		// ?
	},
	startPlugin : function() {
	},
	stopPlugin : function() {

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

		/*this.layercontrols[layerid]*/
		var lc = this.layercontrols[layer.getId()];
		if(!lc)
			return;

		var slider = lc.slider;
		var opacity = layer.getOpacity();

		slider.set('value', opacity);

	},
	refresh : function() {
		var me = this;
		//var query = me.dojo['dojo/query'];
		var conn = me.dojo['dojo'];
		var domConstruct = me.dojo['dojo/dom-construct'];
		//var dom = me.dojo['dojo/dom'];
		var me = this;
		var sandbox = me.instance.getSandbox();

		domConstruct.empty(this.container);

		var selectedList = domConstruct.create("div", {
			className : "selectedLayerList"
		},this.container);
		
		me.layercontrols = {};
		
		var dndList = new me.dojo['dojo/dnd/Source'](selectedList, 
			{ 
				accept: [ "selectedLayer" ],
				singular : true // only one at a time
			});

		var layers = sandbox.findAllSelectedMapLayers();

		var domLayersList = [];

		for(var n = layers.length -1; n >= 0; --n) {
			var layer = layers[n];
			var layerContainer = this.createLayerContainer(layer);

			domLayersList.push(layerContainer);

		}
		dndList.insertNodes(false, domLayersList);
		conn.connect(dndList, "onDndDrop", function(source, nodes, copy, target) {
			me._layerOrderChanged(source, nodes, copy, target);
		});

		/*console.log("DOJO.LAYERS",domLayersList,this.container);
		 window.xxx = this.container;

		 for( var n = 0; n < domLayersList.length;n++ ) {
		 domConstruct.place(domLayersList[n],this.container[0],"last");
		 }
		 */

	},
	/**
	 * @method _layerOrderChanged
	 * Signal core that layer order should be changed
	 * @param {Object} source the source which provides items
	 * @param {Array} nodes the list of transferred items
	 * @param {Boolean} copy copy items, if true, move items otherwise
	 * @param {Object} target the target which accepts items
	 */
	_layerOrderChanged : function(source, nodes, copy, target) {
		// copy always false since we override it
		var movedId = nodes[0].id;
		var allNodes = target.getAllNodes();
		var newIndex = -1;
		for(var i = 0, len = allNodes.length; i < len; ++i) {
			if(allNodes[i].id == movedId) {
				newIndex = i;
				break;
			}
		}
		if(newIndex > -1) {
			// the layer order is reversed in presentation
			// the lowest layer has the highest index
			newIndex = (allNodes.length - 1)  - newIndex;
			var realId = movedId.substring("selected_".length);
			var sandbox = this.instance.getSandbox();
            var request = sandbox.getRequestBuilder('RearrangeSelectedMapLayerRequest')(realId, newIndex);
            sandbox.request(this.instance.getName(), request);
		}
	},
	getLayerContainer : function(layerId) {
		var me = this;
		var dom = me.dojo['dojo/dom'];
		return dom.byId("selected_" + layerId);
	},
	createLayerContainer : function(layer) {
		
		var me = this;
		var sandbox = me.instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
		var query = me.dojo['dojo/query'];
		var conn = me.dojo['dojo'];
		var domConstruct = me.dojo['dojo/dom-construct'];
		var dom = me.dojo['dojo/dom'];
		
		var layerId = layer.getId();
		var value = layer.getOpacity();

		var lel = domConstruct.create("div", {
			className : "selectedLayer",
			id: 'selected_' + layerId,
			style : {
				border: 'solid; 2px'
			}
		});
		

		var pel = domConstruct.create("p", {
			innerHTML : layer.getName()

		}, lel);

		var sliderDiv = domConstruct.create("div", {
			className : "slider",
			style : {

			}
		}, lel);

		var slider = new me.dojo['dijit/form/HorizontalSlider']({
			minimum : 0,
			maximum : 100,
			pageIncrement : 20,
			value : value,
			intermediateChanges : true,
			style : "width: 200px;",
			layer : layer,
			moduleName : me.instance.getName()
		}, sliderDiv);

		me.layercontrols[layerId] = {
			'slider' : slider
		};

		conn.connect(slider, "onChange", function(newValue) {
			var moduleName = this.moduleName;
			var layerId = this.layer.getId();
			sandbox.request(moduleName, opacityRequestBuilder(layerId, newValue));
		});
		/*
		 * slide: function(event, ui) { var newValue =
		 * ui.value; sandbox.request(me.getName(),
		 * opacityRequestBuilder(layerId, newValue)); }
		 */

		slider.startup();
		return lel;
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.poc.dojo.layerselection.Tile
 */
Oskari.clazz.define('Oskari.poc.dojo.layerselection.Tile',

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
	this.dojo = null;
}, {
	setDojo : function(dojo) {
		this.dojo = dojo;
	},
	getName : function() {
		return 'Oskari.poc.dojo.layerselection.Tile';
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
		return "Valitut tasot DOJO";
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
