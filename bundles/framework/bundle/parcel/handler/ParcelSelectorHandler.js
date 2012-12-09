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
}, {
    __name : 'ParcelSelectorHandler',
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
        for (p in me.eventHandlers) {
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
        if (!handler) {
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
            var me = this;
            if (!this.ignoreEvents) {
                if (event && event.getFid()) {
                    this.instance.getService().loadParcel(event.getFid(), function(feature) {
                        me._loadCallback.call(me, feature);
                    });
                }
            }
        },
        'ParcelSelector.RegisterUnitSelectedEvent' : function(event) {
            var me = this;
            if (!this.ignoreEvents) {
                if (event && event.getFid()) {
                    this.instance.getService().loadRegisterUnit(event.getFid(), function(feature) {
                        me._loadCallback.call(me, feature);
                    });
                }
            }
        }
    },
    /**
     *
     */
    _loadCallback : function(feature) {
        if (feature) {
            this.instance.getDrawPlugin().drawFeature(feature);
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
