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
        var sandbox = core.getSandbox();
        if(request.getName() == 'Toolbar.AddToolButtonRequest') {
            this._handleAdd(sandbox, request);
        }
        else if(request.getName() == 'Toolbar.RemoveToolButtonRequest') {
            this._handleRemove(sandbox, request);
        }
        else if(request.getName() == 'Toolbar.ToolButtonStateRequest') {
            this._handleState(sandbox, request);
        }
        else if(request.getName() == 'Toolbar.SelectToolButtonRequest') {
            this._handleClick(sandbox, request);
        }
    },
    _handleAdd : function(sandbox, request) {
        this._toolbar.addToolButton(
            request.getId(), request.getGroup(), request.getConfig());
    },
    _handleRemove : function(sandbox, request) {
        this._toolbar.removeToolButton(
            request.getId(), request.getGroup(), request.getToolbarId());
    },
    _handleState : function(sandbox, request) {
        this._toolbar.changeToolButtonState(
            request.getId(), request.getGroup(), request.getState());
    },
    _handleClick : function(sandbox, request) {
        this._toolbar._clickButton(
            request.getId(), request.getGroup());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
