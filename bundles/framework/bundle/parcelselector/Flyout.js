/**
 * @class Oskari.mapframework.bundle.parcelselector.Flyout
 * 
 * Renders the "all layers" flyout.
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
	this.container = null;
	this.state = null;
	this.parcelTabs = [];
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
		
        var parcelTab = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab", this.instance, this.instance.getLocalization('filter').parcel);
        var registerUnitTab = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab", this.instance, this.instance.getLocalization('filter').registerUnit);
        
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
	 * @method getDescription 
	 * @return {String} localized text for the description of the flyout 
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
	 * @param {String} state
	 * 		close/minimize/maximize etc
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
    setContentState : function(state) {
        // prepare for complete state reset
        if(!state) {
            state = {};
        }
        
        for(var i = 0; i < this.parcelTabs.length; ++i) {
            var tab = this.parcelTabs[i];
            if(tab.getTitle() == state.tab) {
                this.tabContainer.select(tab.getTabPanel());
                tab.setState(state);
            }
        }
    },
    getContentState : function() {
        var state = {};
        for(var i = 0; i < this.parcelTabs.length; ++i) {
            var tab = this.parcelTabs[i];
            if(this.tabContainer.isSelected(tab.getTabPanel())) {
                state = tab.getState();
                break;
            }
        }
        return state;
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
