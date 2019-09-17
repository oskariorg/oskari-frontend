/**
 * @class Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequestHandler
 * Handles Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox} sandbox reference to sandbox
     * @param {Oskari.mapframework.mapmodule.VectorLayerPlugin} vectorLayerPlugin reference to vectorlayer plugin
     */
    function (sandbox, vectorLayerPlugin) {
        this.sandbox = sandbox;
        this.vectorLayerPlugin = vectorLayerPlugin;
        this._log = Oskari.log('AddFeaturesToMapRequestHandler');
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequest} request request to handle
         */
        handleRequest: function (core, request) {
            this._log.debug('Add Features');
            this.vectorLayerPlugin.addFeaturesToMap(request.getGeometry(), request.getOptions());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
