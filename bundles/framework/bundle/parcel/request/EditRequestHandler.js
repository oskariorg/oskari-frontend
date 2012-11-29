/**
 * @class Oskari.mapframework.bundle.parcel.request.EditRequestHandler
 * Handles sequests for a saved "parcel" or parcels categorires to be opened for editing
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.EditRequestHandler', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 *          reference to application sandbox
 * @param {Oskari.mapframework.bundle.parcel.ParcelBundleInstance} instance 
 *          reference to parcels bundle instance
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
     * @param {Oskari.mapframework.bundle.parcel.request.EditPlaceRequest/Oskari.mapframework.bundle.parcel.request.EditCategoryRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var sandbox = core.getSandbox();
        if(request.getName() == 'Parcel.EditPlaceRequest') {
            this._handleEditPlace(sandbox, request);
        }
        else if(request.getName() == 'Parcel.EditCategoryRequest') {
            this._handleEditCategory(sandbox, request);
        }
        else if(request.getName() == 'Parcel.DeleteCategoryRequest') {
            this._handleDeleteCategory(sandbox, request);
        }
        else if(request.getName() == 'Parcel.PublishCategoryRequest') {
            this._handlePublishCategory(sandbox, request);
        }
    },
    _handleEditPlace : function(sandbox, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.parcel.request.EditRequestHandler] edit requested for place " + request.getId());
        var service = this.instance.getService();
        var place = service.findParcel(request.getId());
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
        this.sandbox.printDebug("[Oskari.mapframework.bundle.parcel.request.EditRequestHandler] edit requested for category " + request.getId());
        var service = this.instance.getService();
        var category = service.findCategory(request.getId());
        if(category) {
            this.instance.getCategoryHandler().editCategory(category);
        }
    },
    _handleDeleteCategory : function(sandbox, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.parcel.request.EditRequestHandler] delete requested for category " + request.getId());
        var service = this.instance.getService();
        var category = service.findCategory(request.getId());
        if(category) {
            this.instance.getCategoryHandler().confirmDeleteCategory(category);
        }
    },
    _handlePublishCategory : function(sandbox, request) {
        this.sandbox.printDebug("[Oskari.mapframework.bundle.parcel.request.EditRequestHandler] (un/)publish requested for category " + request.getId());
        var service = this.instance.getService();
        var category = service.findCategory(request.getId());
        if(category) {
            this.instance.getCategoryHandler().confirmPublishCategory(category, request.isPublic());
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
