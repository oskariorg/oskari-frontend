/**
 * @class Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler
 * Handles sequests for a saved "my place" or my places categorires to be opened for editing
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance} instance
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
         * @param {Oskari.mapframework.bundle.myplaces3.request.EditPlaceRequest/Oskari.mapframework.bundle.myplaces3.request.EditCategoryRequest} request
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
            Oskari.log('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler').debug('edit requested for place' + request.getId());
            var service = this.instance.getService();
            var place = service.findMyPlace(request.getId());
            var mainMapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            var geometry, center, shape;
            if (place) {
                geometry = place.getGeometry();
                center = mainMapModule.getCentroidFromGeoJSON(geometry);
                shape = geometry.type.replace('Multi', '');
                this.instance.myPlaceSelected();
                this.instance.setIsEditPlace(true);
                this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [this.instance.getName(), shape, {allowMultipleDrawing: 'multiGeom', geojson: JSON.stringify(geometry), drawControl: false, showMeasureOnMap: true, style: this.instance.getDrawStyle()}]);
                this.instance.getMainView().showPlaceForm(center, place);
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
            Oskari.log('Oskari.mapframework.bundle.myplaces3.request.DeleteRequestHandler').debug('delete requested for place ' + request.getId());
            /* let's refresh map also if there */
            var categoryId = request.getId();
            var layerId = 'myplaces_' + categoryId;
            var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);

            if (layer) {
                var updateRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest');
                var updateRequest = updateRequestBuilder(layerId, true);
                sandbox.request(this.instance, updateRequest);
                // Update myplaces extra layers
                var eventBuilder = Oskari.eventBuilder('MapMyPlaces.MyPlacesVisualizationChangeEvent');
                if (eventBuilder) {
                    var event = eventBuilder(layerId, true);
                    sandbox.notifyAll(event);
                }
            }
            this.instance.getMainView().cleanupPopup();
        },
        _handleEditCategory: function (sandbox, request) {
            Oskari.log('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler').debug('edit requested for category ' + request.getId());
            var service = this.instance.getService();
            var category = service.findCategory(request.getId());
            if (category) {
                this.instance.getCategoryHandler().editCategory(category);
            }
        },
        _handleDeleteCategory: function (sandbox, request) {
            Oskari.log('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler').debug('delete requested for category ' + request.getId());
            var service = this.instance.getService();
            var category = service.findCategory(request.getId());
            if (category) {
                this.instance.getCategoryHandler().confirmDeleteCategory(category);
            }
        },
        _handlePublishCategory: function (sandbox, request) {
            Oskari.log('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler').debug('(un/)publish requested for category ' + request.getId());
            var service = this.instance.getService();
            var category = service.findCategory(request.getId());
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
