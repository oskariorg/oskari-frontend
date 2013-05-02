/**
 * @class Oskari.digiroad.bundle.featureselector.Tile
 * Renders the "featureselector" tile.
 */
Oskari.clazz.define('Oskari.digiroad.bundle.featureselector.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance} instance
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
		return 'Oskari.digiroad.bundle.featureselector.Tile';
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
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the tile 
	 */
	getDescription : function() {
		return this.instance.getLocalization('desc');
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
	},
	/**
	 * @method refresh
	 * Creates the UI for a fresh start
	 */
	refresh : function() {
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Tile']
});
