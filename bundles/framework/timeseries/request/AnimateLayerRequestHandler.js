/**
 * @class Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequesttHandler
 * Requesthandler for animate map layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.request.AnimateLayerRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance} instance
     *          reference to timeseries instance
     */
    function (playbackModule) {
        this._playbackModule = playbackModule;
    }, {
        /**
         * @method handleRequest
         * Time animate a specified maplayer.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         *      request to handle
         * @param {Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var me = this,
                times = request.getTimes(),
                layerId = request.getLayerId(),
                autoPlay = request.getAutoPlay(),
                dimensionName = request.getDimensionName(),
                units = request.getUnits();

            // Currently only supported ISO8601 formatted dimensions
            var isTimeDimension = (dimensionName && units === 'ISO8601') ? true: false;

            if(me._playbackModule && times && layerId && isTimeDimension) {
                me._playbackModule.showSlider(layerId, times, autoPlay, dimensionName, units);
            }

        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });