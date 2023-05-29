/**
 * @class Oskari.mapframework.bundle.featuredata2.event.WFSSetFilter
 *
 * @deprecated - use mapmodule.getVectorFeatures() and VectorFeatureSelectionService instead
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.event.WFSSetFilter',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} geojson
     *
     */

    function (geojson, filters, allLayers) {
        this._geojson = geojson;
        this._filters = filters;
        this._allLayers = allLayers;
    }, {
        /** @static @property __name event name */
        __name: 'WFSSetFilter',
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * WFS feature property filter params
         * @method getFilters
         */
        getFilters: function () {
            return this._filters;
        },
        /**
         * @method getGeoJson
         */
        getGeoJson: function () {
            return this._geojson;
        },
        selectFromAllLayers: function () {
            return this._allLayers;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
