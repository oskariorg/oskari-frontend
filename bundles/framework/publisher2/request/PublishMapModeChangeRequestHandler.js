/**
 * @class Oskari.mapframework.bundle.publisher.request.PublishMapModeRequestHandler
 * Requesthandler for editing a map view in publish mode
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.request.PublishMapModeRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher2.PublisherBundleInstance} instance
     *          reference to publisher instance
     */
    function (instance) {
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * Shows/hides the maplayer specified in the request in OpenLayers implementation.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         *      request to handle
         * @param {Oskari.mapframework.bundle.publishe2r.request.PublishMapModeRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.instance.publishId = request.getMode();
            this.instance.setMode(request.getMode());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });