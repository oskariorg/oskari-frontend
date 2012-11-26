/**
 * @class Oskari.mapframework.bundle.mapmodule.controls.ClearHistoryHandler
 * Handles ClearHistoryRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.controls.ClearHistoryHandler',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.sandbox.Sandbox}
 *            sandbox reference to sandbox
 * @param {Oskari.mapframework.ui.module.common.MapModule}
 *            mapModule reference to mapmodule
 */
function(sandbox, mapModule) {
    this.mapModule = mapModule;
    this.sandbox = sandbox;
},
{
    /**
     * @method handleRequest 
     * Handles the request
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.mapmodule.request.ClearHistoryRequest} request
     *      request to handle
     */
    handleRequest: function(core, request) {
        this.mapModule.clearNavigationHistory();
    }
},
{
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
