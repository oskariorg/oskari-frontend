/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler
 * Handles Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest,
 * Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest and
 * Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest
 *  for managing toolbar buttons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
 *          reference to toolbarInstance that handles the buttons
 */
function(toolbar) {
    this._toolbar = toolbar;
}, {
    /**
     * @method handleRequest
     * Hides the requested infobox/popup
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest/Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest/Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var requestName = request.getName();
        if(requestName === 'Toolbar.AddToolButtonRequest') {
            this._toolbar.addToolButton(
                request.getId(), request.getGroup(), request.getConfig());
        }
        else if(requestName === 'Toolbar.RemoveToolButtonRequest') {
            this._toolbar.removeToolButton(
                request.getId(), request.getGroup(), request.getToolbarId());
        }
        else if(requestName === 'Toolbar.ToolButtonStateRequest') {
            this._toolbar.changeToolButtonState(
                request.getId(), request.getGroup(), request.getState());
        }
        else if(requestName === 'Toolbar.SelectToolButtonRequest') {
            this._toolbar._clickButton(
                request.getId(), request.getGroup());
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
