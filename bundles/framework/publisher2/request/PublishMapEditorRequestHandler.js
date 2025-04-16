/**
 * @class Oskari.mapframework.bundle.publisher2.request.PublishMapEditorRequestHandler
 * Requesthandler for editing a map view in publish mode
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
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
         * @param {Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const { uuid } = request.getEditMap() || {};
            if (!uuid) {
                this.instance.setPublishMode(true);
                return;
            }
            const cb = data => data && this.instance.setPublishMode(true, data);
            this.instance.getService().fetchAppSetup(uuid, cb);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
