/*
 * @class Oskari.mapframework.bundle.promote.Tile
 *
 * Renders the "promote" tile.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.promote.Tile',

	  /**
	   * @method create called automatically on construction
	   * @static
	   * @param {Oskari.mapframework.bundle.promote.PromoteBundleInstance} instance
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
	      return 'Oskari.mapframework.bundle.promote.Tile';
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
	    	var isContainer = (this.container && this.instance.mediator) ? true : false;
            var isBundleId = (isContainer && this.instance.mediator.bundleId) ? true : false;
            var isInstanceId = (isContainer && this.instance.mediator.instanceId) ? true : false;

            if (isInstanceId && !this.container.hasClass(this.instance.mediator.instanceId)) {
                this.container.addClass(this.instance.mediator.instanceId);
            }

            if (isBundleId && !this.container.hasClass(this.instance.mediator.bundleId)) {
                this.container.addClass(this.instance.mediator.bundleId);
            }

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
	     * @method refresh
	     * Creates the UI for a fresh start
	     */
	    refresh : function() {
	      var me = this;
	      var instance = me.instance;
	      var cel = this.container;
	      var tpl = this.template;
	      var sandbox = instance.getSandbox();

	      var status = cel.children('.oskari-tile-status');

//	      status.empty();
//	      status.append('(' + layers.length + ')');

	    }
	  }, {
	    /**
	     * @property {String[]} protocol
	     * @static
	     */
	    'protocol' : ['Oskari.userinterface.Tile']
	  });
