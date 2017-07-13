/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerPlaybackRequest
 *
 * Class for requesting certain time dimension value and timeseries playback from layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerPlaybackRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            layerId layerId
     * @param {String}
     *            time requested point in time
     * @param {Boolean}
     *            playing should the animation start/stop 
     * @param {Number}
     *            frameInterval minimun time beween frames
     * @param {Number}
     *            nthStep playback only nth time steps (optional, default 1)
     */

    function (layerId, time, playing, frameInterval, nthStep) {
        this._layerId = layerId;
        this._time = time;
        this._playing = playing;
        this._frameInterval = frameInterval;
        this._nthStep = nthStep || 1;
    }, {
        /** @static @property __name request name */
        __name: "MapModulePlugin.MapLayerPlaybackRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLayerId
         * @return {String} layerId
         */
        getLayerId: function () {
            return this._layerId;
        },
        /**
         * @method getTime
         * @return {String}
         */
        getTime: function () {
            return this._time;
        },
        /**
         * @method isPlaying
         * @return {Boolean}
         */
        isPlaying: function () {
            return this._playing;
        },
         /**
         * @method getInterval
         * @return {Number}
         */
        getInterval: function () {
            return this._frameInterval;
        },
         /**
         * @method getStep
         * @return {Number}
         */
        getStep: function () {
            return this._nthStep;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });