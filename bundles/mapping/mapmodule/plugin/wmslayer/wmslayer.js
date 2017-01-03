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

        this._availableQueryFormats = [];

        /* Layer Type */
        this._layerType = "WMS";
    }, {
        /**
         * @method addWmsUrl
         * @param {String} wmsUrl
         * Apppends the url to layer array of wms image urls
         */
        addWmsUrl: function (wmsUrl) {
            this.addLayerUrl(wmsUrl);
        },
        /**
         * @method getWmsUrls
         * @return {String[]}
         * Gets array of layer wms image urls
         */
        getWmsUrls: function () {
            return this.getLayerUrls();
        },
        /**
         * @method setWmsUrls
         * @param {String[]} wmsUrls
         * Gets array of layer wms image urls
         */
        setWmsUrls: function (wmsUrls) {
            this.setLayerUrls(wmsUrls);
        },
        /**
         * @method setWmsName
         * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
         */
        setWmsName: function (wmsName) {
            this.setLayerName(wmsName);
        },
        /**
         * @method getWmsName
         * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
         */
        getWmsName: function () {
            return this.getLayerName();
        },
        /**
         * @method setVersion
         * @param {String} version 1.3.0 or 1.1.1.
         */
        setVersion: function (version) {
            this._version = version;
        },
        /**
         * @method getVersion
         * @return {String} version 1.3.0 or 1.1.1.
         */
        getVersion: function () {
            return this._version;
        },
        /**
         * Possible options for #setQueryFormat()
         * @method setAvailableQueryFormats
         * @param {String[]} options for GFI output
         */
        setAvailableQueryFormats: function (options) {
            this._availableQueryFormats = options || [];
        },
        /**
         * Possible options for #setQueryFormat()
         * @method getAvailableQueryFormats
         * @return {String[]} options for GFI output
         */
        getAvailableQueryFormats: function () {
            return this._availableQueryFormats || [];
        }
    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });