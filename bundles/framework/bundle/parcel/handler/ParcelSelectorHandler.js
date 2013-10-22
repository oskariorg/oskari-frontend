/**
 * @class Oskari.mapframework.bundle.parcel.handler.ParcelSelectorHandler
 *
 * Handles ParcelSelector events that are used to inform that feature with given fid should be loaded.
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
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'ParcelSelectorHandler';
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
    loadParcel : function (fid) {
        var me = this;
        me.instance.getService().loadParcel(fid, function(feature) {
                        me._loadCallback.call(me, feature, me.instance.conf.parcelFeatureType);
                    });
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'ParcelSelector.ParcelSelectedEvent' : function(event) {
            var me = this;
            if (!me.ignoreEvents) {
                if (event && event.getFid()) {
                    me.loadParcel(event.getFid());
                }
            }
        },
        'ParcelSelector.RegisterUnitSelectedEvent' : function(event) {
            var me = this;
            if (!me.ignoreEvents) {
                if (event && event.getFid()) {
                    me.instance.getService().loadRegisterUnit(event.getFid(), function(feature) {
                        me._loadCallback.call(me, feature, me.instance.conf.registerUnitFeatureType);
                    });
                }
            }
        }
    },
    /**
     * @method _loadCallback
     * @private
     * Callback function that gets the loaded feature and its feature type.
     * Calls the {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin} to draw the feature into the UI.
     * @param {OpenLayers.Feature.Vector} Feature that has been loaded.
     * @param {String} featureType Feature type of the feature.
     */
    _loadCallback : function(feature, featureType) {
        if (feature) {
            this.instance.getDrawPlugin().drawFeature(feature, featureType);
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
