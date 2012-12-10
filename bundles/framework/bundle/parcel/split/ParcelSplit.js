/**
 * @class Oskari.mapframework.bundle.parcel.split.ParcelSplit
 *
 * Provides tools to split parcel.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.split.ParcelSplit',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
 *          Instance provides other elements for use if required by this class.
 */
function(instance) {
    // Class constructor initializes variables here.
    // Instance provides other elements for use if required by this class.
    this.instance = instance;
}, {

    // Class functions and objects are defined here.
    // Items that are meant for private use only have _ prefix.

    /**
     * Initializations to be called after construction.
     */
    init : function() {
    },
    /**
     * Splits the parcel.
     * 
     * {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance provides the features that are used for the splitting.
     */
    split : function() {
        console.log("ParcelSplitter split TODO Remove this loging text");
        var me = this;
        var sandbox = me.instance.getSandbox();
        var drawPlugin = me.instance.getDrawPlugin();
        var openLayersMap = drawPlugin.getMapModule().getMap();
        var parcelLayer = drawPlugin.drawLayer;
        var parcelFeature = parcelLayer.features[0];
    }
});
