/*
 * @class Oskari.mapframework.bundle.layerselection2.Tile
 *
 * Renders the "selected layers" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselection2.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
 * instance
 * 		reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.template = null;
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
    notifyUser : function() {
        var me = this;
        var status = this.container.children('.oskari-tile-status');
        
        // stop current animation
        status.stop();
        // blink 2 times
        this._blink(status, 2);
    },
    _blink : function(element, count) {
        var me = this;
        if(!element) {
            return;
        }
        if(!count) {
            count = 1;
        }
        // animate to low opacity
        element.animate({
            opacity: 0.25
        }, 500, function() {
            // on complete, animate back to fully visible
             element.animate({
                opacity: 1
            }, 500,function() {
                // on complete, check and adjust the count parameter
                // recurse if count has not been reached yet
                if(count > 1) {
                    me._blink(element, --count);
                }
            });
        });  
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

        var status = this.container.children('.oskari-tile-status');
        status.addClass('icon-bubble-right');
        status.html(layerCount);
        this.notifyUser();
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Tile']
});
