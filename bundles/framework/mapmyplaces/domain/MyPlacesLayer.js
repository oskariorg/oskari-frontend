/**
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer
 *
 * MapLayer of type MyPlaces
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "MYPLACES";
    this._metaType = "MYPLACES";
}, {
	/* Layer type specific functions */

    /**
     * Sets the wms url for the layer.
     *
     * @method setWmsUrl
     * @param {String} wmsUrl
     */
    setWmsUrl : function(wmsUrl) {
        this._wmsUrl = wmsUrl;
    },
    /**
     * Returns the wms url of the layer.
     *
     * @method getWmsUrl
     * @return {String}
     */
    getWmsUrl : function() {
        return this._wmsUrl;
    },
    /**
     * @method setWmsName
     * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmsName : function(wmsName) {
        this._wmsName = wmsName;
    },
    /**
     * @method getWmsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmsName : function() {
        return this._wmsName;
    }

}, {
    "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
});