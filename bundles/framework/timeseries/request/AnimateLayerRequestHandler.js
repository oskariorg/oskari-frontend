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
                autoPlay = request.getAutoPlay();

            if(me._playbackModule && times && layerId) {
                me._playbackModule.showSlider(layerId, times, autoPlay);
            }

        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });