/**
 * @class Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler
 * Handles sequests for a saved "my place" or my places categorires to be opened for editing
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler', 

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
     * Shows/hides the maplayer specified in the request in OpenLayers implementation.
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.myplaces2.request.EditPlaceRequest/Oskari.mapframework.bundle.myplaces2.request.EditCategoryRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var sandbox = core.getSandbox();
        if(request.getName() == 'MyPlaces.EditPlaceRequest') {
            this._handleEditPlace(sandbox, request);
        }
        else if(request.getName() == 'MyPlaces.EditCategoryRequest') {
            this._handleEditCategory(sandbox, request);
        }
    },
    _handleEditPlace : function(sandbox, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] edit requested for place " + request.getId());
        var service = this.instance.getService();
        var place = service.findMyPlace(request.getId());
        if(place) {
            var center = place.getGeometry().getCentroid();
            var location = {
                lon : center.x,
                lat : center.y
            };
            this.instance.getDrawPlugin().startDrawing({
                geometry : place.getGeometry()
            });
            this.instance.getMainView().showPlaceForm(location, place);
        }
        else {
            // should not happen
            /*
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show('Virhe!', 'Kohdetta ei löytynyt!');
            dialog.fadeout();
            */
        }
    },
    _handleEditCategory : function(sandbox, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] edit requested for category " + request.getId());
        var service = this.instance.getService();
        var category = service.findCategory(request.getId());
        if(category) {
            this.instance.getCategoryHandler().editCategory(category);
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
