/**
 * @class Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler
 * Handles sequests for a saved "my place" or my places categorires to be opened for editing
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance} instance
     *          reference to my places bundle instance
     */

    function (sandbox, instance) {
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
        handleRequest: function (core, request) {
            var sandbox = this.sandbox;
            if (request.getName() === 'MyPlaces.EditPlaceRequest') {
                this._handleEditPlace(sandbox, request);
            } else if (request.getName() === 'MyPlaces.DeletePlaceRequest') {
                this._handleDeletePlace(sandbox, request);
            } else if (request.getName() === 'MyPlaces.EditCategoryRequest') {
                this._handleEditCategory(sandbox, request);
            } else if (request.getName() === 'MyPlaces.DeleteCategoryRequest') {
                this._handleDeleteCategory(sandbox, request);
            } else if (request.getName() === 'MyPlaces.PublishCategoryRequest') {
                this._handlePublishCategory(sandbox, request);
            }
        },
        _handleEditPlace: function (sandbox, request) {
            this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] edit requested for place " + request.getId());
            var service = this.instance.getService(),
                place = service.findMyPlace(request.getId());
            if (place) {
                var center = place.getGeometry().getCentroid(),
                    location = {
                        lon: center.x,
                        lat: center.y
                    };
                this.instance.getDrawPlugin().startDrawing({
                    geometry: place.getGeometry()
                });
                this.instance.getMainView().showPlaceForm(location, place);
            } else {
                // should not happen
                /*
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show('Virhe!', 'Kohdetta ei löytynyt!');
            dialog.fadeout();
            */
            }
        },
        _handleDeletePlace: function (sandbox, request) {
            this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.DeleteRequestHandler] delete requested for place " + request.getId());
            /* let's refresh map also if there */
            var categoryId = request.getId(),
                layerId = 'myplaces_' + categoryId,
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);

            if (layer) {
                var updateRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                    updateRequest = updateRequestBuilder(layerId, true);
                sandbox.request(this.instance, updateRequest);
                // Update myplaces extra layers
                var eventBuilder = sandbox.getEventBuilder('MapMyPlaces.MyPlacesVisualizationChangeEvent');
                if (eventBuilder) {
                    var event = eventBuilder(layerId, true);
                    sandbox.notifyAll(event);
                }
            }

            this.instance.getDrawPlugin().stopDrawing();
            this.instance.getMainView().cleanupPopup();
        },
        _handleEditCategory: function (sandbox, request) {
            this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] edit requested for category " + request.getId());
            var service = this.instance.getService(),
                category = service.findCategory(request.getId());
            if (category) {
                this.instance.getCategoryHandler().editCategory(category);
            }
        },
        _handleDeleteCategory: function (sandbox, request) {
            this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] delete requested for category " + request.getId());
            var service = this.instance.getService(),
                category = service.findCategory(request.getId());
            if (category) {
                this.instance.getCategoryHandler().confirmDeleteCategory(category);
            }
        },
        _handlePublishCategory: function (sandbox, request) {
            this.sandbox.printDebug("[Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler] (un/)publish requested for category " + request.getId());
            var service = this.instance.getService(),
                category = service.findCategory(request.getId());
            if (category) {
                this.instance.getCategoryHandler().confirmPublishCategory(category, request.isPublic());
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
