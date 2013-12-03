/**
 * @class Oskari.mapframework.domain.WmsLayer
 *
 * MapLayer of type WMS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WmsLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

        /* Name of wms layer */
        this._wmsLayerName = null;

        /* Array of wms urls for this layer */
        this._wmsUrls = [];

        /* Layer Type */
        this._layerType = "WMS";
    }, {
        /**
         * @method addWmsUrl
         * @param {String} wmsUrl
         * Apppends the url to layer array of wms image urls
         */
        addWmsUrl: function (wmsUrl) {
            this._wmsUrls.push(wmsUrl);
        },
        /**
         * @method getWmsUrls
         * @return {String[]}
         * Gets array of layer wms image urls
         */
        getWmsUrls: function () {
            return this._wmsUrls;
        },
        /**
         * @method setWmsUrls
         * @param {String[]} wmsUrls
         * Gets array of layer wms image urls
         */
        setWmsUrls: function (wmsUrls) {
            this._wmsUrls = wmsUrls;
        },
        /**
         * @method setWmsName
         * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
         */
        setWmsName: function (wmsName) {
            this._wmsName = wmsName;
        },
        /**
         * @method getWmsName
         * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
         */
        getWmsName: function () {
            return this._wmsName;
        }
    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });