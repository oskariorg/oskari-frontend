/**
 * @class Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogHandler
 * Handles sequests for opening the add layer dialog.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogHandler',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance} instance
 *          reference to my places bundle instance
 */
function(sandbox, instance) {
    this.sandbox = sandbox;
    this.instance = instance;
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.myplaces3.request.EditPlaceRequest/Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        if (this.instance) {
            this.instance.openAddLayerDialog(request.getOriginator(), request.getSide());
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
