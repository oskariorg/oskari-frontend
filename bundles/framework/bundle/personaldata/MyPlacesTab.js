/**
 * @class Oskari.mapframework.bundle.personaldata.MyPlacesTab
 * Renders the "personal data" myplaces tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.MyPlacesTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
 * instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
    this.tabsContainer = undefined;
}, {
    /**
     * @method getName
     * @return {String} name of the component
     * (needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this))
     */
    getName : function() {
        return 'PersonalData.MyPlaces';
    },
    getTitle : function() {
        return this.loc.title;
    },
    addTabContent : function(container) {
        var me = this;
        
        this.tabsContainer = 
            Oskari.clazz.create('Oskari.userinterface.component.TabContainer', 'jee');
        this.tabsContainer.insertTo(container);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method MyPlaces.MyPlacesChangedEvent
         * TODO: 
         */
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
            var service = this.instance.sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
            var categories = service.getAllCategories();
            for(var i = 0; i < categories.length; ++i) {
                var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                panel.setTitle(categories[i].getName());
                //panel.getContainer().append('pöö');
                this.tabsContainer.addPanel(panel);   
            }
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        return handler.apply(this, [event]);

    },
    /**
     * @method bindEvents
     * Register tab as eventlistener
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

    },
    /**
     * @method unbindEvents
     * Unregister tab as eventlistener
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.unregisterForEventByName(this, p);
        }
    }
});
