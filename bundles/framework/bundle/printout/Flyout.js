/**
 * @class Oskari.mapframework.bundle.printout.Flyout
 *
 * Renders the "printout" flyout. The flyout shows different view 
 * depending of application state. Currently implemented views are:
 * Oskari.mapframework.bundle.printout.view.StartView (shown for logged in users).
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
 * 		reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;

    this.template = null;
    this.view = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.printout.Flyout';
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
        this.container = el[0];
        if(!jQuery(this.container).hasClass('printout')) {
            jQuery(this.container).addClass('printout');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery('<div></div>');
    },
    /**
     * @method stopPlugin
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {

    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('flyouttitle');
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the
     * flyout
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
        this.state = state;
       
    },
    /**
     * @method createUi
     * Creates the UI for a fresh start.
     * Selects the view to show based on user (guest/loggedin)
     */
    createUi : function() {
        var me = this;

        var flyout = jQuery(this.container);

        this.view = Oskari.clazz.create('Oskari.mapframework.bundle.printout.view.StartView',
                this.instance, 
                this.instance.getLocalization('StartView'));
    },
    
    refresh :function() {
        var flyout = jQuery(this.container);
        flyout.empty();  
        this.view.render(flyout);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
