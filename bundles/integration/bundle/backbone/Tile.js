/**
 * @class Oskari.integration.bundle.backbone.Tile
 */
Oskari.clazz.define('Oskari.integration.bundle.backbone.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale) {

	this.instance = instance;
	this.locale = locale;
	this.container = null;
	this.template = null;
}, {
	getName : function() {
		return 'Oskari.integration.bundle.backbone.Tile';
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
		return this.locale['title'];
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();

		/*var status = cel.children('.oskari-tile-status');*/
		/*status.empty();*/

		/*status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
