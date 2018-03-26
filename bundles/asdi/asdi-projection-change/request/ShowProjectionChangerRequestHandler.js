/**
 * @class Oskari.mapframework.bundle.admin.request.ShowProjectionChangerRequestHandler
 */
Oskari.clazz.define('Oskari.projection.change.request.ShowProjectionChangerRequestHandler',
/**
 * @method create called automatically on construction
 * @param {Oskari.projection.change.plugin.ProjectionChangerPlugin} plugin
 *          reference to search
 */
function(plugin) {
    this.plugin = plugin;
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.projection.change.request.ShowProjectionChangerRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        this.plugin.getFlyout().show();
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.projection.change.request.ShowProjectionChangerRequest']
});
