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

        this._availableQueryFormats = [];

        /* Layer Type */
        this._layerType = "WMS";

        this._gfiContent = null;
    }, {
        /**
         * @method addWmsUrl
         * @param {String} wmsUrl
         * Apppends the url to layer array of wms image urls
         */
        addWmsUrl: function (wmsUrl) {
            var foundExisting = false;
            for (var i = 0; i < this.getWmsUrls().length; ++i) {
                var url = this.getWmsUrls()[i];
                if (url == wmsUrl) {
                    foundExisting = true;
                    break;
                }
            }
            if (!foundExisting) {
                // only add if isn't added yet
                this._wmsUrls.push(wmsUrl);
            }
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
        },
        /**
         * @method setGfiContent
         * @param {String} gfiContent GetFeatureInfo content
         */
        setGfiContent: function (gfiContent) {
            this._gfiContent = gfiContent;
        },
        /**
         * @method getGfiContent
         * @return {String} gfiContent GetFeatureInfo content
         */
        getGfiContent: function () {
            return this._gfiContent;
        }
    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });