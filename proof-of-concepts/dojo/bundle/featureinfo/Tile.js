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
