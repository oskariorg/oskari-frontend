/**
 * @class Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler
 *
 * Handles user style functionality.
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (instance) {
        this.instance = instance;
    }, {

        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.userstyle.request.ShowUserStylesRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const values = {
                layerId: request.getLayerId(),
                styleName: request.getStyleName(),
                showStyle: request.showStyle()
            };
            this.instance.showPopup(values);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
