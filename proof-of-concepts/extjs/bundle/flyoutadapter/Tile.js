/**
 * @class Oskari.poc.jqueryui.layerselection.Tile
 */
Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, props, def) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.props = props;
	this.def = def;

}, {
	getName : function() {
		return this.props.name;
	},
	setEl : function(el, width, height) {
		this.container = el;
	},
	startPlugin : function() {
	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
