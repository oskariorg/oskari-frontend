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
