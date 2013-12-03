/**
 * @class Oskari.mapframework.bundle.parcel.handler.PreParcelSelectorHandler
 *
 * Handles PreParcelSelector events that are used to inform that feature with given fid should be loaded.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.handler.PreParcelSelectorHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.ignoreEvents = false;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'PreParcelSelectorHandler';
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
        var me = this,
            sandbox = this.instance.sandbox,
            p;
        sandbox.register(me);
        for (p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(me, p);
            }
        }
    },
    /**
     * @method stop
     * implements Module protocol stop method
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
    loadPreParcel : function (fid) {
        var me = this;
        me.instance.getService().loadPreParcelById(fid, function(preparcel) {
            me._loadCallback.call(me, preparcel);
        });
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {

    },
    /**
     * @method _loadCallback
     * @private
     * Callback function that gets the loaded preparcel with geometries
     * Calls the ....
     * @param {} preparcel.preparcel (attributes) and preparcel.data  (geom features)
     * @param {String} featureType Feature type of the feature.
     */
    _loadCallback : function(preparcel) {
        var me =this;
        if (jQuery.isEmptyObject(preparcel))
        {
            //  error message
        }
        else if (preparcel.preparcel && preparcel.data) {

            // preparcel.preparcel; common preparcel attributes
            // preparcel.data geom features
            // Create editor
            this.instance.getDrawPlugin().createEditor(preparcel.data, preparcel.preparcel);


        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
