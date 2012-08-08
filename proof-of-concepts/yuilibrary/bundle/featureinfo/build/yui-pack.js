/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:30:12 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.yuilibrary.bundle.FeatureInfoBundleInstance
 *
 * http://yuilibrarytoolkit.org/documentation/tutorials/1.7/dom_functions/
 *
 *
 *
 */
Oskari.clazz.define("Oskari.poc.yuilibrary.bundle.FeatureInfoBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.template = null;
	this.plugins = {};

	/**
	 * @property injected yuilibrary property (by bundle)
	 */
	this.yuilibrary = null;

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'YUILibraryFeatureInfo',
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
		 * let's yuilibrary me
		 */
		me.mediator.bundle.require(function(yuilibrary) {

			me.yuilibrary = yuilibrary;

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
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.yuilibrary.featureinfo.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.yuilibrary.featureinfo.Tile', this);
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
	 * #featureinfo This
	 */
	refresh : function() {
		var me = this;
		if(!me.yuilibrary) {

			return;
		}

		this.plugins['Oskari.userinterface.Flyout'].setYUILibrary(me.yuilibrary);
		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].setYUILibrary(me.yuilibrary);
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.yuilibrary.featureinfo.Flyout
 */
Oskari.clazz.define('Oskari.poc.yuilibrary.featureinfo.Flyout',

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
	this.yuilibrary = null;
}, {
	setYUILibrary : function(yuilibrary) {
		this.yuilibrary = yuilibrary;
	},
	getName : function() {
		return 'Oskari.poc.yuilibrary.featureinfo.Flyout';
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
	refresh : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();

		var Y = me.yuilibrary;
		var tpl = me.template;

		if(!tpl) {
			tpl = Y.Node.create('<div class="grid"></div>');
			me.template = tpl;
		}

		var cel = Y.one(this.container);

		cel.empty();

		var gridDiv = tpl.cloneNode(true);

		var url = "http://query.yahooapis.com/v1/public/yql?format=json" + "&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", query = "&q=" + encodeURIComponent('select * from local.search ' + 'where zip = "94089" and query = "pizza"'), dataSource, table;
		dataSource = new Y.DataSource.Get({
			source : url
		});

		dataSource.plug(Y.Plugin.DataSourceJSONSchema, {
			schema : {
				resultListLocator : "query.results.Result",
				resultFields : ["Title", "Phone", {
					key : "Rating.AverageRating",
					// YQL is returning "NaN" for unrated
					// restaurants
					parser : function(val) {
						return isNaN(val) ? '(none)' : val;
					}
				}]
			}
		});
		table = new Y.DataTable.Base({
			columnset : ["Title", "Phone", {
				key : "Rating.AverageRating",
				label : "Rating"
			}],
			summary : "Pizza places near 98089",
			caption : "Table with JSON data from YQL"
		});

		table.plug(Y.Plugin.DataTableDataSource, {
			datasource : dataSource
		});

		//Creating an xy-scrolling datatable with specific width and height
		table.plug(Y.Plugin.DataTableScroll, {
			width : "500px",
			height : "400px"
		});

		table.render(gridDiv);
		cel.appendChild(gridDiv);

		table.datasource.load({
			request : query
		});

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.poc.yuilibrary.featureinfo.Tile
 */
Oskari.clazz.define('Oskari.poc.yuilibrary.featureinfo.Tile',

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
	this.yuilibrary = null;
}, {
	setYUILibrary : function(yuilibrary) {
		this.yuilibrary = yuilibrary;
	},
	getName : function() {
		return 'Oskari.poc.yuilibrary.featureinfo.Tile';
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
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var layers = sandbox.findAllSelectedMapLayers();

		/*var status = cel.children('.oskari-tile-status');
		 status.empty();

		 status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
