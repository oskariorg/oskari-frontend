/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolbarRequestHandler
 * Handles Oskari.mapframework.bundle.toolbar.request.AddToolbarRequest,
 * Oskari.mapframework.bundle.toolbar.request.RemoveToolbarRequest and
 * Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest
 *  for managing toolbar buttons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolbarRequestHandler', 

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
     * @param {Oskari.mapframework.bundle.toolbar.request.AddToolbarRequest/Oskari.mapframework.bundle.toolbar.request.RemoveToolbarRequest/Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var sandbox = core.getSandbox();
        if(request.getOp() == 'add') {
            this._toolbar._addToolbar(request.getId(), request.getData());
        }
        else if(request.getOp() == 'show') {
            this._toolbar._showToolbar(request.getId());
        }
        else if(request.getOp() == 'hide') {
            this._toolbar._hideToolbar(request.getId());
        } 
        else if(request.getOp() == 'remove') {
            this._toolbar._removeToolbar(request.getId());
        }

    },
    _handleAdd : function(sandbox, request) {
        this._toolbar.addToolButton(
            request.getId(), request.getGroup(), request.getConfig());
    },
    _handleRemove : function(sandbox, request) {
        this._toolbar.removeToolButton(
            request.getId(), request.getGroup());
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
