/**
 * @class Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequest
 * Request timeseries to open maplayer for timeseries animate
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} viewData
     *            View Data object which will be used to prepopulate map data in publish mode
     */
    function (layerId, times, autoPlay) {
        this._layerId = layerId;
        this._times = times;
        this._autoPlay = autoPlay;
    }, {
        /** @static @property __name request name */
        __name: 'Timeseries.AnimateLayerRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLayerId
         * @return {String|Integer} layer id
         */
        getLayerId: function () {
            return this._layerId;
        },
        /**
         * @method getTimes
         * @return {Object|Array} times
         */
        getTimes: function () {
            return this._times;
        },
        /**
         * @method getAutoPlay
         * @return {Boolean} auto play
         */
        getAutoPlay: function () {
            return this._autoPlay;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });