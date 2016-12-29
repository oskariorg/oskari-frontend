/**
 * @class Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequest
 * Request timeseries to open maplayer for timeseries animate
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param  {Integer|String} layerId     layer id
     * @param  {Object|Array} times         times
     * @param  {Boolean} autoPlay           is autoplay
     * @param  {String} dimensionName       dimension name
     * @param  {String} units               units
     */
    function (layerId, times, autoPlay, dimensionName, units) {
        this._layerId = layerId;
        this._times = times;
        this._autoPlay = autoPlay;
        this._dimensionName = dimensionName;
        this._units = units;
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
        },
        /**
         * @method  getDimensionName
         * @return {String} dimension name
         */
        getDimensionName: function() {
            return this._dimensionName;
        },
        /**
         * @method  getUnits
         * @return {String} units
         */
        getUnits: function(){
            return this._units;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });