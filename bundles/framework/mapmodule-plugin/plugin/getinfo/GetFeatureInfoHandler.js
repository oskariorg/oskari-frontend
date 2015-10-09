/**
 * @class Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler
 * Handles requests regarding GFI functionality
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.mapmodule.GetInfoPlugin} getInfoPlugi
     * Plugin that handles gfi functionality
     *
     */
    function (getInfoPlugin) {
        this.getInfoPlugin = getInfoPlugin;
    }, {
        /**
         * @public @method handleRequest
         * Handles requests regarding GFI functionality.
         * @param {Oskari.mapframework.core.Core} core
         * Reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest/Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoActivationRequest} request
         * Request to handle
         *
         */
        handleRequest: function (core, request) {
            if (request.getName() === 'MapModulePlugin.GetFeatureInfoRequest') {
                var lonlat = {
                        lon: request.getLon(),
                        lat: request.getLat()
                    };
                this.getInfoPlugin.clickLocation = lonlat;
                this.getInfoPlugin.handleGetInfo(lonlat);
            } else if (request.getName() === 'MapModulePlugin.GetFeatureInfoActivationRequest') {
                this.getInfoPlugin.setEnabled(request.isEnabled());
            }
        }
    }, {
        /**
         * @static @property {String[]} protocol array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
