/*
 * @class Oskari.mapframework.bundle.layerselection2.Tile
 *
 * Renders the "selected layers" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, locale) {

	this.instance = instance;
	this.locale = locale;

	this.container = null;
	this.template = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.userguide.Tile';
	},
	/**
	 * @method setEl
	 * @param {Object} el
	 * 		reference to the container in browser
	 * @param {Number} width
	 * 		container size(?) - not used
	 * @param {Number} height
	 * 		container size(?) - not used
	 *
	 * Interface method implementation
	 */
	setEl : function(el, width, height) {
		this.container = jQuery(el);
		var status = this.container.children('.oskari-tile-status');
		
	},
	getEl : function() {
		return this.container;
	},
	
	/**
	 * @method startPlugin
	 * Interface method implementation, calls #refresh()
	 */
	startPlugin : function() {
		this.refresh();
	},
	/**
	 * @method stopPlugin
	 * Interface method implementation, clears the container
	 */
	stopPlugin : function() {
		this.container.empty();
	},
	/**
	 * @method getTitle
	 * @return {String} localized text for the title of the tile
	 */
	getTitle : function() {
		return this.locale['title'];
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the tile
	 */
	getDescription : function() {
		return this.locale['desciption'];
	},
	/**
	 * @method getOptions
	 * Interface method implementation, does nothing atm
	 */
	getOptions : function() {

	},
	
	/**
	 * @method refresh
	 * Creates the UI for a fresh start
	 */
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();

	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
