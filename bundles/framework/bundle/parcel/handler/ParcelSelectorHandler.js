/**
 * @class Oskari.mapframework.bundle.parcel.handler.ParcelSelectorHandler
 * 
 * Handles the buttons for parcel functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.handler.ParcelSelectorHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.ignoreEvents = false;
    var me = this;
}, {
    __name : 'ParcelParcelSelectorHandler',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = this.instance.sandbox;
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
    },
        
    /**
     * @method update
     * implements Module protocol update method
     */
    stop : function() {
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'ParcelSelector.ParcelSelectedEvent' : function(event) {
            if(!this.ignoreEvents) {
            }
        },
        'ParcelSelector.RegisteredUnitSelectedEvent' : function(event) {
            if(!this.ignoreEvents) {
            }
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
