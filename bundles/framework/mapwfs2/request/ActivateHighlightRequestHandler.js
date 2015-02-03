/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequestHandler
 *
 * Handles WFS highlight activation functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequestHandler",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (plugin) {
        this.plugin = plugin;
    }, {
        /**
         * @method handleRequest
         * Enables or disabled WFS feature highlight
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapwfs2.request.ActivateHighlightRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var highlighted = request.isEnabled();
            this.plugin.setHighlighted(highlighted);
            if (!highlighted) {
                // Remove highlight images
                this.plugin.removeHighlightImages();
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
