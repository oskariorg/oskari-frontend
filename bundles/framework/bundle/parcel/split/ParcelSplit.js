/**
 * @class Oskari.mapframework.bundle.parcel.split.ParcelSplit
 *
 * Provides tools to split parcel.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.split.ParcelSplit',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin} drawPlugin
 *          Plugin provides other elements for use if required by this class.
 */
function(drawPlugin) {
    // Class constructor initializes variables here.
    // Plugin provides other elements for use if required by this class.
    this.drawPlugin = drawPlugin;
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
        if (this.drawPlugin.splitSelection) return;
        //var openLayersMap = this.drawPlugin.getMapModule().getMap();
        var parcelLayer = this.drawPlugin.drawLayer;
        var featureInd = parcelLayer.features.length-1;
        if (featureInd < 1) return;
        this.drawPlugin.splitSelection = true;
        var basePolygon = parcelLayer.features[0].geometry;
        var operatingGeometry = parcelLayer.features[featureInd].geometry;
        switch (operatingGeometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Polygon":
                this.splitHole(basePolygon,operatingGeometry);
                parcelLayer.redraw();
                break;
            case "OpenLayers.Geometry.LineString":
                break;
        }
    },


    /*
     *
     */
    splitHole : function(outPolygon,inPolygon) {
        outPolygon.addComponent(inPolygon.components[0]);
    },

    /*
     *
     */
    splitLine : function(outPolygon,inPolygon) {



    }

});
