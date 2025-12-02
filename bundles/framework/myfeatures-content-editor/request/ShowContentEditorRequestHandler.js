/**
 * @class Oskari.bundles.framework.myfeatures-content-editor.request.ShowContentEditorRequestHandler
 */
Oskari.clazz.define('Oskari.bundles.framework.myfeatures-content-editor.request.ShowContentEditorRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.bundles.framework.myfeatures-content-editor.ContentEditorBundleInstance} instance
     *          reference to instance
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
         * @param {Oskari.bundles.framework.myfeatures-content-editor.request.ShowContentEditorRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.instance.showContentEditor(request.getLayerId(), request.getOptions());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
