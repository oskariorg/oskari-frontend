/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequest
 *
 * Class for requesting add features to map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} options object with layer references and/or maxZoomLevel
     * @param {Object} featureFilter object with attribute names and accepted values
     */
    function (options, featureFilter) {
        this._options = options;
        this._featureFilter = featureFilter;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.ZoomToFeaturesRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getOptions
         * @return {Object} options for layer references and/or maxZoomLevel
         */
        getOptions: function () {
            return this._options;
        },
        /**
         * @method getFeatureFilter
         * @return {Object} object with attribute names and accepted values
         */
        getFeatureFilter: function () {
            return this._featureFilter;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    }
);
