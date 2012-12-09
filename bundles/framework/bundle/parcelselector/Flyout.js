/**
 * @class Oskari.mapframework.bundle.parcelselector.Flyout
 * 
 * Renders the "parcels" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelselector.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
	this.instance = instance;
	this.parcelTabs = [];
    this.container = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.parcelselector.Flyout';
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
		if(!jQuery(this.container).hasClass('parcelselector')) {
			jQuery(this.container).addClass('parcelselector');
		}
	},
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
	startPlugin : function() {
		var me = this;

        var parcelTab = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab", this.instance, this.instance.getLocalization('filter').parcel, 'ParcelSelector.ParcelSelectedEvent');
        var registerUnitTab = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab", this.instance, this.instance.getLocalization('filter').registerUnit, 'ParcelSelector.RegisterUnitSelectedEvent');

		this.parcelTabs.push(parcelTab);
        this.parcelTabs.push(registerUnitTab);
	},
	/**
	 * @method stopPlugin 
	 * 
	 * Interface method implementation, does nothing atm 
	 */
	stopPlugin : function() {
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the flyout 
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method createUi
	 * Creates the UI for a fresh start
	 */
	createUi : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();

        // clear container
        var cel = jQuery(this.container);
        cel.empty();

        this.tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
        this.tabContainer.insertTo(cel);
        for(var i = 0; i < this.parcelTabs.length; ++i) {
            var tab = this.parcelTabs[i];
            this.tabContainer.addPanel(tab.getTabPanel());
        }
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
