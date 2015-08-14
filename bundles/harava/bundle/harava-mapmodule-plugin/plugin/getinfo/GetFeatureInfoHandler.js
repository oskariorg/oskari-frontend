/**
 * @class Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler
 * Handles requests regarding GFI functionality
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.mapmodule.GetInfoPlugin}
 *            getInfoPlugin plugin that handles gfi functionality
 */
function(getInfoPlugin) {
    this.getInfoPlugin = getInfoPlugin;
}, {
    /**
     * @method handleRequest 
     * Handles requests regarding GFI functionality.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoRequest/Oskari.mapframework.bundle.mapmodule.request.GetFeatureInfoActivationRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        if (request.getName() == 'MapModulePlugin.GetFeatureInfoRequest') {
            this.getInfoPlugin.handleGetInfo({
                lon : request.getLon(),
                lat : request.getLat()
            }, request.getX(), request.getY());
        } else if (request.getName() == 'MapModulePlugin.GetFeatureInfoActivationRequest') {
            this.getInfoPlugin.setEnabled(request.isEnabled());
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
