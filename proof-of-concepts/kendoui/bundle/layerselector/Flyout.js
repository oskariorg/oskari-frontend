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
