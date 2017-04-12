/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler
 * Handles Oskari.mapframework.bundle.toolbar.request.ToolContainerRequest
 *  for managing toolbar buttons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
 *          reference to toolbarInstance that handles the buttons
 */
function(toolbarPlugin) {
    this._toolbar = toolbarPlugin;
}, {
    /**
     * @method handleRequest
     * Hides the requested infobox/popup
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.toolbar.request.AddToolbarRequest/Oskari.mapframework.bundle.toolbar.request.RemoveToolbarRequest/Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        if(request.getOp() == 'set') {
            this._toolbar.setToolContent(request.getData());
        }
        else if(request.getOp() == 'reset') {
            this._toolbar.resetToolContent(request.getData());
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
