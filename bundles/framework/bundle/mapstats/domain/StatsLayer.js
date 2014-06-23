/**
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayer
 *
 * MapLayer of type Stats
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayer',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        /* Layer Type */
        this._layerType = "STATS";

    }, {
        /* Layer type specific functions */
        /**
         * @method setWmsName
         * @param {String} wmsName used to identify service
         */
        setWmsName: function (wmsName) {
            this._wmsName = wmsName;
        },
        /**
         * @method getWmsName
         * @return {String} wmsName used to identify service
         */
        getWmsName: function () {
            return this._wmsName;
        },
        /**
         * @method setFilterPropertyName
         * @param {String} filterPropertyName is the key field name to map layer features
         */
        setFilterPropertyName: function (filterPropertyName) {
            this._filterPropertyName = filterPropertyName;
        },
        /**
         * @method getFilterPropertyName
         * @return {String} filterPropertyName is the key field name to map layer features
         */
        getFilterPropertyName: function () {
            return this._filterPropertyName;
        },
        /**
         * Should have structure like this:
         * {
         *     categories: [
         *         <category>
         *     ],
         *     wmsNames: {
         *         <category>: <wmsname>
         *     },
         *     filterProperties: {
         *         <category>: <filter property>
         *     }
         * }
         *
         * @method setCategoryMappings
         * @param {Object} mappings
         */
        setCategoryMappings: function (mappings) {
            this._categoryMappings = mappings;
        },
        /**
         * @method getCategoryMappings
         * @return {Object} mappings for categories
         */
        getCategoryMappings: function () {
            return this._categoryMappings;
        }
    }, {
        "extend": ["Oskari.mapframework.domain.AbstractLayer"]
    });
