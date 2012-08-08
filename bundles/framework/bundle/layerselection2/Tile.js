/*
 * @class Oskari.mapframework.bundle.layerselection2.Tile
 * 
 * Renders the "selected layers" tile.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.layerselection2.Tile',

	  /**
	   * @method create called automatically on construction
	   * @static
	   * @param {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance} instance
	   * 		reference to component that created the tile
	   */
	  function(instance) {
	    this.instance = instance;
	    this.container = null;
	    this.template = null;
	    this.badge = Oskari.clazz.create('Oskari.userinterface.component.Badge');
	    this.shownLayerCount = null;
	  }, {
	    /**
	     * @method getName
	     * @return {String} the name for the component 
	     */
	    getName : function() {
	      return 'Oskari.mapframework.bundle.layerselection2.Tile';
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
	      this.badge.insertTo(status);
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
	      console.log("Tile.setState", this, state);
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
	      var layers = sandbox.findAllSelectedMapLayers();
		  var layerCount = layers.length;
		  if( this.shownLayerCount && this.shownLayerCount ) {
		  	this.badge.setContent(''+layerCount,'important');
		  } else { 
	      	this.badge.setContent(''+layerCount);
	      }
	      this.shownLayerCount = layerCount;

	    }
	  }, {
	    /**
	     * @property {String[]} protocol
	     * @static 
	     */
	    'protocol' : ['Oskari.userinterface.Tile']
	  });
