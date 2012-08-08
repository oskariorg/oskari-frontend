/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:02:04 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.dojo.bundle.FeatureInfoBundleInstance
 *
 * http://dojotoolkit.org/documentation/tutorials/1.7/dom_functions/
 *
 *
 *
 */
Oskari.clazz.define("Oskari.poc.dojo.bundle.FeatureInfoBundleInstance", function() {
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
	__name : 'DojoFeatureInfo',
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
			me.plugins['Oskari.userinterface.Flyout'].setDojo(me.dojo);
			me.plugins['Oskari.userinterface.Tile'].setDojo(me.dojo);
			//console.dir(dojo);
			//alert('printed');

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
	 * @method afterChangeMapLayerOpacityEvent
	 */
	afterChangeMapLayerOpacityEvent : function(event) {

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
			this.plugins['Oskari.userinterface.Flyout'].handleMapLayerAdded(event);
			this.plugins['Oskari.userinterface.Tile'].handleMapLayerAdded(event);
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleMapLayerRemoved(event);
			this.plugins['Oskari.userinterface.Tile'].handleMapLayerRemoved(event);
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
				this.afterChangeMapLayerOpacityEvent(event);
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
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.dojo.featureinfo.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.dojo.featureinfo.Tile', this);
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
	 *
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #featureinfo This
	 */
	refresh : function() {
		var me = this;
		if(!me.dojo) {

			return;
		}

		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.dojo.featureinfo.Flyout
 */
Oskari.clazz.define('Oskari.poc.dojo.featureinfo.Flyout',

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
}, {
	setDojo : function(dojo) {
		this.dojo = dojo;
	},
	getName : function() {
		return 'Oskari.poc.dojo.featureinfo.Flyout';
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
	handleMapLayerAdded: function (event) {
		
	},
	handleMapLayerRemoved: function (event) {
		
	},
	refresh : function() {
		/*alert('refresh');*/
		var me = this;
		var query = me.dojo['dojo/query'];
		var conn = me.dojo['dojo'];
		var domConstruct = me.dojo['dojo/dom-construct'];
		var dom = me.dojo['dojo/dom'];
		var me = this;
		var cel = conn.query(this.container);
		// conn.query('div',this.container);
		// //
		// dom.byId("featureinfo");
		console.log("DOJO", cel);

		var sandbox = me.instance.getSandbox();

		domConstruct.empty(cel);

		var gridDiv = domConstruct.create("div", {
			className : "grid",
			id : 'grid-module',
			style : {
				width : '400px',
				height : '300px',
				background: 'white'
			}
		}, this.container);

		me.createGrid(gridDiv, "dojo/io/script", me.dojo["dojox/grid/DataGrid"], me.dojo["dojo/store/Memory"], me.dojo["dojo/data/ObjectStore"], me.dojo["dojo/_base/xhr"]);

	},
	createGrid : function(gridDiv, ioScript, DataGrid, Memory, ObjectStore, xhr) {

		var store = new Memory({
			data : [{
				id : 'sami1',
				name : 'tieto1'
			},{
				id : 'sami2',
				name : 'tieto2'
			}]
		});
		var dataStore = new ObjectStore({
			objectStore : store
		});

		var grid = new DataGrid({
			store : dataStore,
			style : {
				width : '100%',
				height : '200px'
			},
/*			style : {
				width : '100%',
				height : '100%'
			},*/
			/*query : {
				id : "*"
			},*/
			structure : [{
					name : "ID",
					field : "id",
					width: '50%'
				}, {
					name : "Nimi",
					field : "name",
					width: '50%'
				}]
		}, gridDiv);

		grid.startup();
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.poc.dojo.featureinfo.Tile
 */
Oskari.clazz.define('Oskari.poc.dojo.featureinfo.Tile',

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
		return 'Oskari.poc.dojo.featureinfo.Tile';
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
		return "Kohdetiedot";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	handleMapLayerAdded: function (event) {
		
	},
	handleMapLayerRemoved: function (event) {
		
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var layers = sandbox.findAllSelectedMapLayers();

		var status = cel.children('.oskari-tile-status');
		/*status.empty();

		 status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
