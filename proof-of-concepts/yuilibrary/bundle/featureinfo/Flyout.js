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
