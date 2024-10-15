/**
 * @class Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequestHandler
 * Handles Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequest to handle getinfo results.
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.plugin.mapmodule.OpenlayersPopupPlugin} featureData
     *          reference to featureData
     */
    function (instance) {
        this.instance = instance;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.instance.addInfoResultHandler(request.getCallback());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
