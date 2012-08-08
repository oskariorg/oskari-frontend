/**
 * @class Oskari.poc.dojo.layerselector.Flyout
 */
Oskari.clazz.define('Oskari.poc.dojo.layerselector.Flyout',

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
	},
	getName : function() {
		return 'Oskari.poc.dojo.layerselector.Flyout';
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
		return "Karttataso valinta Dojo";
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
		var query = me.dojo['dojo/query'];
		var conn = me.dojo['dojo'];
		var domConstruct = me.dojo['dojo/dom-construct'];
		var dom = me.dojo['dojo/dom'];
		var me = this;

		var sandbox = me.instance.getSandbox();

		domConstruct.empty(this.container);
		var data = {
			items : [{
				id : 'layerId',
				name : 'jee'
			}]
		};
		
		
        var dataStore =  new me.dojo['dojo/data/ObjectStore']({ objectStore:new me.dojo['dojo/store/Memory']({ data: data.items }) });
         
        var grid = new DataGrid({
            store: dataStore,
            query: { id: "*" },
            queryOptions: {},
            structure: [
                { name: "ID", field: "id", width: "25%" },
                { name: "Nimi", field: "name", width: "75%" }
            ]
        }, "grid");
        grid.startup();
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
