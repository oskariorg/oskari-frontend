/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:28:45 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.kendoui.bundle.LayerSelectorBundleInstance
 */
Oskari.clazz.define("Oskari.poc.kendoui.bundle.LayerSelectorBundleInstance", function() {
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
	__name : 'Oskari.poc.kendoui.bundle.LayerSelectorBundleInstance',
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

		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {

		}
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
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.kendoui.layerselector.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.kendoui.layerselector.Tile', this);
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
 * @class Oskari.poc.kendoui.layerselector.Flyout
 */
Oskari.clazz.define('Oskari.poc.kendoui.layerselector.Flyout',

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
}, {
	getName : function() {
		return 'Oskari.poc.kendoui.layerselector.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.template = $('<div class="tree"></div>');
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
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();

		cel.empty();

		var el = $(tpl).clone();
		$(el).appendTo(cel);

		var element = $(el).kendoGrid({
			dataSource : {
				type : "odata",
				transport : {
					read : "http://demos.kendoui.com/service/Northwind.svc/Employees"
				},
				pageSize : 6,
				serverPaging : true,
				serverSorting : true
			},
			height : 450,
			sortable : true,
			pageable : true,
			detailInit : detailInit,
			dataBound : function() {
				this.expandRow(this.tbody.find("tr.k-master-row").first());
			},
			columns : [{
				field : "FirstName",
				title : "First Name"
			}, {
				field : "LastName",
				title : "Last Name"
			}, {
				field : "Country"
			}, {
				field : "City"
			}, {
				field : "Title"
			}]
		});

		function detailInit(e) {
			$("<div/>").appendTo(e.detailCell).kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://demos.kendoui.com/service/Northwind.svc/Orders"
					},
					serverPaging : true,
					serverSorting : true,
					serverFiltering : true,
					pageSize : 6,
					filter : {
						field : "EmployeeID",
						operator : "eq",
						value : e.data.EmployeeID
					}
				},
				scrollable : false,
				sortable : true,
				pageable : true,
				columns : ["OrderID", "ShipCountry", "ShipAddress", "ShipName"]
			});
		}

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/**
 * @class Oskari.poc.kendoui.layerselector.Tile
 */
Oskari.clazz.define('Oskari.poc.kendoui.layerselector.Tile',

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
		return 'Oskari.poc.kendoui.layerselector.Tile';
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
		return "Karttatasot";
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
