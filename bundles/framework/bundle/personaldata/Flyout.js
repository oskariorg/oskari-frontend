/**
 * @class Oskari.mapframework.bundle.personaldata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    
	this.template = null;
	this.templateTabHeader = null;
    this.templateTabContent = null;
	this.tabsData = [];
	
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName : function() {
        return 'Oskari.mapframework.bundle.personaldata.Flyout';
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
		if(!jQuery(this.container).hasClass('personaldata')) {
			jQuery(this.container).addClass('personaldata');
		}
    },
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
    startPlugin : function() {
		var me = this;
        
        var tabsLocalization = this.instance.getLocalization('tabs');
		this.tabsData = {
			"myPlaces" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyPlacesTab', this.instance, tabsLocalization.myplaces),
			"myViews" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', this.instance, tabsLocalization.myviews),
			"publishedMaps" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', this.instance, tabsLocalization.publishedmaps),
			"account" : Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.AccountTab', this.instance, tabsLocalization.account)
		};
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
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	
	/**
	 * @method createUi
	 * Creates the UI for a fresh start
	 */
    createUi : function() {
        var me = this;
        var sandbox = me.instance.getSandbox();
        
		// clear container
		var flyout = jQuery(this.container);
		flyout.empty();
        this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', 
            this.instance.getLocalization('notLoggedIn'));
        this.tabsContainer.insertTo(flyout);
        
        if(!sandbox.getUser().isLoggedIn()) {
            //jQuery(me.container).append(me.templateNotLoggedIn.clone());
            return;
        }
        
        // now we can presume user is logged in
		for(var tabId in this.tabsData) {
			var tab = this.tabsData[tabId];
	        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(tab.getTitle());
            
	    	tab.addTabContent(panel.getContainer());
	    	// binds tab to events
	    	if(tab.bindEvents) {
	    		tab.bindEvents();
	    	}
            this.tabsContainer.addPanel(panel);
        }
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ['Oskari.userinterface.Flyout']
});
