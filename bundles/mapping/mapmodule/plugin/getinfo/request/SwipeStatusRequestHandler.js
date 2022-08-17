
/**
 * @class Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequestHandler
 *
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} swipeStatus swipe tool status.
     */
    function (instance) {
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * sets swipe status
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.instance.setSwipeStatus(request.getLayerId(), request.getActive(), request.getCropX());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
