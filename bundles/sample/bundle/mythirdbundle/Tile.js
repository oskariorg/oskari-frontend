/**
 * @class Oskari.sample.bundle.mythirdbundle.Tile
 * Renders the "mythirdbundle" tile.
 */
Oskari.clazz.define('Oskari.sample.bundle.mythirdbundle.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.sample.bundle.mythirdbundle.FlyoutHelloWorldBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.sample.bundle.mythirdbundle.Tile';
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
	},
	/**
	 * @method startPlugin
	 * Interface method implementation, calls #refresh() 
	 */
	startPlugin : function() {
		this.createUI();
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
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the tile 
	 */
	getDescription : function() {
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions : function() {

	},
	/**
	 * @method setState 
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	/**
	 * @method _createUI
	 * Creates the UI for a fresh start
	 */
	createUI : function() {
	    // nothing to do here
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
