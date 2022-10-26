/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ToggleFullScreenControlRequestHandler
 * Handles MapModulePlugin.ToggleFullScreenControlRequest requests
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.ToggleFullScreenControlRequestHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin}
     * plugin Reference to FullScreenPlugin instance
     *
     */
    function (plugin) {
        this.plugin = plugin;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         *
         * @param {Oskari.mapframework.core.Core} core
         * Reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest} request
         * Request to handle
         *
         */
        handleRequest: function (core, request) {
            this.plugin.setVisible(request.isVisible());
        }
    }, {
        /**
         * @static @property {String[]} protocol array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
