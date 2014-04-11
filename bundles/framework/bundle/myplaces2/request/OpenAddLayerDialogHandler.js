/**
 * @class Oskari.mapframework.bundle.myplaces2.request.OpenAddLayerDialogHandler
 * Handles sequests for opening the add layer dialog.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.request.OpenAddLayerDialogHandler', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance} instance 
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
     * @param {Oskari.mapframework.bundle.myplaces2.request.EditPlaceRequest/Oskari.mapframework.bundle.myplaces2.request.OpenAddLayerDialogRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
//        console.log("Caught request");
        if (this.instance) {
//            console.log("Opening dialog...");
            this.instance.openAddLayerDialog(request.getOriginator(), request.getSide());
        } else {
//            console.log("No MyPlacesTab in instance: ", this.instance);
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
