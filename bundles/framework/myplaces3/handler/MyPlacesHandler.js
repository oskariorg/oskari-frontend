import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showLayerPopup } from '../MyPlacesLayerForm';

class PlaceHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            places: [],
            categories: [],
            selectedCategory: null,
            loading: false
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.categoryHandler = this.instance.getCategoryHandler();
        this.service = this.instance.getService();
        this.eventHandlers = this.createEventHandlers();
        this.refreshCategoryList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyPlacesHandler';
    }

    openLayerDialog (categoryId, locale, style) {
        if (this.popupControls) {
            // already opened, do nothing
            return;
        }
        // create popup
        const saveLayer = (locale, style) => {
            this.categoryHandler.saveCategory({
                categoryId,
                locale,
                style
            });
            this.popupCleanup();
        };
        this.popupControls = showLayerPopup(locale, style, saveLayer, () => this.popupCleanup());
    }

    populatePlaces () {
        if (this.state.selectedCategory && this.state.selectedCategory.categoryId) {
            this.updateState({
                places: this.service.getPlacesInCategory(this.state.selectedCategory.categoryId)
            });
        } else {
            this.updateState({
                places: []
            });
        }
        this.updateState({
            loading: false
        });
    }

    refreshCategoryList () {
        this.updateState({
            loading: true
        });
        const categories = this.categoryHandler.getAllCategories();
        this.updateState({
            categories: categories
        });
        if (!this.state.selectedCategory && categories && categories.length > 0) {
            this.updateState({
                selectedCategory: categories[0]
            });
            this.service.loadPlaces(categories[0].categoryId);
        }
        if (this.state.selectedCategory && this.state.categories.findIndex(c => c.categoryId === this.state.selectedCategory.categoryId) < 0) {
            if (categories.length > 0) {
                this.updateState({
                    selectedCategory: categories[0]
                });
                this.service.loadPlaces(categories[0].categoryId);
            } else {
                this.updateState({
                    selectedCategory: null
                });
            }
        }
    }

    selectCategory (categoryId) {
        this.updateState({
            loading: true
        });
        const category = this.state.categories.find(c => c.categoryId === categoryId);
        this.updateState({
            selectedCategory: category
        });
        this.service.loadPlaces(categoryId);
    }

    /**
     * @method showPlace
     * Moves the map so the given geometry is visible on viewport. Adds the myplaces
     * layer to map if its not already selected.
     * @param {OpenLayers.Geometry} geometry place geometry to move map to
     * @param {Number} categoryId categoryId for the place so we can add it's layer to map
     */
    showPlace (geometry, categoryId) {
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        const center = mapModule.getCentroidFromGeoJSON(geometry);
        const bounds = mapModule.getBoundsFromGeoJSON(geometry);
        const mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.lon, center.lat, bounds);
        this.sandbox.request(this.instance, mapmoveRequest);
        // add the myplaces layer to map
        this.instance.getCategoryHandler().addLayerToMap(categoryId);
    }

    /**
     * @method editPlace
     * Requests for given place to be opened for editing
     * @param {Object} data grid data object for place
     */
    editPlace (data) {
        // focus on map
        this.showPlace(data.geometry, data.categoryId);
        // request form
        const request = Oskari.requestBuilder('MyPlaces.EditPlaceRequest')(data.id);
        this.sandbox.request(this.instance, request);
    }

    /**
     * @method deletePlace
     * Confirms delete for given place and deletes it if confirmed. Also shows
     * notification about cancel, deleted or error on delete.
     * @param {Object} data grid data object for place
     */
    deletePlace (data) {
        const callback = (isSuccess) => {
            if (isSuccess) {
                Messaging.success(this.loc('tab.notification.delete.success'));
            } else {
                Messaging.error(this.loc('tab.notification.delete.error'));
            }
        };
        this.service.deleteMyPlace(data.id, callback);
    }

    deleteCategory (categoryId) {
        const deleteReqBuilder = Oskari.requestBuilder('MyPlaces.DeleteCategoryRequest');
        this.sandbox.request(this.instance, deleteReqBuilder(categoryId));
    }

    editCategory (categoryId) {
        const layer = this.categoryHandler.mapLayerService.findMapLayer(this.categoryHandler.getMapLayerId(categoryId));
        const locale = layer.getLocale();
        const style = layer.getCurrentStyle().getFeatureStyle();
        this.openLayerDialog(categoryId, locale, style);
    }

    exportCategory (categoryId) {
        window.location.href = this.service.getExportCategoryUrl(categoryId);
    }

    getGeometryIcon (geometry) {
        return this.service.getDrawModeFromGeometry(geometry);
    }

    createEventHandlers () {
        const handlers = {
            'MyPlaces.MyPlacesChangedEvent': event => {
                this.refreshCategoryList();
                this.populatePlaces();
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(PlaceHandler, [
    'showPlace',
    'editPlace',
    'deletePlace',
    'getGeometryIcon',
    'deleteCategory',
    'editCategory',
    'exportCategory',
    'selectCategory',
    'openLayerDialog'
]);

export { wrapped as MyPlacesHandler };
