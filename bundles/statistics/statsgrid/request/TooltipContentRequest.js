/**
 * Request to get tooltip info for the given feature.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 *
 * @class Oskari.statistics.bundle.statsgrid.request.TooltipContentRequest
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.TooltipContentRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (feature) {
        this._feature = feature;
    }, {
        /** @static @property __name request name */
        __name: "StatsGrid.TooltipContentRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLayer
         * @return {Object} request layer
         */
        getFeature: function () {
            return this._feature;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });